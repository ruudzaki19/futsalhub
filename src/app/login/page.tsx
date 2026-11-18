// src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, X, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FutsalEmblem from '../components/FutsalEmblem';
import Badge from '../components/ui/Badge';
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
  const [errorMsg, setErrorMsg] = useState<{ title: string; desc: string; notRegistered?: boolean } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showNotRegisteredModal, setShowNotRegisteredModal] = useState(false);

  // Handler Submit Login dengan Validasi
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      setErrorMsg(null);

      if (!cleanEmail || !cleanPass) {
        setErrorMsg({
          title: 'Email & Kata Sandi Wajib Diisi',
          desc: 'Silakan masukkan alamat email dan kata sandi akun Anda.',
        });
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
        setErrorMsg({
          title: 'Akun Belum Terdaftar!',
          desc: `Email "${cleanEmail}" belum terdaftar di sistem FutsalHub. Silakan periksa kembali email Anda atau klik tombol di bawah untuk mendaftar akun baru.`,
          notRegistered: true,
        });
        setShowNotRegisteredModal(true);
        return;
      }

      // KASUS 2: Password salah
      if (matchedUser.passwordHash !== cleanPass) {
        setErrorMsg({
          title: 'Kata Sandi Salah',
          desc: 'Kata sandi yang Anda masukkan tidak sesuai. Silakan periksa kembali kata sandi akun Anda.',
        });
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
    }, 600);
  };

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-ink text-brand-ink dark:text-stone-100 font-sora flex flex-col justify-between selection:bg-brand-lime selection:text-brand-navy transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full flex items-center justify-center">
        {/* Dua Kolom: Kiri Foto Real + Teks Condensed Besar, Kanan Form Bersih */}
        <div className="w-full grid lg:grid-cols-12 rounded-3xl overflow-hidden border-[1.5px] border-brand-line dark:border-white/10 shadow-hard-navy-lg bg-white dark:bg-brand-navy/30">
          
          {/* Kolom Kiri: Foto Futsal Real + Teks Condensed Besar */}
          <div className="lg:col-span-6 relative hidden lg:flex flex-col justify-between p-10 bg-brand-navy text-white overflow-hidden min-h-[600px]">
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
              <Badge variant="lime">Portal Masuk</Badge>
            </div>

            <div className="relative z-10 space-y-4 my-auto">
              <span className="font-bebas text-brand-lime text-xl tracking-wider uppercase block">
                Sistem Reservasi 24/7
              </span>
              <h2 className="font-bebas text-6xl text-white uppercase tracking-tight leading-[0.92]">
                SIAP TANDING. <br />
                KUNCI SLOT TIM ANDA.
              </h2>
              <p className="font-sora text-sm text-stone-200 max-w-md leading-relaxed">
                Akses akun kapten tim atau staf operasional arena untuk reservasi slot lapangan, cek bukti e-receipt, dan pantau status jadwal secara live.
              </p>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-stone-300">
              <span>3 Lapangan Interlock FIFA</span>
              <span className="font-mono text-brand-lime">Auto-Lock 15 Menit Aktif</span>
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

              {/* Pemberitahuan Error / Akun Belum Terdaftar */}
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border-[1.5px] border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs flex items-start gap-3 shadow-xs">
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1.5 flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <strong className="block font-bold text-rose-900 dark:text-rose-200 text-sm">
                        {errorMsg.title}
                      </strong>
                      <button
                        type="button"
                        onClick={() => setErrorMsg(null)}
                        className="text-rose-400 hover:text-rose-700 transition-colors cursor-pointer p-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-xs">
                      {errorMsg.desc}
                    </p>
                    {errorMsg.notRegistered && (
                      <div className="pt-2">
                        <Link
                          href="/register"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer font-bebas tracking-wider uppercase"
                        >
                          <span>Daftar / Registrasi Akun Baru</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

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
                        if (errorMsg) setErrorMsg(null); 
                      }}
                      placeholder="nama@email.com"
                      required
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm text-brand-ink dark:text-white bg-white dark:bg-brand-navy/50 border-[1.5px] focus:outline-none transition-all ${
                        errorMsg?.notRegistered 
                          ? 'border-rose-500 ring-2 ring-rose-500/20' 
                          : 'border-brand-line dark:border-white/10 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'
                      }`}
                    />
                  </div>
                  {errorMsg?.notRegistered && (
                    <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1.5 pt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Akun belum terdaftar! Silakan registrasi terlebih dahulu.</span>
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
                        if (errorMsg) setErrorMsg(null); 
                      }}
                      placeholder="Masukkan sandi akun"
                      required
                      className={`w-full pl-10 pr-11 py-3 rounded-xl text-sm text-brand-ink dark:text-white bg-white dark:bg-brand-navy/50 border-[1.5px] focus:outline-none transition-all ${
                        errorMsg?.title === 'Kata Sandi Salah' 
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
                  {errorMsg?.title === 'Kata Sandi Salah' && (
                    <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1.5 pt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Kata sandi salah! Silakan periksa kembali kata sandi akun Anda.</span>
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
                    <>
                      <span>Masuk ke Akun</span>
                      <ArrowRight className="w-5 h-5 ml-1" />
                    </>
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

      {/* POP-UP MODAL PEMBERITAHUAN AKUN BELUM TERDAFTAR */}
      {showNotRegisteredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-brand-navy rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5 shadow-hard-navy-lg border-[1.5px] border-brand-line dark:border-white/10">
            <div className="w-14 h-14 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bebas text-2xl text-brand-ink dark:text-white uppercase tracking-tight">
                Akun Belum Terdaftar!
              </h3>
              <p className="text-xs text-brand-dim dark:text-stone-300 leading-relaxed">
                Email <strong className="text-brand-ink dark:text-white font-bold font-mono">"{email}"</strong> belum terdaftar di sistem FutsalHub.
              </p>
              <p className="text-xs text-rose-700 dark:text-rose-300 font-bold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl p-2.5 mt-2">
                Silakan registrasi akun tim baru terlebih dahulu sebelum login.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <Link
                href="/register"
                className="w-full inline-block"
              >
                <Button variant="primary" className="w-full font-bebas text-lg tracking-wider uppercase shadow-hard-navy">
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => setShowNotRegisteredModal(false)}
                className="w-full py-2 text-xs font-semibold text-brand-dim dark:text-stone-400 hover:text-brand-ink dark:hover:text-white cursor-pointer"
              >
                Coba Email Lain
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
