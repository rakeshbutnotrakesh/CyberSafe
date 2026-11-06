/**
 * Local Image Steganography Service
 * Hides and extracts confidential text messages inside image RGB pixels (Least Significant Bit - LSB).
 * 100% Client-Side canvas manipulation, zero server uploads.
 */

const STEGO_MAGIC = 0x43594252; // "CYBR" in hex

export function calculateStegoCapacity(width: number, height: number): number {
  // 3 color channels (R, G, B) * width * height bits
  const totalBits = width * height * 3;
  // 64 bits reserved for magic (32 bits) and length (32 bits)
  const availableBits = totalBits - 64;
  return Math.max(0, Math.floor(availableBits / 8));
}

export async function encodeTextIntoImage(
  imageFile: File,
  secretMessage: string
): Promise<{ stegoDataUrl: string; width: number; height: number; payloadBytes: number }> {
  const encoder = new TextEncoder();
  const messageBytes = encoder.encode(secretMessage);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const capacity = calculateStegoCapacity(width, height);

        if (messageBytes.length > capacity) {
          reject(
            new Error(
              `Message is too large (${messageBytes.length} bytes) for this image. Maximum capacity is ${capacity} bytes.`
            )
          );
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Prepare bitstream: 32 bits magic + 32 bits length + message bits
        const bitstream: number[] = [];

        // 32-bit magic
        for (let i = 31; i >= 0; i--) {
          bitstream.push((STEGO_MAGIC >> i) & 1);
        }

        // 32-bit length
        const length = messageBytes.length;
        for (let i = 31; i >= 0; i--) {
          bitstream.push((length >> i) & 1);
        }

        // Message bytes
        for (let b = 0; b < messageBytes.length; b++) {
          const byte = messageBytes[b];
          for (let i = 7; i >= 0; i--) {
            bitstream.push((byte >> i) & 1);
          }
        }

        // Write bits to R, G, B channels (skip Alpha)
        let bitIndex = 0;
        for (let i = 0; i < data.length; i += 4) {
          for (let c = 0; c < 3; c++) {
            if (bitIndex < bitstream.length) {
              const bit = bitstream[bitIndex++];
              data[i + c] = (data[i + c] & ~1) | bit;
            } else {
              break;
            }
          }
          if (bitIndex >= bitstream.length) break;
        }

        ctx.putImageData(imgData, 0, 0);
        // Export strictly as lossless PNG
        const stegoDataUrl = canvas.toDataURL('image/png');
        resolve({
          stegoDataUrl,
          width,
          height,
          payloadBytes: messageBytes.length,
        });
      };
      img.onerror = () => reject(new Error('Failed to load image file.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(imageFile);
  });
}

export async function decodeTextFromImage(
  imageFile: File
): Promise<{ secretMessage: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Extract bits from R, G, B channels
        const extractedBits: number[] = [];
        // First extract 64 bits to inspect magic & length
        for (let i = 0; i < data.length; i += 4) {
          for (let c = 0; c < 3; c++) {
            extractedBits.push(data[i + c] & 1);
            if (extractedBits.length >= 64) break;
          }
          if (extractedBits.length >= 64) break;
        }

        // Read magic
        let magic = 0;
        for (let i = 0; i < 32; i++) {
          magic = (magic << 1) | extractedBits[i];
        }

        if (magic !== STEGO_MAGIC) {
          reject(
            new Error(
              'No CyberSafe steganography payload detected in this image. (Magic header signature not found).'
            )
          );
          return;
        }

        // Read length
        let messageLength = 0;
        for (let i = 32; i < 64; i++) {
          messageLength = (messageLength << 1) | extractedBits[i];
        }

        const maxPossible = calculateStegoCapacity(width, height);
        if (messageLength <= 0 || messageLength > maxPossible) {
          reject(new Error('Corrupted or invalid payload length detected in carrier image.'));
          return;
        }

        const totalBitsNeeded = 64 + messageLength * 8;
        const allBits: number[] = [];

        for (let i = 0; i < data.length; i += 4) {
          for (let c = 0; c < 3; c++) {
            allBits.push(data[i + c] & 1);
            if (allBits.length >= totalBitsNeeded) break;
          }
          if (allBits.length >= totalBitsNeeded) break;
        }

        const messageBytes = new Uint8Array(messageLength);
        let bitPtr = 64;
        for (let b = 0; b < messageLength; b++) {
          let byteVal = 0;
          for (let i = 0; i < 8; i++) {
            byteVal = (byteVal << 1) | allBits[bitPtr++];
          }
          messageBytes[b] = byteVal;
        }

        const decoder = new TextDecoder();
        const secretMessage = decoder.decode(messageBytes);
        resolve({ secretMessage, width, height });
      };
      img.onerror = () => reject(new Error('Failed to load image file.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(imageFile);
  });
}
