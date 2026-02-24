import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Flame, Video, DollarSign, Edit3, BookOpen, AlertTriangle, Users, Store, UserRound, Zap, Library, Plus } from 'lucide-react';

interface AdultSectionProps {
  activeSub: string;
  onLock: () => void;
}

export const AdultSection: React.FC<AdultSectionProps> = ({ activeSub, onLock }) => {
  const subcategories = [
    {
      id: 'AdultCharacters',
      icon: <Users size={24} />,
      title: 'Adult Characters',
      color: 'text-zinc-400',
      description: 'Manage your explicit character personas and settings.'
    },
    {
      id: 'AdultMarketplace',
      icon: <Store size={24} />,
      title: 'Adult Marketplace',
      color: 'text-emerald-500',
      description: 'Discover and claim high-converting NSFW models.'
    },
    {
      id: 'AdultGeneration',
      icon: <Flame size={24} />,
      title: 'Adult Generation',
      color: 'text-orange-500',
      description: 'Generate explicit images with advanced uncensored models.'
    },
    {
      id: 'AdultVideos',
      icon: <Video size={24} />,
      title: 'Adult Videos',
      color: 'text-red-500',
      description: 'Create NSFW videos using quick presets or custom scenarios.'
    },
    {
      id: 'AdultEditor',
      icon: <Edit3 size={24} />,
      title: 'Adult Editor',
      color: 'text-blue-500',
      description: 'Uncensored image editing and wardrobe removal tools.'
    },
    {
      id: 'AdultFaceSwap',
      icon: <UserRound size={24} />,
      title: 'Adult Face Swap',
      color: 'text-cyan-500',
      description: 'High-fidelity face swapping for adult content.'
    },
    {
      id: 'AdultCloneDance',
      icon: <Zap size={24} />,
      title: 'Adult Clone Dance',
      color: 'text-yellow-500',
      description: 'Animate models with explicit dance moves and poses.'
    },
    {
      id: 'AdultPrompts',
      icon: <BookOpen size={24} />,
      title: 'Adult Prompts',
      color: 'text-purple-500',
      description: 'Access the NSFW prompt library and templates.'
    },
    {
      id: 'AdultPPV',
      icon: <DollarSign size={24} />,
      title: 'PPV Adult Content',
      color: 'text-emerald-600',
      description: 'Manage OnlyFans-oriented premium content sets.'
    },
    {
      id: 'AdultMedia',
      icon: <Library size={24} />,
      title: 'Adult Media Library',
      color: 'text-zinc-500',
      description: 'Secure storage for all your explicit generated media.'
    }
  ];

  const renderContent = () => {
    // If we are just on the "Adult" landing page (though sidebar now points to specific subs)
    if (activeSub === 'Adult') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategories.map((category) => (
            <motion.div 
              key={category.id}
              whileHover={{ y: -5 }}
              className="glass rounded-3xl p-6 hover:bg-white/5 transition-all cursor-pointer group border-b-4 border-transparent hover:border-red-600"
            >
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${category.color} group-hover:scale-110 transition-transform`}>
                {category.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{category.title}</h3>
              <p className="text-sm text-zinc-500 mb-6">{category.description}</p>
              
              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Open Module</span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 group-hover:bg-red-600 group-hover:text-white transition-all">
                  <Lock size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      );
    }

    // Specific Adult Modules
    if (activeSub === 'AdultCharacters') {
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Adult Characters</h2>
              <p className="text-zinc-400">Manage your explicit character personas</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all">
              <Plus size={20} />
              New Adult Persona
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Adult Content Creator', desc: 'Optimized for high-engagement social media posts.' },
              { name: 'OnlyFans/Fansly Model', desc: 'Specialized in PPV and subscription content.' },
              { name: 'Explicit Personality', desc: 'High-fidelity models for hardcore scenarios.' },
              { name: 'Custom Adult Persona', desc: 'Build your own unique niche character.' }
            ].map((type, i) => (
              <div key={i} className="glass rounded-2xl p-6 border border-white/5 hover:border-red-600/30 transition-all">
                <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500 mb-4">
                  <UserRound size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2">{type.name}</h3>
                <p className="text-sm text-zinc-500 mb-6">{type.desc}</p>
                <button className="w-full py-2 glass hover:bg-white/10 rounded-lg text-xs font-bold uppercase tracking-widest">Select Template</button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeSub === 'AdultMarketplace') {
      return (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">Adult Marketplace</h2>
              <p className="text-zinc-400">Premium NSFW models ready for production</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['Solo', 'Couples', 'Fetish', 'Slim', 'Athletic', 'Curvy', 'Plus'].map(f => (
                <button key={f} className="px-4 py-2 rounded-full text-xs font-medium glass text-zinc-400 hover:text-white whitespace-nowrap">
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              { name: 'Luna Desire', niche: 'OnlyFans Specialist', img: 'https://picsum.photos/seed/luna/400/600' },
              { name: 'Scarlett Vixen', niche: 'Explicit Content', img: 'https://picsum.photos/seed/scarlett/400/600' },
              { name: 'Venus Steel', niche: 'Fetish/Alternative', img: 'https://picsum.photos/seed/venus/400/600' },
              { name: 'Niche Model', niche: 'Lingerie/Cosplay/BDSM', img: 'https://picsum.photos/seed/niche/400/600' }
            ].map((model, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden flex flex-col group">
                <div className="aspect-[3/4] relative">
                  <img src={model.img} alt={model.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-lg font-bold">{model.name}</h3>
                    <p className="text-xs text-red-500 font-bold uppercase tracking-widest">{model.niche}</p>
                  </div>
                </div>
                <div className="p-4">
                  <button className="w-full py-2.5 bg-white text-black font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all">Claim License</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeSub === 'AdultGeneration') {
      return (
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">NSFW Generation Studio</h2>
              <p className="text-zinc-400">Create explicit content with no restrictions</p>
            </div>
            <div className="px-4 py-2 bg-red-600/20 border border-red-600/30 rounded-xl">
              <span className="text-xs font-black text-red-500 uppercase tracking-widest">Uncensored Mode Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="glass rounded-3xl p-6 space-y-6">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Quick Presets (9:16)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Cowgirl', 'Doggy Style', 'Missionary', 'Blowjob POV', 'Solo Play', 'Reverse Cowgirl'].map(p => (
                      <button key={p} className="py-2 px-3 glass hover:bg-red-600/20 hover:border-red-600/30 rounded-xl text-[10px] font-bold text-zinc-400 hover:text-white transition-all">
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Additional Options</label>
                  <div className="space-y-2">
                    {['Lingerie Sets', 'Nude Artistic', 'Explicit Scenes', 'Fetish Content', 'Custom NSFW'].map(o => (
                      <label key={o} className="flex items-center gap-3 p-3 glass rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                        <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-red-600 focus:ring-red-600" />
                        <span className="text-xs font-medium text-zinc-300">{o}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="glass rounded-3xl p-6 space-y-4">
                <textarea 
                  placeholder="Describe the explicit scene in detail..."
                  className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-600 transition-all resize-none"
                />
                <button className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-2">
                  <Flame size={20} />
                  Generate Explicit Content
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-red-600/10 border border-red-600/30 p-6 rounded-3xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tighter uppercase italic">
              🔴 ADULT <span className="text-red-500">CONTENT</span> SECTION
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">🔓 Active Session</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onLock}
          className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-white/10 rounded-xl text-zinc-400 font-bold hover:bg-white/5 hover:text-white transition-all"
        >
          <Lock size={18} />
          Lock Section
        </button>
      </div>

      {/* Warning Banner */}
      <div className="bg-orange-500/10 border-2 border-orange-500/20 p-4 rounded-2xl flex items-center gap-4">
        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500 shrink-0">
          <AlertTriangle size={20} />
        </div>
        <p className="text-orange-500/80 text-sm font-medium">
          <span className="font-bold">⚠️ Explicit Content Warning:</span> This section is for users aged 18 and over only. All generated content must comply with our safety guidelines regarding non-consensual imagery.
        </p>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-[4px] px-2">
          {activeSub === 'Adult' ? '📂 ADULT SUBCATEGORIES' : `📂 ${activeSub.replace('Adult', 'Adult ')}`}
        </h3>
        
        {renderContent()}
      </div>
    </div>
  );
};
