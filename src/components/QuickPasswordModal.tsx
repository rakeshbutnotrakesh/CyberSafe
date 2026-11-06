import React, { useState } from 'react';
import { Sparkles, Copy, RefreshCw, Check, X, ShieldCheck } from 'lucide-react';
import { generateSecurePassword, generateDicewarePassphrase } from '../utils/crypto';
import { analyzePassword } from '../services/passwordService';

interface QuickPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopySuccess: (msg: string) => void;
}

export const QuickPasswordModal: React.FC<QuickPasswordModalProps> = ({
  isOpen,
  onClose,
  onCopySuccess,
}) => {
  const [length, setLength] = useState(20);
  const [mode, setMode] = useState<'random' | 'passphrase'>('random');
  const [generated, setGenerated] = useState(() =>
    generateSecurePassword({
      length: 20,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: false,
    })
  );
  const [copied, setCopied] = useState(false);

  const handleRegenerate = () => {
    if (mode === 'random') {
      setGenerated(
        generateSecurePassword({
          length,
          includeUppercase: true,
          includeLowercase: true,
          includeNumbers: true,
          includeSymbols: true,
          excludeAmbiguous: false,
        })
      );
    } else {
      setGenerated(generateDicewarePassphrase(4, '-'));
    }
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      onCopySuccess('Password copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onCopySuccess('Failed to copy to clipboard.');
    }
  };

  const analysis = analyzePassword(generated);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Quick Password Generator</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <div className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 font-mono text-sm text-emerald-400 font-bold break-all select-all pr-20">
            {generated}
          </div>
          <div className="absolute right-2 top-2 flex items-center gap-1">
            <button
              type="button"
              onClick={handleRegenerate}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors"
              title="Copy"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            Strength: <strong className="text-emerald-400">{analysis.category}</strong>
          </span>
          <span className="text-slate-400">{generated.length} characters</span>
        </div>

        {/* Quick Length Slider */}
        {mode === 'random' && (
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Length:</span>
              <span className="font-mono text-cyan-400 font-bold">{length}</span>
            </div>
            <input
              type="range"
              min={10}
              max={64}
              value={length}
              onChange={(e) => {
                const len = parseInt(e.target.value, 10);
                setLength(len);
                setGenerated(
                  generateSecurePassword({
                    length: len,
                    includeUppercase: true,
                    includeLowercase: true,
                    includeNumbers: true,
                    includeSymbols: true,
                    excludeAmbiguous: false,
                  })
                );
              }}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              const newMode = mode === 'random' ? 'passphrase' : 'random';
              setMode(newMode);
              if (newMode === 'passphrase') {
                setGenerated(generateDicewarePassphrase(4, '-'));
              } else {
                setGenerated(
                  generateSecurePassword({
                    length,
                    includeUppercase: true,
                    includeLowercase: true,
                    includeNumbers: true,
                    includeSymbols: true,
                    excludeAmbiguous: false,
                  })
                );
              }
            }}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono"
          >
            Switch to {mode === 'random' ? 'Diceware Passphrase' : 'Random Characters'}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy & Close'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
