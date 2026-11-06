import React, { useState } from 'react';
import {
  KeyRound,
  Sparkles,
  Search,
  Hash,
  FileSearch,
  CheckSquare,
  GraduationCap,
  HelpCircle,
  FileText,
  BarChart2,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Info,
  Clock,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Compass,
  Award,
} from 'lucide-react';
import { PageId, ChecklistItem, ActivityLogEntry, SecurityStats } from '../types/security';
import { analyzePassword } from '../services/passwordService';
import { PasswordMeter } from '../components/PasswordMeter';
import { formatDateTime } from '../utils/formatters';

interface DashboardProps {
  onNavigate: (page: PageId) => void;
  checklist: ChecklistItem[];
  stats: SecurityStats;
  recentActivity: ActivityLogEntry[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  checklist,
  stats,
  recentActivity,
}) => {
  const [quickPassword, setQuickPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toolFilter, setToolFilter] = useState('');

  const quickAnalysis = analyzePassword(quickPassword);

  const totalChecklist = checklist.length;
  const completedChecklist = checklist.filter((i) => i.completed).length;
  const checklistPercent = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0;

  // Calculate composite Personal Security Posture Index (0 to 100)
  // Checklist: 40%, Learning: 20%, Quiz best score: 20%, Active audits: 20%
  const totalAudits = (stats.passwordAnalysesCount || 0) + (stats.urlAnalysesCount || 0) + (stats.hashGenerationsCount || 0) + (stats.vaultOperationsCount || 0);
  const auditPoints = Math.min(20, Math.round(totalAudits * 4));
  const learningPoints = Math.min(20, Math.round((stats.topicsRead.length / 10) * 20));
  const quizPoints = Math.min(20, Math.round((stats.quizBestScore / 100) * 20));
  const checklistPoints = Math.round((checklistPercent / 100) * 40);

  const postureScore = checklistPoints + learningPoints + quizPoints + auditPoints;

  const getPostureRating = (score: number) => {
    if (score >= 80) return { label: 'Optimal Defense Posture', color: 'text-emerald-400', badge: 'bg-emerald-950 border-emerald-800 text-emerald-300' };
    if (score >= 50) return { label: 'Moderate Defense Posture', color: 'text-cyan-400', badge: 'bg-cyan-950 border-cyan-800 text-cyan-300' };
    return { label: 'Needs Hardening', color: 'text-amber-400', badge: 'bg-amber-950 border-amber-800 text-amber-300' };
  };

  const posture = getPostureRating(postureScore);

  const tools = [
    {
      id: 'password-analyzer' as PageId,
      name: 'Password Analyzer',
      category: 'Audit',
      description: 'Entropy, character diversity, keyboard walks, and GPU crack-time estimation.',
      icon: KeyRound,
      tag: 'Strength Audit',
      color: 'hover:border-emerald-500/50',
    },
    {
      id: 'password-generator' as PageId,
      name: 'Password Generator',
      category: 'CSPRNG',
      description: 'Cryptographically secure passwords & Diceware passphrases via Web Crypto API.',
      icon: Sparkles,
      tag: 'Web Crypto',
      color: 'hover:border-cyan-500/50',
    },
    {
      id: 'url-analyzer' as PageId,
      name: 'Phishing URL Analyzer',
      category: 'Network',
      description: 'Offline heuristic inspection for typosquatting, deceptive subdomains, and punycode.',
      icon: Search,
      tag: 'Offline Heuristics',
      color: 'hover:border-amber-500/50',
    },
    {
      id: 'hash-generator' as PageId,
      name: 'File Hash Generator',
      category: 'Crypto',
      description: 'Calculate SHA-256, SHA-384, and SHA-512 checksums with local integrity verification.',
      icon: Hash,
      tag: 'Integrity',
      color: 'hover:border-emerald-500/50',
    },
    {
      id: 'metadata-inspector' as PageId,
      name: 'Metadata Inspector',
      category: 'Forensics',
      description: 'Examine file properties, binary magic numbers, and image dimensions locally.',
      icon: FileSearch,
      tag: 'File Forensics',
      color: 'hover:border-blue-500/50',
    },
    {
      id: 'crypto-vault' as PageId,
      name: 'AES-256 Crypto Vault',
      category: 'Crypto',
      description: 'Encrypt and decrypt sensitive backup notes locally using authenticated AES-GCM & PBKDF2.',
      icon: Lock,
      tag: 'AES-256-GCM',
      color: 'hover:border-emerald-500/50',
    },
    {
      id: 'steganography' as PageId,
      name: 'Steganography Lab',
      category: 'Concealment',
      description: 'Hide and extract confidential text within lossless image pixels using LSB embedding.',
      icon: EyeOff,
      tag: 'Pixel LSB',
      color: 'hover:border-cyan-500/50',
    },
    {
      id: 'email-analyzer' as PageId,
      name: 'Email Header Inspector',
      category: 'Network',
      description: 'Parse SPF, DKIM, and DMARC headers offline to detect forged senders and trace hops.',
      icon: Mail,
      tag: 'SPF/DKIM/DMARC',
      color: 'hover:border-amber-500/50',
    },
    {
      id: 'incident-simulator' as PageId,
      name: 'Incident Response Simulator',
      category: 'Training',
      description: 'Interactive crisis decision trees for ransomware, phishing, and SIM swap triage.',
      icon: Compass,
      tag: 'NIST Framework',
      color: 'hover:border-purple-500/50',
    },
    {
      id: 'checklist' as PageId,
      name: 'Security Checklist',
      category: 'Audit',
      description: 'Interactive audit across accounts, devices, browsers, and home Wi-Fi networks.',
      icon: CheckSquare,
      tag: `${checklistPercent}% Complete`,
      color: 'hover:border-emerald-500/50',
    },
    {
      id: 'learning' as PageId,
      name: 'Learning Center',
      category: 'Training',
      description: '10 beginner-friendly cybersecurity guides with real incident scenarios and mini-quizzes.',
      icon: GraduationCap,
      tag: `${stats.topicsRead.length}/10 Read`,
      color: 'hover:border-cyan-500/50',
    },
    {
      id: 'quiz' as PageId,
      name: 'Security Quiz',
      category: 'Training',
      description: '30-question test covering phishing, social engineering, passwords, and data privacy.',
      icon: HelpCircle,
      tag: stats.quizBestScore > 0 ? `Best: ${stats.quizBestScore}%` : '30 Questions',
      color: 'hover:border-purple-500/50',
    },
    {
      id: 'notes' as PageId,
      name: 'Private Notes',
      category: 'Audit',
      description: 'Encrypted-in-memory scratchpad for device audit dates and security reminders.',
      icon: FileText,
      tag: 'Offline Only',
      color: 'hover:border-slate-500/50',
    },
  ];

  const filteredTools = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(toolFilter.toLowerCase()) ||
      t.description.toLowerCase().includes(toolFilter.toLowerCase()) ||
      t.category.toLowerCase().includes(toolFilter.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Educational Disclaimer Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-xs text-slate-300">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Educational Assessment Scope: </span>
          CyberSafe provides offline educational risk evaluations, cryptographic calculations, and self-assessment checklists. It operates within browser sandbox boundaries and does not monitor, probe, or measure your physical device's operating system kernel, hardware telemetry, or active antivirus status.
        </div>
      </div>

      {/* Security Posture Index Card */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950 p-6 md:p-8 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                Personal Security Posture Index
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl md:text-4xl font-extrabold font-mono text-white tabular-nums">
                {postureScore}
              </span>
              <span className="text-slate-400 text-sm font-mono">/ 100</span>
              <span className={`text-xs px-2.5 py-1 rounded-md border font-semibold ${posture.badge}`}>
                {posture.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              Composite personal defense score calculated from your completed checklist audits ({checklistPoints}/40), learning modules read ({learningPoints}/20), quiz mastery ({quizPoints}/20), and local security operations ({auditPoints}/20).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('checklist')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              Harden Posture
            </button>
          </div>
        </div>

        {/* 4-Domain Progress Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Checklist</span>
              <span className="text-emerald-400">{checklistPercent}%</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${checklistPercent}%` }} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Curriculum</span>
              <span className="text-cyan-400">{Math.round((stats.topicsRead.length / 10) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${(stats.topicsRead.length / 10) * 100}%` }} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Quiz High</span>
              <span className="text-purple-400">{stats.quizBestScore}%</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${stats.quizBestScore}%` }} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Audits Run</span>
              <span className="text-amber-400">{totalAudits}</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, totalAudits * 20)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Checklist Completion */}
        <div
          onClick={() => onNavigate('checklist')}
          className="cursor-pointer group p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-emerald-500/40 hover:bg-slate-900/70 transition-all space-y-3"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-mono tracking-wider">Security Checklist</span>
            <CheckSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {completedChecklist}/{totalChecklist}
            </div>
            <span className="text-xs font-semibold text-emerald-400 font-mono">{checklistPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${checklistPercent}%` }}
            />
          </div>
        </div>

        {/* Learning Progress */}
        <div
          onClick={() => onNavigate('learning')}
          className="cursor-pointer group p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-cyan-500/40 hover:bg-slate-900/70 transition-all space-y-3"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-mono tracking-wider">Learning Modules</span>
            <GraduationCap className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {stats.topicsRead.length}/10
            </div>
            <span className="text-xs font-semibold text-cyan-400 font-mono">
              {Math.round((stats.topicsRead.length / 10) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(stats.topicsRead.length / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Security Quiz High Score */}
        <div
          onClick={() => onNavigate('quiz')}
          className="cursor-pointer group p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-purple-500/40 hover:bg-slate-900/70 transition-all space-y-3"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-mono tracking-wider">Quiz High Score</span>
            <HelpCircle className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {stats.quizBestScore > 0 ? `${stats.quizBestScore}%` : 'Not Taken'}
            </div>
            <span className="text-xs text-slate-400 font-mono">{stats.quizAttempts} tries</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.quizBestScore}%` }}
            />
          </div>
        </div>

        {/* Total Local Operations */}
        <div
          onClick={() => onNavigate('reports')}
          className="cursor-pointer group p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-amber-500/40 hover:bg-slate-900/70 transition-all space-y-3"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-mono tracking-wider">Tools Executed</span>
            <BarChart2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {stats.passwordAnalysesCount + stats.urlAnalysesCount + stats.hashGenerationsCount}
            </div>
            <span className="text-xs text-amber-400 font-mono">Audits</span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            {stats.hashGenerationsCount} hashes · {stats.urlAnalysesCount} URLs · {stats.passwordAnalysesCount} passes
          </p>
        </div>
      </div>

      {/* Main Grid: Quick Password Tester & Recent Local Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Password Test Card */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Interactive Password Strength Tester</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Instant offline entropy calculation, pattern checks, and brute-force crack time estimates.
              </p>
            </div>
            <button
              onClick={() => onNavigate('password-analyzer')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <span>Full Analyzer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={quickPassword}
                onChange={(e) => setQuickPassword(e.target.value)}
                placeholder="Type a password to test strength (e.g. MySecretPassphrase123!)"
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {quickPassword.length > 0 ? (
              <PasswordMeter analysis={quickAnalysis} />
            ) : (
              <div className="p-4 rounded-lg border border-slate-800/80 bg-slate-950/40 text-xs text-slate-400 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Enter any sample password above to analyze length, dictionary words, and entropy.</span>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <h2 className="text-base font-semibold text-white">Recent Checks</h2>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View Report
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 max-h-72 pr-1">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 space-y-1">
                <p>No recent activity logged yet.</p>
                <p className="text-[11px] text-slate-400">Run a URL check or hash a file to record activity.</p>
              </div>
            ) : (
              recentActivity.slice(0, 5).map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/60 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 truncate max-w-[150px]">
                      {act.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDateTime(act.timestamp)}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] line-clamp-1">{act.details}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Cybersecurity Toolkit Navigation Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">CyberSafe Security Suite ({filteredTools.length})</h2>
            <p className="text-xs text-slate-400">Select any client-side offline defense utility.</p>
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={toolFilter}
              onChange={(e) => setToolFilter(e.target.value)}
              placeholder="Filter security tools..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>
        </div>

        {filteredTools.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-slate-800 bg-slate-900/30 text-xs text-slate-400">
            No security tools match "{toolFilter}".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.id}
                  onClick={() => onNavigate(t.id)}
                  className={`cursor-pointer group p-5 rounded-xl border border-slate-800 bg-slate-900/40 ${t.color} hover:bg-slate-900/70 transition-all flex flex-col justify-between space-y-4`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700/60 text-emerald-400 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/50 text-slate-300">
                        {t.tag}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{t.description}</p>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-white pt-2 border-t border-slate-800/60 transition-colors">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
