import React, { useState } from 'react';
import { ShieldCheck, Info, X, Lock } from 'lucide-react';

interface PrivacyBannerProps {
  onDismiss?: () => void;
  showDismiss?: boolean;
}

export const PrivacyBanner: React.FC<PrivacyBannerProps> = ({
  onDismiss,
  showDismiss = true,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-xl border border-emerald-900/60 bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-cyan-950/30 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-100">
                CyberSafe processes your data locally in your browser. Your passwords, files and submitted URLs are not uploaded to external servers.
              </p>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                <span className="text-emerald-400/90 font-mono">100% Client-Side Engine</span>
                <span>·</span>
                <span>Zero External Network Calls</span>
                <span>·</span>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-cyan-400 hover:text-cyan-300 underline font-medium cursor-pointer transition-colors"
                >
                  View Privacy Guarantees
                </button>
              </div>
            </div>
          </div>

          {showDismiss && onDismiss && (
            <button
              onClick={onDismiss}
              aria-label="Dismiss privacy notice"
              className="self-end sm:self-center p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Privacy Guarantees Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-base">
                <Lock className="w-5 h-5" />
                <span>CyberSafe Privacy & Architecture Architecture</span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300 leading-relaxed max-h-[70vh] overflow-y-auto pr-1">
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300 font-medium">
                "CyberSafe processes your data locally in your browser. Your passwords, files and submitted URLs are not uploaded to external servers."
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-200">Zero In-Transit Data Transmission</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      No APIs, analytical telemetry, or cloud backends receive your keystrokes, submitted passwords, or analyzed URLs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-200">Ephemeral In-Memory Password Analysis</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Entered passwords are never saved to localStorage, indexedDB, or server logs. When you clear or refresh the field, the password is completely wiped from browser memory.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-200">Native Web Crypto API</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Password generation and file hash calculations run exclusively through the W3C Web Cryptography API (<code className="text-cyan-400 font-mono text-[11px]">crypto.subtle.digest</code> and <code className="text-cyan-400 font-mono text-[11px]">crypto.getRandomValues</code>) directly within the browser runtime.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-200">Safe Offline URL Heuristics</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      URLs are parsed using regex and hostname heuristic scanners without making DNS queries, HTTP fetches, or tracking redirects.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
