// src/app/components/Footer.tsx
import React from 'react';
import Link from 'next/link';
import FutsalEmblem from './FutsalEmblem';

export default function Footer() {
  return (
    <footer id="tentang" className="bg-[#0F291E] text-stone-300 py-14 border-t border-emerald-900/50">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <FutsalEmblem className="w-8 h-8 text-emerald-400" />
            <span className="font-black text-xl tracking-tight text-white">FUTSALHUB</span>
          </div>
          <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
            Platform sistem informasi operasional arena 3 lapangan futsal terintegrasi. Memastikan penjadwalan mandiri akurat tanpa double-booking serta pencatatan transaksi transparan.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-4">Navigasi Halaman</h4>
          <ul className="space-y-2 text-sm text-stone-400">
            <li><Link href="/" className="hover:text-emerald-300 transition-colors">Beranda</Link></li>
            <li><Link href="/jadwal" className="hover:text-emerald-300 transition-colors">Kalender Slot</Link></li>
            <li><Link href="/fasilitas" className="hover:text-emerald-300 transition-colors">Fasilitas & Tarif</Link></li>
            <li><Link href="/login" className="hover:text-emerald-300 transition-colors">Login Admin / Owner</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-4">Informasi Arena</h4>
          <p className="text-xs text-stone-400 leading-relaxed">
            Menyediakan 3 lapangan futsal standar turnamen interlock resmi. Buka setiap hari jam 08:00 - 23:00 WIB.
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 mt-10 border-t border-emerald-900/60 text-xs text-stone-500 text-center">
        &copy; {new Date().getFullYear()} FUTSALHUB Arena System. All rights reserved.
      </div>
    </footer>
  );
}
