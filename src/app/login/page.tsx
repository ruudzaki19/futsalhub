// src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FutsalEmblem from '../components/FutsalEmblem';
import { 
  getRegisteredUsers, 
  setStoredUser, 
  resetCustomUsers, 
  UserSession 
} from '../../data/authStore';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handler Submit Login dengan Validasi
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      if (!cleanEmail || !cleanPass) {
        toast.error('Email dan kata sandi wajib diisi!');
        return;
      }

      // Ambil seluruh user terdaftar
      const allRegistered = getRegisteredUsers();

      // Cari user berdasarkan email
      const matchedUser = allRegistered.find(
        (u) => u.email.toLowerCase() === cleanEmail
      );

      // KASUS 1: Email belum pernah didaftarkan
      if (!matchedUser) {
        toast.error('Akun belum terdaftar! Silakan registrasi terlebih dahulu.');
        return;
      }

      // KASUS 2: Password salah
      if (matchedUser.passwordHash !== cleanPass) {
        toast.error('Kata sandi salah! Periksa kembali sandi Anda.');
        return;
      }

      // KASUS 3: Berhasil Login
      const session: UserSession = {
        id: matchedUser.id,
        nama: matchedUser.nama,
        email: matchedUser.email,
        noHp: matchedUser.noHp,
        role: matchedUser.role,
        avatarUrl: matchedUser.avatarUrl,
      };

      setStoredUser(session);
      toast.success(`Selamat datang, ${matchedUser.nama}!`);

      if (matchedUser.role === 'admin') {
        router.push('/admin');
      } else if (matchedUser.role === 'owner') {
        router.push('/owner');
      } else {
        router.push('/jadwal');
      }
    }, 600);
  };

  // Helper untuk mereset seluruh akun pelanggan uji coba
  const handleResetData = () => {
    resetCustomUsers();
    setEmail('');
    setPassword('');
    toast.info('Seluruh akun pelanggan berhasil dikosongkan. Hanya akun Owner & Admin yang tersisa.');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] -z-10" 
          style={{
            backgroundImage: `radial-gradient(#0F291E 1px, transparent 1px), linear-gradient(to right, #0F291E 1px, transparent 1px)`,
            backgroundSize: '32px 32px, 64px 64px'
          }}
        />

        <div className="w-full max-w-md">
          <div className="bg-white/90 backdrop-blur-xl border border-stone-200/90 rounded-3xl p-8 sm:p-10 shadow-xl relative">
            
            <div className="text-center space-y-2 mb-8">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-50 border border-emerald-100 mb-2">
                <FutsalEmblem className="w-8 h-8 text-emerald-800" />
              </div>
              <h1 className="text-2xl font-black text-[#0F291E] tracking-tight">
                Selamat Datang Kembali
              </h1>
              <p className="text-xs text-stone-500">
                Masuk ke akun terdaftar untuk reservasi 3 lapangan futsal.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Alamat Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-stone-50/70 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Kata Sandi
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan sandi akun"
                    required
                    className="w-full pl-10 pr-11 py-3 bg-stone-50/70 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 p-1 text-stone-400 hover:text-stone-700"
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-[#0F291E] hover:bg-[#143B2C] text-[#FDFBF7] text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Masuk ke Akun</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </>
                )}
              </button>
            </form>

            {/* Hint akun demo */}
            <div className="mt-5 p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-500 space-y-1">
              <span className="font-bold text-stone-700 block">Akun Uji Coba Tersedia:</span>
              <div className="flex justify-between">
                <span>Admin Kasir: <strong className="text-emerald-800">admin@gmail.com</strong> (123)</span>
              </div>
              <div className="flex justify-between">
                <span>Owner: <strong className="text-emerald-800">owner@gmail.com</strong> (123)</span>
              </div>
            </div>

            {/* Tautan ke Register */}
            <div className="mt-6 text-center text-xs text-stone-500">
              Belum punya akun?{' '}
              <Link
                href="/register"
                className="font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
              >
                Daftar sekarang
              </Link>
            </div>

            {/* Tombol Pembersih / Reset Data Uji Coba */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex justify-center">
              <button
                type="button"
                onClick={handleResetData}
                className="inline-flex items-center gap-1.5 text-[11px] text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                title="Hapus semua akun pelanggan yang didaftarkan secara lokal"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Kosongkan Seluruh Akun Uji Coba</span>
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

