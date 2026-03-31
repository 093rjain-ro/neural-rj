
import React, { useState } from 'react';
import { developStrategy } from '../services/gemini';
import { AgentPlan, UserTier } from '../types';

interface StrategistProps {
  userTier: UserTier;
  onUpgradeRequest: () => void;
}

const Strategist: React.FC<StrategistProps> = ({ userTier, onUpgradeRequest }) => {
  const [goal, setGoal] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<AgentPlan | null>(null);

  const handleBuild = async () => {
    if (!goal) return;
    if (userTier === 'BASIC') {
      onUpgradeRequest();
      return;
    }
    setLoading(true);
    try {
      const result = await developStrategy(goal, context);
      setPlan(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-700">
      <div className="glass-card rounded-sm p-12 border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[100px] rounded-full"></div>
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
             <h2 className="heading-serif text-4xl font-black text-white tracking-tighter">Neural Architect</h2>
             {userTier === 'BASIC' && (
               <span className="bg-violet-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">PRO FEATURE</span>
             )}
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3 italic">Autonomous Execution Mapping Protocol</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">The Objective</label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Primary system directive..."
              className="w-full h-40 bg-black/40 border border-white/5 rounded-sm p-6 text-sm text-white focus:border-violet-500 outline-none transition-all placeholder:text-slate-800 font-medium"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Environmental Constraints</label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="System parameters and hardware limits..."
              className="w-full h-40 bg-black/40 border border-white/5 rounded-sm p-6 text-sm text-white focus:border-violet-500 outline-none transition-all placeholder:text-slate-800 font-medium"
            />
          </div>
        </div>

        <button
          onClick={handleBuild}
          disabled={loading || !goal}
          className="w-full mt-10 bg-white text-black hover:bg-violet-600 hover:text-white transition-all font-black py-5 rounded-sm text-[10px] uppercase tracking-[0.4em] shadow-2xl disabled:bg-slate-900 disabled:text-slate-700"
        >
          {loading ? 'CALCULATING NEURAL PATHWAYS...' : userTier === 'BASIC' ? 'UPGRADE TO ARCHITECT' : 'SYNTHESIZE DIRECTIVE'}
        </button>
      </div>

      {plan && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <div className="glass-card rounded-sm p-10">
                 <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-[0.5em] mb-10 border-b border-white/5 pb-4">
                    Logic Chain Progression
                 </h3>
                 <div className="space-y-10">
                   {plan.reasoningSteps.map((step, i) => (
                     <div key={i} className="flex gap-8 group">
                       <div className="flex flex-col items-center">
                         <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-[10px] font-black group-hover:bg-violet-600 group-hover:border-violet-600 transition-all duration-500">
                           {i + 1}
                         </div>
                         {i !== plan.reasoningSteps.length - 1 && <div className="w-px h-full bg-white/5 my-2"></div>}
                       </div>
                       <div className="pb-10">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{step.thought}</p>
                         <p className="text-sm text-white leading-relaxed font-medium">{step.action}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>

            <div className="space-y-8">
               <div className="glass-card rounded-sm p-10 bg-white text-black border-none">
                 <h3 className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em] mb-6">Core Directive</h3>
                 <p className="text-3xl heading-serif font-black tracking-tight leading-tight">{plan.finalStrategy}</p>
               </div>
               
               <div className="glass-card rounded-sm p-10 border-red-500/20 bg-red-500/5">
                 <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mb-6">System Degradation Risks</h3>
                 <ul className="space-y-4">
                   {plan.potentialRisks.map((risk, i) => (
                     <li key={i} className="text-xs text-slate-400 font-bold flex items-start gap-3">
                        <span className="w-1 h-1 rounded-full bg-red-500 mt-1.5 shadow-[0_0_10px_rgba(239,68,68,1)]"></span> {risk.toUpperCase()}
                     </li>
                   ))}
                 </ul>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Strategist;
