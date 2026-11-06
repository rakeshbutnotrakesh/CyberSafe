/**
 * CyberSafe - Personal Cybersecurity Toolkit
 * "Think Secure. Stay Protected."
 * 100% Client-Side Local Architecture
 */

import React, { useState, useEffect, useCallback } from 'react';
import { PageId, AppSettings, ChecklistItem, SecurityNote, ActivityLogEntry, SecurityStats, QuizResult } from './types/security';
import {
  loadSettings,
  saveSettings,
  loadChecklist,
  saveChecklist,
  loadNotes,
  saveNotes,
  loadStats,
  saveStats,
  loadActivityLog,
  addActivityLog,
  loadQuizHistory,
  addQuizHistory,
  clearActivityHistory,
  exportAllDataAsJSON,
  importDataFromJSON,
  resetApplicationState,
  incrementStat,
  markTopicAsRead,
  recordQuizCompletion,
  INITIAL_CHECKLIST,
} from './utils/storage';

// Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PrivacyBanner } from './components/PrivacyBanner';
import { ToastContainer, ToastMessage } from './components/Toast';
import { CommandPalette } from './components/CommandPalette';
import { QuickPasswordModal } from './components/QuickPasswordModal';

// Pages
import { Dashboard } from './pages/Dashboard';
import { PasswordAnalyzer } from './pages/PasswordAnalyzer';
import { PasswordGenerator } from './pages/PasswordGenerator';
import { URLAnalyzer } from './pages/URLAnalyzer';
import { HashGenerator } from './pages/HashGenerator';
import { MetadataInspector } from './pages/MetadataInspector';
import { CryptoVault } from './pages/CryptoVault';
import { SteganographyLab } from './pages/SteganographyLab';
import { EmailHeaderAnalyzer } from './pages/EmailHeaderAnalyzer';
import { IncidentSimulator } from './pages/IncidentSimulator';
import { SecurityChecklist } from './pages/SecurityChecklist';
import { LearningCenter } from './pages/LearningCenter';
import { SecurityQuiz } from './pages/SecurityQuiz';
import { Notes } from './pages/Notes';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isQuickPasswordOpen, setIsQuickPasswordOpen] = useState<boolean>(false);

  // Stored state
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => loadChecklist());
  const [notes, setNotes] = useState<SecurityNote[]>(() => loadNotes());
  const [stats, setStats] = useState<SecurityStats>(() => loadStats());
  const [activity, setActivity] = useState<ActivityLogEntry[]>(() => loadActivityLog());
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>(() => loadQuizHistory());

  // Privacy banner visible toggle
  const [showPrivacyBanner, setShowPrivacyBanner] = useState<boolean>(true);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, text, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync state helpers
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleToggleChecklistItem = (id: string) => {
    const updated = checklist.map((item) => {
      if (item.id === id) {
        const nextState = !item.completed;
        if (nextState) {
          addActivityLog('checklist_updated', 'Checklist Item Completed', `Marked "${item.title}" as completed.`);
        }
        return {
          ...item,
          completed: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined,
        };
      }
      return item;
    });
    setChecklist(updated);
    saveChecklist(updated);
    setActivity(loadActivityLog());
  };

  const handleUpdateChecklistNotes = (id: string, itemNotes: string) => {
    const updated = checklist.map((item) => {
      if (item.id === id) {
        return { ...item, notes: itemNotes };
      }
      return item;
    });
    setChecklist(updated);
    saveChecklist(updated);
    addToast('Checklist note saved.');
  };

  const handleResetChecklist = () => {
    setChecklist(INITIAL_CHECKLIST);
    saveChecklist(INITIAL_CHECKLIST);
    addToast('Security checklist reset to default.');
  };

  const handleSaveNote = (note: SecurityNote) => {
    const existingIndex = notes.findIndex((n) => n.id === note.id);
    let updated: SecurityNote[];
    if (existingIndex >= 0) {
      updated = [...notes];
      updated[existingIndex] = note;
    } else {
      updated = [note, ...notes];
    }
    setNotes(updated);
    saveNotes(updated);
    addToast('Note saved successfully.');
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    saveNotes(updated);
    addToast('Note deleted.');
  };

  // Tool usage loggers
  const handleLogPasswordAnalysis = (category: string, length: number) => {
    incrementStat('passwordAnalysesCount');
    addActivityLog(
      'password_analysis',
      'Password Strength Audit',
      `Evaluated password: ${length} chars, estimated category "${category}".`
    );
    setStats(loadStats());
    setActivity(loadActivityLog());
  };

  const handleLogURLAnalysis = (hostname: string, riskLevel: string) => {
    incrementStat('urlAnalysesCount');
    addActivityLog(
      'url_analysis',
      'URL Heuristic Check',
      `Inspected "${hostname}" - Risk Level: ${riskLevel}.`
    );
    setStats(loadStats());
    setActivity(loadActivityLog());
  };

  const handleLogHashGeneration = (fileName: string, algo: string) => {
    incrementStat('hashGenerationsCount');
    addActivityLog(
      'hash_generated',
      'File Checksum Computed',
      `Calculated ${algo} digest for "${fileName}".`
    );
    setStats(loadStats());
    setActivity(loadActivityLog());
  };

  // Omnibar keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogVaultOperation = (operationTitle: string) => {
    incrementStat('vaultOperationsCount');
    addActivityLog('crypto_vault', 'AES-256 Vault Action', operationTitle);
    setStats(loadStats());
    setActivity(loadActivityLog());
  };

  const handleLogStegoOperation = (title: string) => {
    incrementStat('vaultOperationsCount');
    addActivityLog('steganography', 'Steganography Action', title);
    setStats(loadStats());
    setActivity(loadActivityLog());
  };

  const handleLogEmailAnalysis = (subject: string, riskLevel: string) => {
    incrementStat('urlAnalysesCount');
    addActivityLog(
      'email_analysis',
      'Email Header Analysis',
      `Analyzed "${subject.slice(0, 35)}..." - Risk: ${riskLevel}`
    );
    setStats(loadStats());
    setActivity(loadActivityLog());
  };

  const handleSimulationCompleted = (scenarioTitle: string, score: number) => {
    incrementStat('simulationsCompletedCount');
    addActivityLog(
      'incident_simulation',
      'Incident Simulation Finished',
      `Completed "${scenarioTitle}" with score ${score} pts.`
    );
    setStats(loadStats());
    setActivity(loadActivityLog());
    addToast(`Simulation completed! Score: ${score} points.`);
  };

  const handleMarkTopicRead = (topicId: string) => {
    markTopicAsRead(topicId);
    setStats(loadStats());
    addToast('Marked topic as completed.');
  };

  const handleQuizCompleted = (result: QuizResult) => {
    recordQuizCompletion(result.scorePercentage);
    addQuizHistory(result);
    addActivityLog(
      'quiz_completed',
      'Security Quiz Exam',
      `Scored ${result.correctAnswers}/${result.totalQuestions} (${result.scorePercentage}%).`
    );
    setStats(loadStats());
    setQuizHistory(loadQuizHistory());
    setActivity(loadActivityLog());
    addToast(`Quiz completed: ${result.scorePercentage}% score!`);
  };

  const handleClearActivity = () => {
    clearActivityHistory();
    setActivity([]);
    setQuizHistory([]);
    addToast('Activity logs cleared.');
  };

  const handleExportAll = () => {
    const json = exportAllDataAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybersafe-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast(`Downloaded backup file: ${a.download}`);
  };

  const handleImportData = (jsonString: string) => {
    const res = importDataFromJSON(jsonString);
    if (res.success) {
      setSettings(loadSettings());
      setChecklist(loadChecklist());
      setNotes(loadNotes());
      setStats(loadStats());
      setActivity(loadActivityLog());
      setQuizHistory(loadQuizHistory());
    }
    return res;
  };

  const handleResetApplication = () => {
    resetApplicationState();
    setSettings(loadSettings());
    setChecklist(loadChecklist());
    setNotes(loadNotes());
    setStats(loadStats());
    setActivity([]);
    setQuizHistory([]);
    setCurrentPage('dashboard');
    addToast('CyberSafe restored to factory default.');
  };

  // Clipboard copy handler with optional auto-clear
  const handleCopySuccess = (msg: string) => {
    addToast(msg, 'success');

    if (settings.autoClearClipboard) {
      const clearSeconds = settings.clipboardClearSeconds || 30;
      setTimeout(async () => {
        try {
          // Clear clipboard by writing empty string
          await navigator.clipboard.writeText('');
        } catch {
          // Ignore if focus lost
        }
      }, clearSeconds * 1000);
    }
  };

  // Render Theme wrapper classes
  const getThemeClass = () => {
    switch (settings.theme) {
      case 'matrix-green':
        return 'theme-matrix bg-black text-emerald-400';
      case 'neon-cyan':
        return 'theme-cyan bg-[#070e17] text-cyan-300';
      case 'slate-midnight':
        return 'theme-midnight bg-[#090d16] text-slate-200';
      case 'cyber-dark':
      default:
        return 'theme-cyber bg-[#0b0f19] text-slate-200';
    }
  };

  const completedChecklistCount = checklist.filter((i) => i.completed).length;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${getThemeClass()}`}>
      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={(p) => setCurrentPage(p)}
          isOpenMobile={isOpenMobile}
          onCloseMobile={() => setIsOpenMobile(false)}
          checklistCount={{ completed: completedChecklistCount, total: checklist.length }}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-slate-950/40 cyber-grid">
          {/* Top Bar Contract Header */}
          <Header
            currentPage={currentPage}
            onOpenMobile={() => setIsOpenMobile(true)}
            onExportAudit={handleExportAll}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onOpenQuickPassword={() => setIsQuickPasswordOpen(true)}
          />

          <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto space-y-6">
            {/* Required Privacy Banner */}
            {showPrivacyBanner && (
              <PrivacyBanner onDismiss={() => setShowPrivacyBanner(false)} />
            )}

            {/* Viewport Router */}
            {currentPage === 'dashboard' && (
              <Dashboard
                onNavigate={(p) => setCurrentPage(p)}
                checklist={checklist}
                stats={stats}
                recentActivity={activity}
              />
            )}

            {currentPage === 'password-analyzer' && (
              <PasswordAnalyzer onLogAnalysis={handleLogPasswordAnalysis} />
            )}

            {currentPage === 'password-generator' && (
              <PasswordGenerator
                onCopySuccess={handleCopySuccess}
                autoClearSeconds={settings.clipboardClearSeconds}
              />
            )}

            {currentPage === 'url-analyzer' && (
              <URLAnalyzer onLogAnalysis={handleLogURLAnalysis} />
            )}

            {currentPage === 'hash-generator' && (
              <HashGenerator
                defaultAlgorithm={settings.defaultHashAlgorithm}
                onCopySuccess={handleCopySuccess}
                onLogHash={handleLogHashGeneration}
              />
            )}

            {currentPage === 'metadata-inspector' && <MetadataInspector />}

            {currentPage === 'crypto-vault' && (
              <CryptoVault
                onCopySuccess={handleCopySuccess}
                onLogOperation={handleLogVaultOperation}
              />
            )}

            {currentPage === 'steganography' && (
              <SteganographyLab
                onCopySuccess={handleCopySuccess}
                onLogOperation={handleLogStegoOperation}
              />
            )}

            {currentPage === 'email-analyzer' && (
              <EmailHeaderAnalyzer onLogAnalysis={handleLogEmailAnalysis} />
            )}

            {currentPage === 'incident-simulator' && (
              <IncidentSimulator onSimulationCompleted={handleSimulationCompleted} />
            )}

            {currentPage === 'checklist' && (
              <SecurityChecklist
                items={checklist}
                onToggleItem={handleToggleChecklistItem}
                onUpdateNotes={handleUpdateChecklistNotes}
                onResetChecklist={handleResetChecklist}
              />
            )}

            {currentPage === 'learning' && (
              <LearningCenter
                readTopics={stats.topicsRead}
                onMarkRead={handleMarkTopicRead}
              />
            )}

            {currentPage === 'quiz' && (
              <SecurityQuiz
                onQuizCompleted={handleQuizCompleted}
                bestScore={stats.quizBestScore}
              />
            )}

            {currentPage === 'notes' && (
              <Notes
                notes={notes}
                onSaveNote={handleSaveNote}
                onDeleteNote={handleDeleteNote}
              />
            )}

            {currentPage === 'reports' && (
              <Reports
                stats={stats}
                checklist={checklist}
                activity={activity}
                quizHistory={quizHistory}
                onClearActivity={handleClearActivity}
                onCopySuccess={handleCopySuccess}
              />
            )}

            {currentPage === 'settings' && (
              <Settings
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onExportAllData={handleExportAll}
                onImportData={handleImportData}
                onResetApp={handleResetApplication}
                onClearHistory={handleClearActivity}
                onCopySuccess={handleCopySuccess}
              />
            )}
          </main>

          {/* Quiet Accessible Footer */}
          <footer className="border-t border-slate-800/80 bg-slate-950/80 px-4 sm:px-8 py-4 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">CyberSafe</span>
              <span>·</span>
              <span>Think Secure. Stay Protected.</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
              <span>Pure Client-Side Engine</span>
              <span>·</span>
              <span>W3C Web Cryptography</span>
              <span>·</span>
              <span>Zero External Network Calls</span>
            </div>
          </footer>
        </div>
      </div>

      {/* Command Palette / Omnibar Modal (Cmd+K / Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(p) => setCurrentPage(p)}
      />

      {/* Quick Password Modal */}
      <QuickPasswordModal
        isOpen={isQuickPasswordOpen}
        onClose={() => setIsQuickPasswordOpen(false)}
        onCopySuccess={handleCopySuccess}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
