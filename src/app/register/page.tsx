// src/app/register/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FutsalEmblem from '../components/FutsalEmblem';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { saveNewUser } from '../../data/authStore';

export default function RegisterPage() {
  const router = useRouter();

  const [namaLengkap, setNamaLengkap] = useState('');
  const [email, setEmail] = useState('');
  const [noHp, setNoHp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<{ title: string; desc: string; alreadyRegistered?: boolean } | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    setErrorMsg(null);

    if (cleanPass.length < 6) {
      setErrorMsg({
        title: 'Kata Sandi Terlalu Pendek',
        desc: 'Kata sandi akun minimal harus 6 karakter untuk keamanan Anda.',
      });
      return;
    }

    if (cleanPass !== confirmPassword.trim()) {
      setErrorMsg({
        title: 'Konfirmasi Sandi Tidak Cocok',
        desc: 'Konfirmasi kata sandi tidak sama dengan kata sandi yang Anda masukkan.',
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const success = saveNewUser({
        nama: namaLengkap.trim(),
        email: cleanEmail,
        noHp: noHp.trim(),
        passwordHash: cleanPass,
        role: 'pelanggan',
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(namaLengkap)}&backgroundColor=0F291E,144734,10b981`,
      });

      if (!success) {
        setErrorMsg({
          title: 'Email Sudah Terdaftar!',
          desc: `Email "${cleanEmail}" sudah digunakan oleh akun lain. Silakan langsung masuk ke akun Anda.`,
          alreadyRegistered: true,
        });
        return;
      }

      toast.success('Pendaftaran berhasil! Silakan masuk dengan akun Anda.');
      router.push('/login');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-ink text-brand-ink dark:text-stone-100 font-sora flex flex-col justify-between selection:bg-brand-lime selection:text-brand-navy transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full flex items-center justify-center">
        {/* Dua Kolom: Kiri Foto Real + Teks Condensed Besar, Kanan Form Bersih */}
        <div className="w-full grid lg:grid-cols-12 rounded-3xl overflow-hidden border-[1.5px] border-brand-line dark:border-white/10 shadow-hard-navy-lg bg-white dark:bg-brand-navy/30">
          
          {/* Kolom Kiri: Foto Futsal Real + Teks Condensed Besar */}
          <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-10 bg-brand-navy text-white overflow-hidden min-h-[640px]">
            <div className="absolute inset-0 -z-0">
              <Image
                src="/images/login-futsal.jpg"
                alt="Futsal Team Ready"
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
              <Badge variant="lime">Registrasi Akun</Badge>
            </div>

            <div className="relative z-10 space-y-4 my-auto">
              <span className="font-bebas text-brand-lime text-xl tracking-wider uppercase block">
                Gabung Komunitas Arena
              </span>
              <h2 className="font-bebas text-5xl md:text-6xl text-white uppercase tracking-tight leading-[0.92]">
                DAFTARKAN TIM. <br />
                KUNCI JADWAL.
              </h2>
              <p className="font-sora text-sm text-stone-200 max-w-sm leading-relaxed">
                Buat akun kapten tim sekarang untuk akses booking 3 lapangan standar FIFA, e-receipt otomatis, dan histori pertandingan.
              </p>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-stone-300">
              <span>3 Lapangan Turnamen</span>
              <span className="font-mono text-brand-lime">Auto-Lock Aktif</span>
            </div>
          </div>

          {/* Kolom Kanan: Form Bersih */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            <div className="max-w-lg w-full mx-auto space-y-6">
              
              <div className="space-y-1">
                <span className="font-bebas text-brand-blue dark:text-brand-lime text-base tracking-wider uppercase block">
                  Registrasi Komunitas & Tim
                </span>
                <h1 className="font-bebas text-4xl sm:text-5xl text-brand-ink dark:text-white uppercase tracking-tight leading-none">
                  DAFTAR AKUN BARU
                </h1>
                <p className="font-sora text-xs text-brand-dim dark:text-stone-400">
                  Isi data di bawah untuk membuat akun pemesanan lapangan futsal.
                </p>
              </div>

              {/* Pemberitahuan Error / Validasi */}
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
                    {errorMsg.alreadyRegistered && (
                      <div className="pt-2">
                        <Link
                          href="/login"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-navy hover:bg-brand-ink text-white font-bold text-xs shadow-xs transition-all cursor-pointer font-bebas tracking-wider uppercase"
                        >
                          <span>Langsung Masuk ke Akun Anda</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-brand-ink dark:text-stone-200 uppercase tracking-wider block">
                    Nama Lengkap / Kapten Tim
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-brand-dim absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={namaLengkap}
                      onChange={(e) => setNamaLengkap(e.target.value)}
                      placeholder="Contoh: Budi Pratama"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 rounded-xl text-sm text-brand-ink dark:text-white focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-brand-ink dark:text-stone-200 uppercase tracking-wider block">
                      Alamat Email
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-brand-dim absolute left-3.5 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); if (errorMsg) setErrorMsg(null); }}
                        placeholder="nama@email.com"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 rounded-xl text-sm text-brand-ink dark:text-white focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-brand-ink dark:text-stone-200 uppercase tracking-wider block">
                      Nomor WhatsApp
                    </label>
                    <div className="relative flex items-center">
                      <Phone className="w-4 h-4 text-brand-dim absolute left-3.5 pointer-events-none" />
                      <input
                        type="tel"
                        value={noHp}
                        onChange={(e) => setNoHp(e.target.value)}
                        placeholder="081234567890"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 rounded-xl text-sm text-brand-ink dark:text-white focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-brand-ink dark:text-stone-200 uppercase tracking-wider block">
                      Kata Sandi
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-brand-dim absolute left-3.5 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); if (errorMsg) setErrorMsg(null); }}
                        placeholder="Min. 6 karakter"
                        required
                        className="w-full pl-10 pr-10 py-3 bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 rounded-xl text-sm text-brand-ink dark:text-white focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 p-1 text-brand-dim hover:text-brand-ink dark:hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-brand-ink dark:text-stone-200 uppercase tracking-wider block">
                      Ulangi Kata Sandi
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-brand-dim absolute left-3.5 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Samakan sandi"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-brand-navy/50 border-[1.5px] border-brand-line dark:border-white/10 rounded-xl text-sm text-brand-ink dark:text-white focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                      />
                    </div>
                  </div>
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
                      <span>Daftar Akun Sekarang</span>
                      <ArrowRight className="w-5 h-5 ml-1" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center text-xs text-brand-dim dark:text-stone-400">
                Sudah punya akun?{' '}
                <Link
                  href="/login"
                  className="font-bold text-brand-blue dark:text-brand-lime hover:underline underline-offset-4"
                >
                  Masuk ke akun sekarang
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
