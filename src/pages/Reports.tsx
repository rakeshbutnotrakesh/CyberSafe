import React, { useState } from 'react';
import {
  BarChart2,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  Shield,
  FileCode,
  FileSpreadsheet,
  AlertCircle,
  KeyRound,
  Search,
  Hash,
  GraduationCap,
  HelpCircle,
} from 'lucide-react';
import {
  ActivityLogEntry,
  ChecklistItem,
  QuizResult,
  SecurityStats,
} from '../types/security';
import { formatDateTime } from '../utils/formatters';
import { ConfirmModal } from '../components/ConfirmModal';

interface ReportsProps {
  stats: SecurityStats;
  checklist: ChecklistItem[];
  activity: ActivityLogEntry[];
  quizHistory: QuizResult[];
  onClearActivity: () => void;
  onCopySuccess: (msg: string) => void;
}

export const Reports: React.FC<ReportsProps> = ({
  stats,
  checklist,
  activity,
  quizHistory,
  onClearActivity,
  onCopySuccess,
}) => {
  const [showClearModal, setShowClearModal] = useState(false);

  const completedChecklist = checklist.filter((i) => i.completed).length;
  const checklistPercent = checklist.length > 0 ? Math.round((completedChecklist / checklist.length) * 100) : 0;

  const handleExportJSON = () => {
    const reportData = {
      reportTitle: 'CyberSafe Local Security Hygiene Audit Report',
      generatedAt: new Date().toISOString(),
      privacyNotice: 'Generated 100% locally in browser memory. No sensitive passwords or credentials are included.',
      summaryStats: {
        passwordAnalysesPerformed: stats.passwordAnalysesCount,
        urlAnalysesPerformed: stats.urlAnalysesCount,
        fileHashesGenerated: stats.hashGenerationsCount,
        learningModulesRead: `${stats.topicsRead.length} / 10`,
        quizAttempts: stats.quizAttempts,
        quizBestScore: `${stats.quizBestScore}%`,
        checklistCompletion: `${checklistPercent}% (${completedChecklist}/${checklist.length})`,
      },
      checklistAuditItems: checklist.map((item) => ({
        category: item.category,
        title: item.title,
        status: item.completed ? 'Completed' : 'Pending',
        importance: item.importance,
        personalNote: item.notes || null,
      })),
      recentActivityTimeline: activity,
      quizExamHistory: quizHistory,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybersafe-report-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onCopySuccess(`Exported report as ${a.download}`);
  };

  const handleExportCSV = () => {
    // Generate clean CSV format
    const rows: string[][] = [
      ['CyberSafe Personal Security Activity & Audit Report'],
      ['Generated At', new Date().toISOString()],
      ['Privacy Notice', 'Zero Passwords Included - 100% Client-Side Engine'],
      [],
      ['Metric', 'Value'],
      ['Password Analyses', stats.passwordAnalysesCount.toString()],
      ['URL Analyses', stats.urlAnalysesCount.toString()],
      ['File Hashes Generated', stats.hashGenerationsCount.toString()],
      ['Learning Modules Read', `${stats.topicsRead.length} / 10`],
      ['Quiz Attempts', stats.quizAttempts.toString()],
      ['Quiz High Score', `${stats.quizBestScore}%`],
      ['Checklist Completion', `${checklistPercent}% (${completedChecklist}/${checklist.length})`],
      [],
      ['Category', 'Checklist Item', 'Status', 'Importance', 'Personal Note'],
    ];

    checklist.forEach((item) => {
      rows.push([
        item.category,
        `"${item.title.replace(/"/g, '""')}"`,
        item.completed ? 'Completed' : 'Pending',
        item.importance,
        `"${(item.notes || '').replace(/"/g, '""')}"`,
      ]);
    });

    rows.push([]);
    rows.push(['Timestamp', 'Activity Type', 'Title', 'Details']);
    activity.forEach((act) => {
      rows.push([
        act.timestamp,
        act.type,
        `"${act.title.replace(/"/g, '""')}"`,
        `"${act.details.replace(/"/g, '""')}"`,
      ]);
    });

    const csvContent = rows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybersafe-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onCopySuccess(`Exported CSV report as ${a.download}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-amber-400" />
            <span>Local Security Audit & Activity Report</span>
          </h2>
          <p className="text-xs text-slate-400">
            Synthesized metrics on password assessments, URL evaluations, file hashes, and security checklist posture.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors shadow-sm cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span>Export JSON</span>
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors shadow-sm cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span>Passwords</span>
          </div>
          <div className="text-xl font-bold text-white font-mono tabular-nums">
            {stats.passwordAnalysesCount}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>URLs Checked</span>
          </div>
          <div className="text-xl font-bold text-white font-mono tabular-nums">
            {stats.urlAnalysesCount}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
            <Hash className="w-3.5 h-3.5 text-cyan-400" />
            <span>File Hashes</span>
          </div>
          <div className="text-xl font-bold text-white font-mono tabular-nums">
            {stats.hashGenerationsCount}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            <span>Topics Read</span>
          </div>
          <div className="text-xl font-bold text-white font-mono tabular-nums">
            {stats.topicsRead.length}/10
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>Quiz High</span>
          </div>
          <div className="text-xl font-bold text-white font-mono tabular-nums">
            {stats.quizBestScore > 0 ? `${stats.quizBestScore}%` : 'N/A'}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Checklist</span>
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
            {checklistPercent}%
          </div>
        </div>
      </div>

      {/* Checklist Health Breakdown Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <h3 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-300">
          Security Checklist Health Overview
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {(['ACCOUNT', 'DEVICE', 'BROWSER', 'NETWORK'] as const).map((cat) => {
            const catItems = checklist.filter((i) => i.category === cat);
            const comp = catItems.filter((i) => i.completed).length;
            const pct = catItems.length > 0 ? Math.round((comp / catItems.length) * 100) : 0;
            return (
              <div key={cat} className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                  <span>{cat}</span>
                  <span className="text-emerald-400 font-bold">{pct}%</span>
                </div>
                <div className="text-xs font-semibold text-white">
                  {comp} of {catItems.length} passed
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-300">
              Sanitized Audit Log History ({activity.length})
            </h3>
          </div>

          {activity.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {activity.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No local activity logged yet.
            </div>
          ) : (
            activity.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs gap-3"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200">{entry.title}</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{entry.details}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap shrink-0">
                  {formatDateTime(entry.timestamp)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showClearModal}
        title="Clear Activity Log?"
        message="This will wipe the recent local activity timeline and quiz examination records. Statistical totals will remain."
        confirmLabel="Clear Log"
        isDestructive={true}
        onConfirm={() => {
          onClearActivity();
          setShowClearModal(false);
        }}
        onCancel={() => setShowClearModal(false)}
      />
    </div>
  );
};
