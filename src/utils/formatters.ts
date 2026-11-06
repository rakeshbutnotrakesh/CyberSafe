/**
 * CyberSafe Formatting Utilities
 */

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function formatDateShort(isoString: string): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  const hexCodes = [...byteArray].map(value => {
    const hexCode = value.toString(16);
    const paddedHexCode = hexCode.padStart(2, '0');
    return paddedHexCode;
  });
  return hexCodes.join('');
}

export function formatEntropy(bits: number): string {
  return `${Math.round(bits)} bits`;
}

export function getCrackTimeColor(crackTime: string): string {
  if (crackTime.includes('Instant') || crackTime.includes('seconds') || crackTime.includes('minutes')) {
    return 'text-rose-400';
  }
  if (crackTime.includes('hours') || crackTime.includes('days')) {
    return 'text-amber-400';
  }
  if (crackTime.includes('months') || crackTime.includes('years') && !crackTime.includes('million') && !crackTime.includes('billion')) {
    return 'text-emerald-400';
  }
  return 'text-emerald-400';
}
