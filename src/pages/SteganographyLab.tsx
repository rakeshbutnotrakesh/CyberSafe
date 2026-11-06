import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Image as ImageIcon,
  Download,
  Copy,
  Check,
  AlertCircle,
  ShieldCheck,
  Info,
  Sliders,
} from 'lucide-react';
import {
  encodeTextIntoImage,
  decodeTextFromImage,
  calculateStegoCapacity,
} from '../services/steganographyService';
import { DropZone } from '../components/DropZone';
import { formatBytes } from '../utils/formatters';

interface SteganographyLabProps {
  onCopySuccess: (msg: string) => void;
  onLogOperation?: (title: string) => void;
}

export const SteganographyLab: React.FC<SteganographyLabProps> = ({
  onCopySuccess,
  onLogOperation,
}) => {
  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');

  // Encode state
  const [carrierFile, setCarrierFile] = useState<File | null>(null);
  const [secretText, setSecretText] = useState('');
  const [stegoResultUrl, setStegoResultUrl] = useState<string | null>(null);
  const [encodedDetails, setEncodedDetails] = useState<{ width: number; height: number; payloadBytes: number } | null>(null);
  const [isEncoding, setIsEncoding] = useState(false);
  const [encodeError, setEncodeError] = useState<string | null>(null);

  // Decode state
  const [decodeFile, setDecodeFile] = useState<File | null>(null);
  const [extractedMessage, setExtractedMessage] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodeError, setDecodeError] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  const handleEncode = async () => {
    if (!carrierFile || !secretText.trim()) return;
    setIsEncoding(true);
    setEncodeError(null);
    try {
      const res = await encodeTextIntoImage(carrierFile, secretText.trim());
      setStegoResultUrl(res.stegoDataUrl);
      setEncodedDetails({
        width: res.width,
        height: res.height,
        payloadBytes: res.payloadBytes,
      });
      onLogOperation?.('Image Steganography Encoding');
      onCopySuccess('Secret text embedded into image pixels successfully!');
    } catch (err: unknown) {
      setEncodeError((err as Error).message || 'Failed to encode text into image');
    } finally {
      setIsEncoding(false);
    }
  };

  const handleDecode = async () => {
    if (!decodeFile) return;
    setIsDecoding(true);
    setDecodeError(null);
    setExtractedMessage(null);
    try {
      const res = await decodeTextFromImage(decodeFile);
      setExtractedMessage(res.secretMessage);
      onLogOperation?.('Image Steganography Decoding');
      onCopySuccess('Hidden message extracted from image successfully!');
    } catch (err: unknown) {
      setDecodeError((err as Error).message || 'No hidden message detected or file corrupted.');
    } finally {
      setIsDecoding(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopySuccess('Copied extracted message to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onCopySuccess('Failed to copy.');
    }
  };

  const handleDownloadPNG = () => {
    if (!stegoResultUrl) return;
    const a = document.createElement('a');
    a.href = stegoResultUrl;
    a.download = `stego-carrier-${Date.now().toString(36)}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onCopySuccess(`Downloaded steganographic PNG image as ${a.download}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <EyeOff className="w-5 h-5 text-cyan-400" />
          <span>Steganography & Data Concealment Lab</span>
        </h2>
        <p className="text-xs text-slate-400">
          Hide confidential text payloads inside innocent-looking PNG/JPEG pixels via Least Significant Bit (LSB) embedding.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('encode')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'encode'
              ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Hide Message in Image (Encode)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('decode')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'decode'
              ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Extract Hidden Message (Decode)</span>
        </button>
      </div>

      {activeTab === 'encode' ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              1. Select Carrier Image (PNG or JPEG)
            </label>
            <DropZone
              onFilesSelected={(files) => {
                if (files[0]) {
                  setCarrierFile(files[0]);
                  setStegoResultUrl(null);
                  setEncodedDetails(null);
                }
              }}
              multiple={false}
              accept="image/*"
              label={carrierFile ? `Selected: ${carrierFile.name} (${formatBytes(carrierFile.size)})` : 'Drop carrier image here'}
              sublabel="High-resolution photos yield larger concealment payload capacity."
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold uppercase tracking-wider text-slate-300 font-mono">
                2. Secret Text Message to Embed
              </label>
              <span className="text-slate-400 font-mono text-[11px]">
                Payload: {new TextEncoder().encode(secretText).length} bytes
              </span>
            </div>
            <textarea
              rows={4}
              value={secretText}
              onChange={(e) => setSecretText(e.target.value)}
              placeholder="Type your sensitive secret message to invisibly conceal inside the image..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-xs text-white placeholder-slate-500 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleEncode}
            disabled={!carrierFile || !secretText.trim() || isEncoding}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <EyeOff className="w-4 h-4" />
            <span>{isEncoding ? 'Embedding into Pixel Array...' : 'Conceal Message Inside Image'}</span>
          </button>

          {encodeError && (
            <div className="p-4 rounded-xl border border-rose-900/60 bg-rose-950/40 text-xs text-rose-300 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{encodeError}</span>
            </div>
          )}

          {stegoResultUrl && encodedDetails && (
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Concealment Complete · Zero Human-Visible Pixel Change</span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadPNG}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-semibold transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Lossless PNG</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center">
                  <img
                    src={stegoResultUrl}
                    alt="Steganography Carrier"
                    className="max-h-56 rounded object-contain"
                  />
                  <span className="text-[11px] text-slate-400 font-mono mt-2">
                    Resolution: {encodedDetails.width} × {encodedDetails.height} px
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="font-semibold text-slate-200">Steganography Payload Details</div>
                  <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                    <div>Embedded bytes: <strong className="text-cyan-400">{encodedDetails.payloadBytes} bytes</strong></div>
                    <div>Channels modified: <strong>Least Significant Bits (LSB) of Red, Green, Blue</strong></div>
                    <div>Container format: <strong>Lossless PNG (Required to prevent JPEG compression corruption)</strong></div>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 leading-relaxed">
                    Important: Always send this carrier file as an uncompressed document/PNG. Messaging apps that compress photos (like WhatsApp or standard MMS) will destroy the LSB payload.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Decode Section */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              Upload Image to Inspect for Hidden Message
            </label>
            <DropZone
              onFilesSelected={(files) => {
                if (files[0]) {
                  setDecodeFile(files[0]);
                  setExtractedMessage(null);
                  setDecodeError(null);
                }
              }}
              multiple={false}
              accept="image/*"
              label={decodeFile ? `Selected: ${decodeFile.name}` : 'Drop image file here'}
              sublabel="Reads binary LSB bitstream directly in browser canvas memory."
            />
          </div>

          <button
            type="button"
            onClick={handleDecode}
            disabled={!decodeFile || isDecoding}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>{isDecoding ? 'Extracting LSB Bitstream...' : 'Scan & Extract Secret Message'}</span>
          </button>

          {decodeError && (
            <div className="p-4 rounded-xl border border-amber-900/60 bg-amber-950/40 text-xs text-amber-300 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{decodeError}</span>
            </div>
          )}

          {extractedMessage && (
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-emerald-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Hidden Message Discovered & Extracted</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(extractedMessage)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Message'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-xs text-emerald-300 font-mono whitespace-pre-wrap select-all leading-relaxed">
                {extractedMessage}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Educational Note */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 text-xs text-slate-400 space-y-1.5">
        <div className="flex items-center gap-2 font-semibold text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Steganography vs. Cryptography: What is the Difference?</span>
        </div>
        <p className="leading-relaxed">
          Cryptography scrambles a message so third parties cannot read it, but anyone observing the communication knows a secret is being sent. Steganography conceals the very existence of the message by hiding it inside innocent carrier media. For maximum defense-in-depth, security operatives often encrypt text using AES first, then embed the ciphertext into an image using steganography.
        </p>
      </div>
    </div>
  );
};
