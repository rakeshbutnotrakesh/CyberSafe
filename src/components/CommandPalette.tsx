import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  KeyRound,
  Sparkles,
  Hash,
  FileSearch,
  Lock,
  EyeOff,
  Mail,
  Compass,
  CheckSquare,
  GraduationCap,
  HelpCircle,
  FileText,
  BarChart2,
  Settings,
  LayoutDashboard,
  X,
  ArrowRight,
} from 'lucide-react';
import { PageId } from '../types/security';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageId) => void;
}

interface CommandItem {
  id: PageId;
  title: string;
  category: 'Tools' | 'Audits & Knowledge' | 'System';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const COMMAND_ITEMS: CommandItem[] = [
  { id: 'dashboard', title: 'Security Dashboard', category: 'System', description: 'Central cybersecurity hygiene overview and quick scan', icon: LayoutDashboard },
  { id: 'password-analyzer', title: 'Password Security Analyzer', category: 'Tools', description: 'Offline entropy, keyboard walks, dictionary attacks, and crack-time', icon: KeyRound },
  { id: 'password-generator', title: 'Secure Password Generator', category: 'Tools', description: 'Web Crypto API random passwords and Diceware passphrases', icon: Sparkles },
  { id: 'url-analyzer', title: 'Phishing & Suspicious URL Analyzer', category: 'Tools', description: 'Lexical heuristics, brand spoofing, and punycode detection', icon: Search },
  { id: 'hash-generator', title: 'File Hash Calculator', category: 'Tools', description: 'SHA-256, SHA-384, SHA-512 checksums & integrity comparator', icon: Hash },
  { id: 'metadata-inspector', title: 'File Metadata Inspector', category: 'Tools', description: 'Inspect binary magic headers, image geometry, and EXIF advisory', icon: FileSearch },
  { id: 'crypto-vault', title: 'AES-256-GCM Cryptographic Vault', category: 'Tools', description: 'Encrypt and decrypt confidential notes locally with PBKDF2', icon: Lock },
  { id: 'steganography', title: 'Steganography Concealment Lab', category: 'Tools', description: 'Conceal and extract hidden text within image pixel LSBs', icon: EyeOff },
  { id: 'email-analyzer', title: 'Email Header & SPF/DKIM Inspector', category: 'Tools', description: 'Trace mail server hops and detect forged Reply-To headers', icon: Mail },
  { id: 'incident-simulator', title: 'Incident Response & Breach Simulator', category: 'Audits & Knowledge', description: 'Interactive triage crisis decision trees based on NIST/CISA', icon: Compass },
  { id: 'checklist', title: 'Personal Security Checklist', category: 'Audits & Knowledge', description: 'Account, device, browser, and network defense checklists', icon: CheckSquare },
  { id: 'learning', title: 'Cybersecurity Learning Center', category: 'Audits & Knowledge', description: '10 fundamental modules with case studies and quizzes', icon: GraduationCap },
  { id: 'quiz', title: 'Security Knowledge Quiz', category: 'Audits & Knowledge', description: '30-question interactive cyber defense exam', icon: HelpCircle },
  { id: 'notes', title: 'Private Security Notes', category: 'Audits & Knowledge', description: 'Encrypted-in-memory scratchpad for audit observations', icon: FileText },
  { id: 'reports', title: 'Activity & Audit Reports', category: 'System', description: 'View audit statistics and export reports as JSON or CSV', icon: BarChart2 },
  { id: 'settings', title: 'Settings & Local Storage', category: 'System', description: 'Themes, default algorithms, clipboard timers, and data backup', icon: Settings },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredItems = COMMAND_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        onNavigate(filteredItems[selectedIndex].id);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search tools, checklists, incident simulations (or press ESC)..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-medium"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching cybersecurity tools found.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === idx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/10 text-white border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg border ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-emerald-400 translate-x-1' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Navigate with ↑ / ↓</span>
          <span>Select with Enter</span>
          <span>Close with ESC</span>
        </div>
      </div>
    </div>
  );
};
