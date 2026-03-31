
import React, { useState } from 'react';
import { IngestedItem, IndustryMode } from '../types';
import { parseUniversalCapture } from '../services/gemini';

interface GlobalCaptureProps {
  onIngest: (item: IngestedItem) => void;
  activeMode: IndustryMode;
}

const GlobalCapture: React.FC<GlobalCaptureProps> = ({ onIngest, activeMode }) => {
  const [input, setInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isParsing) return;

    setIsParsing(true);
    try {
      const parsed = await parseUniversalCapture(input, activeMode);
      
      const newItem: IngestedItem = {
        id: crypto.randomUUID(),
        type: parsed.type || 'NOTE',
        content: parsed.content || input,
        timestamp: Date.now(),
        mode: activeMode,
        metadata: parsed.metadata
      };
      
      onIngest(newItem);
      setInput('');
    } catch (error) {
      console.error("Neural Link error:", error);
      onIngest({
        id: crypto.randomUUID(),
        type: 'NOTE',
        content: input,
        timestamp: Date.now(),
        mode: activeMode
      });
      setInput('');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-50">
      <form 
        onSubmit={handleSubmit}
        className={`bg-black/80 border border-white/10 rounded-sm shadow-2xl flex items-center p-2 backdrop-blur-3xl transition-all duration-500 ${isParsing ? 'ring-1 ring-violet-500 scale-[0.99]' : ''}`}
      >
        <div className="px-6 flex items-center border-r border-white/5 mr-4">
          {isParsing ? (
            <div className="w-5 h-5 border border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <div className="heading-serif text-white text-lg font-black tracking-tighter opacity-40">Σ</div>
          )}
        </div>
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isParsing ? "Neural pathway calibrating..." : "SYSTEM INPUT: 'Initialize task', 'Log entry', 'Data capture'..."}
          disabled={isParsing}
          className="flex-1 bg-transparent border-none outline-none text-xs font-bold py-5 text-white placeholder:text-slate-700 tracking-[0.2em] uppercase"
          autoFocus
        />
        <button 
          type="submit"
          disabled={!input.trim() || isParsing}
          className="bg-white text-black h-14 px-10 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-violet-600 hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] active:scale-95 disabled:bg-slate-900 disabled:text-slate-700"
        >
          {isParsing ? 'SYNCING' : 'FIRE'}
        </button>
      </form>
    </div>
  );
};

export default GlobalCapture;
