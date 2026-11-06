import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Key,
  Copy,
  Check,
  Download,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw,
  Info,
} from 'lucide-react';
import { encryptTextAESGCM, decryptTextAESGCM } from '../services/vaultService';
import { analyzePassword } from '../services/passwordService';
import { PasswordMeter } from '../components/PasswordMeter';

interface CryptoVaultProps {
  onCopySuccess: (msg: string) => void;
  onLogOperation?: (type: string) => void;
}

export const CryptoVault: React.FC<CryptoVaultProps> = ({
  onCopySuccess,
  onLogOperation,
}) => {
  const [activeTab, setActiveTab] = useState<'encrypt' | 'decrypt'>('encrypt');

  // Encrypt state
  const [plaintextInput, setPlaintextInput] = useState('');
  const [encryptPassphrase, setEncryptPassphrase] = useState('');
  const [showEncryptPass, setShowEncryptPass] = useState(false);
  const [passphraseHint, setPassphraseHint] = useState('');
  const [armoredOutput, setArmoredOutput] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);

  // Decrypt state
  const [ciphertextInput, setCiphertextInput] = useState('');
  const [decryptPassphrase, setDecryptPassphrase] = useState('');
  const [showDecryptPass, setShowDecryptPass] = useState(false);
  const [decryptedOutput, setDecryptedOutput] = useState('');
  const [detectedHint, setDetectedHint] = useState<string | null>(null);
  const [decryptError, setDecryptError] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const passAnalysis = analyzePassword(encryptPassphrase);

  const handleEncrypt = async () => {
    if (!plaintextInput.trim() || !encryptPassphrase) return;
    setIsEncrypting(true);
    try {
      const { armoredString } = await encryptTextAESGCM(
        plaintextInput,
        encryptPassphrase,
        passphraseHint
      );
      setArmoredOutput(armoredString);
      onLogOperation?.('AES-256-GCM Text Encryption');
      onCopySuccess('Encrypted successfully using AES-256-GCM!');
    } catch (err: unknown) {
      alert((err as Error).message || 'Encryption failed');
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!ciphertextInput.trim() || !decryptPassphrase) return;
    setIsDecrypting(true);
    setDecryptError(null);
    setDecryptedOutput('');
    try {
      const { plaintext, payload } = await decryptTextAESGCM(ciphertextInput, decryptPassphrase);
      setDecryptedOutput(plaintext);
      if (payload.hint) {
        setDetectedHint(payload.hint);
      }
      onLogOperation?.('AES-256-GCM Text Decryption');
      onCopySuccess('Message authenticated and decrypted successfully!');
    } catch (err: unknown) {
      setDecryptError((err as Error).message || 'Decryption failed.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleCopy = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyId);
      onCopySuccess('Copied to clipboard!');
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      onCopySuccess('Failed to copy to clipboard.');
    }
  };

  const handleDownloadArmored = () => {
    if (!armoredOutput) return;
    const blob = new Blob([armoredOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybersafe-encrypted-${Date.now().toString(36)}.enc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onCopySuccess(`Downloaded encrypted file as ${a.download}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-400" />
          <span>AES-256-GCM Cryptographic Text Vault</span>
        </h2>
        <p className="text-xs text-slate-400">
          Hardware-accelerated authenticated encryption (AES-GCM 256-bit) with PBKDF2 key derivation (100,000 rounds). 100% offline.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('encrypt')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'encrypt'
              ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Encrypt Confidential Secret</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('decrypt')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'decrypt'
              ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Unlock className="w-3.5 h-3.5" />
          <span>Decrypt Protected Message</span>
        </button>
      </div>

      {activeTab === 'encrypt' ? (
        /* Encrypt Section */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              Confidential Text to Encrypt
            </label>
            <textarea
              rows={4}
              value={plaintextInput}
              onChange={(e) => setPlaintextInput(e.target.value)}
              placeholder="Paste backup codes, private notes, passwords, or confidential keys to encrypt..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-xs text-white placeholder-slate-500 font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                Master Encryption Passphrase
              </label>
              <div className="relative">
                <input
                  type={showEncryptPass ? 'text' : 'password'}
                  value={encryptPassphrase}
                  onChange={(e) => setEncryptPassphrase(e.target.value)}
                  placeholder="Enter strong passphrase..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono pr-10 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowEncryptPass(!showEncryptPass)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  aria-label={showEncryptPass ? 'Hide passphrase' : 'Show passphrase'}
                >
                  {showEncryptPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                Passphrase Hint (Optional, Unencrypted)
              </label>
              <input
                type="text"
                value={passphraseHint}
                onChange={(e) => setPassphraseHint(e.target.value)}
                placeholder="e.g., Mom's maiden city + high school mascot"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {encryptPassphrase && <PasswordMeter analysis={passAnalysis} />}

          <button
            type="button"
            onClick={handleEncrypt}
            disabled={!plaintextInput.trim() || !encryptPassphrase || isEncrypting}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>{isEncrypting ? 'Deriving Key & Encrypting...' : 'Encrypt Payload (AES-256-GCM)'}</span>
          </button>

          {armoredOutput && (
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">
                  Armored Encrypted Payload
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(armoredOutput, 'armored_enc')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                  >
                    {copiedKey === 'armored_enc' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedKey === 'armored_enc' ? 'Copied' : 'Copy Armored Text'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadArmored}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Save .enc File</span>
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                rows={6}
                value={armoredOutput}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-emerald-300 font-mono select-all leading-relaxed"
              />
            </div>
          )}
        </div>
      ) : (
        /* Decrypt Section */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              Paste Armored Encrypted Text or CyberSafe JSON
            </label>
            <textarea
              rows={5}
              value={ciphertextInput}
              onChange={(e) => setCiphertextInput(e.target.value)}
              placeholder="Paste -----BEGIN CYBERSAFE ENCRYPTED MESSAGE----- block here..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-xs text-white placeholder-slate-500 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 max-w-md">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              Passphrase
            </label>
            <div className="relative">
              <input
                type={showDecryptPass ? 'text' : 'password'}
                value={decryptPassphrase}
                onChange={(e) => setDecryptPassphrase(e.target.value)}
                placeholder="Enter passphrase to unlock..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono pr-10 focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowDecryptPass(!showDecryptPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                aria-label={showDecryptPass ? 'Hide passphrase' : 'Show passphrase'}
              >
                {showDecryptPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDecrypt}
            disabled={!ciphertextInput.trim() || !decryptPassphrase || isDecrypting}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Unlock className="w-4 h-4" />
            <span>{isDecrypting ? 'Verifying Authentication Tag...' : 'Authenticate & Decrypt'}</span>
          </button>

          {decryptError && (
            <div className="p-4 rounded-xl border border-rose-900/60 bg-rose-950/40 text-xs text-rose-300 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{decryptError}</span>
            </div>
          )}

          {decryptedOutput && (
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticated Plaintext Decrypted Successfully</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(decryptedOutput, 'decrypted_text')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                >
                  {copiedKey === 'decrypted_text' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedKey === 'decrypted_text' ? 'Copied' : 'Copy Plaintext'}</span>
                </button>
              </div>

              {detectedHint && (
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400">
                  <strong className="text-cyan-400 font-mono">Payload Hint: </strong>
                  {detectedHint}
                </div>
              )}

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white font-mono whitespace-pre-wrap select-all leading-relaxed">
                {decryptedOutput}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Educational Note */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 text-xs text-slate-400 space-y-1.5">
        <div className="flex items-center gap-2 font-semibold text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>How AES-GCM Authenticated Encryption Protects You</span>
        </div>
        <p className="leading-relaxed">
          Standard AES (like CBC mode) is vulnerable to bit-flipping attacks. AES-GCM (Galois/Counter Mode) generates a 128-bit authentication tag with every message. If even a single bit of the encrypted payload is altered in transit or an incorrect passphrase is used, Web Crypto completely aborts decryption, preventing chosen-ciphertext and padding-oracle exploits.
        </p>
      </div>
    </div>
  );
};
