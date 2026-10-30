// src/data/mockData.ts

export interface Lapangan {
  id: number;
  nama: string;
  nomor: number;
  tipe: string;
  harga: number;
}

export interface SlotWaktu {
  id: number;
  lapanganId: number;
  tanggal: string; // YYYY-MM-DD
  jamMulai: string; // contoh: "18:00"
  jamSelesai: string; // contoh: "19:00"
  status: 'kosong' | 'terkunci' | 'terisi';
  tarif: number;
}

export interface Booking {
  id: number;
  kodeBooking: string;
  namaTim: string;
  noHp: string;
  lapanganId: number;
  slotId: number;
  totalBayar: number;
  status: 'menunggu_verifikasi' | 'confirmed' | 'ditolak';
  buktiTransferUrl?: string;
  createdAt: string;
}

// 1. Data 3 Lapangan (Semua jenis sama: Vinyl Interlock Standar Resmi Turnamen)
export const dummyLapangan: Lapangan[] = [
  { id: 1, nomor: 1, nama: 'Lapangan 1', tipe: 'Vinyl Interlock Resmi', harga: 150000 },
  { id: 2, nomor: 2, nama: 'Lapangan 2', tipe: 'Vinyl Interlock Resmi', harga: 150000 },
  { id: 3, nomor: 3, nama: 'Lapangan 3', tipe: 'Vinyl Interlock Resmi', harga: 150000 },
];

// 2. Data Slot Jadwal Hari Ini
export const dummySlots: SlotWaktu[] = [
  // Lapangan 1
  { id: 101, lapanganId: 1, tanggal: '2026-09-19', jamMulai: '15:00', jamSelesai: '16:00', status: 'terisi', tarif: 150000 },
  { id: 102, lapanganId: 1, tanggal: '2026-09-19', jamMulai: '16:00', jamSelesai: '17:00', status: 'terisi', tarif: 150000 },
  { id: 103, lapanganId: 1, tanggal: '2026-09-19', jamMulai: '17:00', jamSelesai: '18:00', status: 'kosong', tarif: 170000 },
  { id: 104, lapanganId: 1, tanggal: '2026-09-19', jamMulai: '18:00', jamSelesai: '19:00', status: 'terkunci', tarif: 170000 },
  { id: 105, lapanganId: 1, tanggal: '2026-09-19', jamMulai: '19:00', jamSelesai: '20:00', status: 'kosong', tarif: 170000 },
  { id: 106, lapanganId: 1, tanggal: '2026-09-19', jamMulai: '20:00', jamSelesai: '21:00', status: 'terisi', tarif: 170000 },
  { id: 107, lapanganId: 1, tanggal: '2026-09-19', jamMulai: '21:00', jamSelesai: '22:00', status: 'kosong', tarif: 170000 },

  // Lapangan 2
  { id: 201, lapanganId: 2, tanggal: '2026-09-19', jamMulai: '15:00', jamSelesai: '16:00', status: 'kosong', tarif: 150000 },
  { id: 202, lapanganId: 2, tanggal: '2026-09-19', jamMulai: '16:00', jamSelesai: '17:00', status: 'kosong', tarif: 150000 },
  { id: 203, lapanganId: 2, tanggal: '2026-09-19', jamMulai: '17:00', jamSelesai: '18:00', status: 'terisi', tarif: 170000 },
  { id: 204, lapanganId: 2, tanggal: '2026-09-19', jamMulai: '18:00', jamSelesai: '19:00', status: 'kosong', tarif: 170000 },
  { id: 205, lapanganId: 2, tanggal: '2026-09-19', jamMulai: '19:00', jamSelesai: '20:00', status: 'terkunci', tarif: 170000 },

  // Lapangan 3
  { id: 301, lapanganId: 3, tanggal: '2026-09-19', jamMulai: '15:00', jamSelesai: '16:00', status: 'kosong', tarif: 150000 },
  { id: 302, lapanganId: 3, tanggal: '2026-09-19', jamMulai: '16:00', jamSelesai: '17:00', status: 'kosong', tarif: 150000 },
  { id: 303, lapanganId: 3, tanggal: '2026-09-19', jamMulai: '17:00', jamSelesai: '18:00', status: 'kosong', tarif: 170000 },
  { id: 304, lapanganId: 3, tanggal: '2026-09-19', jamMulai: '18:00', jamSelesai: '19:00', status: 'terisi', tarif: 170000 },
  { id: 305, lapanganId: 3, tanggal: '2026-09-19', jamMulai: '19:00', jamSelesai: '20:00', status: 'kosong', tarif: 170000 },
];

// 3. Data Antrean Verifikasi untuk Admin
export const dummyBookings: Booking[] = [
  {
    id: 1,
    kodeBooking: 'FUT-20260919-01',
    namaTim: 'Garuda FC',
    noHp: '081234567890',
    lapanganId: 1,
    slotId: 101,
    totalBayar: 150000,
    status: 'confirmed',
    createdAt: '2026-09-19 14:10',
  },
  {
    id: 2,
    kodeBooking: 'FUT-20260919-02',
    namaTim: 'Bintang Muda FC',
    noHp: '089876543210',
    lapanganId: 2,
    slotId: 205,
    totalBayar: 170000,
    status: 'menunggu_verifikasi',
    buktiTransferUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
    createdAt: '2026-09-19 17:45',
  },
  {
    id: 3,
    kodeBooking: 'FUT-20260919-03',
    namaTim: 'Spartan FC',
    noHp: '081289123001',
    lapanganId: 3,
    slotId: 304,
    totalBayar: 170000,
    status: 'menunggu_verifikasi',
    buktiTransferUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=500&auto=format&fit=crop&q=80',
    createdAt: '2026-09-19 18:15',
  },
];
