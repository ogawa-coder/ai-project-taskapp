const STORAGE_PREFIX = 'taskapp_';

export const storageKeys = {
  TASKS: 'tasks',
  CATEGORIES: 'categories',
  TAGS: 'tags',
  FILTERS: 'filters',
  SORT: 'sort',
} as const;

export function getStorageItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const item = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return null;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
}

export function clearAllStorage(): void {
  if (typeof window === 'undefined') return;

  Object.keys(window.localStorage)
    .filter((key) => key.startsWith(STORAGE_PREFIX))
    .forEach((key) => window.localStorage.removeItem(key));
}

export function exportData(): string {
  const data = {
    tasks: getStorageItem(storageKeys.TASKS),
    categories: getStorageItem(storageKeys.CATEGORIES),
    tags: getStorageItem(storageKeys.TAGS),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.tasks) setStorageItem(storageKeys.TASKS, data.tasks);
    if (data.categories) setStorageItem(storageKeys.CATEGORIES, data.categories);
    if (data.tags) setStorageItem(storageKeys.TAGS, data.tags);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}
