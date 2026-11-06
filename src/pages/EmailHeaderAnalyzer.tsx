import React, { useState } from 'react';
import {
  Mail,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Server,
  Info,
} from 'lucide-react';
import { parseEmailHeaders, SAMPLE_EMAIL_HEADERS } from '../services/emailHeaderService';
import { EmailHeaderAnalysis } from '../types/security';
import { RiskBadge } from '../components/RiskBadge';

interface EmailHeaderAnalyzerProps {
  onLogAnalysis?: (subject: string, riskLevel: string) => void;
}

export const EmailHeaderAnalyzer: React.FC<EmailHeaderAnalyzerProps> = ({
  onLogAnalysis,
}) => {
  const [rawInput, setRawInput] = useState('');
  const [analysis, setAnalysis] = useState<EmailHeaderAnalysis | null>(null);

  const handleAnalyze = (headersToAnalyze?: string) => {
    const text = headersToAnalyze !== undefined ? headersToAnalyze : rawInput;
    if (!text.trim()) return;

    const result = parseEmailHeaders(text);
    setAnalysis(result);
    onLogAnalysis?.(result.subject, result.riskLevel);
  };

  const handleSelectSample = (sampleRaw: string) => {
    setRawInput(sampleRaw);
    handleAnalyze(sampleRaw);
  };

  const handleReset = () => {
    setRawInput('');
    setAnalysis(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-amber-400" />
          <span>Email Header & SPF/DKIM/DMARC Security Inspector</span>
        </h2>
        <p className="text-xs text-slate-400">
          Inspect raw message headers offline to reveal forged sender identities, Reply-To traps, and trace server relay hops.
        </p>
      </div>

      {/* Guide Callout */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 text-xs text-slate-300">
        <div className="flex items-center gap-2 font-semibold text-slate-200">
          <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>How to Get Raw Headers from Your Mail Client</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-slate-400 font-mono">
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <strong className="text-white block">Gmail:</strong> Open email → Three dots (⋮) → "Show original" → Copy headers.
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <strong className="text-white block">Outlook:</strong> Open email → Three dots (...) → View → "View message details".
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <strong className="text-white block">Apple Mail:</strong> View → Message → "All Headers" or "Raw Source".
          </div>
        </div>
      </div>

      {/* Input Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Paste Raw RFC 5322 Email Headers
          </label>
          <textarea
            rows={6}
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="From: ...&#10;To: ...&#10;Authentication-Results: ...&#10;Received: from ..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-xs text-white placeholder-slate-500 font-mono focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Presets and Analyze action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-mono text-slate-400">Sample Presets:</span>
            {SAMPLE_EMAIL_HEADERS.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => handleSelectSample(sample.raw)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-[11px] transition-colors"
              >
                {sample.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {analysis && (
              <button
                type="button"
                onClick={handleReset}
                className="p-2.5 text-slate-400 hover:text-white rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => handleAnalyze()}
              disabled={!rawInput.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Mail className="w-4 h-4" />
              <span>Inspect Email Headers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysis && (
        <div className="space-y-6">
          {/* Verdict Banner */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Email Authentication Verdict
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <RiskBadge level={analysis.riskLevel} size="lg" />
                  <span className="text-xs text-slate-400 font-mono">
                    Subject: <strong className="text-white">{analysis.subject}</strong>
                  </span>
                </div>
              </div>

              {analysis.date && (
                <div className="text-xs font-mono text-slate-400">
                  Date: <span className="text-slate-200">{analysis.date}</span>
                </div>
              )}
            </div>

            {/* Address Identity Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Display Sender (From):</span>
                <span className="font-semibold text-white break-all">{analysis.fromAddress}</span>
              </div>

              <div
                className={`p-3 rounded-lg border ${
                  analysis.isSpoofedReplyTo
                    ? 'bg-rose-950/30 border-rose-800/80'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <span className="text-slate-400 block text-[11px]">Reply-To Address:</span>
                <span
                  className={`font-semibold break-all ${
                    analysis.isSpoofedReplyTo ? 'text-rose-400 font-bold' : 'text-slate-200'
                  }`}
                >
                  {analysis.replyToAddress || '(Same as From)'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Return-Path (Bounce):</span>
                <span className="font-semibold text-slate-200 break-all">
                  {analysis.returnPath || '(Not specified)'}
                </span>
              </div>
            </div>
          </div>

          {/* Authentication Standards: SPF, DKIM, DMARC Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SPF */}
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono uppercase font-semibold text-slate-300">SPF Validation</span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    analysis.spfResult.status === 'pass'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : analysis.spfResult.status === 'fail'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {analysis.spfResult.status}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">{analysis.spfResult.details}</p>
            </div>

            {/* DKIM */}
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono uppercase font-semibold text-slate-300">DKIM Signature</span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    analysis.dkimResult.status === 'pass'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : analysis.dkimResult.status === 'fail'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {analysis.dkimResult.status}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">{analysis.dkimResult.details}</p>
            </div>

            {/* DMARC */}
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono uppercase font-semibold text-slate-300">DMARC Policy</span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    analysis.dmarcResult.status === 'pass'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : analysis.dmarcResult.status === 'fail'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {analysis.dmarcResult.status}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">{analysis.dmarcResult.details}</p>
            </div>
          </div>

          {/* Mail Relay Hops Timeline */}
          {analysis.hops.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-200">
                    Mail Server Relay Route & Hops ({analysis.hops.length} Hops Traced)
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Oldest → Newest Relay</span>
              </div>

              <div className="space-y-3">
                {analysis.hops.map((hop) => (
                  <div
                    key={hop.hopIndex}
                    className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs font-mono"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-[10px] font-bold border border-slate-700">
                          {hop.hopIndex}
                        </span>
                        <span className="text-slate-200 font-semibold">{hop.by}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        {hop.delaySeconds > 0 && (
                          <span className="text-amber-400 font-medium">+{hop.delaySeconds}s transit delay</span>
                        )}
                        <span>Protocol: {hop.withProtocol}</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400 pl-7">
                      Received from: <span className="text-slate-300">{hop.from}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Findings & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
              <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Detected Anomalies</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {analysis.findings.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
              <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Safety Best Practices</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {analysis.recommendations.map((r, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
