import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  RefreshCw,
  Check,
  ShieldCheck,
  Sliders,
  History,
  Trash2,
  Info,
} from 'lucide-react';
import {
  generateSecurePassword,
  generateDicewarePassphrase,
  GeneratorOptions,
} from '../utils/crypto';
import { analyzePassword } from '../services/passwordService';

interface PasswordGeneratorProps {
  onCopySuccess: (message: string) => void;
  autoClearSeconds?: number;
}

interface GeneratedItem {
  id: string;
  value: string;
  length: number;
  category: string;
  createdAt: string;
}

export const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({
  onCopySuccess,
  autoClearSeconds = 30,
}) => {
  const [mode, setMode] = useState<'random' | 'passphrase'>('random');
  const [length, setLength] = useState<number>(20);
  const [wordCount, setWordCount] = useState<number>(4);
  const [passphraseSeparator, setPassphraseSeparator] = useState<string>('-');

  // Options
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);

  // Generation count
  const [batchCount, setBatchCount] = useState<1 | 5 | 10>(1);

  // Current Generated
  const [generatedList, setGeneratedList] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // History (disabled by default per spec)
  const [enableHistory, setEnableHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<GeneratedItem[]>([]);

  const handleGenerate = () => {
    const results: string[] = [];
    const options: GeneratorOptions = {
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
      excludeAmbiguous,
    };

    for (let i = 0; i < batchCount; i++) {
      if (mode === 'random') {
        results.push(generateSecurePassword(options));
      } else {
        results.push(generateDicewarePassphrase(wordCount, passphraseSeparator));
      }
    }

    setGeneratedList(results);

    // Save to session history only if explicitly enabled
    if (enableHistory) {
      const newItems: GeneratedItem[] = results.map((val) => {
        const analysis = analyzePassword(val);
        return {
          id: Math.random().toString(36).substring(2, 9),
          value: val,
          length: val.length,
          category: analysis.category,
          createdAt: new Date().toLocaleTimeString(),
        };
      });
      setHistoryItems((prev) => [...newItems, ...prev].slice(0, 30));
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [
    mode,
    length,
    wordCount,
    passphraseSeparator,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeAmbiguous,
    batchCount,
  ]);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      onCopySuccess(`Password copied! Clipboard auto-clears in ${autoClearSeconds}s.`);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      onCopySuccess('Failed to copy to clipboard.');
    }
  };

  const primaryPassword = generatedList[0] || '';
  const primaryAnalysis = analyzePassword(primaryPassword);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>Secure Password & Passphrase Generator</span>
        </h2>
        <p className="text-xs text-slate-400">
          Generated using the browser's hardware-backed <code className="text-cyan-400 font-mono">window.crypto.getRandomValues()</code> CSPRNG.
        </p>
      </div>

      {/* Primary Password Display Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Cryptographically Secure (CSPRNG)</span>
          </span>
          <span className="text-slate-300">
            Strength: <strong className="text-emerald-400">{primaryAnalysis.category}</strong> ({primaryAnalysis.entropyBits} bits)
          </span>
        </div>

        <div className="relative flex items-center">
          <div className="w-full rounded-xl border border-slate-700 bg-slate-950 px-5 py-4 font-mono text-base md:text-lg text-emerald-400 tracking-wider break-all select-all font-semibold shadow-inner pr-28">
            {primaryPassword}
          </div>
          <div className="absolute right-3 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleGenerate}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
              title="Regenerate"
              aria-label="Regenerate password"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleCopy(primaryPassword, 0)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm"
              title="Copy to clipboard"
            >
              {copiedIndex === 0 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedIndex === 0 ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Mode Selector Segmented Tabs */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setMode('random')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                mode === 'random'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Random Characters
            </button>
            <button
              type="button"
              onClick={() => setMode('passphrase')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                mode === 'passphrase'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Diceware Passphrase
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Generate:</span>
            {([1, 5, 10] as const).map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => setBatchCount(cnt)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  batchCount === cnt
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold'
                    : 'text-slate-400 hover:text-white bg-slate-800/60'
                }`}
              >
                {cnt}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Generation Parameters</span>
          </div>

          {mode === 'random' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Password Length</span>
                  <span className="font-mono text-emerald-400 font-bold">{length} characters</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={128}
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>8 (Min)</span>
                  <span>16</span>
                  <span>32</span>
                  <span>64</span>
                  <span>128 (Max)</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                  <span className="text-slate-300">Uppercase Letters (A–Z)</span>
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                  <span className="text-slate-300">Lowercase Letters (a–z)</span>
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                  <span className="text-slate-300">Numbers (0–9)</span>
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                  <span className="text-slate-300">Special Symbols (!@#$%^&*)</span>
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer select-none pt-2 border-t border-slate-800/60">
                  <div>
                    <span className="text-slate-200">Exclude Ambiguous Characters</span>
                    <p className="text-[11px] text-slate-400">Avoids 0, O, o, 1, l, I, |, B, 8</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={excludeAmbiguous}
                    onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                    className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Word Count</span>
                  <span className="font-mono text-cyan-400 font-bold">{wordCount} words</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={8}
                  value={wordCount}
                  onChange={(e) => setWordCount(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>3 words</span>
                  <span>5 words</span>
                  <span>8 words</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <label className="text-xs text-slate-300 font-medium block">Word Separator</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Hyphen (-)', val: '-' },
                    { label: 'Dot (.)', val: '.' },
                    { label: 'Underscore (_)', val: '_' },
                    { label: 'Space ( )', val: ' ' },
                  ].map((sep) => (
                    <button
                      key={sep.val}
                      type="button"
                      onClick={() => setPassphraseSeparator(sep.val)}
                      className={`p-2 rounded-lg text-xs font-mono border transition-colors ${
                        passphraseSeparator === sep.val
                          ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sep.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Batch List or History Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                {batchCount > 1 ? `Batch Results (${batchCount})` : 'Password Generation History'}
              </span>

              {batchCount === 1 && (
                <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableHistory}
                    onChange={(e) => setEnableHistory(e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-emerald-500"
                  />
                  <span>Record History (Opt-In)</span>
                </label>
              )}
            </div>

            {batchCount > 1 ? (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {generatedList.map((pw, i) => {
                  const itemAnalysis = analyzePassword(pw);
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 gap-2"
                    >
                      <div className="font-mono text-xs text-slate-200 truncate flex-1 font-medium">
                        {pw}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-emerald-400 font-mono">
                          {itemAnalysis.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(pw, i)}
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                          title="Copy"
                        >
                          {copiedIndex === i ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : enableHistory ? (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {historyItems.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    No history recorded yet in this session.
                  </p>
                ) : (
                  historyItems.map((item, i) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 gap-2 text-xs"
                    >
                      <div className="font-mono text-slate-200 truncate flex-1">{item.value}</div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-400 font-mono">{item.createdAt}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.value, i + 100)}
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                        >
                          {copiedIndex === i + 100 ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="p-6 rounded-lg border border-slate-800/60 bg-slate-950/40 text-center space-y-2">
                <History className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-400">Password generation history is disabled by default for privacy.</p>
                <p className="text-[11px] text-slate-400">
                  Enable the checkbox above if you wish to temporarily hold generated strings in volatile memory.
                </p>
              </div>
            )}
          </div>

          {enableHistory && historyItems.length > 0 && batchCount === 1 && (
            <div className="pt-2 border-t border-slate-800/80 flex justify-end">
              <button
                type="button"
                onClick={() => setHistoryItems([])}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Session History</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
