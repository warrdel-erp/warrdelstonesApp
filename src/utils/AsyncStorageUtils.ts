import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyValuePair } from '@react-native-async-storage/async-storage/src/types.ts';

/**
 * AsyncStorage utility class for handling data persistence
 */
export class AsyncStorageUtils {
  /**
   * Store a string value
   * @param key - Storage key
   * @param value - String value to store
   */
  static async setString(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting string for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get a string value
   * @param key - Storage key
   * @param defaultValue - Default value if key doesn't exist
   * @returns Stored string value or default value
   */
  static async getString(key: string, defaultValue: string = ''): Promise<string> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null ? value : defaultValue;
    } catch (error) {
      console.error(`Error getting string for key ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Store an object (will be JSON stringified)
   * @param key - Storage key
   * @param value - Object to store
   */
  static async setObject<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error setting object for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get an object (will be JSON parsed)
   * @param key - Storage key
   * @param defaultValue - Default value if key doesn't exist
   * @returns Stored object or default value
   */
  static async getObject<T>(key: string, defaultValue: T | null = null): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
    } catch (error) {
      console.error(`Error getting object for key ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Store a boolean value
   * @param key - Storage key
   * @param value - Boolean value to store
   */
  static async setBoolean(key: string, value: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.error(`Error setting boolean for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get a boolean value
   * @param key - Storage key
   * @param defaultValue - Default value if key doesn't exist
   * @returns Stored boolean value or default value
   */
  static async getBoolean(key: string, defaultValue: boolean = false): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null ? value === 'true' : defaultValue;
    } catch (error) {
      console.error(`Error getting boolean for key ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Store a number value
   * @param key - Storage key
   * @param value - Number value to store
   */
  static async setNumber(key: string, value: number): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.error(`Error setting number for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get a number value
   * @param key - Storage key
   * @param defaultValue - Default value if key doesn't exist
   * @returns Stored number value or default value
   */
  static async getNumber(key: string, defaultValue: number = 0): Promise<number> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null ? parseFloat(value) : defaultValue;
    } catch (error) {
      console.error(`Error getting number for key ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Remove a value from storage
   * @param key - Storage key to remove
   */
  static async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Remove multiple values from storage
   * @param keys - Array of storage keys to remove
   */
  static async removeMultiple(keys: string[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error(`Error removing multiple keys:`, error);
      throw error;
    }
  }

  /**
   * Clear all storage
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      throw error;
    }
  }

  /**
   * Get all keys from storage
   * @returns Array of all storage keys
   */
  static async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  /**
   * Check if a key exists in storage
   * @param key - Storage key to check
   * @returns True if key exists, false otherwise
   */
  static async hasKey(key: string): Promise<boolean> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.includes(key);
    } catch (error) {
      console.error(`Error checking if key ${key} exists:`, error);
      return false;
    }
  }

  /**
   * Get multiple values at once
   * @param keys - Array of keys to retrieve
   * @returns Array of [key, value] pairs
   */
  static async getMultiple(keys: string[]): Promise<readonly KeyValuePair[]> {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      console.error('Error getting multiple values:', error);
      return [];
    }
  }

  /**
   * Set multiple values at once
   * @param keyValuePairs - Array of [key, value] pairs
   */
  static async setMultiple(keyValuePairs: [string, string][]): Promise<void> {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
    } catch (error) {
      console.error('Error setting multiple values:', error);
      throw error;
    }
  }

  /**
   * Get storage usage info (keys count and estimated size)
   * @returns Object with keys count and estimated size in bytes
   */
  static async getStorageInfo(): Promise<{ keysCount: number; estimatedSize: number }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const values = await AsyncStorage.multiGet(keys);

      let estimatedSize = 0;
      values.forEach(([key, value]) => {
        if (value) {
          estimatedSize += key.length + value.length;
        }
      });

      return {
        keysCount: keys.length,
        estimatedSize: estimatedSize * 2, // Rough estimate (UTF-16 encoding)
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { keysCount: 0, estimatedSize: 0 };
    }
  }
}

/**
 * Storage keys constants to avoid typos and maintain consistency
 */
export const STORAGE_KEYS = {
  // Auth related
  USER_TOKEN: 'user_token',
  USER_AUTH_STATE: 'auth_state',
  IS_AUTHENTICATED: 'is_authenticated',
  REFRESH_TOKEN: 'refresh_token',

  // App settings
  APP_THEME: 'app_theme',
  APP_LANGUAGE: 'app_language',
  NOTIFICATION_SETTINGS: 'notification_settings',

  // User preferences
  FIRST_TIME_LAUNCH: 'first_time_launch',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  LAST_LOGIN_DATE: 'last_login_date',

  // Cache
  CACHED_DATA: 'cached_data',
  CACHE_TIMESTAMP: 'cache_timestamp',
} as const;

export default AsyncStorageUtils;
