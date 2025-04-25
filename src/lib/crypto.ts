import crypto from 'crypto';
import { PRIVATE_CONFIG_KEY } from "$env/static/private"

if (!PRIVATE_CONFIG_KEY) {
  throw new Error('PRIVATE_CONFIG_KEY environment variable is not set.');
}

const algorithm = 'aes-256-cbc';
const key = Buffer.from(PRIVATE_CONFIG_KEY, 'base64');
const ivLength = 16; // For AES, this is always 16

/**
 * @param {string} text
 */
export function encrypt(text) {
  console.log('Encrypting text:', text);
  if (typeof text !== 'string') {
    throw new TypeError('The "text" argument must be of type string.');
  }
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const ivBase64 = iv.toString('base64');
  return `${ivBase64}:${encrypted}`;
}

/**
 * @param {string} encryptedText
 */
export function decrypt(encryptedText) {
  const [ivBase64, encryptedData] = encryptedText.split(':');
  const iv = Buffer.from(ivBase64, 'base64');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}