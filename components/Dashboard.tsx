
import React, { useState, useEffect, useMemo } from 'react';
import { IngestedItem, IndustryMode, UserTier } from '../types';

interface DashboardProps {
  items: IngestedItem[];
  activeMode: IndustryMode;
  userTier: UserTier;
}

const Dashboard: React.FC<DashboardProps> = ({ items, activeMode, userTier }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const filteredItems = useMemo(() => 
    items.filter(i => i.mode === activeMode || i.mode === IndustryMode.GENERAL), 
  [items, activeMode]);

  const diagnostics = useMemo(() => {
    const totalCount = filteredItems.length;
    const taskCount = filteredItems.filter(i => i.type === 'TASK').length;
    const noteCount = filteredItems.filter(i => i.type === 'NOTE').length;
    const habitCount = filteredItems.filter(i => i.type === 'HABIT').length;
    
    return {
      totalCount,
      taskCount,
      noteCount,
      habitCount,
      efficiency: totalCount > 0 ? Math.round((taskCount / totalCount) * 100) : 0,
      usagePercent: userTier === 'BASIC' ? (totalCount / 10) * 100 : 0
    };
  }, [filteredItems, userTier]);

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-10 border-b border-white/5">
        <div>
          <h2 className="heading-serif text-5xl font-black text-white tracking-tighter">System Diagnostic</h2>
          <p className="text-violet-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Active Operational Telemetry // {userTier} PROTOCOL</p>
        </div>
        <div className="text-right">
          <p className="heading-serif text-4xl font-bold text-white">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
            {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()}
          </p>
        </div>
      </div>

      <div className="bento-grid">
        {/* Analytical Tiles */}
        <div className="col-span-1 md:col-span-2 glass-card rounded-sm p-8 flex flex-col justify-center border border-white/5 relative overflow-hidden bg-gradient-to-br from-violet-600/5 to-transparent">
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-4">Throughput // System Efficiency</h3>
          <div className="flex items-end gap-4">
             <span className="text-5xl heading-serif font-black text-white">{diagnostics.efficiency}%</span>
             <span className="text-[10px] text-slate-500 mb-2 uppercase tracking-widest">COHERENCE RATING</span>
          </div>
          <div className="mt-6 h-[2px] w-full bg-white/5 rounded-full">
            <div className="h-full bg-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.6)]" style={{ width: `${diagnostics.efficiency}%` }}></div>
          </div>
        </div>

        <div className="col-span-1 glass-card rounded-sm p-6 border-t-2 border-blue-500/50 bg-blue-500/5">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Task Load</span>
          <div className="text-4xl heading-serif font-black text-blue-400 mt-2">{diagnostics.taskCount}</div>
          <p className="text-[8px] text-slate-600 mt-2 uppercase tracking-widest">Active Directives</p>
        </div>

        {/* Subscription / Credit Widget */}
        <div className={`col-span-1 glass-card rounded-sm p-6 border-t-2 ${userTier === 'BASIC' ? 'border-orange-500/50 bg-orange-500/5' : 'border-cyan-500/50 bg-cyan-500/5'}`}>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Usage Credits</span>
          <div className={`text-4xl heading-serif font-black mt-2 ${userTier === 'BASIC' ? 'text-orange-400' : 'text-cyan-400'}`}>
            {userTier === 'BASIC' ? `${10 - diagnostics.totalCount}` : '∞'}
          </div>
          <div className="mt-2 h-[2px] w-full bg-white/5">
            <div 
              className={`h-full ${userTier === 'BASIC' ? 'bg-orange-500' : 'bg-cyan-500'}`} 
              style={{ width: `${userTier === 'BASIC' ? diagnostics.usagePercent : 100}%` }}
            ></div>
          </div>
          <p className="text-[8px] text-slate-600 mt-3 uppercase tracking-widest">
            {userTier === 'BASIC' ? 'Daily Cap Approaching' : 'Quantum Link Stable'}
          </p>
        </div>

        {/* Analytical Summary */}
        <div className="col-span-1 md:col-span-4 glass-card rounded-sm p-8 border border-white/5 flex flex-col justify-center">
           <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-[0.4em] mb-2">Architectural Overview</h3>
           <p className="text-sm font-medium text-slate-300 leading-relaxed max-w-4xl">
             System telemetry indicates a stable operational state on the <span className="text-white">{userTier}</span> layer. 
             Current task density is <span className="text-white">{diagnostics.taskCount > 5 ? 'Elevated' : 'Nominal'}</span>. 
             Syntactic parsing suggests optimization of <span className="text-white">{activeMode}</span> sector protocols is required for peak performance.
           </p>
        </div>

        {/* History Feed */}
        <div className="col-span-1 lg:col-span-4 space-y-6 pt-10">
          <div className="flex items-center gap-4">
            <h2 className="heading-serif text-2xl font-black text-white tracking-widest uppercase">Telemetry Log</h2>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.length === 0 ? (
              <div className="col-span-full p-20 text-center glass-card border-dashed border-white/5 rounded-sm">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">Log Buffer Empty</p>
              </div>
            ) : (
              filteredItems.map(item => (
                <div key={item.id} className="glass-card rounded-sm p-6 hover:border-violet-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-[8px] font-black bg-white/5 text-slate-500 px-2 py-1 rounded-sm uppercase tracking-widest border border-white/5">
                      {item.type}
                    </div>
                    <span className="text-[9px] text-slate-600 font-bold">{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-slate-200 font-medium leading-relaxed group-hover:text-white transition-colors">{item.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
