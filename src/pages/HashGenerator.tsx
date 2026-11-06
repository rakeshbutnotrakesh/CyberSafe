import React, { useState } from 'react';
import {
  Hash,
  Copy,
  Check,
  Download,
  Trash2,
  FileText,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileCode,
} from 'lucide-react';
import { DropZone } from '../components/DropZone';
import { HashAlgorithm, FileHashResult } from '../types/security';
import { hashFile, hashText, compareHashes, generateChecksumFileContent } from '../services/hashService';
import { formatBytes, formatDateTime } from '../utils/formatters';

interface HashGeneratorProps {
  defaultAlgorithm?: HashAlgorithm;
  onCopySuccess: (msg: string) => void;
  onLogHash?: (fileName: string, algo: string) => void;
}

export const HashGenerator: React.FC<HashGeneratorProps> = ({
  defaultAlgorithm = 'SHA-256',
  onCopySuccess,
  onLogHash,
}) => {
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>(defaultAlgorithm);
  const [results, setResults] = useState<FileHashResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Text hashing tab
  const [activeTab, setActiveTab] = useState<'files' | 'text'>('files');
  const [textInput, setTextInput] = useState('');
  const [textHash, setTextHash] = useState('');

  // Hash verification tool
  const [verifyTargetHash, setVerifyTargetHash] = useState('');

  const handleFilesSelected = async (files: File[]) => {
    setIsProcessing(true);
    const newResults: FileHashResult[] = [];

    for (const file of files) {
      try {
        const res = await hashFile(file, algorithm);
        newResults.push(res);
        onLogHash?.(file.name, algorithm);
      } catch (err) {
        console.error('Hash calculation error:', err);
      }
    }

    setResults((prev) => [...newResults, ...prev]);
    setIsProcessing(false);
  };

  const handleHashText = async (text: string, algo: HashAlgorithm) => {
    setTextInput(text);
    if (!text) {
      setTextHash('');
      return;
    }
    const h = await hashText(text, algo);
    setTextHash(h);
  };

  const handleCopy = async (hashString: string, id: string) => {
    try {
      await navigator.clipboard.writeText(hashString);
      setCopiedId(id);
      onCopySuccess('Hash copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      onCopySuccess('Failed to copy to clipboard.');
    }
  };

  const handleDownloadReport = (format: 'sha256sum' | 'json') => {
    if (results.length === 0) return;
    const content = generateChecksumFileContent(results, format);
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = format === 'json' ? 'checksums.json' : 'CHECKSUMS.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onCopySuccess(`Downloaded checksum report as ${a.download}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Hash className="w-5 h-5 text-emerald-400" />
          <span>Local File & Text Hash Calculator</span>
        </h2>
        <p className="text-xs text-slate-400">
          Compute cryptographic checksums locally via the W3C Web Cryptography API (<code className="text-emerald-400 font-mono">crypto.subtle.digest</code>).
        </p>
      </div>

      {/* Tabs & Algorithm Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('files')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'files'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            File Checksum
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'text'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Text / String Hash
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono">Algorithm:</span>
          {(['SHA-256', 'SHA-384', 'SHA-512'] as HashAlgorithm[]).map((algo) => (
            <button
              key={algo}
              type="button"
              onClick={() => {
                setAlgorithm(algo);
                if (activeTab === 'text') {
                  handleHashText(textInput, algo);
                }
              }}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${
                algorithm === algo
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {algo}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'files' ? (
        <div className="space-y-6">
          {/* Dropzone */}
          <DropZone
            onFilesSelected={handleFilesSelected}
            label="Drop files here to compute checksums"
            sublabel="Files are processed directly in browser memory without network uploads."
          />

          {isProcessing && (
            <div className="p-4 rounded-xl border border-emerald-900/60 bg-emerald-950/20 flex items-center justify-center gap-3 text-xs text-emerald-300 font-mono">
              <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span>Calculating cryptographic digests locally in RAM...</span>
            </div>
          )}

          {/* Verification Comparator Box */}
          {results.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2">
              <label className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider block">
                Hash Verification Helper (Compare with Expected Hash)
              </label>
              <input
                type="text"
                value={verifyTargetHash}
                onChange={(e) => setVerifyTargetHash(e.target.value)}
                placeholder="Paste expected checksum from developer/source to verify against calculated results..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {/* Results List */}
          {results.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                  Calculated Checksums ({results.length})
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadReport('sha256sum')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download TXT</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadReport('json')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                  >
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Download JSON</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setResults([])}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition-colors"
                    title="Clear list"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {results.map((res) => {
                  const comp = verifyTargetHash ? compareHashes(res.hash, verifyTargetHash) : null;
                  return (
                    <div
                      key={res.id}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="font-semibold text-white break-all">{res.fileName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                          <span>{formatBytes(res.fileSize)}</span>
                          <span>·</span>
                          <span className="text-emerald-400">{res.algorithm}</span>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-200 break-all select-all pr-20">
                          {res.hash}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(res.hash, res.id)}
                          className="absolute right-2 top-2 flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono transition-colors"
                        >
                          {copiedId === res.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedId === res.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* Comparison Match Badge */}
                      {comp && (
                        <div
                          className={`p-2 rounded-lg flex items-center gap-2 text-xs font-mono ${
                            comp.isMatch
                              ? 'bg-emerald-950/50 border border-emerald-800/80 text-emerald-300'
                              : 'bg-rose-950/40 border border-rose-900/60 text-rose-300'
                          }`}
                        >
                          {comp.isMatch ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>Checksum MATCH! The file matches the expected hash exactly.</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                              <span>Checksum MISMATCH. This file does not match the provided expected hash.</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Text Hashing Tab */
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              Input Text String to Hash ({algorithm})
            </label>
            <textarea
              rows={4}
              value={textInput}
              onChange={(e) => handleHashText(e.target.value, algorithm)}
              placeholder="Type or paste any text string, secret token, or key..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {textHash ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                <span>Calculated {algorithm} Hex Digest:</span>
                <span>{textHash.length / 2} bytes</span>
              </div>
              <div className="relative">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 break-all select-all pr-20">
                  {textHash}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(textHash, 'text_hash')}
                  className="absolute right-2 top-2 flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
                >
                  {copiedId === 'text_hash' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === 'text_hash' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-mono text-center py-4">
              Type text above to view instant live hash computation.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
