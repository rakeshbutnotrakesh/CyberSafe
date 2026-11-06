import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  FileEdit,
  Shield,
  Smartphone,
  Globe,
  Wifi,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ChecklistItem } from '../types/security';
import { ConfirmModal } from '../components/ConfirmModal';

interface SecurityChecklistProps {
  items: ChecklistItem[];
  onToggleItem: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onResetChecklist: () => void;
}

export const SecurityChecklist: React.FC<SecurityChecklistProps> = ({
  items,
  onToggleItem,
  onUpdateNotes,
  onResetChecklist,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>('');
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const categories = [
    { id: 'ALL', label: 'All Items', icon: Shield },
    { id: 'ACCOUNT', label: 'Account Security', icon: Shield },
    { id: 'DEVICE', label: 'Device Security', icon: Smartphone },
    { id: 'BROWSER', label: 'Browser Security', icon: Globe },
    { id: 'NETWORK', label: 'Network Security', icon: Wifi },
  ];

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleStartEditNotes = (item: ChecklistItem) => {
    setEditingNotesId(item.id);
    setNoteDraft(item.notes || '');
  };

  const handleSaveNotes = (id: string) => {
    onUpdateNotes(id, noteDraft);
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-emerald-400" />
          <span>Personal Security Checklist</span>
        </h2>
        <p className="text-xs text-slate-400">
          Practical digital hygiene audit covering account credentials, endpoint encryption, browser privacy, and home networks.
        </p>
      </div>

      {/* Progress & Reset Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Audit Completion Status
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold font-mono text-white tabular-nums">
                {percentage}%
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({completedCount} of {totalCount} completed)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="self-start sm:self-center flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/80 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Checklist</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search checklist items..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Checklist Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-slate-800 bg-slate-900/30 text-xs text-slate-400">
            No checklist items match your search filter.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-4 transition-all duration-200 space-y-3 ${
                item.completed
                  ? 'border-emerald-900/50 bg-emerald-950/10'
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => onToggleItem(item.id)}
                  className="mt-0.5 text-emerald-400 hover:text-emerald-300 transition-colors shrink-0"
                  aria-label={item.completed ? 'Mark incomplete' : 'Mark completed'}
                >
                  {item.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500 hover:text-slate-400" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3
                      className={`text-sm font-semibold transition-colors ${
                        item.completed ? 'text-emerald-300 line-through opacity-85' : 'text-slate-100'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {item.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          item.importance === 'Critical'
                            ? 'bg-rose-950/50 text-rose-300 border border-rose-900/60'
                            : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                        }`}
                      >
                        {item.importance}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Personal Notes Section */}
              <div className="pl-8 pt-1 text-xs space-y-2 border-t border-slate-800/40">
                {editingNotesId === item.id ? (
                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      placeholder="Add personal audit notes (e.g. 'Enabled 2FA on Google & Apple ID on Nov 6, 2026')..."
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingNotesId(null)}
                        className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveNotes(item.id)}
                        className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-slate-400">
                    <div className="text-[11px] text-slate-400 truncate max-w-lg">
                      {item.notes ? (
                        <span className="text-slate-300 font-mono italic">"{item.notes}"</span>
                      ) : (
                        <span className="text-slate-400">No personal note added yet.</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartEditNotes(item)}
                      className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <FileEdit className="w-3 h-3" />
                      <span>{item.notes ? 'Edit Note' : 'Add Note'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showResetModal}
        title="Reset Security Checklist?"
        message="This will uncheck all completed audit items and restore the initial default checklist state. Personal notes will be reset."
        confirmLabel="Reset All"
        isDestructive={true}
        onConfirm={() => {
          onResetChecklist();
          setShowResetModal(false);
        }}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  );
};
