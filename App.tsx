
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import GlobalCapture from './components/GlobalCapture';
import Strategist from './components/Strategist';
import Visualizer from './components/Visualizer';
import VoiceDiagnostic from './components/VoiceDiagnostic';
import Subscription from './components/Subscription';
import Propagation from './components/Propagation';
import { AppSection, IngestedItem, IndustryMode, UserTier } from './types';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.DASHBOARD);
  const [activeMode, setActiveMode] = useState<IndustryMode>(IndustryMode.GENERAL);
  const [userTier, setUserTier] = useState<UserTier>('BASIC');
  const [items, setItems] = useState<IngestedItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('NEURAL_OS_STORE');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Storage error", e);
      }
    }
    const savedMode = localStorage.getItem('NEURAL_OS_MODE');
    if (savedMode) setActiveMode(savedMode as IndustryMode);
    
    const savedTier = localStorage.getItem('NEURAL_OS_TIER');
    if (savedTier) setUserTier(savedTier as UserTier);
  }, []);

  useEffect(() => {
    localStorage.setItem('NEURAL_OS_STORE', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('NEURAL_OS_MODE', activeMode);
  }, [activeMode]);

  useEffect(() => {
    localStorage.setItem('NEURAL_OS_TIER', userTier);
  }, [userTier]);

  const handleIngest = (newItem: IngestedItem) => {
    setItems(prev => [newItem, ...prev]);
  };

  const handleUpgrade = (tier: UserTier) => {
    setUserTier(tier);
    setActiveSection(AppSection.DASHBOARD);
  };

  const renderSection = () => {
    switch (activeSection) {
      case AppSection.DASHBOARD:
        return <Dashboard items={items} activeMode={activeMode} userTier={userTier} />;
      case AppSection.STRATEGIST:
        return <Strategist userTier={userTier} onUpgradeRequest={() => setActiveSection(AppSection.BILLING)} />;
      case AppSection.VISUALIZER:
        return <Visualizer userTier={userTier} onUpgradeRequest={() => setActiveSection(AppSection.BILLING)} />;
      case AppSection.VAULT:
        return <VoiceDiagnostic />;
      case AppSection.BILLING:
        return <Subscription currentTier={userTier} onUpgrade={handleUpgrade} />;
      case AppSection.PROPAGATION:
        return <Propagation userTier={userTier} items={items} />;
      default:
        return <Dashboard items={items} activeMode={activeMode} userTier={userTier} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative text-slate-100 overflow-x-hidden">
      <Header 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        userTier={userTier}
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto py-16 px-8 pb-48">
        <div className="mb-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,1)]"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">
               NEURAL SYSTEM ACTIVE // {userTier} TIER // NODE {items.length.toString().padStart(2, '0')}
             </span>
          </div>
          <div className="hidden md:block">
            <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.3em] border border-white/5 px-3 py-1">
              GEMINI 3 NEURAL CORE // QUANTUM READY
            </span>
          </div>
        </div>

        {renderSection()}
      </main>

      <GlobalCapture onIngest={handleIngest} activeMode={activeMode} />

      <footer className="py-16 px-8 text-center border-t border-white/5 bg-black/80 mt-20">
        <div className="mb-6 opacity-20 heading-serif text-3xl font-black tracking-[0.5em]">NEURAL</div>
        <div className="flex justify-center gap-8 mb-4 text-[8px] font-bold text-slate-600 uppercase tracking-widest">
          <button onClick={() => setActiveSection(AppSection.BILLING)} className="hover:text-white transition-colors">Subscription</button>
          <button onClick={() => setActiveSection(AppSection.PROPAGATION)} className="hover:text-white transition-colors">Propagation</button>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
        <p className="text-[8px] font-bold text-slate-800 uppercase tracking-[0.6em]">
          PERSONAL SOVEREIGNTY // ARCHITECTURAL INTEGRITY // NEURAL OS // 2025
        </p>
      </footer>
    </div>
  );
};

export default App;
