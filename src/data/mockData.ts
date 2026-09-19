// src/data/mockData.ts

export interface Lapangan {
  id: number;
  nama: string;
  tipe: 'Vinyl' | 'Rumput Sintetis';
  harga: number;
}

export interface SlotWaktu {
  id: number;
  lapanganId: number;
  tanggal: string; // YYYY-MM-DD
  jamMulai: string; // contoh: "18:00"
  jamSelesai: string; // contoh: "19:00"
  status: 'kosong' | 'terkunci' | 'terisi'; // sesuai aturan UC-02 di dokumen APSI
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

// 1. Data Lapangan
export const dummyLapangan: Lapangan[] = [
  { id: 1, nama: 'Lapangan A (Vinyl)', tipe: 'Vinyl', harga: 150000 },
  { id: 2, nama: 'Lapangan B (Sintetis)', tipe: 'Rumput Sintetis', harga: 170000 },
];

// 2. Data Slot Jadwal Hari Ini
export const dummySlots: SlotWaktu[] = [
  { id: 101, lapanganId: 1, tanggal: '2026-09-19', jamMulai: '15:00', jamSelesai: '16:00', status: 'terisi', tarif: 150000 },
  { id: 102, lapanganId: 1, tanggal: '2026-09-19', jamMulai: '16:00', jamSelesai: '17:00', status: 'terisi', tarif: 150000 },
  { id: 103, lapanganId: 1, tanggal: '2026-09-19', jamMulai: '17:00', jamSelesai: '18:00', status: 'kosong', tarif: 150000 },
  { id: 104, lapanganId: 1, tanggal: '2026-09-19', jamMulai: '18:00', jamSelesai: '19:00', status: 'terkunci', tarif: 150000 },
  { id: 105, lapanganId: 1, tanggal: '2026-09-19', jamMulai: '19:00', jamSelesai: '20:00', status: 'kosong', tarif: 150000 },
  { id: 106, lapanganId: 1, tanggal: '2026-09-19', jamMulai: '20:00', jamSelesai: '21:00', status: 'kosong', tarif: 150000 },
  { id: 107, lapanganId: 1, tanggal: '2026-09-19', jamMulai: '21:00', jamSelesai: '22:00', status: 'kosong', tarif: 150000 },
  { id: 108, lapanganId: 1, tanggal: '2026-09-19', jamMulai: '22:00', jamSelesai: '23:00', status: 'kosong', tarif: 150000 },
];

// 3. Data Antrean Verifikasi untuk Admin (UC-04)
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
    lapanganId: 1,
    slotId: 104,
    totalBayar: 150000,
    status: 'menunggu_verifikasi',
    buktiTransferUrl: 'https://placehold.co/400x600/png?text=Bukti+Transfer+BCA',
    createdAt: '2026-09-19 17:45',
  },
];