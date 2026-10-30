// src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FutsalEmblem from '../components/FutsalEmblem';
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

      // KASUS 1: Email belum pernah didaftarkan (Pemberitahuan Akun Belum Terdaftar)
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

            {/* Pemberitahuan Error / Akun Belum Terdaftar */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <strong className="block font-black text-rose-900 text-sm">
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
                  <p className="text-stone-700 leading-relaxed text-xs">
                    {errorMsg.desc}
                  </p>
                  {errorMsg.notRegistered && (
                    <div className="pt-2">
                      <Link
                        href="/register"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
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
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-bold text-xs">{successMsg}</span>
              </div>
            )}

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
                    onChange={(e) => { 
                      setEmail(e.target.value); 
                      if (errorMsg) setErrorMsg(null); 
                    }}
                    placeholder="nama@email.com"
                    required
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm text-stone-900 focus:outline-none transition-all ${
                      errorMsg?.notRegistered 
                        ? 'bg-rose-50/70 border-2 border-rose-500 ring-2 ring-rose-500/20' 
                        : 'bg-stone-50/70 border border-stone-200 focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700'
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
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Kata Sandi
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { 
                      setPassword(e.target.value); 
                      if (errorMsg) setErrorMsg(null); 
                    }}
                    placeholder="Masukkan sandi akun"
                    required
                    className={`w-full pl-10 pr-11 py-3 rounded-xl text-sm text-stone-900 focus:outline-none transition-all ${
                      errorMsg?.title === 'Kata Sandi Salah' 
                        ? 'bg-rose-50/70 border-2 border-rose-500 ring-2 ring-rose-500/20' 
                        : 'bg-stone-50/70 border border-stone-200 focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700'
                    }`}
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
                {errorMsg?.title === 'Kata Sandi Salah' && (
                  <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1.5 pt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Kata sandi salah! Silakan periksa kembali kata sandi akun Anda.</span>
                  </p>
                )}
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

          </div>
        </div>
      </main>

      {/* POP-UP MODAL PEMBERITAHUAN AKUN BELUM TERDAFTAR */}
      {showNotRegisteredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5 shadow-2xl border border-rose-100">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-stone-900 tracking-tight">
                Akun Belum Terdaftar!
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Email <strong className="text-stone-900 font-bold font-mono">"{email}"</strong> belum terdaftar atau belum pernah melakukan registrasi di sistem FutsalHub.
              </p>
              <p className="text-xs text-rose-700 font-bold bg-rose-50 border border-rose-200 rounded-xl p-2.5 mt-2">
                Anda tidak dapat login sebelum mendaftar. Silakan registrasi akun baru terlebih dahulu.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <Link
                href="/register"
                className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Daftar / Registrasi Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => setShowNotRegisteredModal(false)}
                className="w-full py-2.5 text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
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

