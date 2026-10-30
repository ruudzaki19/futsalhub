// src/app/components/Navbar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  User, 
  LogOut, 
  ShieldCheck, 
  ChevronDown, 
  Sun, 
  Moon 
} from 'lucide-react';
import { toast } from 'sonner';
import FutsalEmblem from './FutsalEmblem';
import { getStoredUser, clearStoredUser, UserSession } from '../../data/authStore';

interface NavbarProps {
  onLogoClick?: () => void;
}

export default function Navbar({ onLogoClick }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentUser(getStoredUser());

    const savedTheme = localStorage.getItem('futsalhub_theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('futsalhub_theme', 'light');
      setIsDarkMode(false);
      toast.info('Mode terang diaktifkan');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('futsalhub_theme', 'dark');
      setIsDarkMode(true);
      toast.info('Mode gelap diaktifkan');
    }
  };

  const handleLogout = () => {
    clearStoredUser();
    setCurrentUser(null);
    setDropdownOpen(false);
    toast.success('Berhasil keluar dari akun.');
    router.push('/');
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Jadwal Lapangan', href: '/jadwal' },
    { name: 'Fasilitas & Tarif', href: '/fasilitas' },
    { name: 'Tentang Kami', href: '/tentang' },
  ];

  const isInternalStaff = currentUser?.role === 'admin' || currentUser?.role === 'owner';

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 dark:bg-[#121417]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Tombol Logo */}
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors">
            <FutsalEmblem className="w-7 h-7 text-[#0F291E] dark:text-emerald-400" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-[#0F291E] dark:text-white block leading-none">
              FUTSALHUB
            </span>
            <span className="text-[10px] tracking-widest text-stone-500 dark:text-stone-400 font-semibold uppercase">
              Arena System
            </span>
          </div>
        </button>

        {/* Menu Navigasi */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors ${
                  active
                    ? 'text-stone-900 dark:text-white font-bold'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {link.name}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F291E] dark:bg-emerald-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Zona Aksi Kanan */}
        <div className="flex items-center gap-3">
          
          {/* Tombol Toggle Tema */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle mode gelap atau terang"
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1A1D23] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 shadow-sm transition-all focus:outline-none cursor-pointer"
            title={isDarkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-700" />
            )}
          </button>

          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 pl-3 rounded-2xl bg-white dark:bg-[#1A1D23] border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md transition-all focus:outline-none cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <span className="block text-xs font-bold text-stone-800 dark:text-stone-200 leading-tight">
                    {currentUser.nama}
                  </span>
                  {isInternalStaff && (
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                      {currentUser.role}
                    </span>
                  )}
                </div>
                
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-sm">
                  {currentUser.avatarUrl ? (
                    <img 
                      src={currentUser.avatarUrl} 
                      alt={currentUser.nama} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {currentUser.nama
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-stone-400 mr-1" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-[#1A1D23] border border-stone-200 dark:border-stone-700 rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                      Masuk sebagai:
                    </span>
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-100 block truncate">
                      {currentUser.email}
                    </span>
                    {isInternalStaff && (
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 uppercase">
                        Role: {currentUser.role}
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    >
                      <User className="w-4 h-4 text-stone-400" />
                      Profil Saya
                    </Link>

                    {isInternalStaff && (
                      <Link
                        href={currentUser.role === 'admin' ? '/admin' : '/owner'}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Akses Panel {currentUser.role === 'admin' ? 'Admin Kasir' : 'Owner'}
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-stone-100 dark:border-stone-800">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Keluar (Logout)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2.5 text-sm font-semibold text-stone-900 dark:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 rounded-xl transition-all shadow-sm"
            >
              Masuk Akun
            </Link>
          )}

        </div>

      </div>
    </header>
  );
}
