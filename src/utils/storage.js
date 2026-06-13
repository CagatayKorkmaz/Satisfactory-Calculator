const STORAGE_KEY = 'satisfactory-calculator-canvas';

export function saveToStorage({ nodes, edges, overrides, selectedRecipes }) {
  try {
    const data = {
      nodes,
      edges,
      overrides,
      selectedRecipes,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('localStorage kaydetme hatası:', e);
  }
}

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('localStorage yükleme hatası:', e);
    return null;
  }
}

export function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('localStorage temizleme hatası:', e);
  }
}
