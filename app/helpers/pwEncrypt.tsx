import crypto from 'crypto';

const keyCode = process.env.SECRET_KEY as string;
const loopCount = 10_000;
const charCount = 32;
const encType = 'sha512';

export const pwEncrypt = (password: string): string => {
  if (!keyCode) {
    throw new Error('SECRET_KEY is not defined in environment variables');
  }
  return crypto.pbkdf2Sync(password, keyCode, loopCount, charCount, encType).toString('hex');
};