// Auto-imports every image placed in src/assets/portraits/, in filename order.
const modules = import.meta.glob('../assets/portraits/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const portraitImages: string[] = Object.keys(modules)
  .sort()
  .map((key) => modules[key]);

const STORAGE_KEY = 'lelouch-portrait-index';

/**
 * Returns the portrait for this visit and advances the stored index so the
 * next page load (next visitor / next refresh) shows the next image in the
 * folder, wrapping back to the first once the list is exhausted.
 */
export function getRotatingPortrait(): string {
  if (portraitImages.length === 0) return '';
  if (portraitImages.length === 1) return portraitImages[0];

  let currentIndex = 0;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    currentIndex = stored ? parseInt(stored, 10) % portraitImages.length : 0;
    if (Number.isNaN(currentIndex)) currentIndex = 0;
  } catch {
    currentIndex = 0;
  }

  try {
    const nextIndex = (currentIndex + 1) % portraitImages.length;
    window.localStorage.setItem(STORAGE_KEY, String(nextIndex));
  } catch {
    // localStorage unavailable (e.g. private mode) — rotation just resets each visit
  }

  return portraitImages[currentIndex];
}
