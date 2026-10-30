// src/app/register/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FutsalEmblem from '../components/FutsalEmblem';
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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanPass.length < 6) {
      toast.error('Kata sandi harus minimal 6 karakter!');
      return;
    }

    if (cleanPass !== confirmPassword.trim()) {
      toast.error('Konfirmasi kata sandi tidak cocok!');
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
        toast.error('Email ini sudah terdaftar! Silakan langsung login.');
        return;
      }

      toast.success('Pendaftaran berhasil! Silakan masuk dengan akun Anda.');
      router.push('/login');
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-lg"
        >
          <div className="bg-white/90 backdrop-blur-xl border border-stone-200/90 rounded-3xl p-8 sm:p-10 shadow-xl relative">
            
            <div className="text-center space-y-2 mb-8">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-50 border border-emerald-100 mb-2">
                <FutsalEmblem className="w-8 h-8 text-emerald-800" />
              </div>
              <h1 className="text-2xl font-black text-[#0F291E] tracking-tight">
                Registrasi Akun Baru
              </h1>
              <p className="text-xs text-stone-500">
                Daftarkan akun tim Anda untuk reservasi slot 3 lapangan futsal.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Nama Lengkap / Kapten Tim
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    placeholder="Contoh: Budi Pratama"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-stone-50/70 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
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
                      className="w-full pl-10 pr-4 py-3 bg-stone-50/70 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Nomor WhatsApp
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="tel"
                      value={noHp}
                      onChange={(e) => setNoHp(e.target.value)}
                      placeholder="081234567890"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-stone-50/70 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
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
                      placeholder="Min. 6 karakter"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-stone-50/70 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 p-1 text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Ulangi Kata Sandi
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Samakan sandi"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-stone-50/70 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                    />
                  </div>
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
                    <span>Daftar Akun Sekarang</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-stone-500">
              Sudah punya akun?{' '}
              <Link
                href="/login"
                className="font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
              >
                Masuk sekarang
              </Link>
            </div>

          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

