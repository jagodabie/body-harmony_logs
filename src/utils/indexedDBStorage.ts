import { del, get, set } from 'idb-keyval';
import type { StateStorage } from 'zustand/middleware';

export const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log('[IndexedDB] Getting item:', name);
    try {
      const value = await get(name);
      return value || null;
    } catch (error) {
      console.error('[IndexedDB] Error getting item:', error);
      return null;
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    console.log('[IndexedDB] Setting item:', name);
    try {
      await set(name, value);
    } catch (error) {
      console.error('[IndexedDB] Error setting item:', error);
    }
  },

  removeItem: async (name: string): Promise<void> => {
    console.log('[IndexedDB] Removing item:', name);
    try {
      await del(name);
    } catch (error) {
      console.error('[IndexedDB] Error removing item:', error);
    }
  },
};


