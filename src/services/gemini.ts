import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

export const generateImage = async (prompt: string, size: "1K" | "2K" | "4K" = "1K", aspectRatio: string = "1:1", wardrobe?: string, uncensored?: boolean) => {
  const ai = getAI();
  let fullPrompt = prompt;
  if (wardrobe && wardrobe !== 'Default') {
    fullPrompt += `, wearing ${wardrobe}`;
  }
  if (uncensored) {
    fullPrompt += `, uncensored, explicit details, highly detailed skin texture`;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview",
    contents: [{ parts: [{ text: fullPrompt }] }],
    config: {
      imageConfig: {
        imageSize: size,
        aspectRatio: aspectRatio as any,
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

export const editImage = async (base64Image: string, prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType: "image/png",
          },
        },
        { text: prompt },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No edited image generated");
};

export const analyzeImage = async (base64Image: string, prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType: "image/png",
          },
        },
        { text: prompt },
      ],
    },
  });
  return response.text;
};

export const generateVideo = async (prompt: string, imageBase64?: string, aspectRatio: "16:9" | "9:16" = "16:9") => {
  const ai = getAI();
  
  const config: any = {
    model: "veo-3.1-fast-generate-preview",
    prompt,
    config: {
      numberOfVideos: 1,
      resolution: "720p",
      aspectRatio,
    }
  };

  if (imageBase64) {
    config.image = {
      imageBytes: imageBase64.split(',')[1],
      mimeType: "image/png",
    };
  }

  let operation = await ai.models.generateVideos(config);

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed");

  const response = await fetch(downloadLink, {
    method: 'GET',
    headers: {
      'x-goog-api-key': process.env.GEMINI_API_KEY!,
    },
  });
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
