/**
 * CyberSafe Types & Interfaces
 * Pure client-side security data structures
 */

export type PageId =
  | 'dashboard'
  | 'password-analyzer'
  | 'password-generator'
  | 'url-analyzer'
  | 'hash-generator'
  | 'metadata-inspector'
  | 'crypto-vault'
  | 'steganography'
  | 'email-analyzer'
  | 'incident-simulator'
  | 'checklist'
  | 'learning'
  | 'quiz'
  | 'notes'
  | 'reports'
  | 'settings';

export type PasswordStrengthCategory =
  | 'Very Weak'
  | 'Weak'
  | 'Moderate'
  | 'Strong'
  | 'Very Strong';

export interface PasswordAnalysis {
  length: number;
  score: number; // 0 to 100
  category: PasswordStrengthCategory;
  entropyBits: number;
  estimatedCrackTimeOnline: string;
  estimatedCrackTimeOffline: string;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  isCommonPassword: boolean;
  hasSequences: boolean;
  hasRepeatedChars: boolean;
  hasKeyboardWalk: boolean;
  hasDatePattern: boolean;
  weaknesses: string[];
  suggestions: string[];
}

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface URLFinding {
  id: string;
  title: string;
  severity: RiskLevel;
  description: string;
  recommendation: string;
}

export interface URLAnalysisResult {
  url: string;
  normalizedUrl: string;
  hostname: string;
  protocol: string;
  riskLevel: RiskLevel;
  overallScore: number; // 0 (safest) to 100 (most risky)
  findings: URLFinding[];
  checksPassed: string[];
  isIPAddress: boolean;
  isShortener: boolean;
  hasSuspiciousTLD: boolean;
  hasExcessiveSubdomains: boolean;
  hasPunycode: boolean;
  hasAtSymbol: boolean;
  hasBrandSpoofing: boolean;
  spoofedBrandMatch?: string;
  timestamp: string;
}

export type HashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512';

export interface FileHashResult {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  algorithm: HashAlgorithm;
  hash: string;
  calculatedAt: string;
}

export interface FileMetadataInfo {
  fileName: string;
  fileSize: number;
  fileType: string;
  extension: string;
  lastModified: string;
  magicBytesHex?: string;
  detectedFormatFromSignature?: string;
  isMimeMismatch?: boolean;
  imageDimensions?: {
    width: number;
    height: number;
    aspectRatio: string;
    megaPixels: string;
  };
  audioVideoDuration?: number;
  privacyNotice: string;
}

// AES-256-GCM Vault Types
export interface EncryptedPayload {
  format: 'CYBERSAFE_AES_GCM_V1';
  saltHex: string;
  ivHex: string;
  ciphertextHex: string;
  iterations: number;
  hint?: string;
  timestamp: string;
}

// Email Header Inspection Types
export interface EmailHop {
  hopIndex: number;
  by: string;
  from: string;
  withProtocol: string;
  timestamp: string;
  delaySeconds: number;
}

export interface EmailHeaderAnalysis {
  fromAddress: string;
  fromDomain: string;
  replyToAddress?: string;
  returnPath?: string;
  subject: string;
  date: string;
  messageId: string;
  isSpoofedReplyTo: boolean;
  spfResult: {
    status: 'pass' | 'fail' | 'softfail' | 'neutral' | 'none';
    details: string;
  };
  dkimResult: {
    status: 'pass' | 'fail' | 'none';
    domain?: string;
    details: string;
  };
  dmarcResult: {
    status: 'pass' | 'fail' | 'none';
    disposition?: string;
    details: string;
  };
  hops: EmailHop[];
  riskLevel: RiskLevel;
  findings: string[];
  recommendations: string[];
}

// Incident Simulator Types
export interface IncidentChoice {
  id: string;
  text: string;
  isOptimal: boolean;
  feedback: string;
  scoreImpact: number;
  nextStepId?: string;
}

export interface IncidentStep {
  id: string;
  title: string;
  situation: string;
  urgentNotice?: string;
  choices: IncidentChoice[];
}

export interface IncidentScenario {
  id: string;
  title: string;
  category: 'Phishing' | 'Ransomware' | 'Account Compromise' | 'Wi-Fi Threat' | 'SIM Swap';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  synopsis: string;
  initialStepId: string;
  steps: Record<string, IncidentStep>;
  finalResolution: {
    summary: string;
    keyTakeaway: string;
    frameworkReference: string; // e.g. "NIST SP 800-61 Incident Handling Guide"
  };
}

export interface ChecklistItem {
  id: string;
  category: 'ACCOUNT' | 'DEVICE' | 'BROWSER' | 'NETWORK';
  title: string;
  description: string;
  importance: 'Critical' | 'High' | 'Medium';
  completed: boolean;
  notes?: string;
  completedAt?: string;
}

export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  tip: string;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timestamp: string;
  timeSpentSeconds: number;
}

export interface LearningTopic {
  id: string;
  title: string;
  summary: string;
  readTime: string;
  iconName: string;
  overview: string;
  realWorldScenario: {
    title: string;
    narrative: string;
    lesson: string;
  };
  preventionRules: string[];
  keyTerms: { term: string; definition: string }[];
  miniQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface SecurityNote {
  id: string;
  title: string;
  content: string;
  category: 'Audit' | 'Hardware' | 'Accounts' | 'Network' | 'General';
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLogEntry {
  id: string;
  type:
    | 'password_analysis'
    | 'url_analysis'
    | 'hash_generated'
    | 'crypto_vault'
    | 'steganography'
    | 'email_analysis'
    | 'incident_simulation'
    | 'quiz_completed'
    | 'checklist_updated';
  title: string;
  details: string;
  timestamp: string;
}

export interface AppSettings {
  theme: 'cyber-dark' | 'matrix-green' | 'neon-cyan' | 'slate-midnight';
  defaultHashAlgorithm: HashAlgorithm;
  autoClearClipboard: boolean;
  clipboardClearSeconds: number;
  saveGeneratedPasswordHistory: boolean;
  showPrivacyNoticeBanner: boolean;
}

export interface SecurityStats {
  passwordAnalysesCount: number;
  urlAnalysesCount: number;
  hashGenerationsCount: number;
  vaultOperationsCount: number;
  simulationsCompletedCount: number;
  topicsRead: string[];
  quizBestScore: number;
  quizAttempts: number;
}
