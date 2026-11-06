/**
 * Local File Hash Generator Service
 * Employs browser native Web Crypto API (crypto.subtle.digest).
 * 100% local, zero uploads.
 */

import { HashAlgorithm, FileHashResult } from '../types/security';
import { calculateHash } from '../utils/crypto';

export const MAX_SAFE_FILE_SIZE = 100 * 1024 * 1024; // 100 MB warning threshold

export async function hashFile(
  file: File,
  algorithm: HashAlgorithm,
  onProgress?: (percent: number) => void
): Promise<FileHashResult> {
  // Read file as ArrayBuffer
  onProgress?.(10);
  const arrayBuffer = await file.arrayBuffer();
  onProgress?.(60);

  const hash = await calculateHash(arrayBuffer, algorithm);
  onProgress?.(100);

  return {
    id: 'hash_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || 'application/octet-stream',
    algorithm,
    hash,
    calculatedAt: new Date().toISOString(),
  };
}

export async function hashText(
  text: string,
  algorithm: HashAlgorithm
): Promise<string> {
  return calculateHash(text, algorithm);
}

export function compareHashes(
  calculatedHash: string,
  expectedHash: string
): { isMatch: boolean; normalizedCalculated: string; normalizedExpected: string } {
  const normCalc = calculatedHash.trim().toLowerCase();
  const normExp = expectedHash.trim().toLowerCase();
  return {
    isMatch: normCalc === normExp && normCalc.length > 0,
    normalizedCalculated: normCalc,
    normalizedExpected: normExp,
  };
}

export function generateChecksumFileContent(
  results: FileHashResult[],
  format: 'sha256sum' | 'json'
): string {
  if (format === 'json') {
    return JSON.stringify(results, null, 2);
  }

  // Standard GNU coreutils checksum format: <hash>  <filename>
  return results.map(r => `${r.hash}  ${r.fileName} (${r.algorithm})`).join('\n');
}
