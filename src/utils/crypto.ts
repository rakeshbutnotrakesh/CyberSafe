/**
 * Cryptographic utilities using the browser's native Web Crypto API.
 * Never uses Math.random() for security-sensitive operations.
 */

import { HashAlgorithm } from '../types/security';
import { bufferToHex } from './formatters';

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Ambiguous characters: 0, O, o, 1, l, I, |, B, 8
const AMBIGUOUS_REGEX = /[0Oo1lI|B8]/g;

export interface GeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
}

export function generateSecurePassword(options: GeneratorOptions): string {
  let charPool = '';
  const guaranteedChars: string[] = [];

  let upper = UPPERCASE_CHARS;
  let lower = LOWERCASE_CHARS;
  let nums = NUMBER_CHARS;
  let syms = SYMBOL_CHARS;

  if (options.excludeAmbiguous) {
    upper = upper.replace(AMBIGUOUS_REGEX, '');
    lower = lower.replace(AMBIGUOUS_REGEX, '');
    nums = nums.replace(AMBIGUOUS_REGEX, '');
    syms = syms.replace(AMBIGUOUS_REGEX, '');
  }

  if (options.includeUppercase && upper.length > 0) {
    charPool += upper;
    guaranteedChars.push(getRandomChar(upper));
  }
  if (options.includeLowercase && lower.length > 0) {
    charPool += lower;
    guaranteedChars.push(getRandomChar(lower));
  }
  if (options.includeNumbers && nums.length > 0) {
    charPool += nums;
    guaranteedChars.push(getRandomChar(nums));
  }
  if (options.includeSymbols && syms.length > 0) {
    charPool += syms;
    guaranteedChars.push(getRandomChar(syms));
  }

  if (charPool.length === 0) {
    // Fallback if user turned all off
    charPool = lower;
  }

  const length = Math.max(8, Math.min(128, options.length));
  const remainingCount = Math.max(0, length - guaranteedChars.length);
  const randomChars: string[] = [];

  // Generate remaining characters using Web Crypto API
  const randomValues = new Uint32Array(remainingCount);
  window.crypto.getRandomValues(randomValues);

  for (let i = 0; i < remainingCount; i++) {
    const randomIndex = randomValues[i] % charPool.length;
    randomChars.push(charPool[randomIndex]);
  }

  const combined = [...guaranteedChars, ...randomChars];

  // Fisher-Yates cryptographically secure shuffle
  const shuffleValues = new Uint32Array(combined.length);
  window.crypto.getRandomValues(shuffleValues);

  for (let i = combined.length - 1; i > 0; i--) {
    const j = shuffleValues[i] % (i + 1);
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined.join('');
}

function getRandomChar(charset: string): string {
  const randomValue = new Uint32Array(1);
  window.crypto.getRandomValues(randomValue);
  return charset[randomValue[0] % charset.length];
}

// Curated Diceware wordlist for memorable multi-word passphrases
const PASSPHRASE_WORDS = [
  'anchor', 'beacon', 'breeze', 'canyon', 'castle', 'cipher', 'cloud', 'crystal',
  'delta', 'echo', 'falcon', 'forest', 'frost', 'galaxy', 'glacier', 'granite',
  'harbor', 'horizon', 'island', 'jupiter', 'laser', 'matrix', 'meadow', 'nebula',
  'oasis', 'orbit', 'patrol', 'phoenix', 'planet', 'portal', 'prism', 'pulsar',
  'quantum', 'radar', 'ranger', 'rover', 'safari', 'shield', 'signal', 'silver',
  'solstice', 'spark', 'summit', 'titan', 'tracer', 'vortex', 'voyage', 'zenith',
  'aurora', 'blizzard', 'cascade', 'comet', 'drift', 'ember', 'flare', 'geyser',
  'haven', 'iron', 'jaguar', 'keystone', 'lunar', 'meteor', 'nexus', 'ocean',
  'pinnacle', 'quartz', 'relic', 'shadow', 'sierra', 'solar', 'thunder', 'timber',
  'vector', 'whisper', 'zephyr', 'arctic', 'bronze', 'cobalt', 'falcon', 'genesis'
];

export function generateDicewarePassphrase(wordCount: number = 4, separator: string = '-'): string {
  const count = Math.max(3, Math.min(8, wordCount));
  const randomIndices = new Uint32Array(count);
  window.crypto.getRandomValues(randomIndices);

  const selectedWords: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = randomIndices[i] % PASSPHRASE_WORDS.length;
    let word = PASSPHRASE_WORDS[idx];
    // Capitalize first letter of each word for clarity
    word = word.charAt(0).toUpperCase() + word.slice(1);
    selectedWords.push(word);
  }

  // Append a secure random 2-digit number for additional entropy
  const randomNum = new Uint32Array(1);
  window.crypto.getRandomValues(randomNum);
  const suffix = (randomNum[0] % 90 + 10).toString();

  return selectedWords.join(separator) + separator + suffix;
}

/**
 * Calculates hash using Web Crypto API.
 */
export async function calculateHash(
  data: ArrayBuffer | Uint8Array | string,
  algorithm: HashAlgorithm
): Promise<string> {
  let buffer: ArrayBuffer;
  if (typeof data === 'string') {
    const encoder = new TextEncoder();
    buffer = encoder.encode(data).buffer as ArrayBuffer;
  } else if (data instanceof Uint8Array) {
    buffer = data.buffer as ArrayBuffer;
  } else {
    buffer = data;
  }

  const hashBuffer = await window.crypto.subtle.digest(algorithm, buffer);
  return bufferToHex(hashBuffer);
}
