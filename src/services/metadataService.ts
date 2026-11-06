/**
 * Local File Metadata Inspector Service
 * Extracts client-accessible file properties, binary magic headers, and image dimensions.
 * 100% client-side inspection.
 */

import { FileMetadataInfo } from '../types/security';

interface MagicSignature {
  name: string;
  expectedExt: string;
  bytes: number[];
  mask?: number[];
}

const MAGIC_SIGNATURES: MagicSignature[] = [
  { name: 'PNG Image', expectedExt: 'png', bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
  { name: 'JPEG Image', expectedExt: 'jpg', bytes: [0xFF, 0xD8, 0xFF] },
  { name: 'GIF87a Image', expectedExt: 'gif', bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61] },
  { name: 'GIF89a Image', expectedExt: 'gif', bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61] },
  { name: 'PDF Document', expectedExt: 'pdf', bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  { name: 'ZIP Archive / Office OpenXML', expectedExt: 'zip', bytes: [0x50, 0x4B, 0x03, 0x04] }, // PK..
  { name: 'GZIP Compressed Archive', expectedExt: 'gz', bytes: [0x1F, 0x8B] },
  { name: 'Windows Executable / DLL (PE)', expectedExt: 'exe', bytes: [0x4D, 0x5A] }, // MZ
  { name: 'Linux ELF Executable', expectedExt: 'elf', bytes: [0x7F, 0x45, 0x4C, 0x46] }, // .ELF
  { name: 'WebP Image', expectedExt: 'webp', bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF....WEBP
  { name: '7-Zip Archive', expectedExt: '7z', bytes: [0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C] },
  { name: 'MP4 / ISO Media Video', expectedExt: 'mp4', bytes: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70] },
];

export async function inspectFileMetadata(file: File): Promise<{
  info: FileMetadataInfo;
  previewUrl?: string;
}> {
  const extension = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() || '' : '';
  const lastModified = file.lastModified ? new Date(file.lastModified).toISOString() : new Date().toISOString();

  // Read first 16 bytes for magic number analysis
  let magicBytesHex = '';
  let detectedFormatFromSignature: string | undefined;
  let isMimeMismatch = false;

  try {
    const slice = file.slice(0, 16);
    const headerBuffer = await slice.arrayBuffer();
    const headerBytes = new Uint8Array(headerBuffer);
    magicBytesHex = Array.from(headerBytes)
      .map(b => b.toString(16).padStart(2, '0').toUpperCase())
      .join(' ');

    // Match signature
    for (const sig of MAGIC_SIGNATURES) {
      let match = true;
      for (let i = 0; i < sig.bytes.length; i++) {
        if (i >= headerBytes.length || headerBytes[i] !== sig.bytes[i]) {
          match = false;
          break;
        }
      }
      if (match) {
        detectedFormatFromSignature = sig.name;
        // Check for extension spoofing (e.g. filename claims to be .pdf or .jpg, but magic bytes are EXE)
        if (sig.expectedExt === 'exe' && extension !== 'exe' && extension !== 'dll') {
          isMimeMismatch = true;
        }
        break;
      }
    }
  } catch {
    // Fail silently
  }

  let previewUrl: string | undefined;
  let imageDimensions: FileMetadataInfo['imageDimensions'];
  let audioVideoDuration: number | undefined;

  // Inspect Image Dimensions if image file
  if (file.type.startsWith('image/')) {
    try {
      previewUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = previewUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });

      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        const gcd = getGcd(img.naturalWidth, img.naturalHeight);
        const aspectW = Math.round(img.naturalWidth / gcd);
        const aspectH = Math.round(img.naturalHeight / gcd);
        const mp = ((img.naturalWidth * img.naturalHeight) / 1_000_000).toFixed(2);

        imageDimensions = {
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: `${aspectW}:${aspectH}`,
          megaPixels: `${mp} MP`,
        };
      }
    } catch {
      // Ignored
    }
  }

  // Inspect Video / Audio duration
  if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
    try {
      const mediaUrl = URL.createObjectURL(file);
      const media = document.createElement(file.type.startsWith('video/') ? 'video' : 'audio');
      media.preload = 'metadata';
      media.src = mediaUrl;
      await new Promise((resolve) => {
        media.onloadedmetadata = resolve;
        media.onerror = resolve;
      });
      if (media.duration && !isNaN(media.duration)) {
        audioVideoDuration = Math.round(media.duration);
      }
      URL.revokeObjectURL(mediaUrl);
    } catch {
      // Ignored
    }
  }

  const isImage = file.type.startsWith('image/');
  const privacyNotice = isImage
    ? 'Privacy Warning: Original photos taken by smartphone cameras and digital DSLRs typically contain EXIF metadata (GPS coordinates, exact capture timestamp, device serial, and camera hardware). Strip EXIF data before uploading photos to public forums.'
    : 'Local Inspection Note: Browser sandboxing restricts web applications from accessing OS-level low-level file creation timestamps, filesystem inodes, and owner permissions.';

  return {
    info: {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'application/octet-stream',
      extension: extension || 'none',
      lastModified,
      magicBytesHex,
      detectedFormatFromSignature,
      isMimeMismatch,
      imageDimensions,
      audioVideoDuration,
      privacyNotice,
    },
    previewUrl,
  };
}

function getGcd(a: number, b: number): number {
  return b === 0 ? a : getGcd(b, a % b);
}
