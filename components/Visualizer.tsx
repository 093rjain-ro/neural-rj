
import React, { useState, useEffect } from 'react';
import { generateSystemVisual, editVisual, simulateVideo } from '../services/gemini';
import { ImageSize, UserTier } from '../types';

interface VisualizerProps {
  userTier: UserTier;
  onUpgradeRequest: () => void;
}

const Visualizer: React.FC<VisualizerProps> = ({ userTier, onUpgradeRequest }) => {
  const [prompt, setPrompt] = useState('');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      const ok = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(ok);
    };
    checkKey();
  }, []);

  const handleAuth = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    setHasApiKey(true);
  };

  const handleGenerateImage = async () => {
    if (!prompt) return;
    if (imageSize !== '1K' && userTier === 'BASIC') {
      onUpgradeRequest();
      return;
    }
    setLoading(true);
    setStatusMessage('Generating Blueprint...');
    try {
      const url = await generateSystemVisual(prompt, imageSize);
      setImageUrl(url);
      setVideoUrl(null);
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
        setStatusMessage('Error: Valid API key not found. Please re-select.');
      } else {
        setStatusMessage('Generation Failed. Check console.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateVideo = async () => {
    if (!prompt) return;
    if (userTier !== 'QUANTUM') {
      onUpgradeRequest();
      return;
    }
    setLoading(true);
    setStatusMessage('Preparing Simulation (this may take a minute)...');
    try {
      const url = await simulateVideo(prompt);
      setVideoUrl(url);
      setImageUrl(null);
    } catch (e) {
      console.error(e);
      setStatusMessage('Simulation Failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditImage = async () => {
    if (!imageUrl || !editPrompt) return;
    setLoading(true);
    setStatusMessage('Applying Refinement...');
    try {
      const url = await editVisual(imageUrl, editPrompt);
      setImageUrl(url);
      setEditPrompt('');
    } catch (e) {
      console.error(e);
      setStatusMessage('Edit Failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!hasApiKey) {
    return (
      <div className="flex flex-col items-center justify-center p-12 md:p-20 text-center space-y-6 bg-slate-900 border border-white/5 rounded-sm glass-card">
        <div className="max-w-md space-y-6">
          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/30">
            <span className="text-2xl font-bold text-blue-400">?</span>
          </div>
          <div className="space-y-2">
            <h2 className="heading-serif text-2xl font-extrabold text-white tracking-tight">Key Selection Required</h2>
            <p className="text-sm text-slate-400">
              Advanced system visualization (Gemini 3 Pro & Veo) requires a paid API key from a Google Cloud Project with billing enabled.
            </p>
          </div>
          <div className="pt-2">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-xs text-blue-500 font-bold underline block mb-6">VIEW BILLING DOCS</a>
            <button 
              onClick={handleAuth}
              className="w-full px-8 py-4 bg-white text-black font-black hover:bg-violet-600 hover:text-white transition-all rounded-sm shadow-lg text-[10px] uppercase tracking-widest"
            >
              Select Paid API Key
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom duration-500 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card border border-white/5 p-6 rounded-sm space-y-6 shadow-xl">
            <h3 className="text-[10px] font-black text-blue-400 tracking-widest uppercase">Visual Engine</h3>
            
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase block tracking-widest">Concept Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: A workflow for a long-running business agent..."
                className="w-full bg-black/40 border border-white/5 rounded-sm p-4 text-sm focus:border-blue-500 outline-none min-h-[100px] text-white transition-all placeholder:text-slate-800"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase block tracking-widest">BluePrint Quality</label>
              <div className="flex gap-2">
                {(['1K', '2K', '4K'] as ImageSize[]).map(size => (
                  <button
                    key={size}
                    onClick={() => setImageSize(size)}
                    className={`flex-1 py-2 text-[10px] font-bold border rounded-sm transition-all relative ${imageSize === size ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-white/5 text-slate-600'}`}
                  >
                    {size}
                    {size !== '1K' && userTier === 'BASIC' && (
                      <span className="absolute -top-1 -right-1 text-[6px] bg-violet-600 text-white px-1 rounded-full">PRO</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                disabled={loading || !prompt}
                onClick={handleGenerateImage}
                className="w-full bg-white text-black py-4 rounded-sm font-black text-[10px] uppercase disabled:opacity-30 transition-all hover:bg-violet-600 hover:text-white"
              >
                Generate Blueprint
              </button>
              <button
                disabled={loading || !prompt}
                onClick={handleSimulateVideo}
                className="w-full border border-cyan-500/50 text-cyan-400 py-4 rounded-sm font-black text-[10px] uppercase disabled:opacity-30 hover:bg-cyan-600/5 transition-all relative"
              >
                Simulate Process
                {userTier !== 'QUANTUM' && (
                  <span className="absolute top-1 right-2 text-[6px] bg-cyan-600 text-white px-2 rounded-full">QUANTUM</span>
                )}
              </button>
            </div>
          </div>

          {imageUrl && (
            <div className="glass-card border border-white/5 p-6 rounded-sm space-y-4 shadow-xl animate-in zoom-in duration-300">
              <h3 className="text-[10px] font-black text-violet-400 tracking-widest uppercase">Refinement</h3>
              <input
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="Ex: Make it high contrast..."
                className="w-full bg-black/40 border border-white/5 rounded-sm p-4 text-sm focus:border-blue-500 outline-none text-white"
              />
              <button
                disabled={loading || !editPrompt}
                onClick={handleEditImage}
                className="w-full bg-violet-600/10 border border-violet-600/30 text-violet-400 py-3 rounded-sm font-black text-[10px] uppercase disabled:opacity-30"
              >
                Update Visual
              </button>
            </div>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="aspect-video bg-black/80 rounded-sm border border-white/5 flex flex-col items-center justify-center overflow-hidden relative shadow-2xl">
            {!imageUrl && !videoUrl && !loading && (
              <div className="text-center space-y-4 opacity-30">
                <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center mx-auto">
                   <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Waiting for command</p>
              </div>
            )}
            
            {loading && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-violet-500/20"></div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white tracking-tight">{statusMessage}</p>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Neural Core Processing</p>
                </div>
              </div>
            )}
            
            {videoUrl && !loading && (
              <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
            )}
            
            {imageUrl && !videoUrl && !loading && (
              <img src={imageUrl} alt="System Visual" className="w-full h-full object-contain p-4" />
            )}
            
            {(imageUrl || videoUrl) && (
              <button 
                onClick={() => { setImageUrl(null); setVideoUrl(null); }}
                className="absolute top-6 right-6 bg-black/80 backdrop-blur-md px-4 py-2 hover:bg-black text-white rounded-sm font-black text-[8px] uppercase border border-white/10"
              >
                Reset Visual
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 border border-white/5 rounded-sm glass-card">
               <span className="text-[9px] font-black text-slate-500 block mb-3 uppercase tracking-widest">Engine Status</span>
               <div className="space-y-2">
                 <div className="flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-green-500"></div>
                   <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">Visual: Gemini 3 Pro</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-green-500"></div>
                   <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">Simulation: Veo 3.1</span>
                 </div>
               </div>
             </div>
             <div className="p-6 border border-white/5 rounded-sm glass-card">
               <span className="text-[9px] font-black text-slate-500 block mb-3 uppercase tracking-widest">Subscription Tier</span>
               <div className="space-y-2">
                 <div className="flex justify-between items-center">
                   <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">Current Plan</span>
                   <span className={`text-[9px] font-black uppercase tracking-widest ${userTier === 'BASIC' ? 'text-slate-500' : 'text-violet-400'}`}>{userTier}</span>
                 </div>
                 <button onClick={onUpgradeRequest} className="text-[8px] font-black text-blue-500 hover:text-white uppercase tracking-widest">Manage Protocols</button>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
