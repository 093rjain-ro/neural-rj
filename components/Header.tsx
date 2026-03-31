
import React from 'react';
import { AppSection, IndustryMode, UserTier } from '../types';

interface HeaderProps {
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
  activeMode: IndustryMode;
  setActiveMode: (mode: IndustryMode) => void;
  userTier: UserTier;
}

const Header: React.FC<HeaderProps> = ({ activeSection, setActiveSection, activeMode, setActiveMode, userTier }) => {
  return (
    <header className="border-b border-white/5 bg-black/40 backdrop-blur-2xl sticky top-0 z-40 px-8 py-5 flex flex-col lg:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveSection(AppSection.DASHBOARD)}>
          <div className="relative">
            <div className="w-12 h-12 bg-white flex items-center justify-center rounded-sm overflow-hidden transform group-hover:scale-110 transition-transform duration-500">
              <div className="w-full h-full bg-black flex items-center justify-center p-2">
                <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current overflow-visible">
                  <line x1="20" y1="50" x2="50" y2="20" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  <line x1="20" y1="50" x2="50" y2="80" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  <line x1="50" y1="20" x2="80" y2="50" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  <line x1="50" y1="80" x2="80" y2="50" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
                  <circle cx="20" cy="50" r="4" fill="currentColor" />
                  <circle cx="50" cy="20" r="4" fill="currentColor" />
                  <circle cx="50" cy="80" r="4" fill="currentColor" />
                  <circle cx="80" cy="50" r="4" fill="currentColor" />
                  <circle cx="50" cy="50" r="5" fill="#8B5CF6" className="animate-pulse" />
                  <line x1="75" y1="45" x2="85" y2="55" stroke="#8B5CF6" strokeWidth="3" />
                </svg>
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-500 blur-[2px] animate-pulse"></div>
          </div>
          <div>
            <h1 className="heading-serif text-xl font-black tracking-[0.2em] text-white leading-none">NEURAL OS</h1>
            <p className="text-[9px] font-bold text-violet-400 tracking-[0.5em] uppercase mt-1">Synapse V3.0</p>
          </div>
        </div>
        
        <div className="flex gap-1 bg-white/5 p-1 rounded-sm border border-white/5">
          {Object.values(IndustryMode).map((m) => (
            <button
              key={m}
              onClick={() => setActiveMode(m)}
              className={`px-4 py-2 text-[8px] font-bold uppercase tracking-[0.2em] transition-all ${
                activeMode === m
                  ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <nav className="flex gap-2">
          {Object.values(AppSection).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.3em] transition-all border ${
                activeSection === section
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
              }`}
            >
              {section.replace('_', ' ')}
            </button>
          ))}
        </nav>

        <div className="h-10 w-px bg-white/5 hidden lg:block"></div>

        <button 
          onClick={() => setActiveSection(AppSection.BILLING)}
          className={`px-4 py-2 rounded-sm border text-[8px] font-black uppercase tracking-widest transition-all ${
            userTier === 'BASIC' 
            ? 'border-slate-800 text-slate-500 hover:border-white hover:text-white' 
            : userTier === 'PRO' 
            ? 'border-violet-500 text-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.2)]'
            : 'border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
          }`}
        >
          {userTier}
        </button>
      </div>
    </header>
  );
};

export default Header;
