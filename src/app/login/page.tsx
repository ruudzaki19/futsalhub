// src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FutsalEmblem from '../components/FutsalEmblem';
import Button from '../components/ui/Button';
import { 
  getRegisteredUsers, 
  setStoredUser, 
  UserSession 
} from '../../data/authStore';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Handler Submit Login dengan Validasi
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      setEmailError(null);
      setPasswordError(null);

      if (!cleanEmail) {
        setEmailError('Alamat email wajib diisi.');
        return;
      }

      if (!cleanPass) {
        setPasswordError('Kata sandi wajib diisi.');
        return;
      }

      // Ambil seluruh user terdaftar
      const allRegistered = getRegisteredUsers();

      // Cari user berdasarkan email
      const matchedUser = allRegistered.find(
        (u) => u.email.toLowerCase() === cleanEmail
      );

      // KASUS 1: Email belum pernah didaftarkan (notifikasi langsung di bawah email)
      if (!matchedUser) {
        setEmailError('Akun belum terdaftar');
        return;
      }

      // KASUS 2: Password salah (notifikasi langsung di bawah password)
      if (matchedUser.passwordHash !== cleanPass) {
        setPasswordError('Kata sandi salah');
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

      setSuccessMsg(`Selamat datang, ${matchedUser.nama}! Mengalihkan...`);
      setStoredUser(session);
      toast.success(`Selamat datang, ${matchedUser.nama}!`);

      if (matchedUser.role === 'admin') {
        router.push('/admin');
      } else if (matchedUser.role === 'owner') {
        router.push('/owner');
      } else {
        router.push('/jadwal');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-ink text-brand-ink dark:text-stone-100 font-sora flex flex-col justify-between selection:bg-brand-lime selection:text-brand-navy transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full flex items-center justify-center">
        {/* Dua Kolom: Kiri Foto Real + Teks Slogan Mengajak, Kanan Form Bersih */}
        <div className="w-full grid lg:grid-cols-12 rounded-3xl overflow-hidden border-[1.5px] border-brand-line dark:border-white/10 shadow-hard-navy-lg bg-white dark:bg-brand-navy/30">
          
          {/* Kolom Kiri: Foto Futsal Real + Teks Slogan Mengajak */}
          <div className="lg:col-span-6 relative hidden lg:flex flex-col justify-between p-10 bg-brand-navy text-white overflow-hidden min-h-[560px]">
            <div className="absolute inset-0 -z-0">
              <Image
                src="/images/login-futsal.jpg"
                alt="Futsal Player in Tunnel"
                fill
                priority
                className="object-cover opacity-65"
              />
              <div className="absolute inset-0 bg-brand-navy/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/30 to-transparent" />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FutsalEmblem className="w-8 h-8" />
                <span className="font-bebas text-2xl tracking-wider text-white">FUTSALHUB</span>
              </div>
            </div>

            <div className="relative z-10 space-y-3 my-auto">
              <h2 className="font-bebas text-5xl sm:text-6xl text-white uppercase tracking-tight leading-[0.92]">
                GABUNG SEKARANG. <br />
                <span className="text-brand-lime">AMBIL JADWAL MAIN TIM KAMU.</span>
              </h2>
              <p className="font-sora text-sm text-stone-200 max-w-md leading-relaxed">
                Pesan lapangan futsal favoritmu dengan mudah dan cepat kapan saja.
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Form Bersih */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto space-y-6">
              
              <div className="space-y-1">
                <span className="font-bebas text-brand-blue dark:text-brand-lime text-base tracking-wider uppercase block">
                  Selamat Datang Kembali
                </span>
                <h1 className="font-bebas text-4xl sm:text-5xl text-brand-ink dark:text-white uppercase tracking-tight leading-none">
                  MASUK KE AKUN
                </h1>
                <p className="font-sora text-xs text-brand-dim dark:text-stone-400">
                  Masukkan email dan kata sandi akun FutsalHub Anda.
                </p>
              </div>

              {/* Pemberitahuan Sukses */}
              {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-[1.5px] border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-3 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-xs">{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-brand-ink dark:text-stone-200 uppercase tracking-wider block">
                    Alamat Email
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-brand-dim absolute left-3.5 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { 
                        setEmail(e.target.value); 
                        if (emailError) setEmailError(null); 
                      }}
                      placeholder="nama@email.com"
                      required
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm text-brand-ink dark:text-white bg-white dark:bg-brand-navy/50 border-[1.5px] focus:outline-none transition-all ${
                        emailError 
                          ? 'border-rose-500 ring-2 ring-rose-500/20' 
                          : 'border-brand-line dark:border-white/10 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'
                      }`}
                    />
                  </div>
                  {emailError && (
                    <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 pt-1">
                      {emailError}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-brand-ink dark:text-stone-200 uppercase tracking-wider block">
                    Kata Sandi
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-brand-dim absolute left-3.5 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { 
                        setPassword(e.target.value); 
                        if (passwordError) setPasswordError(null); 
                      }}
                      placeholder="Masukkan sandi akun"
                      required
                      className={`w-full pl-10 pr-11 py-3 rounded-xl text-sm text-brand-ink dark:text-white bg-white dark:bg-brand-navy/50 border-[1.5px] focus:outline-none transition-all ${
                        passwordError 
                          ? 'border-rose-500 ring-2 ring-rose-500/20' 
                          : 'border-brand-line dark:border-white/10 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 p-1 text-brand-dim hover:text-brand-ink dark:hover:text-white cursor-pointer"
                      aria-label="Toggle password"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 pt-1">
                      {passwordError}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="primary"
                  size="lg"
                  className="w-full font-bebas text-xl tracking-wider uppercase shadow-hard-navy"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin" />
                  ) : (
                    <span>Masuk ke Akun</span>
                  )}
                </Button>
              </form>

              {/* Tautan ke Register */}
              <div className="pt-2 text-center text-xs text-brand-dim dark:text-stone-400">
                Belum punya akun?{' '}
                <Link
                  href="/register"
                  className="font-bold text-brand-blue dark:text-brand-lime hover:underline underline-offset-4"
                >
                  Daftar akun tim sekarang
                </Link>
              </div>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
