import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Info,
} from 'lucide-react';
import { analyzePassword } from '../services/passwordService';
import { PasswordMeter } from '../components/PasswordMeter';

interface PasswordAnalyzerProps {
  onLogAnalysis?: (category: string, length: number) => void;
}

const SAMPLE_PASSWORDS = [
  { label: 'Common Leaked', value: 'password123' },
  { label: 'Keyboard Walk', value: 'qwerty2024!' },
  { label: 'Short with Symbols', value: 'Tr0ub4dor&3' },
  { label: 'Long Diceware Passphrase', value: 'Falcon-Summit-Meadow-Beacon-88' },
];

export const PasswordAnalyzer: React.FC<PasswordAnalyzerProps> = ({ onLogAnalysis }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasLogged, setHasLogged] = useState(false);

  const analysis = analyzePassword(password);

  useEffect(() => {
    if (password.length >= 6 && !hasLogged) {
      const timer = setTimeout(() => {
        onLogAnalysis?.(analysis.category, password.length);
        setHasLogged(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [password, analysis.category, hasLogged, onLogAnalysis]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setHasLogged(false);
  };

  const handleClear = () => {
    setPassword('');
    setHasLogged(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-emerald-400" />
          <span>Password Security Analyzer</span>
        </h2>
        <p className="text-xs text-slate-400">
          In-depth mathematical entropy calculation, pattern heuristics, and dictionary leak resistance analysis.
        </p>
      </div>

      {/* Educational Notice */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 text-xs text-slate-300">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Zero Password Storage Guarantee: </span>
          Passwords entered here are never stored in localStorage, cookies, session history, or console logs. All computations run in volatile browser RAM. Strength metrics are educational heuristics and do not guarantee account security.
        </div>
      </div>

      {/* Input Box Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Enter Password to Audit
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handleInputChange}
              placeholder="Type or paste a password (e.g. Cobalt-Horizon-782!)..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono pr-24"
            />
            <div className="absolute right-2 top-2 flex items-center gap-1">
              {password.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-2 py-1 text-xs text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Test Presets:</span>
          {SAMPLE_PASSWORDS.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => {
                setPassword(sample.value);
                setHasLogged(false);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors text-[11px]"
            >
              {sample.label}
            </button>
          ))}
        </div>

        {/* Strength Meter Component */}
        {password.length > 0 && <PasswordMeter analysis={analysis} />}
      </div>

      {/* Analysis Breakdowns */}
      {password.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Character Diversity Checklist */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-300">
              Character Diversity & Composition
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <span className="text-slate-300">Length Requirement (12+ recommended)</span>
                <span className="flex items-center gap-1 font-mono font-medium">
                  {analysis.length >= 12 ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> {analysis.length} chars
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <X className="w-3.5 h-3.5" /> {analysis.length} chars (Short)
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <span className="text-slate-300">Lowercase Letters (a–z)</span>
                {analysis.hasLowercase ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-mono font-medium">
                    <Check className="w-3.5 h-3.5" /> Present
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1 font-mono">
                    <X className="w-3.5 h-3.5" /> Missing
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <span className="text-slate-300">Uppercase Letters (A–Z)</span>
                {analysis.hasUppercase ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-mono font-medium">
                    <Check className="w-3.5 h-3.5" /> Present
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1 font-mono">
                    <X className="w-3.5 h-3.5" /> Missing
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <span className="text-slate-300">Numerical Digits (0–9)</span>
                {analysis.hasNumbers ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-mono font-medium">
                    <Check className="w-3.5 h-3.5" /> Present
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1 font-mono">
                    <X className="w-3.5 h-3.5" /> Missing
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <span className="text-slate-300">Special Symbols (!@#$%)</span>
                {analysis.hasSymbols ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-mono font-medium">
                    <Check className="w-3.5 h-3.5" /> Present
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1 font-mono">
                    <X className="w-3.5 h-3.5" /> Missing
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pattern & Weakness Detection */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-300">
              Vulnerability & Pattern Heuristics
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <span className="text-slate-300">Common Dictionary / Leaked Password</span>
                {analysis.isCommonPassword ? (
                  <span className="text-rose-400 font-semibold font-mono flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Detected (High Risk)
                  </span>
                ) : (
                  <span className="text-emerald-400 font-mono flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Clean
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <span className="text-slate-300">Keyboard Walk Pattern (e.g. qwerty)</span>
                {analysis.hasKeyboardWalk ? (
                  <span className="text-amber-400 font-semibold font-mono flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Detected
                  </span>
                ) : (
                  <span className="text-emerald-400 font-mono flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Clean
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <span className="text-slate-300">Consecutive Repeated Characters (aaa, 111)</span>
                {analysis.hasRepeatedChars ? (
                  <span className="text-amber-400 font-semibold font-mono flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Detected
                  </span>
                ) : (
                  <span className="text-emerald-400 font-mono flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Clean
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <span className="text-slate-300">Sequential Characters (abc, 123)</span>
                {analysis.hasSequences ? (
                  <span className="text-amber-400 font-semibold font-mono flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Detected
                  </span>
                ) : (
                  <span className="text-emerald-400 font-mono flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Clean
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <span className="text-slate-300">Calendar Year / Date Pattern</span>
                {analysis.hasDatePattern ? (
                  <span className="text-amber-400 font-semibold font-mono flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Detected
                  </span>
                ) : (
                  <span className="text-emerald-400 font-mono flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Clean
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actionable Suggestions & Weaknesses */}
          <div className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-300 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Recommendations & Actionable Guidance</span>
            </h3>

            {analysis.weaknesses.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-rose-400">Identified Vulnerabilities:</div>
                <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                  {analysis.weaknesses.map((w, idx) => (
                    <li key={idx} className="text-slate-300">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
              <div className="text-xs font-semibold text-emerald-400">Improvement Suggestions:</div>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {analysis.suggestions.map((s, idx) => (
                  <li key={idx} className="text-slate-300">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-8 text-center text-xs text-slate-400 space-y-2">
          <KeyRound className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="font-medium text-slate-300">Ready for Password Evaluation</p>
          <p className="max-w-md mx-auto text-slate-400">
            Type any password or select one of the test presets above to observe how character set permutations, wordlist checks, and length impact mathematical entropy.
          </p>
        </div>
      )}
    </div>
  );
};
