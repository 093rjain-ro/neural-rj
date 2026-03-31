
import React from 'react';
import { UserTier } from '../types';

interface SubscriptionProps {
  currentTier: UserTier;
  onUpgrade: (tier: UserTier) => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ currentTier, onUpgrade }) => {
  const plans = [
    {
      id: 'BASIC' as UserTier,
      name: 'SYNAPSE FREE',
      price: '$0',
      tagline: 'Basic System Diagnostics',
      features: ['Basic Parsing', '10 Daily Capture Nodes', '1K Visual Resolution', 'Community Support'],
      accent: 'border-slate-800',
      text: 'text-slate-400'
    },
    {
      id: 'PRO' as UserTier,
      name: 'NEURAL PRO',
      price: '$29',
      tagline: 'Advanced Human Optimization',
      features: ['Unlimited Capture Nodes', 'Autonomous Strategy Builder', '4K Visual Imaging', 'Priority Neural Pathways'],
      accent: 'border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.2)]',
      text: 'text-violet-400',
      popular: true
    },
    {
      id: 'QUANTUM' as UserTier,
      name: 'QUANTUM ENT.',
      price: '$199',
      tagline: 'Enterprise-Grade Intelligence',
      features: ['Full Video Simulations', 'Custom Agent Contexts', 'Dedicated AI Compute', 'SLA Response Guarantee'],
      accent: 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]',
      text: 'text-cyan-400'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h2 className="heading-serif text-5xl font-black text-white tracking-tighter">Monetize Intelligence</h2>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">System Expansion Protocols // Select Your Tier</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`glass-card rounded-sm p-10 flex flex-col border-t-4 transition-all hover:scale-[1.02] ${plan.accent} ${currentTier === plan.id ? 'opacity-100 ring-2 ring-white/20' : 'opacity-80'}`}
          >
            {plan.popular && (
              <span className="text-[8px] font-black bg-violet-600 text-white px-3 py-1 rounded-full w-fit mb-6 tracking-widest uppercase">Most Effective</span>
            )}
            <h3 className={`heading-serif text-2xl font-black mb-2 ${plan.text}`}>{plan.name}</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black text-white">{plan.price}</span>
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">/ Month</span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8 h-8">{plan.tagline}</p>
            
            <ul className="space-y-4 mb-12 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-3">
                  <span className={`w-1 h-1 rounded-full mt-1.5 ${plan.text.replace('text', 'bg')}`}></span>
                  {feature.toUpperCase()}
                </li>
              ))}
            </ul>

            <button
              onClick={() => onUpgrade(plan.id)}
              disabled={currentTier === plan.id}
              className={`w-full py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
                currentTier === plan.id 
                ? 'bg-slate-900 text-slate-600 border border-white/5' 
                : 'bg-white text-black hover:bg-violet-600 hover:text-white shadow-xl'
              }`}
            >
              {currentTier === plan.id ? 'ACTIVE TIER' : 'INITIALIZE SYNC'}
            </button>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-sm p-8 border border-white/5 text-center">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">
          All transactions secured via Neural Ledger // 256-bit Synaptic Encryption // Instant Activation
        </p>
      </div>
    </div>
  );
};

export default Subscription;
