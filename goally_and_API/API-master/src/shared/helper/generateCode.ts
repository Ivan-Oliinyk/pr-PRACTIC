import { customAlphabet } from 'nanoid';

export function generateCode(length: number): string {
  const nanoid = customAlphabet('123456789ABCDEFGHIJKLMNPQRSTUVWXYZ', length);
  return nanoid();
}
