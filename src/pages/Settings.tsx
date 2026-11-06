import React, { useState, useRef } from 'react';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Palette,
  Clipboard,
  Hash,
  Trash2,
  Check,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { AppSettings, HashAlgorithm } from '../types/security';
import { ConfirmModal } from '../components/ConfirmModal';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onExportAllData: () => void;
  onImportData: (jsonString: string) => { success: boolean; error?: string };
  onResetApp: () => void;
  onClearHistory: () => void;
  onCopySuccess: (msg: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onUpdateSettings,
  onExportAllData,
  onImportData,
  onResetApp,
  onClearHistory,
  onCopySuccess,
}) => {
  const [showResetModal, setShowResetModal] = useState(false);
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success: boolean; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThemeChange = (theme: AppSettings['theme']) => {
    onUpdateSettings({ ...settings, theme });
    onCopySuccess(`Theme updated.`);
  };

  const handleAlgorithmChange = (defaultHashAlgorithm: HashAlgorithm) => {
    onUpdateSettings({ ...settings, defaultHashAlgorithm });
    onCopySuccess(`Default algorithm set to ${defaultHashAlgorithm}.`);
  };

  const handleClipboardToggle = (autoClearClipboard: boolean) => {
    onUpdateSettings({ ...settings, autoClearClipboard });
  };

  const handleClipboardSeconds = (clipboardClearSeconds: number) => {
    onUpdateSettings({ ...settings, clipboardClearSeconds });
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = onImportData(content);
      if (res.success) {
        setImportStatus({ success: true, msg: 'Backup restored successfully! All data updated.' });
        onCopySuccess('Data restored from backup.');
      } else {
        setImportStatus({ success: false, msg: res.error || 'Failed to parse backup JSON.' });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-emerald-400" />
          <span>Application Settings & Local Storage</span>
        </h2>
        <p className="text-xs text-slate-400">
          Configure security defaults, clipboard protection timers, and manage JSON backups.
        </p>
      </div>

      {/* Privacy Guarantee Card */}
      <div className="p-4 rounded-xl border border-emerald-900/60 bg-gradient-to-r from-emerald-950/30 to-slate-900/80 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-semibold text-emerald-300">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Local-Only Processing Principle</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          "CyberSafe processes your data locally in your browser. Your passwords, files and submitted URLs are not uploaded to external servers."
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance & Themes */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase font-mono tracking-wider text-slate-300">
            <Palette className="w-4 h-4 text-cyan-400" />
            <span>Theme & Visual Styling</span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { id: 'cyber-dark' as const, label: 'Cyber Dark (Default)', desc: 'Deep obsidian & emerald glow accents' },
              { id: 'matrix-green' as const, label: 'Matrix Terminal', desc: 'High-contrast monochrome phosphor green' },
              { id: 'neon-cyan' as const, label: 'Neon Cyan', desc: 'Deep electric cyan & cold slate surfaces' },
              { id: 'slate-midnight' as const, label: 'Midnight Slate', desc: 'Subtle corporate dark navy theme' },
            ].map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => handleThemeChange(th.id)}
                className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                  settings.theme === th.id
                    ? 'border-emerald-500 bg-emerald-950/20 text-white font-semibold'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="text-xs">{th.label}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{th.desc}</div>
                </div>
                {settings.theme === th.id && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Security Defaults */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase font-mono tracking-wider text-slate-300">
            <Hash className="w-4 h-4 text-emerald-400" />
            <span>Default Hash Algorithm</span>
          </div>

          <div className="space-y-2 text-xs">
            {(['SHA-256', 'SHA-384', 'SHA-512'] as HashAlgorithm[]).map((algo) => (
              <button
                key={algo}
                type="button"
                onClick={() => handleAlgorithmChange(algo)}
                className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                  settings.defaultHashAlgorithm === algo
                    ? 'border-emerald-500 bg-emerald-950/20 text-white font-semibold'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="text-xs font-mono">{algo}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {algo === 'SHA-256'
                      ? 'Fastest standard checksum (256-bit digest)'
                      : algo === 'SHA-384'
                      ? 'Truncated SHA-512 with high collision resistance'
                      : 'Highest security 512-bit digest for critical assets'}
                  </div>
                </div>
                {settings.defaultHashAlgorithm === algo && (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Clipboard Preferences */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase font-mono tracking-wider text-slate-300">
            <Clipboard className="w-4 h-4 text-amber-400" />
            <span>Clipboard Security & Auto-Clear</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <div>
                <span className="text-slate-200 font-medium">Auto-Clear Clipboard</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Overwrites copied credentials after a timeout to prevent clipboard sniffing.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoClearClipboard}
                onChange={(e) => handleClipboardToggle(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500"
              />
            </label>

            {settings.autoClearClipboard && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between text-slate-300">
                  <span>Clear Timeout</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {settings.clipboardClearSeconds} seconds
                  </span>
                </div>
                <div className="flex gap-2">
                  {[15, 30, 60].map((secs) => (
                    <button
                      key={secs}
                      type="button"
                      onClick={() => handleClipboardSeconds(secs)}
                      className={`flex-1 py-1.5 rounded text-xs font-mono border transition-colors ${
                        settings.clipboardClearSeconds === secs
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {secs}s
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Data Backup & Migration */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase font-mono tracking-wider text-slate-300">
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Backup & Restore Data</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Export a full JSON backup of your checklist progress, custom notes, quiz scores, and settings.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              onClick={onExportAllData}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export JSON Backup</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors shadow-sm"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Import Backup</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileImport}
              className="hidden"
            />
          </div>

          {importStatus && (
            <div
              className={`p-2.5 rounded-lg text-xs font-mono flex items-center gap-2 ${
                importStatus.success
                  ? 'bg-emerald-950/50 border border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/50 border border-rose-800 text-rose-300'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{importStatus.msg}</span>
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone: Clear History & Reset App */}
      <div className="rounded-xl border border-rose-900/40 bg-rose-950/10 p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase font-mono tracking-wider text-rose-400">
          <Trash2 className="w-4 h-4" />
          <span>Data Erasure & Reset</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-slate-100">Clear Activity Logs & Quiz History</h4>
            <p className="text-xs text-slate-400">
              Wipes the recent activity log and quiz examination scores while preserving notes and checklist state.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowClearHistoryModal(true)}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-rose-950 text-rose-300 hover:text-rose-200 border border-rose-900/60 text-xs font-semibold transition-colors shrink-0"
          >
            Clear History
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-rose-900/30">
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-rose-300">Complete Application Reset</h4>
            <p className="text-xs text-slate-400">
              Wipes all locally stored checklist items, private notes, learning progress, and restores factory defaults.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shrink-0 shadow-sm"
          >
            Reset All Data
          </button>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={showClearHistoryModal}
        title="Clear Activity History?"
        message="This will clear your recent security check timeline and quiz exam scores. Notes and checklist progress will remain."
        confirmLabel="Clear History"
        isDestructive={true}
        onConfirm={() => {
          onClearHistory();
          setShowClearHistoryModal(false);
        }}
        onCancel={() => setShowClearHistoryModal(false)}
      />

      <ConfirmModal
        isOpen={showResetModal}
        title="Reset CyberSafe Application Completely?"
        message="WARNING: This will permanently delete all your offline notes, checklist records, learning history, and restore factory defaults. This action cannot be reversed."
        confirmLabel="Delete Everything & Reset"
        isDestructive={true}
        onConfirm={() => {
          onResetApp();
          setShowResetModal(false);
        }}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  );
};
