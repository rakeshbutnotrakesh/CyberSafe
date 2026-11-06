import React, { useState, useRef } from 'react';
import { UploadCloud, File, AlertCircle } from 'lucide-react';
import { formatBytes } from '../utils/formatters';
import { MAX_SAFE_FILE_SIZE } from '../services/hashService';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  sublabel?: string;
  maxRecommendedSize?: number;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFilesSelected,
  accept,
  multiple = true,
  label = 'Drag and drop files here, or click to browse',
  sublabel = 'Calculated 100% locally in browser memory. No files are uploaded.',
  maxRecommendedSize = MAX_SAFE_FILE_SIZE,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const filesArray = Array.from(fileList);

    const hasHugeFile = filesArray.some(f => f.size > maxRecommendedSize);
    if (hasHugeFile) {
      setWarning(`Note: Files larger than ${formatBytes(maxRecommendedSize)} may take several seconds to hash in browser memory.`);
    } else {
      setWarning(null);
    }

    onFilesSelected(filesArray);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset input so same file can be reselected if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-emerald-400 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="mx-auto flex w-12 h-12 items-center justify-center rounded-full bg-slate-800/80 border border-slate-700/60 mb-3 text-emerald-400">
          <UploadCloud className="w-6 h-6" />
        </div>

        <h3 className="text-sm font-semibold text-slate-200">{label}</h3>
        <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">{sublabel}</p>

        <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <File className="w-3.5 h-3.5 text-slate-400" />
            <span>Multiple files supported</span>
          </span>
          <span>·</span>
          <span>Max recommended: {formatBytes(maxRecommendedSize)}</span>
        </div>
      </div>

      {warning && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/50 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{warning}</span>
        </div>
      )}
    </div>
  );
};
