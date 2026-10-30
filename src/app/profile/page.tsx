// src/app/profile/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, User, Mail, Phone, Shield, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getStoredUser, setStoredUser, UserSession } from '../../data/authStore';

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [session, setSession] = useState<UserSession | null>(null);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [noHp, setNoHp] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      toast.error('Silakan login terlebih dahulu untuk mengakses profil.');
      router.push('/login');
      return;
    }
    setSession(user);
    setNama(user.nama);
    setEmail(user.email);
    setNoHp(user.noHp);
    setAvatarPreview(user.avatarUrl);
  }, [router]);

  // Handler Upload Ganti Foto Profil Langsung dari Komputer
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Harap pilih berkas foto gambar (JPG/PNG)!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAvatarPreview(base64);
      toast.success('Pratinjau foto berhasil dimuat. Jangan lupa simpan perubahan!');
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
      toast.success('Profil dan foto berhasil diperbarui!');
    }, 600);
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-emerald-900 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="bg-white border border-stone-200 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="border-b border-stone-100 pb-8 mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F291E]">
              Pengaturan Akun & Profil
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Kelola informasi identitas, foto profil, dan kredensial penyewaan Anda.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-8">
            
            {/* Bagian Ganti Foto Profil */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-stone-100">
              <div className="relative group">
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-emerald-800 bg-stone-100 shadow-md">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Foto Profil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-stone-400 m-auto mt-6" />
                  )}
                </div>

                {/* Tombol Kamera untuk Upload */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 p-2 bg-[#0F291E] text-white rounded-xl shadow-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                  title="Ganti Foto Profil"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="space-y-1.5 text-center sm:text-left">
                <h3 className="text-sm font-bold text-stone-900">Foto Profil Akun</h3>
                <p className="text-xs text-stone-500 max-w-xs">
                  Format gambar JPG, PNG, atau WebP. Foto ini akan muncul di sudut kanan atas bar navigasi.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-4 cursor-pointer"
                >
                  Pilih Gambar Baru Dari Komputer
                </button>
              </div>
            </div>

            {/* Input Data Diri */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Nama Lengkap / Kapten Tim
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Hak Akses / Peran
                </label>
                <div className="relative flex items-center">
                  <Shield className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={session.role.toUpperCase()}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-stone-100 border border-stone-200 rounded-xl text-sm font-bold text-stone-500 cursor-not-allowed"
                  />
                </div>
              </div>

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
                    required
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
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
                    required
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                  />
                </div>
              </div>
            </div>

            {/* Tombol Simpan Perubahan */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3.5 bg-[#0F291E] hover:bg-[#143B2C] text-[#FDFBF7] text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isSaving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 text-emerald-400" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

