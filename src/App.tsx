/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Store, 
  Image as ImageIcon, 
  Video, 
  Edit3, 
  UserRound, 
  Zap, 
  Library, 
  BookOpen, 
  DollarSign,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  FolderPlus,
  MoreVertical,
  Sparkles,
  Play,
  ArrowRight,
  Home,
  Flame,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Character, MarketplaceModel, MediaItem, Folder, Prompt } from './types';

import { generateImage, generateVideo, editImage } from './services/gemini';
import { AdultAccessModal } from './components/AdultAccessModal';
import { AdultSection } from './components/AdultSection';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="flex-1 text-left font-medium">{label}</span>
    {badge && (
      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500 text-black rounded-full uppercase tracking-wider">
        {badge}
      </span>
    )}
  </button>
);

const CreditBadge = ({ credits, tokens }: { credits: number, tokens: number }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full">
    <div className="flex items-center gap-1.5 border-r border-white/10 pr-2">
      <Zap size={14} className="text-yellow-400 fill-yellow-400" />
      <span className="text-sm font-bold">{credits}</span>
    </div>
    <div className="flex items-center gap-1.5">
      <Sparkles size={14} className="text-emerald-400" />
      <span className="text-sm font-bold">{tokens}</span>
    </div>
  </div>
);

// --- Modules ---

const CharactersModule = ({ user, characters, onUpgrade }: any) => {
  const characterTypes = [
    'Fashion Influencer',
    'Lifestyle Blogger',
    'Brand Ambassador',
    'Professional Model',
    'Business Personality'
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Safe Characters</h2>
          <p className="text-zinc-400">Manage your professional AI influencer roster</p>
        </div>
        <button 
          onClick={onUpgrade}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl transition-all"
        >
          <Plus size={20} />
          New Character
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4">
        {characterTypes.map(t => (
          <button key={t} className="px-4 py-2 glass rounded-full text-xs font-bold text-zinc-400 hover:text-white whitespace-nowrap transition-all">
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((char: Character) => (
          <motion.div 
            key={char.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl overflow-hidden group"
          >
            <div className="aspect-[3/4] relative">
              <img src={char.thumbnail} alt={char.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold">{char.name}, {char.age}</h3>
                <p className="text-sm text-zinc-300 line-clamp-1">{char.description}</p>
              </div>
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${char.is_active ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                  {char.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-4 flex gap-2">
              <button className="flex-1 py-2 glass hover:bg-white/10 rounded-lg text-sm font-medium">Edit</button>
              <button className="flex-1 py-2 glass hover:bg-white/10 rounded-lg text-sm font-medium">Studio</button>
            </div>
          </motion.div>
        ))}
        
        {!user.is_premium && (
          <div className="glass rounded-2xl border-dashed border-2 border-white/10 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Zap size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Unlock More Slots</h3>
              <p className="text-sm text-zinc-400">Upgrade to Premium to create unlimited characters and train custom models.</p>
            </div>
            <button onClick={onUpgrade} className="w-full py-3 bg-white text-black font-bold rounded-xl">Upgrade Now</button>
          </div>
        )}
      </div>
    </div>
  );
};

const MarketplaceModule = ({ models, onClaim }: any) => {
  const [filter, setFilter] = useState('All');
  const [styleFilter, setStyleFilter] = useState('All');
  
  const styles = ['Fashion', 'Business', 'Casual', 'Artistic'];
  const useCases = ['Instagram', 'LinkedIn', 'Brand Ambassador'];
  const aesthetics = ['Modern', 'Vintage', 'Minimalist'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Safe Marketplace</h2>
          <p className="text-zinc-400">Discover professional AI influencers</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', 'Classic', 'Premium', 'Elite'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${filter === f ? 'bg-emerald-500 text-black' : 'glass text-zinc-400'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-4 glass rounded-2xl">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Style</span>
          <div className="flex gap-2">
            {styles.map(s => (
              <button key={s} className="px-3 py-1.5 glass rounded-lg text-xs hover:bg-white/5 transition-all">{s}</button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Use Case</span>
          <div className="flex gap-2">
            {useCases.map(u => (
              <button key={u} className="px-3 py-1.5 glass rounded-lg text-xs hover:bg-white/5 transition-all">{u}</button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Aesthetic</span>
          <div className="flex gap-2">
            {aesthetics.map(a => (
              <button key={a} className="px-3 py-1.5 glass rounded-lg text-xs hover:bg-white/5 transition-all">{a}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {models.filter((m: any) => filter === 'All' || m.tier === filter).map((model: MarketplaceModel) => (
          <motion.div 
            key={model.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="aspect-[3/4] relative">
              <img src={model.thumbnail} alt={model.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                  model.tier === 'Elite' ? 'bg-purple-500' : model.tier === 'Premium' ? 'bg-blue-500' : 'bg-zinc-600'
                }`}>
                  {model.tier}
                </span>
              </div>
              {model.licenses_claimed >= model.max_licenses && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="px-4 py-2 bg-red-500 text-white font-black uppercase tracking-tighter text-xl -rotate-12 border-4 border-white">ALL CLAIMED</span>
                </div>
              )}
            </div>
            <div className="p-4 space-y-3 flex-1 flex flex-col">
              <div>
                <h3 className="text-lg font-bold">{model.name}, {model.age}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2">{model.description}</p>
              </div>
              <div className="mt-auto space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Licenses</span>
                  <span className="font-bold">{model.licenses_claimed} / {model.max_licenses}</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500" 
                    style={{ width: `${(model.licenses_claimed / model.max_licenses) * 100}%` }}
                  />
                </div>
                <button 
                  disabled={model.licenses_claimed >= model.max_licenses}
                  onClick={() => onClaim(model.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                    model.licenses_claimed >= model.max_licenses 
                      ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                      : 'bg-white text-black hover:bg-emerald-500'
                  }`}
                >
                  Claim License
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const HomeModule = ({ onStart }: any) => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      <section className="space-y-6 text-center">
        <h2 className="text-6xl font-black tracking-tighter italic uppercase leading-none">
          Transformă <span className="text-emerald-500">Creativitatea</span> <br /> în Profit
        </h2>
        <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
          AI Influencer Studio este platforma completă de creare conținut vizual și video pentru viitorul influencerilor virtuali.
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={onStart} className="px-8 py-4 bg-emerald-500 text-black font-black rounded-2xl flex items-center gap-2 hover:scale-105 transition-all">
            ÎNCEPE ACUM <ArrowRight size={20} />
          </button>
          <button className="px-8 py-4 glass text-white font-bold rounded-2xl hover:bg-white/5 transition-all">
            VEZI MARKETPLACE
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Marketplace Premium", desc: "98+ influenceri AI gata de utilizat cu licențe exclusive.", icon: Store },
          { title: "Generare Ultra HD", desc: "Imagini și videoclipuri la calitate Master (4K).", icon: Sparkles },
          { title: "Monetizare PPV", desc: "Unelte integrate pentru OnlyFans și Fansly.", icon: DollarSign }
        ].map((f, i) => (
          <div key={i} className="glass rounded-3xl p-8 space-y-4 hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <f.icon size={24} />
            </div>
            <h3 className="font-bold text-xl">{f.title}</h3>
            <p className="text-sm text-zinc-400">{f.desc}</p>
          </div>
        ))}
      </div>

      <section className="glass rounded-[40px] p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent" />
        <div className="relative z-10 space-y-8 max-w-lg">
          <h3 className="text-4xl font-black italic uppercase tracking-tighter">Povestea Ta Spre Succes</h3>
          <div className="space-y-4 text-zinc-300 leading-relaxed">
            <p>"Este 3 dimineața. Ești în fața laptop-ului, epuizat după încă o sesiune foto de 6 ore. 150 de poze făcute, doar 3 utilizabile..."</p>
            <p>Bun venit în viitor. Cu AI Influencer Studio, generezi conținut de o lună în doar 2 ore. ROI de peste 30,000%.</p>
          </div>
          <button onClick={onStart} className="flex items-center gap-2 text-emerald-400 font-bold hover:gap-4 transition-all">
            Citește Capitolul 1 <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

const GenerationModule = ({ characters, onGenerate }: any) => {
  const [selectedChar, setSelectedChar] = useState(characters[0]?.id);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [size, setSize] = useState('1K');
  const [wardrobe, setWardrobe] = useState('Default');
  const [uncensored, setUncensored] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Safe Generation Studio</h2>
          <p className="text-zinc-400">Create professional visuals for your AI influencer</p>
        </div>
        <div className="flex items-center gap-4 glass px-4 py-2 rounded-xl">
           <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Safe Mode</span>
           <div className="w-10 h-5 rounded-full bg-emerald-500 relative">
             <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest">1. Select Character</label>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {characters.map((c: any) => (
                <button 
                  key={c.id}
                  onClick={() => setSelectedChar(c.id)}
                  className={`w-20 aspect-square rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${selectedChar === c.id ? 'border-emerald-500 scale-105' : 'border-transparent opacity-50'}`}
                >
                  <img src={c.thumbnail} className="w-full h-full object-cover" />
                </button>
              ))}
              <button className="w-20 aspect-square rounded-2xl glass border-dashed border-2 border-white/10 flex items-center justify-center text-zinc-500 flex-shrink-0">
                <Plus size={24} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest">2. Describe Scene</label>
            <div className="relative">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the scene, outfit, and lighting..."
                className="w-full h-40 glass rounded-3xl p-6 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none text-lg"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="p-2 glass hover:bg-white/10 rounded-lg text-zinc-400"><Sparkles size={18} /></button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-3">
                <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest">3. Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-2">
                  {['1:1', '3:4', '4:3', '9:16', '16:9', '21:9'].map(r => (
                    <button 
                      key={r}
                      onClick={() => setAspectRatio(r)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${aspectRatio === r ? 'bg-emerald-500 text-black' : 'glass text-zinc-400'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
             </div>
             <div className="space-y-3">
                <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest">4. Wardrobe</label>
                <select 
                  value={wardrobe}
                  onChange={(e) => setWardrobe(e.target.value)}
                  className="w-full glass rounded-xl p-3 focus:outline-none text-sm"
                >
                  <option>Default</option>
                  <option>Bikini / Swimwear</option>
                  <option>Lingerie</option>
                  <option>Evening Gown</option>
                  <option>Business Casual</option>
                  <option>Urban Streetwear</option>
                  <option>Fitness / Gym</option>
                </select>
             </div>
          </div>

          <button 
            onClick={() => onGenerate({ prompt, aspectRatio, size, charId: selectedChar, wardrobe, uncensored })}
            className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xl rounded-3xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 group"
          >
            <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
            GENERATE ULTRA HD
          </button>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2 uppercase tracking-widest text-xs text-zinc-500">
              <Zap size={16} className="text-yellow-400" />
              Quick Presets
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { name: 'Professional Headshot', desc: 'Clean, professional portrait for LinkedIn or business.' },
                { name: 'Fashion Editorial', desc: 'High-fashion magazine style with dramatic lighting.' },
                { name: 'Lifestyle Photo', desc: 'Natural, candid shots in everyday environments.' },
                { name: 'Brand Campaign', desc: 'Commercial style optimized for product placement.' },
                { name: 'Social Media Post', desc: 'Casual, high-engagement influencer style.' }
              ].map(p => (
                <button 
                  key={p.name}
                  onClick={() => setPrompt(p.name + ': ' + p.desc)}
                  className="w-full text-left p-3 glass hover:bg-white/10 rounded-xl group transition-all"
                >
                  <p className="text-sm font-bold group-hover:text-emerald-400">{p.name}</p>
                  <p className="text-[10px] text-zinc-500">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2 uppercase tracking-widest text-xs text-zinc-500">
              <ImageIcon size={16} className="text-blue-400" />
              Reference Images
            </h3>
            <div className="aspect-square glass rounded-2xl border-dashed border-2 border-white/10 flex flex-col items-center justify-center text-zinc-500 cursor-pointer hover:bg-white/5 transition-all">
              <Plus size={32} />
              <span className="text-xs mt-2">Upload (Max 10)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MediaLibraryModule = ({ media, folders, onAddFolder }: any) => {
  const [view, setView] = useState('All');
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Media Library</h2>
          <p className="text-zinc-400">Manage your generated assets</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onAddFolder} className="p-2 glass hover:bg-white/10 rounded-lg text-zinc-400">
            <FolderPlus size={20} />
          </button>
          <button className="p-2 glass hover:bg-white/10 rounded-lg text-zinc-400">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-white/5 pb-4 overflow-x-auto">
        {['All', 'Images', 'Videos', 'Edited'].map(v => (
          <button 
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${view === v ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}
          >
            {v}
          </button>
        ))}
        <div className="w-px h-8 bg-white/10 mx-2" />
        {folders.map((f: any) => (
          <button 
            key={f.id}
            onClick={() => setView(f.name)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${view === f.name ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-500 hover:text-white'}`}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
            {f.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-zinc-600">
              <Library size={40} />
            </div>
            <p className="text-zinc-500">No media available - Start generating amazing content!</p>
          </div>
        ) : (
          media.map((item: MediaItem) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square glass rounded-xl overflow-hidden group relative cursor-pointer"
            >
              {item.type === 'image' ? (
                <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                  <Play size={32} className="text-white/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/40"><Download size={16} /></button>
                <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/40"><Trash2 size={16} /></button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

const VideoModule = ({ media, onGenerateVideo }: any) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [quality, setQuality] = useState('Standard');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Create a Video</h2>
        <p className="text-zinc-400">Animate your characters with Veo 3.1 (8-40 credits)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Step 1: Select Image</label>
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 glass rounded-xl">
              {media.filter((m: any) => m.type === 'image').map((m: any) => (
                <button 
                  key={m.id}
                  onClick={() => setSelectedImage(m.url)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === m.url ? 'border-emerald-500 scale-105' : 'border-transparent opacity-50'}`}
                >
                  <img src={m.url} className="w-full h-full object-cover" />
                </button>
              ))}
              <div className="aspect-square glass rounded-lg border-dashed border-2 border-white/10 flex items-center justify-center text-zinc-500 cursor-pointer">
                <Plus size={20} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Step 2: Describe Action</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the movement (e.g., 'walking on the beach, hair blowing in the wind')..."
              className="w-full h-24 glass rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Step 3: Settings</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs text-zinc-500">Aspect Ratio</span>
                  <div className="flex gap-2">
                    {['16:9', '9:16'].map(r => (
                      <button 
                        key={r}
                        onClick={() => setAspectRatio(r as any)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${aspectRatio === r ? 'bg-emerald-500 text-black' : 'glass text-zinc-400'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-xs text-zinc-500">Quality</span>
                  <select 
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-full glass rounded-lg p-2 text-xs focus:outline-none"
                  >
                    <option>Standard (8c)</option>
                    <option>Pro (9c)</option>
                    <option>Master (40c)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 glass rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Estimated Cost</span>
                <span className="font-bold text-emerald-400">{quality === 'Master' ? 40 : quality === 'Pro' ? 9 : 8} Credits</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Duration</span>
                <span className="font-bold">5 Seconds</span>
              </div>
            </div>

            <button 
              onClick={() => onGenerateVideo({ prompt, image: selectedImage, aspectRatio, quality })}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-lg rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Video size={24} />
              GENERATE VIDEO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditorModule = ({ media, onEdit }: any) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [instruction, setInstruction] = useState('');

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold">AI Image Editor</h2>
        <p className="text-zinc-400">Modify your images using natural language (2 credits)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video glass rounded-2xl flex items-center justify-center overflow-hidden relative">
            {selectedImage ? (
              <img src={selectedImage} className="w-full h-full object-contain" />
            ) : (
              <div className="text-center space-y-2 text-zinc-500">
                <ImageIcon size={48} className="mx-auto opacity-20" />
                <p>Select an image from the library to start editing</p>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {media.filter((m: any) => m.type === 'image').map((m: any) => (
              <button 
                key={m.id}
                onClick={() => setSelectedImage(m.url)}
                className={`w-20 aspect-square rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImage === m.url ? 'border-emerald-500' : 'border-transparent opacity-50'}`}
              >
                <img src={m.url} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">AI Instructions</label>
              <textarea 
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="e.g., 'Change her outfit to a red dress', 'Add sunglasses', 'Make the background a sunset'..."
                className="w-full h-32 glass rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {['Change Outfit', 'Add Accessories', 'Change Background', 'Retouch Face', 'Color Grade'].map(p => (
                <button 
                  key={p}
                  onClick={() => setInstruction(p)}
                  className="px-3 py-2 glass hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-400"
                >
                  {p}
                </button>
              ))}
            </div>

            <button 
              disabled={!selectedImage || !instruction}
              onClick={() => onEdit({ image: selectedImage, instruction })}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-black text-lg rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Edit3 size={24} />
              APPLY EDITS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FaceSwapModule = ({ media, onSwap }: any) => {
  const [source, setSource] = useState<string | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [mode, setMode] = useState<'Face' | 'Head'>('Face');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Face & Head Swap</h2>
        <p className="text-zinc-400">Seamlessly swap identities between images (1 credit)</p>
      </div>

      <div className="flex justify-center gap-4">
        {['Face', 'Head'].map(m => (
          <button 
            key={m}
            onClick={() => setMode(m as any)}
            className={`px-8 py-2 rounded-full font-bold transition-all ${mode === m ? 'bg-emerald-500 text-black' : 'glass text-zinc-400'}`}
          >
            {m} Swap
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h3 className="text-center font-bold text-zinc-500 uppercase tracking-widest text-xs">Source Face</h3>
          <div className="aspect-square glass rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative">
            {source ? (
              <img src={source} className="w-full h-full object-cover" />
            ) : (
              <UserRound size={64} className="text-zinc-800" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
               <button className="px-4 py-2 bg-white text-black font-bold rounded-lg text-sm">Select Source</button>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto py-2">
            {media.slice(0, 5).map((m: any) => (
              <button key={m.id} onClick={() => setSource(m.url)} className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                <img src={m.url} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-center font-bold text-zinc-500 uppercase tracking-widest text-xs">Target Body</h3>
          <div className="aspect-square glass rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative">
            {target ? (
              <img src={target} className="w-full h-full object-cover" />
            ) : (
              <Users size={64} className="text-zinc-800" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
               <button className="px-4 py-2 bg-white text-black font-bold rounded-lg text-sm">Select Target</button>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto py-2">
            {media.slice(5, 10).map((m: any) => (
              <button key={m.id} onClick={() => setTarget(m.url)} className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                <img src={m.url} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          disabled={!source || !target}
          onClick={() => onSwap({ source, target, mode })}
          className="px-12 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-black text-xl rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-3"
        >
          <Sparkles size={24} />
          EXECUTE SWAP
        </button>
      </div>
    </div>
  );
};

const CloneDanceModule = ({ characters, media, onClone }: any) => {
  const [selectedChar, setSelectedChar] = useState(characters[0]?.id);
  const [videoUrl, setVideoUrl] = useState('');
  const [quality, setQuality] = useState('580p');
  const [background, setBackground] = useState('Photo Scene');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Clone Dance <span className="text-xs bg-emerald-500 text-black px-2 py-0.5 rounded-full ml-2">BETA</span></h2>
          <p className="text-zinc-400">Clone viral dance moves onto your AI character (10-20 credits)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Step 1: Select Character</label>
            <div className="grid grid-cols-4 gap-2">
              {characters.map((c: any) => (
                <button 
                  key={c.id}
                  onClick={() => setSelectedChar(c.id)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedChar === c.id ? 'border-emerald-500 scale-105' : 'border-transparent opacity-50'}`}
                >
                  <img src={c.thumbnail} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Step 2: Reference Dance Video</label>
            <input 
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste TikTok/Reels URL or .mp4 link..."
              className="w-full glass rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <div className="aspect-video glass rounded-xl border-dashed border-2 border-white/10 flex flex-col items-center justify-center text-zinc-500 cursor-pointer hover:bg-white/5 transition-all">
              <Plus size={32} />
              <span className="text-xs mt-2">Upload Video (Max 100MB)</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Step 3: Output Quality</label>
              <div className="grid grid-cols-3 gap-2">
                {['480p', '580p', '720p'].map(q => (
                  <button 
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${quality === q ? 'bg-emerald-500 text-black' : 'glass text-zinc-400'}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Step 4: Background</label>
              <div className="grid grid-cols-2 gap-2">
                {['Video Scene', 'Photo Scene'].map(b => (
                  <button 
                    key={b}
                    onClick={() => setBackground(b)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${background === b ? 'bg-emerald-500 text-black' : 'glass text-zinc-400'}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 glass rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Estimated Cost</span>
                <span className="font-bold text-emerald-400">{quality === '720p' ? 20 : quality === '580p' ? 15 : 10} Credits</span>
              </div>
              <p className="text-[10px] text-zinc-500">AI will replicate the exact movements from the reference video onto your character.</p>
            </div>

            <button 
              onClick={() => onClone({ charId: selectedChar, videoUrl, quality, background })}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-lg rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Zap size={24} />
              CLONE DANCE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PPVModule = ({ media }: any) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">PPV Content Creator</h2>
          <p className="text-zinc-400">Generate premium monetizable content packages</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-6 space-y-4 border-l-4 border-emerald-500">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                <ImageIcon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Premium Photo Set</h3>
                <p className="text-sm text-zinc-400">Pachete de 10-50 imagini tematice cu watermark personalizat.</p>
              </div>
              <button className="w-full py-2 bg-white text-black font-bold rounded-lg text-sm">Create Set</button>
            </div>

            <div className="glass rounded-2xl p-6 space-y-4 border-l-4 border-blue-500">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                <Video size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Exclusive Video</h3>
                <p className="text-sm text-zinc-400">Videoclipuri 30-60 secunde, calitate Master pentru fanii VIP.</p>
              </div>
              <button className="w-full py-2 bg-white text-black font-bold rounded-lg text-sm">Create Video</button>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-xl">Pricing Suggester</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 glass rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-emerald-500 font-bold">$</div>
                  <div>
                    <p className="font-bold">Basic Tier</p>
                    <p className="text-xs text-zinc-500">Recommended for 10-photo sets</p>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold">$5 - $15</span>
              </div>
              <div className="flex items-center justify-between p-4 glass rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-blue-500 font-bold">$$</div>
                  <div>
                    <p className="font-bold">Premium Tier</p>
                    <p className="text-xs text-zinc-500">Recommended for 30-photo sets + video</p>
                  </div>
                </div>
                <span className="text-blue-400 font-bold">$15 - $30</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Edit3 size={18} className="text-purple-400" />
              Watermarking
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Custom Text</span>
                <input type="text" placeholder="@yourname" className="bg-transparent text-right focus:outline-none text-emerald-400" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Anti-Screenshot</span>
                <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Buyer Embedding</span>
                <div className="w-10 h-5 bg-zinc-700 rounded-full relative">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Zap size={18} className="text-yellow-400" />
              Distribution
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['OnlyFans', 'Fansly', 'Telegram', 'Discord'].map(p => (
                <button key={p} className="py-2 glass hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpgradeModule = ({ onUpgrade }: any) => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black tracking-tighter italic uppercase">Choose Your <span className="text-emerald-500">Power</span></h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">Scale your AI influencer empire with professional tools and unlimited generation capabilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass rounded-3xl p-8 space-y-8 relative overflow-hidden">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Free Plan</h3>
            <p className="text-zinc-400 text-sm">Perfect for testing the waters</p>
          </div>
          <div className="text-4xl font-black italic">$0<span className="text-sm font-normal text-zinc-500 not-italic">/month</span></div>
          <ul className="space-y-4">
            {['5 Initial Credits', '1 Active Character', 'Basic Generation', 'Media Library (90 days)', 'Standard Support'].map(f => (
              <li key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">✓</div>
                {f}
              </li>
            ))}
          </ul>
          <button className="w-full py-4 glass text-zinc-400 font-bold rounded-2xl cursor-not-allowed">Current Plan</button>
        </div>

        <div className="glass rounded-3xl p-8 space-y-8 relative overflow-hidden border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/10">
          <div className="absolute top-0 right-0 bg-emerald-500 text-black px-6 py-1 font-black text-[10px] uppercase tracking-widest -rotate-45 translate-x-6 translate-y-4">Best Value</div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-emerald-400">Premium Plan</h3>
            <p className="text-zinc-400 text-sm">For professional creators & agencies</p>
          </div>
          <div className="text-4xl font-black italic">$29<span className="text-sm font-normal text-zinc-500 not-italic">/month</span></div>
          <ul className="space-y-4">
            {['500 Monthly Credits', 'Unlimited Characters', 'Marketplace Token Access', 'Veo 3.1 Master Quality', 'Clone Dance Access', 'Commercial Usage Rights', 'Unlimited Storage'].map(f => (
              <li key={f} className="flex items-center gap-3 text-sm text-white">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-black">✓</div>
                {f}
              </li>
            ))}
          </ul>
          <button onClick={onUpgrade} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-lg rounded-2xl shadow-lg shadow-emerald-500/20 transition-all">
            Upgrade Now
          </button>
        </div>
      </div>

      <div className="text-center p-8 glass rounded-3xl space-y-4">
        <h4 className="font-bold text-xl italic uppercase tracking-tighter">Why Go Premium?</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
             <div className="text-emerald-400 font-black text-2xl">31,237%</div>
             <p className="text-xs text-zinc-400 uppercase font-bold tracking-widest">Average ROI</p>
          </div>
          <div className="space-y-2">
             <div className="text-blue-400 font-black text-2xl">100x</div>
             <p className="text-xs text-zinc-400 uppercase font-bold tracking-widest">Faster Production</p>
          </div>
          <div className="space-y-2">
             <div className="text-purple-400 font-black text-2xl">Unlimited</div>
             <p className="text-xs text-zinc-400 uppercase font-bold tracking-widest">Creative Freedom</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [user, setUser] = useState<User | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [marketplace, setMarketplace] = useState<MarketplaceModel[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Adult Content State
  const [adultAccessGranted, setAdultAccessGranted] = useState(false);
  const [isAdultModalOpen, setIsAdultModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [uRes, cRes, mRes, medRes, fRes] = await Promise.all([
        fetch('/api/user'),
        fetch('/api/characters'),
        fetch('/api/marketplace'),
        fetch('/api/media'),
        fetch('/api/folders')
      ]);
      setUser(await uRes.json());
      setCharacters(await cRes.json());
      setMarketplace(await mRes.json());
      setMedia(await medRes.json());
      setFolders(await fRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Check adult access on mount
    const access = sessionStorage.getItem('adultAccess');
    const timestamp = sessionStorage.getItem('adultAccessTime');
    if (access === 'granted' && timestamp) {
      const TWO_HOURS = 2 * 60 * 60 * 1000;
      if (Date.now() - parseInt(timestamp) < TWO_HOURS) {
        setAdultAccessGranted(true);
      } else {
        sessionStorage.removeItem('adultAccess');
        sessionStorage.removeItem('adultAccessTime');
      }
    }
  }, []);

  const handleClaim = async (modelId: number) => {
    try {
      const res = await fetch('/api/marketplace/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelId })
      });
      if (res.ok) fetchData();
      else alert(await res.text());
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerate = async (config: any) => {
    try {
      const deduct = await fetch('/api/user/deduct-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 2 })
      });
      
      if (!deduct.ok) {
        alert("Insufficient credits!");
        return;
      }

      setLoading(true);
      let url;
      try {
        url = await generateImage(config.prompt, config.size, config.aspectRatio, config.wardrobe, config.uncensored);
      } catch (e) {
        console.error("Gemini Image Gen failed, falling back to placeholder", e);
        url = `https://picsum.photos/seed/${Math.random()}/1024/1496`;
      }

      await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'image',
          url,
          character_id: config.charId,
          metadata: config
        })
      });

      fetchData();
      setActiveTab('Media Library');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (amount: number, type: 'image' | 'video', url: string) => {
    try {
      const deduct = await fetch('/api/user/deduct-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      
      if (!deduct.ok) {
        alert("Insufficient credits!");
        return;
      }

      await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, url })
      });

      fetchData();
      setActiveTab('Media Library');
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateVideo = async (config: any) => {
    try {
      const amount = config.quality === 'Master' ? 40 : config.quality === 'Pro' ? 9 : 8;
      const deduct = await fetch('/api/user/deduct-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      
      if (!deduct.ok) {
        alert("Insufficient credits!");
        return;
      }

      setLoading(true);
      let url;
      try {
        url = await generateVideo(config.prompt, config.image, config.aspectRatio);
      } catch (e) {
        console.error("Veo Video Gen failed, falling back to placeholder", e);
        url = 'https://www.w3schools.com/html/mov_bbb.mp4';
      }

      await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'video', url })
      });

      fetchData();
      setActiveTab('Media Library');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditImage = async (config: any) => {
    try {
      const deduct = await fetch('/api/user/deduct-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 2 })
      });
      
      if (!deduct.ok) {
        alert("Insufficient credits!");
        return;
      }

      setLoading(true);
      let url;
      try {
        url = await editImage(config.image, config.instruction);
      } catch (e) {
        console.error("Gemini Image Edit failed, falling back to original", e);
        url = config.image;
      }

      await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'image', url })
      });

      fetchData();
      setActiveTab('Media Library');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFolder = async () => {
    const name = prompt("Enter folder name:");
    if (!name) return;
    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color: '#10b981' })
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">Initializing Studio...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="h-full glass border-r border-white/5 flex flex-col z-50 overflow-hidden"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-black">
            <Sparkles size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">Influencer<span className="text-emerald-500">Studio</span></h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-10">
          <div className="flex items-center gap-2 px-4 py-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Safe Content</div>
          </div>
          
          <SidebarItem icon={Users} label="Characters" active={activeTab === 'Characters'} onClick={() => setActiveTab('Characters')} />
          <SidebarItem icon={Store} label="Marketplace" active={activeTab === 'Marketplace'} onClick={() => setActiveTab('Marketplace')} badge="98+" />
          <SidebarItem icon={ImageIcon} label="Generation" active={activeTab === 'Generation'} onClick={() => setActiveTab('Generation')} />
          <SidebarItem icon={Video} label="Create Video" active={activeTab === 'Video'} onClick={() => setActiveTab('Video')} />
          <SidebarItem icon={Edit3} label="Image Editor" active={activeTab === 'Editor'} onClick={() => setActiveTab('Editor')} />
          <SidebarItem icon={UserRound} label="Face Swap" active={activeTab === 'FaceSwap'} onClick={() => setActiveTab('FaceSwap')} />
          <SidebarItem icon={Zap} label="Clone Dance" active={activeTab === 'CloneDance'} onClick={() => setActiveTab('CloneDance')} badge="Beta" />
          <SidebarItem icon={BookOpen} label="Prompts" active={activeTab === 'Prompts'} onClick={() => setActiveTab('Prompts')} />
          <SidebarItem icon={DollarSign} label="PPV Content" active={activeTab === 'PPV'} onClick={() => setActiveTab('PPV')} />
          <SidebarItem icon={Library} label="Media Library" active={activeTab === 'Media Library'} onClick={() => setActiveTab('Media Library')} />
          
          <div className="border-t border-white/5 my-6" />

          <div className="flex items-center gap-2 px-4 py-4">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Adult Content</div>
            {adultAccessGranted && <span className="ml-auto text-[10px] text-emerald-500 font-bold">🔓 ACTIVE</span>}
          </div>

          {!adultAccessGranted ? (
            <div className="px-4 py-2">
              <p className="text-[10px] text-zinc-500 mb-3 px-1 italic">⚠️ 18+ Password Required</p>
              <button 
                onClick={() => setIsAdultModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl adult-section-btn font-black text-[10px] uppercase tracking-widest"
              >
                <Lock size={12} />
                Unlock Adult Section
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <SidebarItem icon={Users} label="Adult Characters" active={activeTab === 'AdultCharacters'} onClick={() => setActiveTab('AdultCharacters')} />
              <SidebarItem icon={Store} label="Adult Marketplace" active={activeTab === 'AdultMarketplace'} onClick={() => setActiveTab('AdultMarketplace')} />
              <SidebarItem icon={Flame} label="Adult Generation" active={activeTab === 'AdultGeneration'} onClick={() => setActiveTab('AdultGeneration')} />
              <SidebarItem icon={Video} label="Adult Videos" active={activeTab === 'AdultVideos'} onClick={() => setActiveTab('AdultVideos')} />
              <SidebarItem icon={Edit3} label="Adult Editor" active={activeTab === 'AdultEditor'} onClick={() => setActiveTab('AdultEditor')} />
              <SidebarItem icon={UserRound} label="Adult Face Swap" active={activeTab === 'AdultFaceSwap'} onClick={() => setActiveTab('AdultFaceSwap')} />
              <SidebarItem icon={Zap} label="Adult Clone Dance" active={activeTab === 'AdultCloneDance'} onClick={() => setActiveTab('AdultCloneDance')} />
              <SidebarItem icon={BookOpen} label="Adult Prompts" active={activeTab === 'AdultPrompts'} onClick={() => setActiveTab('AdultPrompts')} />
              <SidebarItem icon={DollarSign} label="PPV Adult Content" active={activeTab === 'AdultPPV'} onClick={() => setActiveTab('AdultPPV')} />
              <SidebarItem icon={Library} label="Adult Media Library" active={activeTab === 'AdultMedia'} onClick={() => setActiveTab('AdultMedia')} />
              
              <div className="px-4 py-4">
                <button 
                  onClick={() => {
                    sessionStorage.removeItem('adultAccess');
                    sessionStorage.removeItem('adultAccessTime');
                    setAdultAccessGranted(false);
                    setActiveTab('Home');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-500 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all"
                >
                  <Lock size={12} />
                  Lock Adult Section
                </button>
              </div>
            </div>
          )}
        </nav>

        <div className="p-4 mt-auto">
          <div className="glass-dark rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400">Credits</span>
              <CreditBadge credits={user?.credits || 0} tokens={user?.tokens || 0} />
            </div>
            <button onClick={() => setActiveTab('Upgrade')} className="w-full py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-emerald-500 transition-all">
              Buy Credits
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 glass-dark border-b border-white/5 flex items-center justify-between px-8 z-40">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-4">
            {!user?.is_premium && (
              <button onClick={() => setActiveTab('Upgrade')} className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold">
                <Zap size={14} />
                UPGRADE TO PREMIUM
              </button>
            )}
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10" />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'Home' && <HomeModule onStart={() => setActiveTab('Generation')} />}
              {activeTab === 'Characters' && <CharactersModule user={user} characters={characters} onUpgrade={() => setActiveTab('Upgrade')} />}
              {activeTab === 'Marketplace' && <MarketplaceModule models={marketplace} onClaim={handleClaim} />}
              {activeTab === 'Generation' && <GenerationModule characters={characters} onGenerate={handleGenerate} />}
              {activeTab === 'Media Library' && <MediaLibraryModule media={media} folders={folders} onAddFolder={handleAddFolder} />}
              
              {activeTab === 'Video' && <VideoModule media={media} onGenerateVideo={handleGenerateVideo} />}
              {activeTab === 'Editor' && <EditorModule media={media} onEdit={handleEditImage} />}
              {activeTab === 'FaceSwap' && <FaceSwapModule media={media} onSwap={(c: any) => handleAction(1, 'image', c.target)} />}
              {activeTab === 'CloneDance' && <CloneDanceModule characters={characters} media={media} onClone={(c: any) => handleAction(15, 'video', 'https://www.w3schools.com/html/mov_bbb.mp4')} />}
              {activeTab === 'PPV' && <PPVModule media={media} />}
              {activeTab === 'Upgrade' && <UpgradeModule onUpgrade={() => handleAction(-500, 'image', '')} />}
              
              {/* Adult Content Modules */}
              {activeTab.startsWith('Adult') && (
                adultAccessGranted ? (
                  <AdultSection 
                    activeSub={activeTab}
                    onLock={() => {
                      sessionStorage.removeItem('adultAccess');
                      sessionStorage.removeItem('adultAccessTime');
                      setAdultAccessGranted(false);
                      setActiveTab('Home');
                    }} 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
                      <Lock size={48} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Access Restricted</h2>
                      <p className="text-zinc-400 max-w-md mx-auto mt-2">The Adult Content section is password protected. Please use the button in the sidebar to unlock access.</p>
                      <button 
                        onClick={() => setIsAdultModalOpen(true)}
                        className="mt-6 px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all"
                      >
                        Unlock Now
                      </button>
                    </div>
                  </div>
                )
              )}

              {/* Placeholders for other modules */}
              {['Prompts'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                   <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 animate-pulse">
                      <Sparkles size={48} />
                   </div>
                   <div>
                     <h2 className="text-3xl font-bold">{activeTab} Module</h2>
                     <p className="text-zinc-400 max-w-md mx-auto mt-2">This feature is part of the full AI Influencer Studio suite. In a production environment, this would integrate with specialized AI models for {activeTab.toLowerCase()} tasks.</p>
                   </div>
                   <button onClick={() => setActiveTab('Generation')} className="px-8 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-2">
                     Back to Generation <ArrowRight size={18} />
                   </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AdultAccessModal 
        isOpen={isAdultModalOpen} 
        onClose={() => setIsAdultModalOpen(false)} 
        onUnlock={() => {
          setAdultAccessGranted(true);
          setIsAdultModalOpen(false);
          setActiveTab('Adult');
        }} 
      />
    </div>
  );
}
