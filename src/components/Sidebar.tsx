import React from 'react';
import {
  Shield,
  LayoutDashboard,
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
  Settings,
  Lock,
  EyeOff,
  Mail,
  Compass,
} from 'lucide-react';
import { PageId } from '../types/security';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: 'Primary' | 'Analysis Tools' | 'Knowledge & Audits' | 'Preferences';
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Security Dashboard', icon: LayoutDashboard, group: 'Primary' },
  { id: 'password-analyzer', label: 'Password Analyzer', icon: KeyRound, group: 'Analysis Tools' },
  { id: 'password-generator', label: 'Password Generator', icon: Sparkles, group: 'Analysis Tools' },
  { id: 'url-analyzer', label: 'Phishing URL Analyzer', icon: Search, group: 'Analysis Tools' },
  { id: 'hash-generator', label: 'File Hash Generator', icon: Hash, group: 'Analysis Tools' },
  { id: 'metadata-inspector', label: 'Metadata Inspector', icon: FileSearch, group: 'Analysis Tools' },
  { id: 'crypto-vault', label: 'AES-256 Crypto Vault', icon: Lock, group: 'Analysis Tools' },
  { id: 'steganography', label: 'Steganography Lab', icon: EyeOff, group: 'Analysis Tools' },
  { id: 'email-analyzer', label: 'Email Header Inspector', icon: Mail, group: 'Analysis Tools' },
  { id: 'incident-simulator', label: 'Incident Simulator', icon: Compass, group: 'Knowledge & Audits' },
  { id: 'checklist', label: 'Security Checklist', icon: CheckSquare, group: 'Knowledge & Audits' },
  { id: 'learning', label: 'Learning Center', icon: GraduationCap, group: 'Knowledge & Audits' },
  { id: 'quiz', label: 'Security Quiz', icon: HelpCircle, group: 'Knowledge & Audits' },
  { id: 'notes', label: 'Security Notes', icon: FileText, group: 'Knowledge & Audits' },
  { id: 'reports', label: 'Activity Reports', icon: BarChart2, group: 'Preferences' },
  { id: 'settings', label: 'Settings & Privacy', icon: Settings, group: 'Preferences' },
];

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  checklistCount?: { completed: number; total: number };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  checklistCount,
}) => {
  const groups: Array<NavItem['group']> = [
    'Primary',
    'Analysis Tools',
    'Knowledge & Audits',
    'Preferences',
  ];

  const handleItemClick = (pageId: PageId) => {
    onNavigate(pageId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-slate-800/80 bg-slate-950/95 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Area */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-slate-800/80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-white">CyberSafe</span>
              <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
                Local
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">Think Secure. Stay Protected.</p>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {groups.map((group) => {
            const items = NAV_ITEMS.filter((i) => i.group === group);
            return (
              <div key={group} className="space-y-1">
                <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  {group}
                </div>
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap text-left ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold'
                            : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-emerald-400' : 'text-slate-400'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.id === 'checklist' && checklistCount && (
                          <span className="text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                            {checklistCount.completed}/{checklistCount.total}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">100% Offline · Zero Data Leaks</span>
          </div>
        </div>
      </aside>
    </>
  );
};
