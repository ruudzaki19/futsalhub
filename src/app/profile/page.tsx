// src/app/profile/page.tsx
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Camera, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Save, 
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Printer,
  X,
  FileText,
  CreditCard,
  Trash2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getStoredUser, setStoredUser, UserSession } from '../../data/authStore';
import { 
  getAllBookings, 
  formatRupiah, 
  BookingRecord,
  cancelBooking,
  checkAndExpireBookings,
  hideBookingForUser,
  clearUserBookingHistory
} from '../../data/bookingStore';
import PaymentInstructionModal from '../components/PaymentInstructionModal';

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [session, setSession] = useState<UserSession | null>(null);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [noHp, setNoHp] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Data Riwayat Booking Pelanggan
  const [allBookings, setAllBookings] = useState<BookingRecord[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<BookingRecord | null>(null);
  const [payModalBooking, setPayModalBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setSession(user);
    setNama(user.nama);
    setEmail(user.email);
    setNoHp(user.noHp);
    setAvatarPreview(user.avatarUrl);

    // Ambil data bookings
    setAllBookings(getAllBookings());
  }, [router]);

  // Listen to bookings update & real-time countdown
  useEffect(() => {
    const handleUpdate = () => setAllBookings(getAllBookings());
    window.addEventListener('futsalhub_bookings_changed', handleUpdate);

    const interval = setInterval(() => {
      checkAndExpireBookings();
      setAllBookings(getAllBookings());
    }, 2000);

    return () => {
      window.removeEventListener('futsalhub_bookings_changed', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  // Filter booking milik akun yang sedang login (Ruud Zaki atau lainnya)
  const myBookings = useMemo(() => {
    if (!session) return [];
    return allBookings.filter((b) => {
      if (b.hiddenFromUser) return false;
      const matchEmail = b.email && session.email && b.email.toLowerCase() === session.email.toLowerCase();
      const matchHp = b.noHp && session.noHp && (b.noHp.includes(session.noHp) || session.noHp.includes(b.noHp));
      const matchNama = b.namaPenyewa && session.nama && (
        b.namaPenyewa.toLowerCase().includes(session.nama.toLowerCase()) ||
        session.nama.toLowerCase().includes(b.namaPenyewa.toLowerCase())
      );
      return matchEmail || matchHp || matchNama;
    });
  }, [allBookings, session]);

  // Handler Upload Ganti Foto Profil Langsung dari Komputer
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAvatarPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setIsSaving(true);
    setTimeout(() => {
      const updated: UserSession = {
        ...session,
        nama,
        email,
        noHp,
        avatarUrl: avatarPreview,
      };

      setStoredUser(updated);
      setSession(updated);
      setIsSaving(false);
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 3000);
    }, 400);
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#121417] text-stone-900 dark:text-[#F3F4F6] font-sans selection:bg-emerald-200 dark:selection:bg-emerald-900 flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10 w-full flex-1">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        {/* SECTION 1: RIWAYAT & STATUS BOOKING (JAWABAN PERTANYAAN USER) */}
        <div id="riwayat" className="bg-white dark:bg-[#1A1D23] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 mb-2">
                <Calendar className="w-3.5 h-3.5" />
                Status Reservasi Real-Time
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                Riwayat & Status Booking Lapangan Anda
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Pantau verifikasi jadwal yang telah Anda pesan. Status akan otomatis berubah setelah admin menyetujuinya di meja kasir.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <span className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300">
                Total: {myBookings.length} Pesanan
              </span>

              {myBookings.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Apakah Anda ingin menghapus semua riwayat booking dari tampilan akun Anda? (Jadwal lapangan & data admin kasir tetap tersimpan aman).')) {
                      clearUserBookingHistory(session.email || session.noHp || session.nama);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-300 text-xs font-bold border border-red-200 dark:border-red-800 transition-all cursor-pointer"
                  title="Hapus riwayat booking dari akun saya"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Riwayat Saya</span>
                </button>
              )}
            </div>
          </div>

          {/* List Kartu Booking */}
          {myBookings.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Anda belum memiliki pesanan jadwal lapangan.
              </p>
              <button
                type="button"
                onClick={() => router.push('/jadwal')}
                className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer"
              >
                Pilih Lapangan & Booking Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 sm:p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-4 transition-all hover:border-emerald-500/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/60 dark:border-stone-700">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-sm text-stone-900 dark:text-white">
                        #{b.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold">
                        {b.lapanganNama}
                      </span>
                    </div>

                    {/* STATUS VERIFIKASI ADMIN */}
                    <div>
                      {b.status === 'confirmed' ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black border border-emerald-300 dark:border-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Terkonfirmasi (Disetujui Admin)</span>
                        </div>
                      ) : b.status === 'selesai' ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-black border border-blue-300 dark:border-blue-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Lunas Kasir & Selesai Main</span>
                        </div>
                      ) : b.status === 'ditolak' ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 text-xs font-black border border-red-300 dark:border-red-700">
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          <span>{b.refundStatus === 'selesai_refund' ? 'Ditolak & Refund Selesai' : 'Pesanan Ditolak'}</span>
                        </div>
                      ) : b.status === 'dibatalkan' ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-black border border-stone-200 dark:border-stone-700">
                          <XCircle className="w-3.5 h-3.5 text-stone-400" />
                          <span>Dibatalkan oleh Anda</span>
                        </div>
                      ) : b.status === 'kadaluarsa' ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-xs font-bold border border-stone-300 dark:border-stone-700">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>Kadaluarsa (Batas 10 Mnt Habis)</span>
                        </div>
                      ) : b.status === 'menunggu_pembayaran' ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-xs font-black border border-amber-300 dark:border-amber-700 animate-pulse">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>
                            Menunggu Pembayaran {b.expiresAt ? `(${Math.max(0, Math.floor((new Date(b.expiresAt).getTime() - Date.now()) / 1000))}s)` : ''}
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-black border border-blue-200 dark:border-blue-800">
                          <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                          <span>Menunggu Konfirmasi Admin</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rincian Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[11px]">Tanggal & Waktu Main:</span>
                      <strong className="text-stone-800 dark:text-stone-200">
                        {b.tanggalLabel}
                      </strong>
                      <div className="text-stone-600 dark:text-stone-400 mt-0.5">
                        {b.slots.map((s) => s.jam).join(', ')} ({b.slots.length} Jam)
                      </div>
                    </div>

                    <div>
                      <span className="text-stone-400 block text-[11px]">Skema & Metode Bayar:</span>
                      <strong className="text-stone-800 dark:text-stone-200 uppercase font-mono">
                        {b.metodePembayaran} • {b.tipePembayaran === 'lunas' ? 'Tagihan Penuh (100%)' : 'DP 50%'}
                      </strong>
                      <div className="text-stone-600 dark:text-stone-400 mt-0.5">
                        Total Tagihan: <strong className="text-emerald-700 dark:text-emerald-400">{formatRupiah(b.nominalDibayar)}</strong>
                      </div>
                      {b.sisaPelunasan > 0 && b.status !== 'selesai' && (
                        <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold block">
                          Sisa Pelunasan di Kasir: {formatRupiah(b.sisaPelunasan)}
                        </span>
                      )}
                    </div>

                    <div className="sm:text-right flex sm:flex-col justify-between sm:justify-center items-start sm:items-end gap-2">
                      <div className="flex items-center gap-2">
                        {b.status === 'menunggu_pembayaran' ? (
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:justify-end">
                            <button
                              type="button"
                              onClick={() => setPayModalBooking(b)}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Bayar Sekarang (Lanjut)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('Apakah Anda ingin membatalkan booking ini?')) {
                                  cancelBooking(b.id);
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl text-stone-400 hover:text-red-600 text-xs font-semibold cursor-pointer"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedReceipt(b)}
                            className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold text-xs hover:bg-stone-800 dark:hover:bg-stone-100 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Lihat & Cetak E-Receipt</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus pesanan #${b.id} dari riwayat akun Anda?`)) {
                              hideBookingForUser(b.id);
                            }
                          }}
                          className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          title="Hapus dari riwayat akun saya"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Keterangan Status */}
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-700/60 text-[11px] text-stone-600 dark:text-stone-400">
                    {b.status === 'confirmed' ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        ✓ Jadwal Anda sudah diverifikasi dan disetujui kasir. Tunjukkan kode booking <strong>#{b.id}</strong> di meja resepsionis saat tiba di venue.
                      </span>
                    ) : b.status === 'menunggu_pembayaran' ? (
                      <span className="text-amber-800 dark:text-amber-300 font-semibold flex items-center justify-between flex-wrap gap-2">
                        <span>⏱ Jadwal terkunci 10 menit khusus untuk Anda. Selesaikan pembayaran sebelum batas waktu habis agar slot tidak dilepas ke pelanggan lain.</span>
                        <button
                          type="button"
                          onClick={() => setPayModalBooking(b)}
                          className="underline text-emerald-700 dark:text-emerald-400 font-bold hover:text-emerald-800 cursor-pointer"
                        >
                          Buka Instruksi Bayar →
                        </button>
                      </span>
                    ) : b.status === 'menunggu_verifikasi' ? (
                      <span className="text-blue-700 dark:text-blue-300 font-semibold">
                        ⏳ Staf kasir kami sedang mencocokkan mutasi pembayaran Anda. Status akan otomatis berubah menjadi "Terkonfirmasi" setelah diverifikasi.
                      </span>
                    ) : b.status === 'selesai' ? (
                      <span className="text-stone-700 dark:text-stone-300 font-semibold">
                        ✓ Sesi bermain telah selesai. Terima kasih telah mempercayakan jadwal bermain tim Anda bersama FutsalHub Arena!
                      </span>
                    ) : b.status === 'kadaluarsa' ? (
                      <span className="text-stone-500 font-semibold">
                        ✕ Batas waktu pembayaran 10 menit telah habis. Slot jadwal telah otomatis dilepas kembali ke kalender ketersediaan.
                      </span>
                    ) : b.status === 'ditolak' ? (
                      <div className="space-y-1">
                        <span className="text-red-700 dark:text-red-400 font-bold block">
                          ✕ Pesanan ditolak oleh Admin Kasir.
                        </span>
                        {b.refundStatus === 'selesai_refund' ? (
                          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-medium">
                            💰 <strong>Pengembalian Dana (Refund) Telah Berhasil:</strong> Nominal {formatRupiah(b.refundNominal || b.nominalDibayar)} telah ditransfer kembali via {b.metodePembayaran.toUpperCase()}. Catatan: <em>{b.refundCatatan || 'Dana 100% dikembalikan.'}</em>
                          </div>
                        ) : (
                          <span className="text-stone-500">
                            Tidak ada pembayaran yang didebit atau jadwal dibatalkan sebelum transfer.
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-stone-500 font-semibold">
                        ✕ Jadwal ini telah Anda batalkan.
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: PENGATURAN AKUN & PROFIL */}
        <div className="bg-white dark:bg-[#1A1D23] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          <div className="border-b border-stone-100 dark:border-stone-800 pb-6">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
              Pengaturan Profil Akun
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Kelola informasi identitas, foto profil, dan kredensial penyewaan Anda.
            </p>
          </div>

          {saveSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 font-bold">
              ✓ Profil dan foto berhasil diperbarui!
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-8">
            
            {/* Bagian Ganti Foto Profil */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-stone-100 dark:border-stone-800">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-700 bg-stone-100 dark:bg-stone-800 shadow-md">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Foto Profil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-stone-400 m-auto mt-6" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1.5 right-1.5 p-1.5 bg-emerald-700 text-white rounded-lg shadow hover:bg-emerald-800 transition-colors cursor-pointer"
                  title="Ganti Foto Profil"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">Foto Profil Akun</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs">
                  Format gambar JPG, PNG, atau WebP. Foto ini akan muncul di bar navigasi atas.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Pilih Berkas Dari Komputer
                </button>
              </div>
            </div>

            {/* Input Data Diri */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Nama Lengkap / Tim
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-white outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Hak Akses / Peran
                </label>
                <div className="relative flex items-center">
                  <Shield className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={session.role.toUpperCase()}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-100 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Alamat Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-white outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Nomor WhatsApp
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-white outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Tombol Simpan Perubahan */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isSaving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 text-white" />
                    <span>Simpan Perubahan Akun</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </main>

      {/* MODAL E-RECEIPT UNTUK PELANGGAN */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto p-6 sm:p-8 space-y-6 text-stone-900">
            
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Bukti E-Receipt Resmi FutsalHub
              </span>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Box Struk */}
            <div className="p-6 bg-white border border-stone-300 rounded-2xl font-mono text-xs space-y-4 shadow-xs">
              <div className="text-center space-y-1 border-b-2 border-dashed border-stone-300 pb-4">
                <h3 className="text-base font-black tracking-tight text-stone-900">
                  FUTSALHUB ARENA - TANGERANG SELATAN
                </h3>
                <p className="text-[10px] text-stone-500">
                  E-Receipt Tanda Bukti Pemesanan Lapangan Resmi
                </p>
              </div>

              <div className="space-y-1 text-[11px] border-b border-stone-200 pb-3">
                <div className="flex justify-between">
                  <span>ID Booking:</span>
                  <span className="font-bold">#{selectedReceipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-bold uppercase ${selectedReceipt.status === 'confirmed' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {selectedReceipt.status === 'confirmed' ? 'TERKONFIRMASI ADMIN' : 'MENUNGGU VERIFIKASI'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Nama Pemesan:</span>
                  <span className="font-bold">{selectedReceipt.namaPenyewa}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kontak:</span>
                  <span>{selectedReceipt.noHp}</span>
                </div>
              </div>

              <div className="space-y-1 text-[11px] border-b border-stone-200 pb-3">
                <div className="flex justify-between">
                  <span>Venue:</span>
                  <span className="font-bold">{selectedReceipt.lapanganNama}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal Main:</span>
                  <span className="font-bold">{selectedReceipt.tanggalLabel}</span>
                </div>
                <div className="pt-1">
                  <span className="text-stone-500 block text-[10px]">Slot Jam:</span>
                  {selectedReceipt.slots.map((s) => (
                    <div key={s.jam} className="flex justify-between pl-2">
                      <span>• {s.jam}</span>
                      <span>{formatRupiah(s.harga)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1 text-[11px] border-b-2 border-dashed border-stone-300 pb-3">
                <div className="flex justify-between font-bold text-sm text-stone-900">
                  <span>TOTAL BIAYA:</span>
                  <span>{formatRupiah(selectedReceipt.totalAkhir)}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>DIBAYAR ({selectedReceipt.tipePembayaran.toUpperCase()}):</span>
                  <span>{formatRupiah(selectedReceipt.nominalDibayar)}</span>
                </div>
                {selectedReceipt.sisaPelunasan > 0 && (
                  <div className="flex justify-between text-amber-800 font-bold">
                    <span>SISA DI KASIR:</span>
                    <span>{formatRupiah(selectedReceipt.sisaPelunasan)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-500 pt-1">
                  <span>Metode:</span>
                  <span className="uppercase">{selectedReceipt.metodePembayaran} ({selectedReceipt.kodeBayar})</span>
                </div>
              </div>

              <div className="text-center space-y-1 pt-1 text-[10px] text-stone-500">
                <p className="font-bold text-stone-800">
                  Tunjukkan E-Receipt ini di meja resepsionis saat kedatangan.
                </p>
                <p>Terima kasih atas kunjungan Anda!</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* POPUP INSTRUKSI PEMBAYARAN RESMI DENGAN DESAIN 100% SAMA */}
      <PaymentInstructionModal
        isOpen={!!payModalBooking}
        booking={payModalBooking}
        onClose={() => setPayModalBooking(null)}
        onPaymentConfirmed={() => {
          setAllBookings(getAllBookings());
          setPayModalBooking(null);
        }}
      />

      <Footer />
    </div>
  );
}
