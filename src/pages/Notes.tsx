import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit2,
  AlertTriangle,
  Check,
  X,
  Tag,
} from 'lucide-react';
import { SecurityNote } from '../types/security';
import { ConfirmModal } from '../components/ConfirmModal';
import { formatDateShort } from '../utils/formatters';

interface NotesProps {
  notes: SecurityNote[];
  onSaveNote: (note: SecurityNote) => void;
  onDeleteNote: (id: string) => void;
}

const CATEGORIES: Array<SecurityNote['category']> = [
  'Audit',
  'Hardware',
  'Accounts',
  'Network',
  'General',
];

export const Notes: React.FC<NotesProps> = ({ notes, onSaveNote, onDeleteNote }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<Partial<SecurityNote> | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredNotes = notes.filter((n) => {
    const matchesCat = selectedCategory === 'ALL' || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Sort pinned notes to top
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned === b.isPinned) {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return a.isPinned ? -1 : 1;
  });

  const handleCreateNew = () => {
    setEditingNote({
      id: 'note_' + Date.now().toString(36),
      title: '',
      content: '',
      category: 'Audit',
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(true);
  };

  const handleEdit = (note: SecurityNote) => {
    setEditingNote({ ...note });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editingNote || !editingNote.title?.trim()) return;
    const finalNote: SecurityNote = {
      id: editingNote.id || 'note_' + Date.now().toString(36),
      title: editingNote.title.trim(),
      content: editingNote.content || '',
      category: editingNote.category || 'General',
      isPinned: !!editingNote.isPinned,
      createdAt: editingNote.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSaveNote(finalNote);
    setIsEditing(false);
    setEditingNote(null);
  };

  const handleTogglePin = (note: SecurityNote) => {
    onSaveNote({
      ...note,
      isPinned: !note.isPinned,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Private Local Security Notes</span>
          </h2>
          <p className="text-xs text-slate-400">
            Offline scratchpad for device audit schedules, home router settings, and defense checklist reminders.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Sensitive Credentials Warning */}
      <div className="p-3.5 rounded-xl border border-amber-900/60 bg-amber-950/20 text-xs text-amber-200 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300">Security Rule: </span>
          Never store actual passwords, PINs, banking credentials, or crypto seed phrases in plaintext notes. Use an encrypted password manager for credential storage.
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-slate-800 text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Note Editor Modal / Drawer */}
      {isEditing && editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-white">
                {editingNote.title ? 'Edit Security Note' : 'Create Security Note'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-mono">Title</label>
                <input
                  type="text"
                  value={editingNote.title || ''}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  placeholder="e.g. Router Firmware Update Schedule"
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-mono">Category</label>
                  <select
                    value={editingNote.category || 'General'}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, category: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!editingNote.isPinned}
                      onChange={(e) =>
                        setEditingNote({ ...editingNote, isPinned: e.target.checked })
                      }
                      className="w-4 h-4 rounded accent-emerald-500"
                    />
                    <span>Pin note to top</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-mono">Note Content</label>
                <textarea
                  rows={6}
                  value={editingNote.content || ''}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  placeholder="Write your observation, device audit checklist, or reminder..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!editingNote.title?.trim()}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedNotes.length === 0 ? (
          <div className="col-span-full p-8 text-center rounded-xl border border-slate-800 bg-slate-900/30 text-xs text-slate-400 space-y-1">
            <p>No notes found in this category.</p>
            <p className="text-[11px] text-slate-400">Click "New Note" to record your audit details.</p>
          </div>
        ) : (
          sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`rounded-xl border p-5 space-y-3 transition-all flex flex-col justify-between ${
                note.isPinned
                  ? 'border-emerald-900/60 bg-emerald-950/10 shadow-sm'
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {note.isPinned && (
                      <Pin className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 shrink-0" />
                    )}
                    <h3 className="text-sm font-semibold text-white line-clamp-1">{note.title}</h3>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/80">
                    {note.category}
                  </span>
                </div>

                <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed line-clamp-4">
                  {note.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="font-mono">{formatDateShort(note.updatedAt)}</span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleTogglePin(note)}
                    className="p-1.5 text-slate-400 hover:text-emerald-400 rounded transition-colors"
                    title={note.isPinned ? 'Unpin' : 'Pin to top'}
                  >
                    <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'text-emerald-400' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(note)}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(note.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="Delete Security Note?"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmLabel="Delete Note"
        isDestructive={true}
        onConfirm={() => {
          if (deleteTargetId) {
            onDeleteNote(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
