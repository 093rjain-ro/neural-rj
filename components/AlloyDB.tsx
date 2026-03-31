import React, { useState, useRef, useEffect } from 'react';
import { runNaturalLanguageQuery, PRESET_QUERIES, NLQueryResult } from '../services/alloydb';
import { UserTier } from '../types';

interface AlloyDBProps {
  userTier: UserTier;
}

const AlloyDB: React.FC<AlloyDBProps> = ({ userTier }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<NLQueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const [animateResult, setAnimateResult] = useState(false);
  const [typedSQL, setTypedSQL] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Typewriter effect for SQL
  useEffect(() => {
    if (!result?.generatedSQL) return;
    setTypedSQL('');
    let i = 0;
    const sql = result.generatedSQL;
    const interval = setInterval(() => {
      if (i < sql.length) {
        setTypedSQL(sql.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 12);
    return () => clearInterval(interval);
  }, [result?.generatedSQL]);

  const handleQuery = async (q?: string) => {
    const finalQuery = q || query;
    if (!finalQuery.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setAnimateResult(false);
    try {
      const res = await runNaturalLanguageQuery(finalQuery);
      setResult(res);
      setTimeout(() => setAnimateResult(true), 50);
    } catch (e: any) {
      setError(e.message || 'AlloyDB AI engine error. Check API key.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (idx: number) => {
    setActivePreset(idx);
    const q = PRESET_QUERIES[idx].query;
    setQuery(q);
    handleQuery(q);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleQuery();
  };

  const colKeys = result?.mockResults?.[0] ? Object.keys(result.mockResults[0]) : [];

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-10 border-b border-white/5">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-2 h-2 bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] animate-pulse" />
            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.5em]">ALLOYDB AI // LIVE</span>
          </div>
          <h2 className="heading-serif text-5xl font-black text-white tracking-tighter">Data Intelligence</h2>
          <p className="text-cyan-400/70 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">
            AlloyDB · Natural Language → SQL · pgvector · asia-south1
          </p>
          <p className="text-violet-400/90 text-[11px] font-black uppercase tracking-[0.2em] mt-4 border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 inline-block">
            Use Case: Exploring cognitive telemetry and task tracking data using natural language.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="border border-white/5 px-4 py-2 bg-white/[0.02]">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">INSTANCE</span>
            <p className="text-[10px] font-bold text-cyan-400 mt-0.5">neural-os-prod-001 · neural_os_db</p>
          </div>
          <div className="flex gap-2">
            <span className="text-[8px] font-black text-slate-700 border border-white/5 px-2 py-1 uppercase tracking-widest">gemini-1.5-pro</span>
            <span className="text-[8px] font-black text-slate-700 border border-white/5 px-2 py-1 uppercase tracking-widest">pgvector</span>
            <span className="text-[8px] font-black text-slate-700 border border-white/5 px-2 py-1 uppercase tracking-widest">postgres 15</span>
          </div>
        </div>
      </div>

      {/* Architecture diagram */}
      <div className="glass-card rounded-sm p-8 border border-white/5 bg-gradient-to-br from-cyan-600/5 to-transparent">
        <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] mb-6">Track 3 // Architecture</h3>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: 'NEURAL OS', sub: 'Frontend', color: 'border-violet-500/50 text-violet-400 bg-violet-500/5' },
            { label: '→', sub: '', color: 'text-slate-600 border-transparent' },
            { label: 'GEMINI AI', sub: 'NL→SQL Engine', color: 'border-cyan-500/50 text-cyan-400 bg-cyan-500/5' },
            { label: '→', sub: '', color: 'text-slate-600 border-transparent' },
            { label: 'ALLOYDB', sub: 'PostgreSQL + pgvector', color: 'border-green-500/50 text-green-400 bg-green-500/5' },
            { label: '→', sub: '', color: 'text-slate-600 border-transparent' },
            { label: 'RESULTS', sub: 'Structured Output', color: 'border-white/10 text-slate-300 bg-white/5' },
          ].map((node, i) => (
            node.label === '→' ? (
              <span key={i} className="text-slate-600 text-lg font-bold">→</span>
            ) : (
              <div key={i} className={`border px-5 py-3 rounded-sm ${node.color}`}>
                <div className="text-[10px] font-black tracking-[0.2em] uppercase">{node.label}</div>
                {node.sub && <div className="text-[8px] text-slate-500 mt-0.5 tracking-widest">{node.sub}</div>}
              </div>
            )
          ))}
        </div>
      </div>

      {/* Schema preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { name: 'neural_logs', tag: 'PRIMARY', fields: ['id UUID', 'entry_type TEXT', 'content TEXT', 'priority TEXT', 'created_at TIMESTAMP', 'embedding vector(768)'] },
          { name: 'habit_streaks', tag: 'TRACKING', fields: ['id UUID', 'habit_name TEXT', 'streak_days INT', 'last_checked DATE'] },
          { name: 'system_metrics', tag: 'TELEMETRY', fields: ['id UUID', 'metric_name TEXT', 'metric_value NUMERIC', 'recorded_at TIMESTAMP'] },
          { name: 'cognitive_load_events', tag: 'CUSTOM_BUILT', fields: ['id UUID', 'stress_level INT', 'focus_score INT', 'logged_at TIMESTAMP'] },
        ].map((table) => (
          <div key={table.name} className="glass-card rounded-sm p-6 border border-white/5 font-mono">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.3em]">{table.name}</span>
              <span className={`text-[7px] font-black border px-2 py-0.5 uppercase tracking-widest ${table.tag === 'CUSTOM_BUILT' ? 'text-violet-400 border-violet-500/50 bg-violet-500/10' : 'text-slate-600 border-white/5'}`}>{table.tag}</span>
            </div>
            <div className="space-y-1.5">
              {table.fields.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-violet-500/50 flex-shrink-0" />
                  <span className="text-[10px] text-slate-400">{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Query Input */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h3 className="text-[9px] font-black text-white uppercase tracking-[0.5em]">Natural Language Query</h3>
          <div className="h-px flex-1 bg-white/5" />
          <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Ctrl+Enter to run</span>
        </div>

        {/* Preset chips */}
        <div className="flex flex-wrap gap-2">
          {PRESET_QUERIES.map((p, i) => (
            <button
              key={i}
              onClick={() => handlePreset(i)}
              className={`px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] border transition-all ${
                activePreset === i
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                  : 'border-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <div className="relative">
          <div className="absolute top-4 left-4 text-[10px] font-black text-slate-600 pointer-events-none select-none">
            neural_os_db=#
          </div>
          <textarea
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            rows={3}
            placeholder="Ask anything about your Neural OS data..."
            className="w-full bg-black/60 border border-white/10 rounded-sm pl-36 pr-6 pt-4 pb-4 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all resize-none font-mono"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => handleQuery()}
            disabled={loading || !query.trim()}
            className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.4em] border transition-all ${
              loading
                ? 'border-cyan-500/30 text-cyan-400/50 cursor-wait'
                : 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]'
            }`}
          >
            {loading ? 'QUERYING ALLOYDB...' : 'EXECUTE QUERY →'}
          </button>
          {result && (
            <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">
              ✓ {result.rowCount} rows · {result.executionTime}
            </span>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="border border-red-500/30 bg-red-500/5 rounded-sm p-6">
          <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Query Error</p>
          <p className="text-sm text-red-300/70 font-mono">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          <div className="glass-card rounded-sm p-6 border border-white/5 animate-pulse">
            <div className="h-3 w-32 bg-white/5 rounded mb-4" />
            <div className="space-y-2">
              {[80, 60, 90, 50].map((w, i) => (
                <div key={i} className="h-2 bg-white/5 rounded" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className={`space-y-6 transition-all duration-700 ${animateResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

          {/* NL Query echo */}
          <div className="border border-violet-500/20 bg-violet-500/5 rounded-sm p-6">
            <p className="text-[8px] font-black text-violet-400 uppercase tracking-[0.5em] mb-2">Natural Language Input</p>
            <p className="text-sm text-slate-200 font-mono italic">"{result.naturalLanguage}"</p>
          </div>

          {/* Generated SQL */}
          <div className="glass-card rounded-sm border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-black/40">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">AlloyDB Generated SQL</span>
              </div>
              <span className="text-[8px] font-black text-cyan-400/50 uppercase tracking-widest">gemini-1.5-pro</span>
            </div>
            <div className="p-6 bg-black/40">
              <pre className="text-[11px] text-cyan-300 font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
                <span>{typedSQL}</span>
                <span className="animate-pulse text-cyan-400">▋</span>
              </pre>
            </div>
          </div>

          {/* Explanation */}
          <div className="glass-card rounded-sm p-6 border border-white/5 bg-gradient-to-br from-violet-500/5 to-transparent">
            <p className="text-[8px] font-black text-violet-400 uppercase tracking-[0.5em] mb-2">Query Explanation</p>
            <p className="text-sm text-slate-300 leading-relaxed">{result.explanation}</p>
          </div>

          {/* Result table */}
          {result.mockResults && result.mockResults.length > 0 && (
            <div className="glass-card rounded-sm border border-white/5 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-black/40">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Query Results</span>
                <div className="flex items-center gap-3">
                  <span className="text-[8px] text-green-400 font-black uppercase tracking-widest">{result.rowCount} rows returned</span>
                  <span className="text-[8px] text-slate-600 font-bold">{result.executionTime}</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] font-mono">
                  <thead>
                    <tr className="border-b border-white/5">
                      {colKeys.map(k => (
                        <th key={k} className="text-left px-6 py-3 text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] whitespace-nowrap">
                          {k}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.mockResults.map((row, ri) => (
                      <tr key={ri} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        {colKeys.map(k => {
                          const val = String(row[k] ?? '');
                          const isHigh = val === 'HIGH';
                          const isMed = val === 'MED';
                          const isLow = val === 'LOW';
                          return (
                            <td key={k} className="px-6 py-3 whitespace-nowrap">
                              {isHigh ? (
                                <span className="text-[8px] font-black text-red-400 border border-red-500/30 bg-red-500/5 px-2 py-0.5 uppercase tracking-widest">HIGH</span>
                              ) : isMed ? (
                                <span className="text-[8px] font-black text-yellow-400 border border-yellow-500/30 bg-yellow-500/5 px-2 py-0.5 uppercase tracking-widest">MED</span>
                              ) : isLow ? (
                                <span className="text-[8px] font-black text-green-400 border border-green-500/30 bg-green-500/5 px-2 py-0.5 uppercase tracking-widest">LOW</span>
                              ) : (
                                <span className="text-slate-300">{val}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AlloyDB config footer */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
            {Object.entries(result.alloydbConfig).map(([k, v]) => (
              <div key={k} className="border border-white/5 px-3 py-2 bg-black/40">
                <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest">{k}</p>
                <p className="text-[9px] font-bold text-slate-400 mt-0.5">{v}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && !error && (
        <div className="text-center py-24 glass-card border-dashed border-white/5 rounded-sm">
          <div className="w-12 h-12 border border-cyan-500/20 mx-auto mb-6 flex items-center justify-center">
            <div className="w-3 h-3 bg-cyan-500/40 animate-pulse" />
          </div>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mb-2">AlloyDB AI Ready</p>
          <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">Select a preset or type a natural language query above</p>
        </div>
      )}
    </div>
  );
};

export default AlloyDB;
