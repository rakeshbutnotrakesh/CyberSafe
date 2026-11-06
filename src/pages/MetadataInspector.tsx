import React, { useState, useEffect } from 'react';
import {
  FileSearch,
  Image,
  AlertTriangle,
  Info,
  Clock,
  HardDrive,
  FileType,
  ShieldAlert,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { DropZone } from '../components/DropZone';
import { FileMetadataInfo } from '../types/security';
import { inspectFileMetadata } from '../services/metadataService';
import { formatBytes, formatDateTime } from '../utils/formatters';

export const MetadataInspector: React.FC = () => {
  const [metadata, setMetadata] = useState<FileMetadataInfo | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    setIsInspecting(true);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    try {
      const file = files[0]; // inspect primary selected file
      const res = await inspectFileMetadata(file);
      setMetadata(res.info);
      if (res.previewUrl) {
        setPreviewUrl(res.previewUrl);
      }
    } catch (err) {
      console.error('Inspection error:', err);
    } finally {
      setIsInspecting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-blue-400" />
          <span>Local File Metadata & Binary Magic Inspector</span>
        </h2>
        <p className="text-xs text-slate-400">
          Inspect client-accessible filesystem properties, image dimensions, and detect file extension spoofing via binary magic bytes.
        </p>
      </div>

      {/* Drop Zone */}
      <DropZone
        onFilesSelected={handleFilesSelected}
        multiple={false}
        label="Select or drag a file to inspect metadata"
        sublabel="Images, documents, executables, or archives. Inspected strictly within client memory."
      />

      {isInspecting && (
        <div className="p-4 rounded-xl border border-blue-900/60 bg-blue-950/20 flex items-center justify-center gap-3 text-xs text-blue-300 font-mono">
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span>Extracting local metadata headers...</span>
        </div>
      )}

      {metadata && (
        <div className="space-y-6">
          {/* Extension Spoofing Warning */}
          {metadata.isMimeMismatch && (
            <div className="p-4 rounded-xl border border-rose-800 bg-rose-950/40 text-xs text-rose-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-rose-300">
                  Critical Extension Spoofing Warning!
                </span>
                <p className="text-slate-200">
                  The file extension is <code className="font-mono text-rose-300">.{metadata.extension}</code>, but its binary header matches a Windows executable binary (<code className="font-mono text-rose-300">MZ</code> header). Attackers use double-extension spoofing (e.g. invoice.pdf.exe) to trick users into executing malicious binaries disguised as harmless documents.
                </p>
              </div>
            </div>
          )}

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Info */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
              <h3 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-300 flex items-center gap-2">
                <FileType className="w-4 h-4 text-blue-400" />
                <span>File Properties</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400">File Name</span>
                  <span className="font-semibold text-white font-mono break-all max-w-[200px] text-right">
                    {metadata.fileName}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400">Detected Extension</span>
                  <span className="font-mono text-cyan-400 font-semibold uppercase">
                    .{metadata.extension}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400">MIME Content Type</span>
                  <span className="font-mono text-slate-200">{metadata.fileType}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400">File Size</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    {formatBytes(metadata.fileSize)} ({metadata.fileSize.toLocaleString()} bytes)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400">Last Modified</span>
                  <span className="font-mono text-slate-200">{formatDateTime(metadata.lastModified)}</span>
                </div>
              </div>
            </div>

            {/* Binary Magic Headers */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
              <h3 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-300 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span>Binary Signature (Magic Bytes)</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-[11px] text-slate-400 font-mono mb-1">
                    Header Bytes (First 16 Bytes Hex):
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-emerald-400 tracking-wider text-xs break-all">
                    {metadata.magicBytesHex || 'Unable to read byte stream'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400">Signature Match:</span>
                  <span className="font-semibold text-white font-mono">
                    {metadata.detectedFormatFromSignature || 'Unknown binary structure'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                  Operating systems and security engines inspect magic numbers to identify the real binary format of a file regardless of what extension the user or attacker assigned to it.
                </div>
              </div>
            </div>
          </div>

          {/* Image Dimensions & Preview (if image) */}
          {metadata.imageDimensions && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Image className="w-4 h-4 text-cyan-400" />
                <span>Image Geometry & Visual Metadata</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {previewUrl && (
                  <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <img
                      src={previewUrl}
                      alt={metadata.fileName}
                      className="max-h-48 rounded object-contain"
                    />
                    <span className="text-[10px] text-slate-400 font-mono mt-2">Local Blob Preview</span>
                  </div>
                )}

                <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                    <div className="text-slate-400 font-mono text-[11px]">Width</div>
                    <div className="font-bold text-white text-base font-mono">
                      {metadata.imageDimensions.width} px
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                    <div className="text-slate-400 font-mono text-[11px]">Height</div>
                    <div className="font-bold text-white text-base font-mono">
                      {metadata.imageDimensions.height} px
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                    <div className="text-slate-400 font-mono text-[11px]">Aspect Ratio</div>
                    <div className="font-bold text-cyan-400 text-base font-mono">
                      {metadata.imageDimensions.aspectRatio}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                    <div className="text-slate-400 font-mono text-[11px]">Resolution</div>
                    <div className="font-bold text-emerald-400 text-base font-mono">
                      {metadata.imageDimensions.megaPixels}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Sandbox Notice Card */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-xs space-y-2 text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Metadata Privacy Advisory</span>
            </div>
            <p className="leading-relaxed text-slate-400">{metadata.privacyNotice}</p>
          </div>
        </div>
      )}
    </div>
  );
};
