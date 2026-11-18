// src/app/components/Footer.tsx
import React from 'react';
import Link from 'next/link';
import FutsalEmblem from './FutsalEmblem';

export default function Footer() {
  return (
    <footer id="tentang" className="bg-brand-navy text-white pt-16 pb-12 border-t-[1.5px] border-brand-line/20 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          
          {/* Kolom 1: Brand & Filosofi */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <FutsalEmblem className="w-9 h-9" />
              <div>
                <span className="font-bebas text-2xl tracking-wider text-white block leading-none">FUTSALHUB</span>
                <span className="font-sora text-[10px] tracking-widest text-brand-lime uppercase font-semibold">Arena Booking & Community</span>
              </div>
            </div>
            <p className="font-sora text-sm text-stone-300 max-w-sm leading-relaxed">
              Platform sistem informasi operasional arena 3 lapangan futsal interlock standar FIFA. Reservasi mandiri real-time 24/7 tanpa risiko double-booking dengan bukti e-receipt resmi.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-stone-300">
              <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
              <span>Sistem Operasional Aktif 08:00 - 00:00 WIB</span>
            </div>
          </div>

          {/* Kolom 2: Navigasi */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bebas text-lg tracking-wider text-brand-lime uppercase">Navigasi Cepat</h4>
            <ul className="font-sora space-y-2 text-sm text-stone-300">
              <li>
                <Link href="/" className="hover:text-brand-lime transition-colors inline-flex items-center gap-1.5">
                  <span className="text-brand-lime/60 font-mono text-xs">/</span> Beranda Utama
                </Link>
              </li>
              <li>
                <Link href="/jadwal" className="hover:text-brand-lime transition-colors inline-flex items-center gap-1.5">
                  <span className="text-brand-lime/60 font-mono text-xs">/</span> Jadwal & Kalender Slot
                </Link>
              </li>
              <li>
                <Link href="/fasilitas" className="hover:text-brand-lime transition-colors inline-flex items-center gap-1.5">
                  <span className="text-brand-lime/60 font-mono text-xs">/</span> Fasilitas & Tarif Sewa
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-brand-lime transition-colors inline-flex items-center gap-1.5">
                  <span className="text-brand-lime/60 font-mono text-xs">/</span> Tentang & Kontak Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Portal Manajemen */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bebas text-lg tracking-wider text-brand-lime uppercase">Portal Internal</h4>
            <ul className="font-sora space-y-2 text-sm text-stone-300">
              <li>
                <Link href="/login" className="hover:text-brand-lime transition-colors inline-flex items-center gap-1.5">
                  <span className="text-brand-lime/60 font-mono text-xs">/</span> Masuk Akun
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand-lime transition-colors inline-flex items-center gap-1.5">
                  <span className="text-brand-lime/60 font-mono text-xs">/</span> Dashboard Admin
                </Link>
              </li>
              <li>
                <Link href="/owner" className="hover:text-brand-lime transition-colors inline-flex items-center gap-1.5">
                  <span className="text-brand-lime/60 font-mono text-xs">/</span> Portal Owner
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Lokasi & Spesifikasi */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bebas text-lg tracking-wider text-brand-lime uppercase">Spesifikasi Arena</h4>
            <p className="font-sora text-xs text-stone-300 leading-relaxed">
              3 Lapangan Interlock Standar Turnamen resmi, pencahayaan LED 400 Lux, ruang ganti ber-AC, kantin & shower bersih.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-mono text-stone-400 block">Tangerang Selatan, Banten</span>
              <span className="text-[11px] font-mono text-brand-lime">support@futsalhub.id</span>
            </div>
          </div>

        </div>

        {/* Baris Bawah: Hak Cipta */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sora text-xs text-stone-400">
          <p>&copy; {new Date().getFullYear()} FUTSALHUB Arena System. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-6">
            <span className="text-stone-500 font-mono">Engine: Next.js App Router</span>
            <span className="text-brand-lime font-mono">Status: Terverifikasi Stabil</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
