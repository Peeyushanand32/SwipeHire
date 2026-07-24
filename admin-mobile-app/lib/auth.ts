import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'swipehire_admin_token';
const USER_KEY = 'swipehire_admin_user';

export async function saveAuthSession(token: string, user: any) {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Error saving auth session:', e);
  }
}

export async function getAuthToken(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

export async function getAuthUser(): Promise<any | null> {
  try {
    let str: string | null = null;
    if (Platform.OS === 'web') {
      str = localStorage.getItem(USER_KEY);
    } else {
      str = await SecureStore.getItemAsync(USER_KEY);
    }
    return str ? JSON.parse(str) : null;
  } catch (e) {
    return null;
  }
}

export async function clearAuthSession() {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    }
  } catch (e) {
    console.error('Error clearing auth session:', e);
  }
}
