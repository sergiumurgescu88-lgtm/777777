export interface User {
  id: number;
  credits: number;
  tokens: number;
  is_premium: boolean;
}

export interface Character {
  id: number;
  name: string;
  age: number;
  description: string;
  physical_traits?: string;
  is_active: boolean;
  thumbnail: string;
  is_adult?: boolean;
  body_type?: string;
  niche?: string;
  content_preferences?: string[];
  custom_attributes?: Record<string, string>;
  social_handle?: string;
  voice_id?: string;
  usage_stats?: {
    videos_generated: number;
    content_published: number;
  };
}

export interface MarketplaceModel {
  id: number;
  name: string;
  age: number;
  description: string;
  traits?: string;
  tier: string;
  niche?: string;
  licenses_claimed: number;
  max_licenses: number;
  thumbnail: string;
  is_adult?: boolean;
}

export interface MediaItem {
  id: number;
  type: 'image' | 'video';
  url: string;
  character_id?: number;
  folder_id?: number;
  created_at: string;
  metadata?: string;
}

export interface Folder {
  id: number;
  name: string;
  color: string;
}

export interface Prompt {
  id: number;
  title: string;
  positive: string;
  negative: string;
  category: string;
}
