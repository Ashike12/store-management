/**
 * Generates a RFC4122 compliant UUID (v4)
 * @returns {string} A randomly generated UUID string
 */
export function generateUUID(): string {
  // Implementation based on RFC4122 v4 UUID generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generates a unique ID with customizable prefix and length
 * @param {number} length - Length of the random part (default: 8)
 * @returns {string} A unique ID string
 */
export const generateShortId = (length = 8) => {
  const randomPart = Math.random()
    .toString(36)
    .substring(2, 2 + length);

  const timestamp = Date.now().toString(36);

  return `${randomPart}-${timestamp}`;
};
