/**
 * Local AES-256-GCM Cryptographic Vault Service
 * Employs browser native Web Crypto API (crypto.subtle)
 * PBKDF2 key derivation with SHA-256, 100,000 iterations + 16-byte salt
 * 100% Client-Side memory, zero network.
 */

import { EncryptedPayload } from '../types/security';
import { bufferToHex } from '../utils/formatters';

const PBKDF2_ITERATIONS = 100_000;

export async function encryptTextAESGCM(
  plaintext: string,
  passphrase: string,
  hint?: string
): Promise<{ payload: EncryptedPayload; armoredString: string }> {
  const encoder = new TextEncoder();
  const plaintextBuffer = encoder.encode(plaintext);

  // Generate cryptographically secure 16-byte salt
  const salt = new Uint8Array(16);
  window.crypto.getRandomValues(salt);

  // Generate 12-byte IV for AES-GCM
  const iv = new Uint8Array(12);
  window.crypto.getRandomValues(iv);

  // Derive AES-GCM key from passphrase via PBKDF2
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const aesKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  // Encrypt
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    aesKey,
    plaintextBuffer
  );

  const saltHex = bufferToHex(salt.buffer as ArrayBuffer);
  const ivHex = bufferToHex(iv.buffer as ArrayBuffer);
  const ciphertextHex = bufferToHex(ciphertextBuffer);

  const payload: EncryptedPayload = {
    format: 'CYBERSAFE_AES_GCM_V1',
    saltHex,
    ivHex,
    ciphertextHex,
    iterations: PBKDF2_ITERATIONS,
    hint: hint ? hint.trim() : undefined,
    timestamp: new Date().toISOString(),
  };

  const armoredString = `-----BEGIN CYBERSAFE ENCRYPTED MESSAGE-----\n${btoa(
    JSON.stringify(payload)
  )}\n-----END CYBERSAFE ENCRYPTED MESSAGE-----`;

  return { payload, armoredString };
}

export async function decryptTextAESGCM(
  armoredOrJson: string,
  passphrase: string
): Promise<{ plaintext: string; payload: EncryptedPayload }> {
  let jsonString = armoredOrJson.trim();

  // Strip armored header if present
  if (jsonString.includes('BEGIN CYBERSAFE ENCRYPTED MESSAGE')) {
    const lines = jsonString
      .replace(/-----BEGIN CYBERSAFE ENCRYPTED MESSAGE-----/, '')
      .replace(/-----END CYBERSAFE ENCRYPTED MESSAGE-----/, '')
      .trim();
    try {
      jsonString = atob(lines);
    } catch {
      throw new Error('Invalid armored format or corrupted base64 encoding.');
    }
  }

  let payload: EncryptedPayload;
  try {
    payload = JSON.parse(jsonString);
  } catch {
    throw new Error('Invalid encryption payload. Must be valid CyberSafe JSON or armored text.');
  }

  if (payload.format !== 'CYBERSAFE_AES_GCM_V1') {
    throw new Error('Unsupported payload format or version.');
  }

  const salt = hexToUint8Array(payload.saltHex);
  const iv = hexToUint8Array(payload.ivHex);
  const ciphertext = hexToUint8Array(payload.ciphertextHex);

  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const aesKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: payload.iterations || PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as unknown as BufferSource,
      },
      aesKey,
      ciphertext as unknown as BufferSource
    );

    const decoder = new TextDecoder();
    const plaintext = decoder.decode(decryptedBuffer);
    return { plaintext, payload };
  } catch {
    throw new Error('Decryption failed! Incorrect passphrase or ciphertext has been tampered with.');
  }
}

function hexToUint8Array(hexString: string): Uint8Array {
  const cleanHex = hexString.replace(/[^0-9a-fA-F]/g, '');
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }
  return bytes;
}
