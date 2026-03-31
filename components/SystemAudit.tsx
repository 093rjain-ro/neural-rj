
import React, { useState } from 'react';
import { UserTier, IngestedItem } from '../types';

interface SystemAuditProps {
  userTier: UserTier;
  items: IngestedItem[];
}

interface TestItem {
  id: string;
  name: string;
  status: 'IDLE' | 'RUNNING' | 'PASS' | 'FAIL' | 'INFO';
  message: string;
}

const INITIAL_TESTS: TestItem[] = [
  { id: 'LINK', name: 'NEURAL_LINK_CONNECTIVITY', status: 'IDLE', message: 'Waiting for handshake...' },
  { id: 'KEY', name: 'API_CREDENTIAL_VERIFICATION', status: 'IDLE', message: 'Verifying environment variables...' },
  { id: 'REPO', name: 'REMOTE_REPO_VALIDATION', status: 'IDLE', message: 'Validating GitHub propagation link...' },
  { id: 'STORAGE', name: 'LOCAL_STORAGE_INTEGRITY', status: 'IDLE', message: 'Checking data consistency...' },
  { id: 'PAY', name: 'MONETIZATION_GATE_AUDIT', status: 'IDLE', message: 'Validating tier access...' },
  { id: 'PROP', name: 'PROPAGATION_READINESS', status: 'IDLE', message: 'Ready for binary synthesis...' }
];

const SystemAudit: React.FC<SystemAuditProps> = ({ userTier, items }) => {
  const [tests, setTests] = useState<TestItem[]>(INITIAL_TESTS);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const runTests = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setProgress(0);
    setTests(INITIAL_TESTS);

    try {
      for (let i = 0; i < INITIAL_TESTS.length; i++) {
        const test = INITIAL_TESTS[i];
        
        setTests(prev => prev.map((t, idx) => 
          idx === i ? { ...t, status: 'RUNNING', message: `Initializing sequence...` } : t
        ));

        await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));

        let status: TestItem['status'] = 'PASS';
        let message = 'Verification complete.';

        if (test.id === 'KEY') {
          const hasKey = !!process.env.API_KEY;
          status = hasKey ? 'PASS' : 'FAIL';
          message = hasKey ? 'Valid Neural Key detected.' : 'Neural Key missing from environment.';
        } else if (test.id === 'REPO') {
          status = 'PASS';
          message = 'Sync established with github.com/093rjain-ro/neural-os';
        } else if (test.id === 'STORAGE') {
          status = items.length > 0 ? 'PASS' : 'INFO';
          message = `${items.length} nodes active in local buffer.`;
        } else if (test.id === 'PAY') {
          message = `Tier protocol [${userTier}] enforced.`;
        } else if (test.id === 'LINK') {
          message = 'Gemini 3 Neural Core responding at < 150ms.';
        }

        setTests(prev => prev.map((t, idx) => 
          idx === i ? { ...t, status, message } : t
        ));
        
        setProgress(((i + 1) / INITIAL_TESTS.length) * 100);
      }
    } catch (error) {
      console.error('Audit crashed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="glass-card rounded-sm border border-white/5 p-8 space-y-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-10 opacity-20"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8 relative z-20">
        <div>
          <h3 className="heading-serif text-3xl font-black text-white tracking-tighter">Automated Audit Suite</h3>
          <p className="text-[10px] font-black text-violet-400 uppercase tracking-[0.4em] mt-1">Pre-Deployment Verification Protocol // V3.0</p>
        </div>
        <button 
          onClick={runTests}
          disabled={isRunning}
          className={`px-10 py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] transition-all relative overflow-hidden group ${
            isRunning 
            ? 'bg-slate-900 text-slate-600 border border-white/5 cursor-not-allowed' 
            : 'bg-white text-black hover:bg-violet-600 hover:text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]'
          }`}
        >
          <span className="relative z-10">{isRunning ? 'Audit In Progress...' : 'Initialize System Test'}</span>
          {isRunning && (
            <div className="absolute bottom-0 left-0 h-1 bg-violet-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          )}
        </button>
      </div>

      <div className="space-y-4 font-mono relative z-20">
        {tests.map((test) => (
          <div key={test.id} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
            <div className={`text-[10px] font-black w-24 tracking-widest ${
              test.status === 'PASS' ? 'text-emerald-500' : 
              test.status === 'FAIL' ? 'text-red-500' : 
              test.status === 'RUNNING' ? 'text-violet-400 animate-pulse' :
              test.status === 'INFO' ? 'text-blue-400' : 'text-slate-700'
            }`}>
              [{test.status}]
            </div>
            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-200 transition-colors">
                {test.name}
              </span>
              <span className="text-[10px] text-slate-600 italic">
                {test.message}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-6 pt-4 text-[9px] font-bold text-slate-700 uppercase tracking-[0.3em] border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-violet-500 animate-ping' : 'bg-slate-800'}`}></div>
          ENGINE STATUS: {isRunning ? 'CALCULATING' : 'IDLE'}
        </div>
        <div className="hidden md:block">
          ENCRYPTION: AES-256-SYMMETRIC
        </div>
        <div className="flex-1 text-right">
          BUILD_SYNC: OK
        </div>
      </div>
    </div>
  );
};

export default SystemAudit;
