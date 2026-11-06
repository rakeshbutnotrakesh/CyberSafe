/**
 * CyberSafe LocalStorage State Management
 * Pure client-side persistence for user notes, checklist progress, and local statistics.
 * NEVER stores passwords or sensitive credentials.
 */

import {
  AppSettings,
  ChecklistItem,
  SecurityNote,
  ActivityLogEntry,
  SecurityStats,
  QuizResult,
} from '../types/security';

const STORAGE_KEYS = {
  SETTINGS: 'cybersafe_settings_v1',
  CHECKLIST: 'cybersafe_checklist_v1',
  NOTES: 'cybersafe_notes_v1',
  STATS: 'cybersafe_stats_v1',
  ACTIVITY: 'cybersafe_activity_v1',
  QUIZ_HISTORY: 'cybersafe_quiz_history_v1',
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'cyber-dark',
  defaultHashAlgorithm: 'SHA-256',
  autoClearClipboard: true,
  clipboardClearSeconds: 30,
  saveGeneratedPasswordHistory: false,
  showPrivacyNoticeBanner: true,
};

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  // ACCOUNT SECURITY
  {
    id: 'acc-1',
    category: 'ACCOUNT',
    title: 'Use unique passwords for every critical account',
    description: 'Ensure your email, banking, and primary cloud accounts do not share the same password. If one service suffers a breach, credential stuffing will not compromise your other services.',
    importance: 'Critical',
    completed: false,
  },
  {
    id: 'acc-2',
    category: 'ACCOUNT',
    title: 'Enable Two-Factor Authentication (2FA) via Authenticator App',
    description: 'Prefer time-based OTP apps (Google Authenticator, Aegis, Bitwarden) or hardware security keys (FIDO2/WebAuthn) over SMS, which is susceptible to SIM swapping.',
    importance: 'Critical',
    completed: false,
  },
  {
    id: 'acc-3',
    category: 'ACCOUNT',
    title: 'Review and update account recovery phone numbers & emails',
    description: 'Verify that backup emails and recovery phone numbers on your primary accounts are active and secure.',
    importance: 'High',
    completed: false,
  },
  {
    id: 'acc-4',
    category: 'ACCOUNT',
    title: 'Perform manual active session review',
    description: 'Check Google, Apple, Microsoft, and social accounts for unrecognized connected devices or legacy login sessions, and sign them out.',
    importance: 'Medium',
    completed: false,
  },
  {
    id: 'acc-5',
    category: 'ACCOUNT',
    title: 'Adopt an encrypted password manager',
    description: 'Transition all credentials into an encrypted vault with a strong master passphrase and biometric unlock.',
    importance: 'High',
    completed: false,
  },

  // DEVICE SECURITY
  {
    id: 'dev-1',
    category: 'DEVICE',
    title: 'Keep operating systems and applications automatically updated',
    description: 'Enable automatic OS patches on desktop and mobile to close known zero-day vulnerabilities and remote code execution flaws.',
    importance: 'Critical',
    completed: false,
  },
  {
    id: 'dev-2',
    category: 'DEVICE',
    title: 'Configure aggressive screen lock timers',
    description: 'Set device display timeout to 2–5 minutes with immediate biometric or PIN requirement on resume to protect against physical access.',
    importance: 'High',
    completed: false,
  },
  {
    id: 'dev-3',
    category: 'DEVICE',
    title: 'Enable full-disk device encryption',
    description: 'Turn on FileVault (macOS), BitLocker (Windows), or LUKS (Linux). Ensure mobile device storage encryption is verified.',
    importance: 'Critical',
    completed: false,
  },
  {
    id: 'dev-4',
    category: 'DEVICE',
    title: 'Install software strictly from verified official sources',
    description: 'Never install pirated software, cracked executables, or unverified browser extensions that frequently bundle trojans and info-stealers.',
    importance: 'High',
    completed: false,
  },
  {
    id: 'dev-5',
    category: 'DEVICE',
    title: 'Verify offline backup copies of essential data',
    description: 'Follow the 3-2-1 backup rule (3 copies, 2 different media types, 1 isolated/offline copy) to build ransomware resilience.',
    importance: 'High',
    completed: false,
  },

  // BROWSER SECURITY
  {
    id: 'brw-1',
    category: 'BROWSER',
    title: 'Audit and prune third-party browser extensions',
    description: 'Remove legacy, unmaintained, or rarely used browser extensions. Compromised extensions often harvest keystrokes and session cookies.',
    importance: 'High',
    completed: false,
  },
  {
    id: 'brw-2',
    category: 'BROWSER',
    title: 'Enable HTTPS-First or HTTPS-Only mode',
    description: 'Configure your browser settings to strictly refuse unencrypted HTTP connections and warn before loading insecure endpoints.',
    importance: 'High',
    completed: false,
  },
  {
    id: 'brw-3',
    category: 'BROWSER',
    title: 'Inspect website domains and SSL certificates before entering data',
    description: 'Always examine the exact address bar domain for typosquatting, weird TLDs, or punycode before entering credentials.',
    importance: 'Critical',
    completed: false,
  },
  {
    id: 'brw-4',
    category: 'BROWSER',
    title: 'Clear outdated cookies and third-party tracking permissions',
    description: 'Regularly clear long-lived session tokens and configure tracker blocking to minimize tracking profiles and session theft.',
    importance: 'Medium',
    completed: false,
  },

  // NETWORK SECURITY
  {
    id: 'net-1',
    category: 'NETWORK',
    title: 'Avoid untrusted, unencrypted public Wi-Fi for sensitive activities',
    description: 'Never conduct online banking, credential resets, or private communication over open public coffee shop or airport Wi-Fi without a trusted VPN.',
    importance: 'Critical',
    completed: false,
  },
  {
    id: 'net-2',
    category: 'NETWORK',
    title: 'Change default administrative credentials on your home Wi-Fi router',
    description: 'Replace default router gateway passwords (admin/admin) with a strong passphrase and ensure WPA3 or WPA2-AES encryption is active.',
    importance: 'Critical',
    completed: false,
  },
  {
    id: 'net-3',
    category: 'NETWORK',
    title: 'Disable WPS (Wi-Fi Protected Setup) and remote router administration',
    description: 'WPS has known brute-force design weaknesses. Remote admin panels should never be accessible from the WAN/internet interface.',
    importance: 'High',
    completed: false,
  },
  {
    id: 'net-4',
    category: 'NETWORK',
    title: 'Isolate IoT smart home devices on a dedicated Guest Wi-Fi network',
    description: 'Segregate smart TVs, bulbs, and IP cameras from the personal Wi-Fi VLAN where your laptops and personal devices exchange data.',
    importance: 'Medium',
    completed: false,
  },
];

export const INITIAL_NOTES: SecurityNote[] = [
  {
    id: 'note-welcome',
    title: 'CyberSafe Local Setup & Security Observations',
    content: 'Welcome to your private offline security notes. Use this workspace to record dates of your last router firmware update, devices audited, or backup drives verified.\n\nREMINDER: Never store real passwords, banking credentials, or seed phrases in plain text notes.',
    category: 'Audit',
    isPinned: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_STATS: SecurityStats = {
  passwordAnalysesCount: 0,
  urlAnalysesCount: 0,
  hashGenerationsCount: 0,
  vaultOperationsCount: 0,
  simulationsCompletedCount: 0,
  topicsRead: [],
  quizBestScore: 0,
  quizAttempts: 0,
};

// Storage Helpers
export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // Local storage access issue
  }
}

export function loadChecklist(): ChecklistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
    if (!raw) return INITIAL_CHECKLIST;
    const parsed: ChecklistItem[] = JSON.parse(raw);
    // Merge in any new checklist items if schema was updated
    const existingIds = new Set(parsed.map(item => item.id));
    const merged = [...parsed];
    for (const item of INITIAL_CHECKLIST) {
      if (!existingIds.has(item.id)) {
        merged.push(item);
      }
    }
    return merged;
  } catch {
    return INITIAL_CHECKLIST;
  }
}

export function saveChecklist(items: ChecklistItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(items));
  } catch {
    // Fail silently
  }
}

export function loadNotes(): SecurityNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    return raw ? JSON.parse(raw) : INITIAL_NOTES;
  } catch {
    return INITIAL_NOTES;
  }
}

export function saveNotes(notes: SecurityNote[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch {
    // Fail silently
  }
}

export function loadStats(): SecurityStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    return raw ? { ...INITIAL_STATS, ...JSON.parse(raw) } : INITIAL_STATS;
  } catch {
    return INITIAL_STATS;
  }
}

export function saveStats(stats: SecurityStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch {
    // Fail silently
  }
}

export function incrementStat(
  key:
    | 'passwordAnalysesCount'
    | 'urlAnalysesCount'
    | 'hashGenerationsCount'
    | 'vaultOperationsCount'
    | 'simulationsCompletedCount'
): void {
  const current = loadStats();
  current[key] = (current[key] || 0) + 1;
  saveStats(current);
}

export function markTopicAsRead(topicId: string): void {
  const current = loadStats();
  if (!current.topicsRead.includes(topicId)) {
    current.topicsRead.push(topicId);
    saveStats(current);
  }
}

export function recordQuizCompletion(scorePercentage: number): void {
  const current = loadStats();
  current.quizAttempts += 1;
  if (scorePercentage > current.quizBestScore) {
    current.quizBestScore = scorePercentage;
  }
  saveStats(current);
}

export function loadActivityLog(): ActivityLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addActivityLog(
  type: ActivityLogEntry['type'],
  title: string,
  details: string
): void {
  try {
    const logs = loadActivityLog();
    const newEntry: ActivityLogEntry = {
      id: 'act_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      type,
      title,
      details,
      timestamp: new Date().toISOString(),
    };
    // Keep last 40 logs
    const updated = [newEntry, ...logs].slice(0, 40);
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(updated));
  } catch {
    // Fail silently
  }
}

export function loadQuizHistory(): QuizResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addQuizHistory(result: QuizResult): void {
  try {
    const history = loadQuizHistory();
    const updated = [result, ...history].slice(0, 20);
    localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(updated));
  } catch {
    // Fail silently
  }
}

export function clearActivityHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_HISTORY);
  } catch {
    // Fail silently
  }
}

export function exportAllDataAsJSON(): string {
  const payload = {
    app: 'CyberSafe',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    settings: loadSettings(),
    checklist: loadChecklist(),
    notes: loadNotes(),
    stats: loadStats(),
    activity: loadActivityLog(),
    quizHistory: loadQuizHistory(),
  };
  return JSON.stringify(payload, null, 2);
}

export function importDataFromJSON(jsonString: string): { success: boolean; error?: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!data || data.app !== 'CyberSafe') {
      return { success: false, error: 'Invalid file format. Must be a CyberSafe exported backup JSON.' };
    }
    if (data.settings) saveSettings(data.settings);
    if (Array.isArray(data.checklist)) saveChecklist(data.checklist);
    if (Array.isArray(data.notes)) saveNotes(data.notes);
    if (data.stats) saveStats(data.stats);
    if (Array.isArray(data.activity)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(data.activity));
    }
    if (Array.isArray(data.quizHistory)) {
      localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(data.quizHistory));
    }
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || 'Failed to parse JSON file' };
  }
}

export function resetApplicationState(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  } catch {
    // Fail silently
  }
}
