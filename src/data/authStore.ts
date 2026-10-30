// src/data/authStore.ts

export interface RegisteredUser {
  id: number;
  nama: string;
  email: string;
  noHp: string;
  passwordHash: string;
  role: 'pelanggan' | 'admin' | 'owner';
  avatarUrl: string;
}

export interface UserSession {
  id: number;
  nama: string;
  email: string;
  noHp: string;
  role: 'pelanggan' | 'admin' | 'owner';
  avatarUrl: string;
}

const SESSION_KEY = 'futsalhub_user_session';
const REGISTERED_USERS_KEY = 'futsalhub_registered_users';

// 1. Akun Internal Bawaan Sistem
export const DEFAULT_INTERNAL_USERS: RegisteredUser[] = [
  {
    id: 1,
    nama: 'Bapak Hendra (Owner)',
    email: 'owner@gmail.com',
    noHp: '08111222333',
    passwordHash: '123',
    role: 'owner',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    nama: 'Staf Kasir Lapangan',
    email: 'admin@gmail.com',
    noHp: '081298765432',
    passwordHash: '123',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
];

// Mengambil seluruh akun terdaftar
export const getRegisteredUsers = (): RegisteredUser[] => {
  if (typeof window === 'undefined') return DEFAULT_INTERNAL_USERS;
  const data = localStorage.getItem(REGISTERED_USERS_KEY);
  if (!data) return DEFAULT_INTERNAL_USERS;
  try {
    const customUsers: RegisteredUser[] = JSON.parse(data);
    return [...DEFAULT_INTERNAL_USERS, ...customUsers];
  } catch {
    return DEFAULT_INTERNAL_USERS;
  }
};

// Menyimpan akun pelanggan baru dari Form Registrasi
export const saveNewUser = (user: Omit<RegisteredUser, 'id'>): boolean => {
  if (typeof window === 'undefined') return false;
  
  const allUsers = getRegisteredUsers();
  const exists = allUsers.some(
    (u) => u.email.toLowerCase() === user.email.toLowerCase()
  );

  if (exists) {
    return false;
  }

  const currentCustom: RegisteredUser[] = JSON.parse(
    localStorage.getItem(REGISTERED_USERS_KEY) || '[]'
  );

  const newUser: RegisteredUser = {
    ...user,
    id: Date.now(),
  };

  currentCustom.push(newUser);
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(currentCustom));
  return true;
};

// Reset total semua akun pelanggan
export const resetCustomUsers = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(REGISTERED_USERS_KEY);
    localStorage.removeItem(SESSION_KEY);
  }
};

// Pengelolaan Sesi Login
export const getStoredUser = (): UserSession | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: UserSession): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
};

export const clearStoredUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
};

