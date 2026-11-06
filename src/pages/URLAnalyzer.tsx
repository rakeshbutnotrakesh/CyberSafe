import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { analyzeURL } from '../services/urlAnalysisService';
import { RiskBadge } from '../components/RiskBadge';
import { URLAnalysisResult } from '../types/security';

interface URLAnalyzerProps {
  onLogAnalysis?: (hostname: string, riskLevel: string) => void;
}

const PRESET_URLS = [
  { label: 'Legitimate Portal', url: 'https://www.paypal.com/signin' },
  { label: 'Brand Typosquatting', url: 'http://paypa1-account-security.top/login' },
  { label: 'Raw IP Address Host', url: 'http://192.168.1.105:8080/secure-update' },
  { label: 'Excessive Subdomains', url: 'https://security.update.login.apple.id.auth-portal.com' },
  { label: 'URL Shortener', url: 'https://bit.ly/3xSecurityVerify' },
  { label: '@ Credential Trick', url: 'https://google.com@evil-destination.com/verify' },
  { label: 'Punycode Homoglyph', url: 'https://xn--appl-43d.com/support' },
];

export const URLAnalyzer: React.FC<URLAnalyzerProps> = ({ onLogAnalysis }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [result, setResult] = useState<URLAnalysisResult | null>(null);

  const handleAnalyze = (urlToTest?: string) => {
    const target = (urlToTest !== undefined ? urlToTest : inputUrl).trim();
    if (!target) return;

    const analysis = analyzeURL(target);
    setResult(analysis);
    onLogAnalysis?.(analysis.hostname, analysis.riskLevel);
  };

  const handleSelectPreset = (url: string) => {
    setInputUrl(url);
    handleAnalyze(url);
  };

  const handleReset = () => {
    setInputUrl('');
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Search className="w-5 h-5 text-amber-400" />
          <span>Offline Phishing & Suspicious URL Analyzer</span>
        </h2>
        <p className="text-xs text-slate-400">
          Evaluates lexical anomalies, deceptive subdomains, punycode, and brand-name spoofing without making network queries.
        </p>
      </div>

      {/* Crucial Safety Notice */}
      <div className="p-4 rounded-xl border border-amber-900/60 bg-gradient-to-r from-amber-950/30 to-slate-900/80 space-y-2 text-xs text-amber-200">
        <div className="flex items-center gap-2 font-semibold text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Offline Isolation Guarantee & Safety Warning</span>
        </div>
        <p className="leading-relaxed text-slate-300">
          • <strong>Do not open or visit suspicious links in your browser.</strong> This tool analyzes string syntax purely in offline memory and does not resolve DNS or load website resources.<br />
          • <strong>Offline heuristic analysis cannot guarantee whether a link is benign.</strong> Zero detected red flags does not mean a website is harmless, as attackers frequently host phishing pages on newly registered benign-looking domains.
        </p>
      </div>

      {/* Input Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Enter Link or Web Address to Analyze
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="e.g., https://paypal-security-update.xyz/login"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAnalyze()}
                disabled={!inputUrl.trim()}
                className="px-5 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:hover:bg-amber-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Analyze Link</span>
              </button>
              {result && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-3 text-slate-400 hover:text-white rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Preset Samples */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-mono text-slate-400">Sample Test Scenarios:</span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_URLS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleSelectPreset(p.url)}
                className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-[11px] transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Results View */}
      {result && (
        <div className="space-y-6">
          {/* Result Summary Bar */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                  Evaluation Verdict
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <RiskBadge level={result.riskLevel} size="lg" />
                  <span className="text-xs font-mono text-slate-400">
                    Suspicion Score: <strong className="text-white font-bold">{result.overallScore}/100</strong>
                  </span>
                </div>
              </div>

              <div className="text-xs font-mono space-y-1 text-slate-400">
                <div>Host: <span className="text-slate-200 font-semibold">{result.hostname}</span></div>
                <div>Protocol: <span className="text-slate-200">{result.protocol}</span></div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono break-all text-slate-300">
              {result.url}
            </div>
          </div>

          {/* Detected Red Flags & Indicators */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              <span>Suspicious Indicators Detected ({result.findings.length})</span>
            </h3>

            {result.findings.length === 0 ? (
              <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No prominent syntax red flags detected in offline lexical analysis.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {result.findings.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <RiskBadge level={f.severity} size="sm" />
                        <h4 className="font-semibold text-slate-100">{f.title}</h4>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{f.description}</p>
                    <div className="pt-2 border-t border-slate-800/60 text-slate-400">
                      <span className="text-cyan-400 font-medium font-mono text-[11px]">Recommendation: </span>
                      {f.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checks Passed & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
              <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Heuristic Checks Passed</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {result.checksPassed.map((check, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
              <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span>Safety Best Practices</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                <li>Never enter passwords on destinations reached via unsolicited text or email links.</li>
                <li>Verify domain names by reading from right to left before the first forward slash.</li>
                <li>Access banking and accounts via official browser bookmarks or mobile apps.</li>
                <li>Remember that free SSL certificates allow attackers to display HTTPS padlocks on fraudulent websites.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
