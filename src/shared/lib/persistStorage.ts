import localForage from 'localforage';

export const persistStorage = {
  async getItem<T>(key: string): Promise<T | null> {
    return await localForage.getItem<T>(key);
  },

  async getItemSafe<T>(key: string, defaultValue: T): Promise<T> {
    const result = await localForage.getItem<T>(key);
    return result === null ? defaultValue : result;
  },

  async setItem<T>(key: string, value: T): Promise<T | null> {
    try {
      return await localForage.setItem<T>(key, value);
    } catch {
      return Promise.resolve(null);
    }
  },
};
