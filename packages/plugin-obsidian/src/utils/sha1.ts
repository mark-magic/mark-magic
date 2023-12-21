import crypto from 'crypto'

/**
 * Generates a SHA-1 hash of the given message synchronously.
 * @param message - The message to hash.
 * @returns The hexadecimal representation of the SHA-1 hash.
 */
export function sha1(message: string): string {
  const hash = crypto.createHash('sha1')
  hash.update(message)
  return hash.digest('hex')
}
