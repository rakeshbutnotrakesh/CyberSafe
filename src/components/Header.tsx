import React from 'react';
import { Menu, ShieldCheck, Download, Search, Sparkles } from 'lucide-react';
import { PageId } from '../types/security';

interface HeaderProps {
  currentPage: PageId;
  onOpenMobile: () => void;
  onExportAudit: () => void;
  onOpenCommandPalette: () => void;
  onOpenQuickPassword: () => void;
}

const PAGE_TITLES: Record<PageId, string> = {
  'dashboard': 'Security Dashboard',
  'password-analyzer': 'Password Security Analyzer',
  'password-generator': 'Secure Password Generator',
  'url-analyzer': 'Phishing & URL Analyzer',
  'hash-generator': 'File Hash Calculator',
  'metadata-inspector': 'File Metadata Inspector',
  'crypto-vault': 'AES-256 Cryptographic Vault',
  'steganography': 'Steganography Concealment Lab',
  'email-analyzer': 'Email Header & SPF/DKIM Inspector',
  'incident-simulator': 'Incident & Breach Simulator',
  'checklist': 'Personal Security Checklist',
  'learning': 'Cybersecurity Learning Center',
  'quiz': 'Security Knowledge Quiz',
  'notes': 'Private Security Notes',
  'reports': 'Security Activity Report',
  'settings': 'Settings & Local Storage',
};

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onOpenMobile,
  onExportAudit,
  onOpenCommandPalette,
  onOpenQuickPassword,
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-4 md:gap-8 border-b border-slate-800/80 bg-slate-950/90 px-4 sm:px-8 backdrop-blur-md">
      {/* Zone 1: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm whitespace-nowrap">
          <span className="font-semibold text-slate-400 hidden sm:inline">CyberSafe</span>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <h1 className="font-semibold text-white truncate max-w-[150px] sm:max-w-xs">
            {PAGE_TITLES[currentPage]}
          </h1>
        </div>
      </div>

      {/* Zone 2: Omnibar Quick Search & Status */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          title="Search tools (Ctrl+K or ⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Quick Jump</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-950 rounded border border-slate-800">
            ⌘K
          </kbd>
        </button>

        <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Offline</span>
          </span>
        </div>
      </div>

      {/* Zone 3: Quick Password & Primary Export Action */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={onOpenQuickPassword}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-800/60 hover:bg-slate-800 text-xs font-medium text-cyan-300 transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          title="Quick Password Generator"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Quick Pass</span>
        </button>

        <button
          type="button"
          onClick={onExportAudit}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Export Audit</span>
        </button>
      </div>
    </header>
  );
};
