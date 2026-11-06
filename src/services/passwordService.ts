/**
 * Password Security Analyzer Service
 * Evaluates password strength, entropy, crack time, and patterns locally.
 * NEVER transmits or logs passwords to console or storage.
 */

import { PasswordAnalysis, PasswordStrengthCategory } from '../types/security';

const COMMON_PASSWORDS = new Set([
  '123456', 'password', '123456789', '12345678', '12345', 'qwerty',
  '111111', '1234567', 'dragon', '123123', 'baseball', 'football',
  'letmein', 'monkey', 'shadow', 'master', 'sunshine', 'princess',
  'welcome', 'admin', 'pass123', 'login', 'testing', 'iloveyou',
  'trustno1', 'superman', 'starwars', 'killer', 'secret', 'charlie'
]);

const KEYBOARD_WALKS = [
  'qwerty', 'wertyu', 'ertyui', 'rtyuio', 'tyuiop',
  'asdfgh', 'sdfghj', 'dfghjk', 'fghjkl',
  'zxcvbn', 'xcvbnm',
  '123456', '234567', '345678', '456789', '567890',
  'qazwsx', 'wsxedc', 'edcrfv', 'rfvtgb', 'tgbnhy',
];

export function analyzePassword(password: string): PasswordAnalysis {
  if (!password) {
    return {
      length: 0,
      score: 0,
      category: 'Very Weak',
      entropyBits: 0,
      estimatedCrackTimeOnline: 'Instant',
      estimatedCrackTimeOffline: 'Instant',
      hasLowercase: false,
      hasUppercase: false,
      hasNumbers: false,
      hasSymbols: false,
      isCommonPassword: false,
      hasSequences: false,
      hasRepeatedChars: false,
      hasKeyboardWalk: false,
      hasDatePattern: false,
      weaknesses: ['Password cannot be empty'],
      suggestions: ['Enter a password to evaluate its strength.'],
    };
  }

  const length = password.length;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^a-zA-Z0-9]/.test(password);

  const lowerPw = password.toLowerCase();

  // Check common password
  const isCommonPassword = COMMON_PASSWORDS.has(lowerPw);

  // Check keyboard walks
  let hasKeyboardWalk = false;
  for (const walk of KEYBOARD_WALKS) {
    if (lowerPw.includes(walk) || lowerPw.includes(walk.split('').reverse().join(''))) {
      hasKeyboardWalk = true;
      break;
    }
  }

  // Check repeated characters (e.g. "aaa", "111")
  const hasRepeatedChars = /(.)\1{2,}/.test(password);

  // Check sequential characters (e.g. "abc", "123", "cba")
  let hasSequences = false;
  for (let i = 0; i < password.length - 2; i++) {
    const c1 = password.charCodeAt(i);
    const c2 = password.charCodeAt(i + 1);
    const c3 = password.charCodeAt(i + 2);
    if ((c2 === c1 + 1 && c3 === c2 + 1) || (c2 === c1 - 1 && c3 === c2 - 1)) {
      hasSequences = true;
      break;
    }
  }

  // Check date or year patterns (1920-2035)
  const hasDatePattern = /(19[2-9]\d|20[0-3]\d)/.test(password);

  // Pool size calculation for Shannon entropy
  let poolSize = 0;
  if (hasLowercase) poolSize += 26;
  if (hasUppercase) poolSize += 26;
  if (hasNumbers) poolSize += 10;
  if (hasSymbols) poolSize += 33;

  // Base Shannon entropy: length * log2(poolSize)
  let rawEntropy = poolSize > 0 ? length * (Math.log(poolSize) / Math.log(2)) : 0;

  // Penalize entropy for predictable patterns
  if (isCommonPassword) rawEntropy = Math.min(rawEntropy, 10);
  if (hasKeyboardWalk) rawEntropy = Math.max(0, rawEntropy - 15);
  if (hasRepeatedChars) rawEntropy = Math.max(0, rawEntropy - 10);
  if (hasSequences) rawEntropy = Math.max(0, rawEntropy - 8);
  if (hasDatePattern) rawEntropy = Math.max(0, rawEntropy - 8);

  const entropyBits = Math.max(0, Math.round(rawEntropy * 10) / 10);

  // Calculate normalized score (0 - 100)
  let score = 0;

  // Length points (up to 40)
  if (length >= 16) score += 40;
  else if (length >= 12) score += 30;
  else if (length >= 8) score += 15;
  else score += length * 1.5;

  // Character variety points (up to 30)
  const charTypesCount = [hasLowercase, hasUppercase, hasNumbers, hasSymbols].filter(Boolean).length;
  score += charTypesCount * 7.5;

  // Complexity & entropy bonus (up to 30)
  if (entropyBits >= 80) score += 30;
  else if (entropyBits >= 60) score += 20;
  else if (entropyBits >= 40) score += 10;

  // Penalties
  if (isCommonPassword) score -= 50;
  if (hasKeyboardWalk) score -= 20;
  if (hasRepeatedChars) score -= 15;
  if (hasSequences) score -= 10;
  if (hasDatePattern) score -= 10;
  if (length < 8) score = Math.min(score, 25);

  score = Math.max(5, Math.min(100, Math.round(score)));

  // Categorize
  let category: PasswordStrengthCategory;
  if (score < 25) category = 'Very Weak';
  else if (score < 48) category = 'Weak';
  else if (score < 68) category = 'Moderate';
  else if (score < 88) category = 'Strong';
  else category = 'Very Strong';

  // Crack time estimations
  const totalCombinations = Math.pow(2, entropyBits);
  const estimatedCrackTimeOnline = calculateCrackTime(totalCombinations, 100); // 100 attempts/sec with throttling
  const estimatedCrackTimeOffline = calculateCrackTime(totalCombinations, 100_000_000_000); // 100 billion/sec GPU hashcat

  // Weaknesses & Suggestions
  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  if (length < 8) {
    weaknesses.push(`Length is too short (${length} characters). Modern standards recommend at least 12–16 characters.`);
    suggestions.push('Extend password length to 12 or more characters.');
  } else if (length < 12) {
    weaknesses.push('Length is under 12 characters, making it vulnerable to offline GPU cracking.');
    suggestions.push('Consider using a 16+ character passphrase or adding more random segments.');
  }

  if (isCommonPassword) {
    weaknesses.push('This password appears in top leaked credential lists (RockYou / HaveIBeenPwned).');
    suggestions.push('Never use dictionary words or widely leaked phrases.');
  }

  if (hasKeyboardWalk) {
    weaknesses.push('Detected predictable keyboard pattern (e.g., qwerty or asdfgh).');
    suggestions.push('Replace sequential keyboard rows with randomized words or characters.');
  }

  if (hasRepeatedChars) {
    weaknesses.push('Contains 3 or more identical characters in a row.');
    suggestions.push('Avoid repeating identical characters consecutively.');
  }

  if (hasSequences) {
    weaknesses.push('Contains sequential letters or numbers (e.g., abc or 123).');
    suggestions.push('Break up alphabetical or numerical sequences.');
  }

  if (hasDatePattern) {
    weaknesses.push('Contains an apparent 4-digit birth year or calendar year.');
    suggestions.push('Avoid personal milestone years, birthdates, or telephone numbers.');
  }

  if (!hasUppercase) suggestions.push('Include uppercase letters (A–Z).');
  if (!hasLowercase) suggestions.push('Include lowercase letters (a–z).');
  if (!hasNumbers) suggestions.push('Include numeric digits (0–9).');
  if (!hasSymbols) suggestions.push('Include special punctuation symbols (!@#$%^&*).');

  if (weaknesses.length === 0 && score >= 85) {
    suggestions.push('Excellent password composition! Store it safely in an encrypted password manager.');
  }

  return {
    length,
    score,
    category,
    entropyBits,
    estimatedCrackTimeOnline,
    estimatedCrackTimeOffline,
    hasLowercase,
    hasUppercase,
    hasNumbers,
    hasSymbols,
    isCommonPassword,
    hasSequences,
    hasRepeatedChars,
    hasKeyboardWalk,
    hasDatePattern,
    weaknesses,
    suggestions,
  };
}

function calculateCrackTime(combinations: number, ratePerSecond: number): string {
  if (combinations <= 0) return 'Instant';
  const seconds = (combinations / 2) / ratePerSecond; // Average half the keyspace

  if (seconds < 1) return 'Instant (< 1 second)';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;

  const years = seconds / 31536000;
  if (years < 1000) return `${Math.round(years)} years`;
  if (years < 1_000_000) return `${Math.round(years / 1000)} thousand years`;
  if (years < 1_000_000_000) return `${Math.round(years / 1_000_000)} million years`;
  if (years < 1_000_000_000_000) return `${Math.round(years / 1_000_000_000)} billion years`;
  return 'Trillions of years (Cryptographically hard)';
}
