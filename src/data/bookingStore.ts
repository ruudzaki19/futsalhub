// src/data/bookingStore.ts

export interface SelectedSlot {
  jam: string; // e.g. "20:00 - 21:00"
  harga: number; // e.g. 170000
}

export interface CartItem {
  id: string; // unique cart item id
  lapanganId: number; // 1, 2, 3
  lapanganNama: string; // "Lapangan 1"
  tanggal: string; // "2026-10-30"
  tanggalLabel: string; // "Jum, 30 Okt 2026"
  slots: SelectedSlot[];
  rangeLabel: string; // e.g. "19:00 - 22:00 (3 Jam)"
  totalJam: number;
  totalHarga: number;
}

export type PaymentMethod = 
  | 'qris' 
  | 'bca' 
  | 'mandiri' 
  | 'bni' 
  | 'bri' 
  | 'gopay' 
  | 'dana' 
  | 'ovo' 
  | 'shopeepay';

export interface BookingRecord {
  id: string; // e.g. "FH-8832"
  namaPenyewa: string;
  noHp: string;
  email: string;
  lapanganId: number; // 1, 2, 3
  lapanganNama: string; // "Lapangan 1" atau "Lapangan 1 (10:00 - 12:00 • 2 Jam)"
  tanggal: string; // "2026-10-30" (YYYY-MM-DD)
  tanggalLabel: string; // "Jum, 30 Okt 2026"
  slots: SelectedSlot[];
  subtotal: number;
  biayaLayanan: number;
  totalAkhir: number;
  tipePembayaran: 'lunas' | 'dp'; // Lunas (100%) vs DP (50%)
  nominalDibayar: number;
  sisaPelunasan: number;
  metodePembayaran: PaymentMethod;
  kodeBayar: string; // Nomor VA atau ID QRIS
  status: 'menunggu_pembayaran' | 'menunggu_verifikasi' | 'confirmed' | 'ditolak' | 'selesai' | 'dibatalkan' | 'kadaluarsa';
  createdAt: string;
  expiresAt?: string; // Batas waktu bayar (10 menit sejak checkout)
  // Fitur Refund Kasir jika pesanan berbayar ditolak
  refundStatus?: 'none' | 'perlu_refund' | 'selesai_refund';
  refundNominal?: number;
  refundCatatan?: string;
  refundAt?: string;
  // Fitur Hapus Riwayat Khusus User / Pelanggan (Jadwal Lapangan & Admin Tetap Ada)
  hiddenFromUser?: boolean;
}

const BOOKINGS_STORAGE_KEY = 'futsalhub_bookings_list';
const CART_STORAGE_KEY = 'futsalhub_cart_items';

// Data bawaan: Jadwal tetap terisi untuk data riil penyewa (tidak di-reset)
const DEFAULT_INITIAL_BOOKINGS: BookingRecord[] = [];

// --- FUNGSI CART / KERANJANG SEWA ---
export const getCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const addToCart = (item: CartItem): void => {
  if (typeof window === 'undefined') return;
  const current = getCartItems();
  const filtered = current.filter((c) => c.id !== item.id);
  const updated = [item, ...filtered];
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('futsalhub_cart_changed'));
};

export const removeFromCart = (itemId: string): void => {
  if (typeof window === 'undefined') return;
  const current = getCartItems();
  const updated = current.filter((c) => c.id !== itemId);
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('futsalhub_cart_changed'));
};

export const removeMultipleFromCart = (itemIds: string[]): void => {
  if (typeof window === 'undefined') return;
  const current = getCartItems();
  const updated = current.filter((c) => !itemIds.includes(c.id));
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('futsalhub_cart_changed'));
};

export const clearCart = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_STORAGE_KEY);
  window.dispatchEvent(new Event('futsalhub_cart_changed'));
};

// Cek apakah slot sedang ada di keranjang untuk lapangan & tanggal tertentu
export const getCartSlotsForDate = (lapanganId: number, tanggal: string): string[] => {
  const cart = getCartItems();
  const matched = cart.filter((c) => c.lapanganId === lapanganId && c.tanggal === tanggal);
  const slots: string[] = [];
  matched.forEach((c) => {
    c.slots.forEach((s) => slots.push(s.jam));
  });
  return slots;
};

// --- FUNGSI PEMERIKSAAN KADALUARSA 10 MENIT ---
export const checkAndExpireBookings = (): BookingRecord[] => {
  if (typeof window === 'undefined') return DEFAULT_INITIAL_BOOKINGS;
  const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
  if (!raw) return DEFAULT_INITIAL_BOOKINGS;
  try {
    const list: BookingRecord[] = JSON.parse(raw);
    const now = Date.now();
    let hasChanges = false;

    const updated = list.map((b) => {
      // Jika status masih menunggu_pembayaran dan sudah melewati batas expiresAt, ubah ke 'kadaluarsa'
      if (b.status === 'menunggu_pembayaran' && b.expiresAt) {
        const expTime = new Date(b.expiresAt).getTime();
        if (expTime <= now) {
          hasChanges = true;
          return {
            ...b,
            status: 'kadaluarsa' as const,
          };
        }
      }
      return b;
    });

    if (hasChanges) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('futsalhub_bookings_changed'));
    }
    return updated;
  } catch {
    return DEFAULT_INITIAL_BOOKINGS;
  }
};

// --- FUNGSI BOOKING STORE ---
export const getAllBookings = (): BookingRecord[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify([]));
    return [];
  }
  try {
    const list: BookingRecord[] = JSON.parse(raw);
    // Filter otomatis: hapus data dummy bawaan seperti FH-8832 dan nama fiktif agar jadwal lapangan bersih dan tersedia
    const cleaned = list.filter((b) => 
      !['Rian Pratama', 'Dimas Anggara', 'Fajar Kurnia'].includes(b.namaPenyewa) &&
      b.id !== 'FH-8832'
    );
    if (cleaned.length !== list.length) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(cleaned));
      return cleaned;
    }
    return list;
  } catch {
    return [];
  }
};

export const createBooking = (newBooking: BookingRecord): void => {
  if (typeof window === 'undefined') return;
  const current = getAllBookings();
  const updated = [newBooking, ...current];
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('futsalhub_bookings_changed'));
};

export const updateBookingStatus = (
  bookingId: string, 
  newStatus: BookingRecord['status'],
  extra?: Partial<BookingRecord>
): void => {
  if (typeof window === 'undefined') return;
  const current = getAllBookings();
  const updated = current.map((b) => {
    if (b.id === bookingId) {
      return { ...b, status: newStatus, ...(extra || {}) };
    }
    return b;
  });
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('futsalhub_bookings_changed'));
};

export const cancelBooking = (bookingId: string): void => {
  updateBookingStatus(bookingId, 'dibatalkan');
};

// Hapus satu riwayat pesanan KHUSUS untuk tampilan User/Pelanggan (Jadwal lapangan & Admin TIDAK di-reset)
export const hideBookingForUser = (bookingId: string): void => {
  if (typeof window === 'undefined') return;
  const current = getAllBookings();
  const updated = current.map((b) => (b.id === bookingId ? { ...b, hiddenFromUser: true } : b));
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('futsalhub_bookings_changed'));
};

// Hapus SEMUA riwayat pesanan KHUSUS untuk tampilan User/Pelanggan (Jadwal lapangan & Admin TIDAK di-reset)
export const clearUserBookingHistory = (userIdentifier: string): void => {
  if (typeof window === 'undefined') return;
  const current = getAllBookings();
  const lowerId = (userIdentifier || '').toLowerCase();
  const updated = current.map((b) => {
    const matchEmail = b.email && lowerId && b.email.toLowerCase() === lowerId;
    const matchHp = b.noHp && lowerId && (b.noHp.includes(lowerId) || lowerId.includes(b.noHp));
    const matchNama = b.namaPenyewa && lowerId && (b.namaPenyewa.toLowerCase().includes(lowerId) || lowerId.includes(b.namaPenyewa.toLowerCase()));
    if (matchEmail || matchHp || matchNama) {
      return { ...b, hiddenFromUser: true };
    }
    return b;
  });
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('futsalhub_bookings_changed'));
};

// Reset / Kosongkan semua data booking & keranjang (Global)
export const clearAllBookings = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify([]));
  localStorage.removeItem(CART_STORAGE_KEY);
  window.dispatchEvent(new Event('futsalhub_bookings_changed'));
  window.dispatchEvent(new Event('futsalhub_cart_changed'));
};

// Proses Refund jika Admin menolak pesanan yang sudah ditransfer
export const processRefundBooking = (
  bookingId: string,
  refundNominal: number,
  refundCatatan: string
): void => {
  if (typeof window === 'undefined') return;
  const current = getAllBookings();
  const updated = current.map((b) => {
    if (b.id === bookingId) {
      return {
        ...b,
        status: 'ditolak' as const,
        refundStatus: 'selesai_refund' as const,
        refundNominal,
        refundCatatan: refundCatatan || 'Dana dikembalikan 100% oleh Admin Kasir.',
        refundAt: new Date().toISOString(),
      };
    }
    return b;
  });
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('futsalhub_bookings_changed'));
};

export interface SlotLiveStatus {
  jam: string;
  status: 'tersedia' | 'di_keranjang' | 'locked_10min' | 'terisi';
  booking?: BookingRecord;
  expiresInSeconds?: number;
}

// Cek status detail setiap slot untuk visual papan monitoring & jadwal
export const getSlotLiveDetailsForCourt = (lapanganId: number, tanggal: string): Record<string, SlotLiveStatus> => {
  const all = getAllBookings();
  const cartSlots = getCartSlotsForDate(lapanganId, tanggal);
  const now = Date.now();
  const result: Record<string, SlotLiveStatus> = {};

  // Cek booking aktif untuk lapangan & tanggal ini
  const relevantBookings = all.filter(
    (b) => b.lapanganId === lapanganId && b.tanggal === tanggal
  );

  relevantBookings.forEach((b) => {
    b.slots.forEach((s) => {
      if (b.status === 'confirmed' || b.status === 'menunggu_verifikasi' || b.status === 'selesai') {
        result[s.jam] = {
          jam: s.jam,
          status: 'terisi',
          booking: b,
        };
      } else if (b.status === 'menunggu_pembayaran' && b.expiresAt) {
        const expTime = new Date(b.expiresAt).getTime();
        if (expTime > now) {
          result[s.jam] = {
            jam: s.jam,
            status: 'locked_10min',
            booking: b,
            expiresInSeconds: Math.max(0, Math.floor((expTime - now) / 1000)),
          };
        }
      }
    });
  });

  return result;
};

// Slot yang saat ini mengunci jadwal (termasuk hold 10 menit aktif)
export const getBookedSlotsForDate = (lapanganId: number, tanggal: string): string[] => {
  const all = getAllBookings();
  const now = Date.now();

  const matched = all.filter((b) => {
    if (b.lapanganId !== lapanganId || b.tanggal !== tanggal) return false;
    if (b.status === 'confirmed' || b.status === 'menunggu_verifikasi' || b.status === 'selesai') {
      return true;
    }
    // Kunci selama 10 menit jika status menunggu_pembayaran dan belum kadaluarsa
    if (b.status === 'menunggu_pembayaran' && b.expiresAt) {
      return new Date(b.expiresAt).getTime() > now;
    }
    return false;
  });

  const bookedSlots: string[] = [];
  matched.forEach((b) => {
    b.slots.forEach((s) => {
      if (!bookedSlots.includes(s.jam)) {
        bookedSlots.push(s.jam);
      }
    });
  });
  return bookedSlots;
};

// Format Rupiah helper (deterministik tanpa hydration mismatch antar server & client)
export const formatRupiah = (val: number): string => {
  if (isNaN(val) || val === null || val === undefined) return 'Rp 0';
  const formatted = Math.round(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted}`;
};
