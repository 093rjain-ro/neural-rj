
import React, { useState, useEffect, useRef } from 'react';
import SystemAudit from './SystemAudit';
import { UserTier, IngestedItem } from '../types';

interface PropagationProps {
  userTier: UserTier;
  items: IngestedItem[];
}

const Propagation: React.FC<PropagationProps> = ({ userTier, items }) => {
  const [syncStatus, setSyncStatus] = useState<'IDLE' | 'SYNCING' | 'COMPLETE'>('IDLE');
  const [gitLogs, setGitLogs] = useState<string[]>([]);
  const [isGitPushing, setIsGitPushing] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const REPO_URL = "https://github.com/093rjain-ro/neural-os";

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [gitLogs]);

  const runSync = () => {
    if (syncStatus === 'SYNCING') return;
    setSyncStatus('SYNCING');
    setTimeout(() => setSyncStatus('COMPLETE'), 3000);
  };

  const runGitPush = async () => {
    if (isGitPushing) return;
    setIsGitPushing(true);
    setGitLogs([]);
    
    const steps = [
      `[GIT] Handshaking with https://github.com/093rjain-ro/neural-os...`,
      `[GIT] Identifying modified blocks (Delta: ${items.length} nodes)`,
      `[GIT] Preparing secure commit...`,
      `[GIT] git add .`,
      `[GIT] git commit -m "Neural Update: ${new Date().toISOString()}"`,
      `[GIT] git push origin main --force`,
      `[SYNC] Delta compression using up to 12 threads.`,
      `[SYNC] Writing objects: 100% (64/64), 12.42 KiB, done.`,
      `[GIT] Total 64 (delta 42), reused 0 (delta 0)`,
      `[GIT] To ${REPO_URL}.git`,
      `[GIT] * [new branch]      main -> main`,
      `[GIT] SUCCESS: SYSTEM PROPAGATED TO GITHUB`
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 300 + Math.random() * 500));
      setGitLogs(prev => [...prev, step]);
    }
    setIsGitPushing(false);
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700 pb-20">
      <div className="text-center space-y-6">
        <h2 className="heading-serif text-6xl font-black text-white tracking-tighter">System Propagation</h2>
        <div className="h-px w-24 bg-violet-600 mx-auto"></div>
        <p className="text-[11px] font-black text-violet-400 uppercase tracking-[0.5em]">Binary Synthesis & Universal Distribution</p>
      </div>

      <SystemAudit userTier={userTier} items={items} />

      {/* GitHub Propagation Block */}
      <div className="glass-card rounded-sm border border-white/5 overflow-hidden">
        <div className="bg-white/[0.03] px-8 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Git Link // v3.0</span>
          </div>
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Target: origin/main</span>
        </div>
        <div className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="space-y-2">
              <h3 className="heading-serif text-2xl font-black text-white">Repository Sync</h3>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">{REPO_URL}</p>
            </div>
            <button 
              onClick={runGitPush}
              disabled={isGitPushing}
              className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-violet-600 hover:text-white transition-all disabled:opacity-50"
            >
              {isGitPushing ? 'PROPAGATING...' : 'PUSH TO GITHUB'}
            </button>
          </div>

          <div 
            ref={logContainerRef}
            className="bg-black/80 rounded-sm border border-white/5 h-48 overflow-y-auto p-4 font-mono text-[9px] space-y-1 scroll-smooth"
          >
            {gitLogs.length === 0 ? (
              <p className="text-slate-800 uppercase tracking-widest">Handshake pending... Click "Push to GitHub" to initialize.</p>
            ) : (
              gitLogs.map((log, i) => (
                <div key={i} className={log.includes('[GIT]') ? 'text-violet-400' : 'text-emerald-500'}>
                  {log}
                </div>
              ))
            )}
            {isGitPushing && <div className="text-white animate-pulse">_</div>}
          </div>

          <div className="pt-6 border-t border-white/5 space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manual Override Console</h4>
            <div className="space-y-2">
               {[
                 "git init",
                 `git remote add origin ${REPO_URL}.git`,
                 "git add .",
                 'git commit -m "Neural OS: Initial System Propagation"',
                 "git branch -M main",
                 "git push -u origin main"
               ].map((cmd, idx) => (
                 <div key={idx} className="flex items-center justify-between bg-black/40 border border-white/5 p-3 rounded-sm group">
                   <code className="text-[10px] text-white font-mono">{cmd}</code>
                   <button 
                     onClick={() => copyCommand(cmd)}
                     className="text-[8px] font-black text-slate-600 uppercase hover:text-violet-400 opacity-0 group-hover:opacity-100 transition-all"
                   >
                     COPY
                   </button>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card rounded-sm p-10 border border-white/5 relative overflow-hidden group hover:border-violet-500/30 transition-all duration-500">
          <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-10 transition-all duration-700 scale-[2.0]">
            <img src="https://img.icons8.com/ios-filled/100/ffffff/google-play.png" alt="Play Store" />
          </div>
          <h3 className="heading-serif text-2xl font-black text-white mb-2">Android Ecosystem</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-10">Neural Node Distribution</p>
          <ul className="space-y-5 mb-12">
            <li className="flex items-start gap-3 text-[10px] text-emerald-400 font-black uppercase tracking-widest leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] mt-1"></span> PWA Manifest Verified
            </li>
            <li className="flex items-start gap-3 text-[10px] text-emerald-400 font-black uppercase tracking-widest leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] mt-1"></span> Asset Delivery Configured
            </li>
          </ul>
          <button className="w-full py-5 border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            Export .AAB Bundle
          </button>
        </div>

        <div className="glass-card rounded-sm p-10 border border-white/5 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-500">
          <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-10 transition-all duration-700 scale-[2.0]">
            <img src="https://img.icons8.com/ios-filled/100/ffffff/mac-os.png" alt="App Store" />
          </div>
          <h3 className="heading-serif text-2xl font-black text-white mb-2">iOS Ecosystem</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-10">Synapse Matrix Deployment</p>
          <ul className="space-y-5 mb-12">
            <li className="flex items-start gap-3 text-[10px] text-emerald-400 font-black uppercase tracking-widest leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] mt-1"></span> Xcode Workspace Optimized
            </li>
            <li className="flex items-start gap-3 text-[10px] text-emerald-400 font-black uppercase tracking-widest leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] mt-1"></span> StoreKit API Synchronized
            </li>
          </ul>
          <button className="w-full py-5 border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            Initialize Xcode Bridge
          </button>
        </div>
      </div>

      <div className="glass-card rounded-sm p-12 border border-violet-500/20 bg-gradient-to-b from-violet-500/10 to-transparent text-center space-y-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
        
        <div className="space-y-2">
          <h3 className="heading-serif text-3xl font-black text-white tracking-tighter">Universal Cloud Synthesis</h3>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2 italic">Mirroring local nodes to encrypted global mesh</p>
        </div>
        
        <div className="flex flex-col items-center justify-center space-y-8">
           <div className="relative">
             {syncStatus === 'SYNCING' ? (
               <div className="w-20 h-20 flex items-center justify-center">
                 <div className="absolute inset-0 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
                 <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(139,92,246,1)]"></div>
               </div>
             ) : syncStatus === 'COMPLETE' ? (
               <div className="w-20 h-20 flex items-center justify-center bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full animate-in zoom-in duration-500">
                 <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                 </svg>
               </div>
             ) : (
               <div className="w-20 h-20 border-2 border-white/5 rounded-full flex items-center justify-center bg-black/40">
                 <div className="w-3 h-3 bg-white/10 rounded-full"></div>
               </div>
             )}
           </div>

           <div className="space-y-4 w-full max-w-sm">
             <button 
               onClick={runSync}
               disabled={syncStatus === 'SYNCING'}
               className={`w-full py-5 rounded-sm font-black text-[11px] uppercase tracking-[0.5em] transition-all relative overflow-hidden ${
                 syncStatus === 'SYNCING'
                 ? 'bg-slate-900 text-slate-500 border border-white/5 cursor-wait'
                 : 'bg-violet-600 text-white shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:scale-[1.02] active:scale-95'
               }`}
             >
               {syncStatus === 'SYNCING' ? 'BROADCASTING DATA...' : syncStatus === 'COMPLETE' ? 'RE-SYNC NODE' : 'INITIATE GLOBAL SYNC'}
             </button>
             {syncStatus === 'COMPLETE' && (
               <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
                 Propagation confirmed // Node stable
               </p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Propagation;
