import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal, Shield, GitBranch, Cpu, FileCode, Settings, BookOpen,
  Activity, Play, CheckCircle2, AlertTriangle, RefreshCw, Copy, Check,
  FolderTree, FileText, Sparkles, Send, Volume2, VolumeX, Waves, Radio,
  Clock, Compass, Network, Server, Zap, Globe, Layers, ArrowUpRight,
  ExternalLink, Search, Lock, Unlock, Eye, ListFilter, Download
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'master-index' | 'dragon9' | 'mesh' | 'cli' | 'workspace' | 'jobs' | 'ai-patch' | 'git' | 'audit' | 'config' | 'guide'>('master-index');

  // Status & Telemetry
  const [status, setStatus] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [d9Data, setD9Data] = useState<any>(null);

  // Master Index state
  const [masterIndexData, setMasterIndexData] = useState<{ repositories: any[]; publishedApplets: any[]; markdown: string }>({
    repositories: [],
    publishedApplets: [],
    markdown: ''
  });
  const [repoSearch, setRepoSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sequenceRunning, setSequenceRunning] = useState(false);
  const [sequenceStatusMsg, setSequenceStatusMsg] = useState('');
  const [showMarkdownModal, setShowMarkdownModal] = useState(false);

  // 432 Hz Web Audio Engine
  const [audioActive, setAudioActive] = useState(false);
  const [selectedFreq, setSelectedFreq] = useState<number>(432);
  const [audioVolume, setAudioVolume] = useState<number>(0.15);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Wave Visualizer Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // CLI state
  const [cliInput, setCliInput] = useState('');
  const [cliLogs, setCliLogs] = useState<Array<{ command: string; output: string; exitCode: number; time: string }>>([
    { command: 'repoman sequence run', output: 'RepoMan operational sequence executed: All repositories audited, visibility locked to PUBLIC, and MASTER_INDEX.md generated.', exitCode: 0, time: '15:30:00' },
    { command: 'repoman status', output: 'RepoMan Agent v2.4.0-dragon9 attached to fluidmotiontv-oss. 12 repositories public, 4 published AI Studio apps online.', exitCode: 0, time: '15:30:05' }
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Workspace state
  const [tree, setTree] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('MASTER_INDEX.md');
  const [fileContent, setFileContent] = useState<string>('');
  const [originalContent, setOriginalContent] = useState<string>('');
  const [fileStatusMsg, setFileStatusMsg] = useState<string>('');

  // Jobs state
  const [jobs, setJobs] = useState<any[]>([]);
  const [runningJobId, setRunningJobId] = useState<string | null>(null);
  const [jobLogs, setJobLogs] = useState<string>('[repoman-agent/fluidmotiontv-oss] Ready to execute harmonic automation jobs.');

  // AI Fluid Patch state
  const [aiPrompt, setAiPrompt] = useState('Refactor for fluid motion wave mechanics, zero bloat, and sovereign antiX/Termux local resilience');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<string[]>([]);

  // Config state
  const [configJson, setConfigJson] = useState<string>('');
  const [configStatus, setConfigStatus] = useState<string>('');

  // Copied state
  const [copied, setCopied] = useState<false | string>(false);

  useEffect(() => {
    fetchStatus();
    fetchD9();
    fetchMasterIndex();
    fetchWorkspace();
    fetchJobs();
    fetchAuditLogs();
    fetchConfig();

    const interval = setInterval(() => {
      fetchD9();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === 'cli') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [cliLogs, activeTab]);

  // Audio Engine Lifecycle
  const toggleAudio = (freq?: number) => {
    const targetFreq = freq || selectedFreq;
    if (audioActive && !freq) {
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.05);
        setTimeout(() => {
          oscRef.current?.stop();
          oscRef.current?.disconnect();
          setAudioActive(false);
        }, 100);
      }
      return;
    }

    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(targetFreq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(audioVolume, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
      setSelectedFreq(targetFreq);
      setAudioActive(true);
    } catch (err) {
      console.error('Audio initialization error:', err);
    }
  };

  const playApexChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const freqs = [432, 518.4, 648];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        const startTime = ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.8);
      });
    } catch (e) {
      console.error('Chime error', e);
    }
  };

  // Canvas Wave Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const mid = height / 2;

      ctx.beginPath();
      ctx.strokeStyle = audioActive ? '#818cf8' : '#475569';
      ctx.lineWidth = 2.5;

      for (let x = 0; x < width; x++) {
        const angle = (x / width) * Math.PI * 4 + step;
        const y = mid + Math.sin(angle) * (height * 0.3) * (audioActive ? 1.2 : 0.6);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = audioActive ? 'rgba(52, 211, 153, 0.4)' : 'rgba(71, 85, 105, 0.2)';
      ctx.lineWidth = 1.5;

      for (let x = 0; x < width; x++) {
        const angle = (x / width) * Math.PI * 2 + step * 0.5;
        const y = mid + Math.cos(angle) * (height * 0.2);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      step += audioActive ? 0.06 : 0.02;
      animationFrameRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [audioActive]);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error('Failed to fetch status', e);
    } finally {
      setLoadingStatus(false);
    }
  };

  const fetchD9 = async () => {
    try {
      const res = await fetch('/api/dragon9');
      const data = await res.json();
      if (data.success) {
        setD9Data(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch Dragon 9 time', e);
    }
  };

  const fetchMasterIndex = async () => {
    try {
      const res = await fetch('/api/master-index');
      const data = await res.json();
      if (data.success) {
        setMasterIndexData(data);
      }
    } catch (e) {
      console.error('Failed to fetch master index', e);
    }
  };

  const runOperationalSequence = async () => {
    setSequenceRunning(true);
    setSequenceStatusMsg('Step 1/3: Auditing and standardizing repositories...');
    try {
      // Step 1: Audit
      await fetch('/api/repos/audit', { method: 'POST' });
      setSequenceStatusMsg('Step 2/3: Enforcing PUBLIC visibility across all repositories...');

      // Step 2: Visibility
      await fetch('/api/repos/visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility: 'public' })
      });
      setSequenceStatusMsg('Step 3/3: Regenerating MASTER_INDEX.md Hub...');

      // Step 3: Index
      await fetch('/api/repos/generate-index', { method: 'POST' });

      setSequenceStatusMsg('Sequence Complete: 100% Public, Audited & Indexed!');
      playApexChime();
      fetchMasterIndex();
      fetchStatus();
      fetchAuditLogs();
      setTimeout(() => setSequenceStatusMsg(''), 4000);
    } catch (err: any) {
      setSequenceStatusMsg(`Error: ${err.message}`);
    } finally {
      setSequenceRunning(false);
    }
  };

  const enforcePublicVisibility = async () => {
    try {
      const res = await fetch('/api/repos/visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility: 'public' })
      });
      const data = await res.json();
      if (data.success) {
        fetchMasterIndex();
        fetchStatus();
        fetchAuditLogs();
        alert('All repositories successfully set to Public visibility.');
      }
    } catch (e: any) {
      alert(`Visibility update failed: ${e.message}`);
    }
  };

  const regenerateMasterIndex = async () => {
    try {
      const res = await fetch('/api/repos/generate-index', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchMasterIndex();
        fetchAuditLogs();
        alert('MASTER_INDEX.md regenerated successfully.');
      }
    } catch (e: any) {
      alert(`Index generation failed: ${e.message}`);
    }
  };

  const fetchWorkspace = async () => {
    try {
      const res = await fetch('/api/scan');
      const data = await res.json();
      if (data.success) {
        setTree(data.tree);
        loadFileContent('MASTER_INDEX.md');
      }
    } catch (e) {
      console.error('Failed to scan workspace', e);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (e) {
      console.error('Failed to fetch jobs', e);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/audit');
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.logs);
      }
    } catch (e) {
      console.error('Failed to fetch audit logs', e);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      if (data.success) {
        setConfigJson(JSON.stringify(data.config, null, 2));
      }
    } catch (e) {
      console.error('Failed to fetch config', e);
    }
  };

  const loadFileContent = async (path: string) => {
    setSelectedFile(path);
    try {
      const res = await fetch(`/api/files/read?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      if (data.success) {
        setFileContent(data.content);
        setOriginalContent(data.content);
        setFileStatusMsg('');
      } else {
        setFileStatusMsg(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setFileStatusMsg(`Error: ${e.message}`);
    }
  };

  const saveFileContent = async () => {
    try {
      const res = await fetch('/api/files/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: selectedFile, content: fileContent })
      });
      const data = await res.json();
      if (data.success) {
        setFileStatusMsg('Saved with sovereign rollback backup (.bak)!');
        setOriginalContent(fileContent);
        fetchAuditLogs();
        fetchMasterIndex();
      } else {
        setFileStatusMsg(`Save failed: ${data.error}`);
      }
    } catch (e: any) {
      setFileStatusMsg(`Save failed: ${e.message}`);
    }
  };

  const runCliCommand = async (cmdText?: string) => {
    const command = cmdText || cliInput.trim();
    if (!command) return;

    const time = new Date().toLocaleTimeString();
    try {
      const res = await fetch('/api/cli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      const data = await res.json();
      setCliLogs(prev => [...prev, { command, output: data.output, exitCode: data.exitCode, time }]);
      if (!cmdText) setCliInput('');
      fetchAuditLogs();
      fetchStatus();
      fetchMasterIndex();
    } catch (e: any) {
      setCliLogs(prev => [...prev, { command, output: `Execution error: ${e.message}`, exitCode: 1, time }]);
    }
  };

  const runJob = async (jobId: string) => {
    setRunningJobId(jobId);
    setJobLogs(`[repoman-agent/fluidmotiontv-oss] Executing job ID: ${jobId}...\n`);
    try {
      const res = await fetch('/api/jobs/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId })
      });
      const data = await res.json();
      if (data.success) {
        setJobLogs(data.output);
        playApexChime();
      } else {
        setJobLogs(`Job failed: ${data.error}`);
      }
      fetchAuditLogs();
    } catch (e: any) {
      setJobLogs(`Job error: ${e.message}`);
    } finally {
      setRunningJobId(null);
    }
  };

  const runAiPatch = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch('/api/ai/patch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          codeContext: fileContent,
          filePath: selectedFile
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiResult(data.result);
      } else {
        alert(data.error || 'AI patch generation failed');
      }
    } catch (e: any) {
      alert(`AI error: ${e.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const saveConfig = async () => {
    try {
      const parsed = JSON.parse(configJson);
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: parsed })
      });
      const data = await res.json();
      if (data.success) {
        setConfigStatus('Configuration saved successfully for fluidmotiontv-oss!');
        fetchStatus();
        fetchAuditLogs();
        fetchMasterIndex();
      } else {
        setConfigStatus(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setConfigStatus(`Invalid JSON format: ${e.message}`);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(false), 2000);
  };

  // Tree node renderer
  const renderTreeNode = (nodes: any[]) => {
    return nodes.map((node, i) => {
      if (node.type === 'directory') {
        return (
          <div key={i} className="ml-2 my-1 text-slate-300">
            <div className="flex items-center gap-1.5 font-medium text-xs text-slate-400 py-0.5">
              <FolderTree className="w-3.5 h-3.5 text-indigo-400" />
              <span>{node.name}</span>
            </div>
            <div className="pl-3 border-l border-slate-800">
              {renderTreeNode(node.children || [])}
            </div>
          </div>
        );
      } else {
        const isSelected = selectedFile === node.path;
        return (
          <div
            key={i}
            onClick={() => loadFileContent(node.path)}
            className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer text-xs transition-colors ${
              isSelected ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">{node.name}</span>
          </div>
        );
      }
    });
  };

  // Filtered repositories for Master Hub
  const filteredRepos = (masterIndexData.repositories || []).filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(repoSearch.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(repoSearch.toLowerCase()) ||
      (r.tags || []).some((t: string) => t.toLowerCase().includes(repoSearch.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sovereign Dragon 9 Global Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-4 py-2.5 flex flex-wrap items-center justify-between shadow-xl gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white relative">
            <Waves className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                <span>RepoMan Agent</span>
                <span className="text-[11px] font-normal text-slate-400">/</span>
                <span className="text-indigo-400 font-mono text-xs">fluidmotiontv-oss</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                All Repos Public
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>Sovereign Local Hub</span>
              <span>•</span>
              <span className="text-emerald-400 font-mono">432 Hz Pythagorean Base</span>
            </p>
          </div>
        </div>

        {/* Dragon 9 Real-Time Telemetry Bar */}
        {d9Data && (
          <div className="flex items-center gap-3 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800/80 shadow-inner">
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-4 h-4 text-indigo-400 animate-spin-slow" />
              <div>
                <span className="font-mono font-bold text-indigo-300 text-sm tracking-wide">
                  {d9Data.dragon9.displayTime}
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">
                  Cycle {d9Data.dragon9.hour}/26.667h (54m)
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-800"></div>

            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${d9Data.dragon9.isApex ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  {d9Data.dragon9.isApex ? '⚡ Apex Intermission' : `Wave Triad ${d9Data.dragon9.apexPhaseNumber}/3`}
                </span>
                <span className="text-[10px] text-slate-400">
                  {d9Data.dragon9.isApex ? '18m Rest / Buffer' : `Next Apex: ${d9Data.dragon9.minutesUntilNextApex}m`}
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

            <div className="hidden sm:block text-right">
              <span className="text-xs font-medium text-slate-300 block">{d9Data.calendar13m.monthName} Day {d9Data.calendar13m.dayOfMonth}</span>
              <span className="text-[10px] text-slate-400">13-Month Harmony</span>
            </div>

            <div className="h-6 w-px bg-slate-800"></div>

            <button
              onClick={() => toggleAudio()}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                audioActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title={audioActive ? 'Mute 432 Hz Carrier Tone' : 'Play 432 Hz Pythagorean Pure Sine Carrier'}
            >
              {audioActive ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="font-mono text-[11px] font-bold">432Hz</span>
            </button>
          </div>
        )}

        {/* Global Action Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={runOperationalSequence}
            disabled={sequenceRunning}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
            title="Run complete 3-step sequence: Audit -> Make Public -> Generate Master Index"
          >
            {sequenceRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-300" />}
            <span>{sequenceRunning ? 'Running Sequence...' : 'Execute 3-Step Sequence'}</span>
          </button>
          <button
            onClick={() => { fetchStatus(); fetchD9(); fetchWorkspace(); fetchAuditLogs(); fetchMasterIndex(); }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh State"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Navigation Ribbon */}
      <nav className="flex items-center gap-1 bg-slate-900 border-b border-slate-800 px-4 py-2 overflow-x-auto scrollbar-none shadow-sm">
        {[
          { id: 'master-index', label: 'Master Hub & Index', icon: Globe },
          { id: 'dashboard', label: 'Dashboard', icon: Activity },
          { id: 'dragon9', label: 'Dragon 9 Matrix', icon: Clock },
          { id: 'mesh', label: 'P2P Mesh (antiX/Termux)', icon: Network },
          { id: 'cli', label: 'CLI Terminal', icon: Terminal },
          { id: 'workspace', label: 'Workspace Files', icon: FileCode },
          { id: 'jobs', label: 'Harmonic Jobs', icon: Play },
          { id: 'ai-patch', label: 'Fluid AI Patch', icon: Sparkles },
          { id: 'git', label: 'Git & Sync', icon: GitBranch },
          { id: 'audit', label: 'Audit Trail', icon: Shield },
          { id: 'config', label: 'Config Studio', icon: Settings },
          { id: 'guide', label: 'Setup Guide', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sequence Notification Banner */}
      {sequenceStatusMsg && (
        <div className="bg-indigo-950/80 border-b border-indigo-500/40 px-4 py-2 text-xs text-indigo-200 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{sequenceStatusMsg}</span>
          </div>
          <button onClick={() => setSequenceStatusMsg('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main View Container */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {/* 1. MASTER HUB & INDEX TAB (PRIMARY ENTRY POINT) */}
        {activeTab === 'master-index' && (
          <div className="space-y-6">
            {/* Master Hub Hero Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Organization: fluidmotiontv-oss
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Access: Public
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mt-2">
                    🌐 Sovereign Master Repository & Workspace Hub
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                    Single unified hub aggregating all core protocols, spatial engines, creative suites, autonomous agent tooling, and published AI Studio workspaces under the Dragon 9 harmonic architecture.
                  </p>
                </div>

                {/* Automation Action Buttons */}
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    onClick={runOperationalSequence}
                    disabled={sequenceRunning}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Run 3-Step Sequence</span>
                  </button>
                  <button
                    onClick={enforcePublicVisibility}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                    title="Enforce Public Visibility across all repositories"
                  >
                    <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Set All to Public</span>
                  </button>
                  <button
                    onClick={() => setShowMarkdownModal(true)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>View MASTER_INDEX.md</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Published AI Studio Apps & Interactive Workspace Hub */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-400" />
                    <span>Published AI Studio Applications & Workspaces</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live production-grade web applications and workspace applets deployed for team members and external visitors.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(masterIndexData.publishedApplets || []).map((applet, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between group hover:border-indigo-500/50 transition-all">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors">
                          {applet.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {applet.env}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                        {applet.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Live Online</span>
                      </span>
                      <a
                        href={applet.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        <span>Launch App</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categorized Repository Catalog */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Categorized Software Repositories ({filteredRepos.length})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Standardized, audited, and public software repositories in fluidmotiontv-oss.
                  </p>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={repoSearch}
                      onChange={(e) => setRepoSearch(e.target.value)}
                      placeholder="Search repositories, tags..."
                      className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 w-48 sm:w-60"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    {['All', 'Core Protocols', 'Spatial Engines', 'Creative Suites', 'Tools'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          selectedCategory === cat
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Repositories Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                          {repo.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Public
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                            {repo.branch || 'main'}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-bold text-sm text-white mt-1.5 flex items-center gap-1.5">
                        <GitBranch className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{repo.name}</span>
                      </h4>

                      <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {repo.description}
                      </p>

                      {/* Topic Tags */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {(repo.tags || []).map((t: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">
                        {repo.meshP2p}
                      </span>
                      <a
                        href={repo.upstream}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                      >
                        <span>GitHub</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRepos.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No repositories matched the selected filter.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-indigo-500/10"><Activity className="w-20 h-20" /></div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Temporal Cycle</p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Dragon 9
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mt-2 font-mono">
                  {d9Data ? d9Data.dragon9.displayTime : 'D9 00:00:00'}
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  54m Hours • 26.667 Daily Hours
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-emerald-500/10"><Waves className="w-20 h-20" /></div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Acoustic Base</p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Pythagorean
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-emerald-400 mt-2 font-mono">
                  432.000 Hz
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  0.00ms Jitter • Wave Motion Locked
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-violet-500/10"><Network className="w-20 h-20" /></div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sovereign Mesh</p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    P2P Gossip
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mt-2">
                  3 Sovereign Peers
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  antiX Master + Termux Edge
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-amber-500/10"><GitBranch className="w-20 h-20" /></div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">fluidmotiontv-oss</p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    100% Public
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mt-2">
                  12 Repositories
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  4 Categories • Master Hub Active
                </p>
              </div>
            </div>

            {/* Live Wave Canvas */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Waves className="w-5 h-5 text-indigo-400" />
                    <span>Fluid Wave Resonance Visualizer (432 Hz Base)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sinusoidal natural tuning replaces rigid synchronization.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {[216, 432, 648, 864].map((f) => (
                    <button
                      key={f}
                      onClick={() => toggleAudio(f)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                        audioActive && selectedFreq === f
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {f}Hz
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full bg-slate-950 rounded-xl p-3 border border-slate-800 relative overflow-hidden">
                <canvas ref={canvasRef} width={900} height={100} className="w-full h-24 rounded-lg block" />
              </div>
            </div>

            {/* Quick Action Commands */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>RepoMan Operational Sequence Commands</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { cmd: 'repoman sequence run', desc: 'Execute complete 3-step sequence', color: 'border-indigo-500/30 hover:bg-indigo-600/10' },
                  { cmd: 'repoman audit --all', desc: 'Step 1: Audit & standardize repos', color: 'border-blue-500/30 hover:bg-blue-600/10' },
                  { cmd: 'repoman visibility --public', desc: 'Step 2: Enforce public visibility', color: 'border-emerald-500/30 hover:bg-emerald-600/10' },
                  { cmd: 'repoman index --generate', desc: 'Step 3: Generate MASTER_INDEX.md', color: 'border-violet-500/30 hover:bg-violet-600/10' },
                  { cmd: 'repoman dragon9', desc: 'Display 54m/18m/13m matrix', color: 'border-amber-500/30 hover:bg-amber-600/10' },
                  { cmd: 'repoman apex run', desc: 'Flush buffer & run 18m Apex cycle', color: 'border-amber-500/30 hover:bg-amber-600/10' },
                  { cmd: 'repoman mesh sync', desc: 'Sync antiX Linux & Termux P2P mesh', color: 'border-violet-500/30 hover:bg-violet-600/10' },
                  { cmd: 'repoman security-audit', desc: 'Zero-telemetry sovereign check', color: 'border-rose-500/30 hover:bg-rose-600/10' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setActiveTab('cli'); runCliCommand(item.cmd); }}
                    className={`p-3 rounded-xl border text-left transition-all bg-slate-950/50 ${item.color} group`}
                  >
                    <div className="font-mono text-xs text-indigo-300 font-semibold group-hover:text-white">{item.cmd}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. DRAGON 9 MATRIX TAB */}
        {activeTab === 'dragon9' && d9Data && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Dragon 9 Chronometer
                    </span>
                    <span className="text-xs text-slate-400">Solar Day Restructured</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mt-1 font-mono">
                    {d9Data.dragon9.displayTime}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Solar elapsed: {d9Data.solarMinutesElapsed} of 1,440 minutes • 54-minute hour cycle
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => runJob('job_dragon9_apex_flush')}
                    className="px-4 py-2 bg-amber-600/90 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-amber-600/20 transition-all"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Trigger Apex Cycle Now</span>
                  </button>
                  <button
                    onClick={playApexChime}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
                  >
                    <span>Harmonic Chime</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-semibold uppercase">54-Minute Hour</span>
                    <Clock className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold font-mono text-white">
                      Minute {d9Data.dragon9.minute} / 54
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full transition-all duration-500"
                        style={{ width: `${(d9Data.dragon9.minute / 54) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Cycle {d9Data.dragon9.hour} of 26.667 daily hours (1,440 / 54 = 26.6667)
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-semibold uppercase">18-Minute Apex</span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold font-mono text-amber-300">
                      {d9Data.dragon9.isApex ? 'ACTIVE' : `${d9Data.dragon9.minutesUntilNextApex}m remaining`}
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full transition-all duration-500"
                        style={{ width: `${((d9Data.dragon9.minute % 18) / 18) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Harmonic buffer: 36m Motion Wave + 18m Apex Intermission
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-semibold uppercase">13-Month Harmony</span>
                    <Compass className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-emerald-300">
                      {d9Data.calendar13m.monthName} {d9Data.calendar13m.dayOfMonth}
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full transition-all duration-500"
                        style={{ width: `${(d9Data.calendar13m.dayOfMonth / 28) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      13 months × 28 days = 364 days + 1 Sovereign Apex Year-Day
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. P2P MESH TAB */}
        {activeTab === 'mesh' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Network className="w-5 h-5 text-indigo-400" />
                    <span>Sovereign Local P2P Mesh Topology</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Decentralized, zero-telemetry node synchronization across antiX Linux and Termux edge devices.
                  </p>
                </div>
                <button
                  onClick={() => runCliCommand('mesh sync')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync P2P Mesh Now</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {[
                  {
                    id: 'antix-workstation-master',
                    name: 'antiX Linux Sovereign Master',
                    os: 'antiX 23.2 (systemd-free, runit)',
                    arch: 'x86_64',
                    ram: '118 MB / 4 GB',
                    latency: '6ms',
                    status: 'Connected & Harmonic Locked',
                    isLocal: true
                  },
                  {
                    id: 'termux-node-09b',
                    name: 'Termux Android Edge Node',
                    os: 'Termux ARM64 (Linux 6.1-android)',
                    arch: 'aarch64',
                    ram: '46 MB / 8 GB',
                    latency: '14ms',
                    status: 'Connected & Harmonic Locked',
                    isLocal: false
                  },
                  {
                    id: 'mesh-gateway-sol',
                    name: 'Alpine Sovereign Gateway',
                    os: 'Alpine Linux 3.20 (musl libc)',
                    arch: 'x86_64',
                    ram: '28 MB / 1 GB',
                    latency: '22ms',
                    status: 'Connected & Harmonic Locked',
                    isLocal: false
                  }
                ].map((node, i) => (
                  <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{node.name}</span>
                        {node.isLocal && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Current Daemon
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-2 space-y-1">
                        <div>Platform: <strong className="text-slate-300">{node.os}</strong></div>
                        <div>Architecture: <code className="text-indigo-400">{node.arch}</code></div>
                        <div>RAM Footprint: <strong className="text-emerald-400">{node.ram}</strong></div>
                        <div>Mesh Latency: <strong className="text-amber-300">{node.latency}</strong></div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span>432 Hz Synchronized</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. CLI TERMINAL TAB */}
        {activeTab === 'cli' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[calc(100vh-140px)]">
            <div className="bg-slate-850 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/85"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/85"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/85"></div>
                <span className="font-mono text-xs text-slate-400 ml-2">
                  repoman-terminal — fluidmotiontv-oss@sovereign:~/applet
                </span>
              </div>
              <button
                onClick={() => setCliLogs([])}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Clear Terminal
              </button>
            </div>

            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-4 bg-slate-950">
              <div className="text-slate-500">
                RepoMan Autonomous Agent v2.4.0-dragon9. Operational sequence commands enabled.
              </div>

              {cliLogs.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <span className="text-slate-500">[{item.time}]</span>
                    <span className="font-bold text-emerald-400">fluidmotiontv@mesh:~$</span>
                    <span className="text-white font-semibold">{item.command}</span>
                  </div>
                  <pre className={`p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 text-slate-300 whitespace-pre-wrap leading-relaxed ${item.exitCode !== 0 ? 'border-red-500/30 text-red-300' : ''}`}>
                    {item.output}
                  </pre>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            <div className="bg-slate-900 px-4 py-2 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] text-slate-500 uppercase font-semibold shrink-0">Sequence:</span>
              {[
                'repoman sequence run',
                'repoman audit --all',
                'repoman visibility --public',
                'repoman index --generate',
                'repoman dragon9',
                'repoman apex run',
                'repoman mesh sync',
                'repoman status',
                'repoman security-audit'
              ].map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => runCliCommand(cmd)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-mono transition-colors shrink-0"
                >
                  {cmd}
                </button>
              ))}
            </div>

            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
              <span className="font-mono text-emerald-400 font-bold">fluidmotiontv&gt;</span>
              <input
                type="text"
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runCliCommand()}
                placeholder="Type command (e.g. repoman sequence run, repoman audit, repoman index)..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 font-mono text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => runCliCommand()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Execute</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. WORKSPACE FILES TAB */}
        {activeTab === 'workspace' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-full shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-indigo-400" />
                  <span>Workspace Tree</span>
                </h3>
                <button
                  onClick={fetchWorkspace}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-1 space-y-0.5">
                {renderTreeNode(tree)}
              </div>
            </div>

            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full shadow-lg overflow-hidden">
              <div className="bg-slate-850 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs font-semibold text-white">{selectedFile}</span>
                  {fileContent !== originalContent && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Modified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {fileStatusMsg && (
                    <span className="text-xs text-emerald-400 font-medium">{fileStatusMsg}</span>
                  )}
                  <button
                    onClick={saveFileContent}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all"
                  >
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 p-0 bg-slate-950 flex flex-col">
                <textarea
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  className="w-full h-full bg-slate-950 text-slate-200 font-mono text-xs p-4 resize-none focus:outline-none leading-relaxed"
                  spellCheck="false"
                />
              </div>
            </div>
          </div>
        )}

        {/* 7. JOBS SCHEDULER TAB */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Play className="w-5 h-5 text-indigo-400" />
                    <span>Dragon 9 Harmonic Task Scheduler</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Scheduled on 54-minute cycles, 18-minute Apex intervals, and 432 Hz acoustic drift calibrations.
                  </p>
                </div>
                <button
                  onClick={() => runJob('all')}
                  disabled={runningJobId !== null}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run All Harmonic Jobs</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-md">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm text-white">{job.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${job.enabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                          {job.harmonicTrigger || 'Active'}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-slate-400 mt-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                        {job.command}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                        <span>Schedule: <strong className="text-slate-200">{job.schedule}</strong></span>
                        <span>ID: <code className="text-indigo-400">{job.id}</code></span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Node: antiX/Termux</span>
                      <button
                        onClick={() => runJob(job.id)}
                        disabled={runningJobId !== null}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        {runningJobId === job.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{runningJobId === job.id ? 'Running...' : 'Execute Job'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Harmonic Job Execution Log</span>
              </h3>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed min-h-[120px]">
                {jobLogs}
              </pre>
            </div>
          </div>
        )}

        {/* 8. AI FLUID PATCH ENGINE TAB */}
        {activeTab === 'ai-patch' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Fluid Motion AI Patch & Wave Refactor Engine</h3>
                  <p className="text-xs text-slate-400">
                    Engineered for fluidmotiontv-oss. Refactors code to eliminate rigid bloat, enforce zero telemetry, and optimize for antiX Linux and Termux sovereign local environments.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Optimization Directive</label>
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                    placeholder="e.g. Standardize READMEs, add Dragon 9 badges, optimize memory footprint"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Target file: <code className="text-indigo-400 font-mono">{selectedFile}</code></span>
                  <button
                    onClick={runAiPatch}
                    disabled={aiLoading}
                    className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all disabled:opacity-50"
                  >
                    {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{aiLoading ? 'Synthesizing Fluid Patch...' : 'Synthesize Fluid Patch'}</span>
                  </button>
                </div>
              </div>
            </div>

            {aiResult && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Fluid Motion AI Patch Output</span>
                </h4>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                  <p className="font-semibold text-indigo-300">Analysis:</p>
                  <p>{aiResult.explanation}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">Refactored Code:</span>
                    <button
                      onClick={() => { setFileContent(aiResult.patchedCode); setActiveTab('workspace'); }}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all"
                    >
                      Apply Patch to File
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 max-h-80 overflow-y-auto">
                    {aiResult.patchedCode}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 9. GIT & SYNC TAB */}
        {activeTab === 'git' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                <GitBranch className="w-5 h-5 text-indigo-400" />
                <span>fluidmotiontv-oss Git & Sovereign Mesh Engine</span>
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Automated upstream synchronization, rebase workflows, and peer-to-peer mesh gossip hash broadcast.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400 font-medium">Upstream Organization</span>
                  <div className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-400" />
                    <span>fluidmotiontv-oss</span>
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400 font-medium">Visibility State</span>
                  <div className="text-lg font-bold text-emerald-400 mt-1">100% Public</div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400 font-medium">Master Index Hub</span>
                  <div className="text-lg font-bold text-indigo-400 mt-1">Compiled & Synced</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => runCliCommand('sync --auto-pr --rebase-upstream')}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <GitBranch className="w-4 h-4" />
                  <span>Sync & Rebase Upstream</span>
                </button>
                <button
                  onClick={() => runCliCommand('sequence run')}
                  className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all"
                >
                  <Zap className="w-4 h-4" />
                  <span>Run Complete Sequence</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 10. AUDIT LOGS TAB */}
        {activeTab === 'audit' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span>Sovereign Audit Log (`repoman-audit.log`)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Cryptographically anchored, zero-telemetry audit trail for fluidmotiontv-oss.
                </p>
              </div>
              <button
                onClick={fetchAuditLogs}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Logs</span>
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2 max-h-[500px] overflow-y-auto">
              {auditLogs.map((log, i) => (
                <div key={i} className="text-slate-300 flex items-start gap-2 py-1 border-b border-slate-900">
                  <span className="text-slate-500 select-none">[{i + 1}]</span>
                  <span className="break-all">{log}</span>
                </div>
              ))}
              {auditLogs.length === 0 && <div className="text-slate-500 text-center py-6">No audit records found.</div>}
            </div>
          </div>
        )}

        {/* 11. CONFIG STUDIO TAB */}
        {activeTab === 'config' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-400" />
                  <span>Configuration Studio (`repoman.config.json`)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure repositories, published applets, Dragon 9 harmonic parameters, and P2P mesh.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {configStatus && <span className="text-xs text-emerald-400 font-medium">{configStatus}</span>}
                <button
                  onClick={saveConfig}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <span>Save Configuration</span>
                </button>
              </div>
            </div>

            <textarea
              value={configJson}
              onChange={(e) => setConfigJson(e.target.value)}
              className="w-full h-[420px] bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
              spellCheck="false"
            />
          </div>
        )}

        {/* 12. SETUP GUIDE TAB */}
        {activeTab === 'guide' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">🤖 RepoMan Operational Sequence & Setup Guide</h2>
                  <p className="text-xs text-slate-400">
                    Repository Audit, Public Visibility Enforcement & Master Index Generation Workflow
                  </p>
                </div>
              </div>
            </div>

            {/* Sequence Flow Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="text-indigo-400 font-bold text-xs uppercase">Step 1</div>
                <h4 className="font-bold text-sm text-white mt-1">Audit & Updates</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Scans all connected repositories, standardizes README headers, and applies Dragon 9 and 432 Hz topic tags.
                </p>
                <div className="mt-3 font-mono text-[11px] text-slate-300 bg-slate-900 p-2 rounded">
                  repoman audit --all
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="text-emerald-400 font-bold text-xs uppercase">Step 2</div>
                <h4 className="font-bold text-sm text-white mt-1">Visibility Management</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Reviews access settings across designated repositories and updates visibility to <strong>Public</strong>.
                </p>
                <div className="mt-3 font-mono text-[11px] text-slate-300 bg-slate-900 p-2 rounded">
                  repoman visibility --public
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="text-violet-400 font-bold text-xs uppercase">Step 3</div>
                <h4 className="font-bold text-sm text-white mt-1">Master Index Hub</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Compiles <code>MASTER_INDEX.md</code>, categorizing repos and linking published AI Studio applets.
                </p>
                <div className="mt-3 font-mono text-[11px] text-slate-300 bg-slate-900 p-2 rounded">
                  repoman index --generate
                </div>
              </div>
            </div>

            {/* Complete Automated Command */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">★</span>
                <h3 className="text-sm font-bold text-white">One-Shot Automated Execution</h3>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative group">
                <pre className="font-mono text-xs text-slate-300">
{`# Execute the complete 3-step operational sequence:
repoman sequence run

# Or via Node.js script:
node scripts/repoman-audit-publish.mjs all`}
                </pre>
                <button
                  onClick={() => copyToClipboard('repoman sequence run', 'seq1')}
                  className="absolute top-3 right-3 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {copied === 'seq1' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Markdown Modal */}
      {showMarkdownModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">MASTER_INDEX.md Hub Document</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(masterIndexData.markdown, 'modal_md')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  {copied === 'modal_md' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'modal_md' ? 'Copied Markdown' : 'Copy Markdown'}</span>
                </button>
                <button
                  onClick={() => setShowMarkdownModal(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-300 bg-slate-950 whitespace-pre-wrap leading-relaxed select-text">
              {masterIndexData.markdown}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
