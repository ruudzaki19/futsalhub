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
  Moon,
  ShoppingBag,
  Calendar
} from 'lucide-react';
import FutsalEmblem from './FutsalEmblem';
import CartDrawer from './CartDrawer';
import { getStoredUser, clearStoredUser, UserSession } from '../../data/authStore';
import { getCartItems } from '../../data/bookingStore';

interface NavbarProps {
  onLogoClick?: () => void;
}

export default function Navbar({ onLogoClick }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentUser(getStoredUser());

    const updateCart = () => {
      const items = getCartItems();
      setCartCount(items.length);
    };
    updateCart();

    window.addEventListener('futsalhub_cart_changed', updateCart);

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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('futsalhub_cart_changed', updateCart);
    };
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('futsalhub_theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('futsalhub_theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    clearStoredUser();
    setCurrentUser(null);
    setDropdownOpen(false);
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
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0E1220]/90 backdrop-blur-md border-b-[1.5px] border-[#E3E7EF] dark:border-[#1E263D] transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <button
            type="button"
            onClick={onLogoClick}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1456D6] flex items-center justify-center shadow-hard-lime text-[#B8F03C] transition-transform group-hover:scale-105">
              <FutsalEmblem className="w-6 h-6 text-[#B8F03C]" />
            </div>
            <div>
              <span className="font-condensed text-2xl font-bold tracking-wider text-[#0E1220] dark:text-white block leading-none">
                FUTSALHUB
              </span>
              <span className="text-[10px] tracking-widest text-[#1456D6] dark:text-[#B8F03C] font-black uppercase">
                Arena System
              </span>
            </div>
          </button>

          {/* Navigasi Utama */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-2 transition-colors ${
                    active
                      ? 'text-[#0E1220] dark:text-white font-black'
                      : 'text-[#5B6478] dark:text-[#94A3B8] hover:text-[#0E1220] dark:hover:text-white'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1456D6] dark:bg-[#B8F03C] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Zone Kanan */}
          <div className="flex items-center gap-3">
            
            {/* Tombol Keranjang Sewa */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Keranjang Sewa Lapangan"
              className="relative p-2.5 rounded-xl border-[1.5px] border-[#E3E7EF] dark:border-[#1E263D] bg-white dark:bg-[#13192B] text-[#0E1220] dark:text-[#F3F4F6] hover:bg-stone-50 dark:hover:bg-stone-800 transition-all focus:outline-none cursor-pointer"
              title="Keranjang Sewa Lapangan"
            >
              <ShoppingBag className="w-4 h-4 text-[#1456D6] dark:text-[#B8F03C]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-md bg-[#B8F03C] text-[#0B1B3F] text-[10px] font-black border border-[#0B1B3F] flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Tombol Toggle Tema */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle mode gelap atau terang"
              className="p-2.5 rounded-xl border-[1.5px] border-[#E3E7EF] dark:border-[#1E263D] bg-white dark:bg-[#13192B] text-[#0E1220] dark:text-[#F3F4F6] hover:bg-stone-50 dark:hover:bg-stone-800 transition-all focus:outline-none cursor-pointer"
              title={isDarkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-[#B8F03C]" />
              ) : (
                <Moon className="w-4 h-4 text-[#0B1B3F]" />
              )}
            </button>

            {/* Menu Akun / Login */}
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 rounded-xl bg-white dark:bg-[#13192B] border-[1.5px] border-[#E3E7EF] dark:border-[#1E263D] hover:border-[#1456D6] transition-all focus:outline-none cursor-pointer"
                >
                  <div className="text-right hidden sm:block">
                    <span className="block text-xs font-bold text-[#0E1220] dark:text-[#F3F4F6] leading-tight">
                      {currentUser.nama}
                    </span>
                    {isInternalStaff && (
                      <span className="text-[10px] font-black text-[#1456D6] dark:text-[#B8F03C] uppercase tracking-wider block">
                        {currentUser.role}
                      </span>
                    )}
                  </div>
                  
                  <div className="w-8 h-8 rounded-lg overflow-hidden border-[1.5px] border-[#E3E7EF] dark:border-[#1E263D] bg-stone-100 dark:bg-stone-800 text-[#0B1B3F] dark:text-white flex items-center justify-center font-bold text-xs">
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
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 mr-1" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#13192B] border-[1.5px] border-[#E3E7EF] dark:border-[#1E263D] rounded-xl shadow-hard-lg-navy dark:shadow-none py-2 z-50">
                    <div className="px-4 py-3 border-b-[1.5px] border-[#E3E7EF] dark:border-[#1E263D]">
                      <span className="text-[10px] font-bold text-[#5B6478] dark:text-[#94A3B8] uppercase tracking-wider block">
                        Akun Terhubung:
                      </span>
                      <span className="text-xs font-bold text-[#0E1220] dark:text-white block truncate">
                        {currentUser.email}
                      </span>
                      {isInternalStaff && (
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-black bg-[#B8F03C] text-[#0B1B3F] uppercase">
                          Role: {currentUser.role}
                        </span>
                      )}
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                      >
                        <User className="w-4 h-4 text-stone-400" />
                        Profil Saya
                      </Link>

                      <Link
                        href="/profile#riwayat"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-[#1456D6] dark:text-[#B8F03C] hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-[#1456D6] dark:text-[#B8F03C]" />
                        Riwayat & Status Booking
                      </Link>

                      {isInternalStaff && (
                        <Link
                          href={currentUser.role === 'admin' ? '/admin' : '/owner'}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#1456D6] dark:text-[#B8F03C]" />
                          Akses Panel {currentUser.role === 'admin' ? 'Admin Kasir' : 'Owner'}
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t-[1.5px] border-[#E3E7EF] dark:border-[#1E263D]">
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
                className="px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#0B1B3F] bg-[#B8F03C] hover:bg-[#A6DE2E] border-[1.5px] border-[#0B1B3F] rounded-xl shadow-hard-navy transition-all active:translate-y-0.5 inline-block"
              >
                Masuk Akun
              </Link>
            )}

          </div>

        </div>
      </header>

      {/* Pop-up Keranjang Sewa */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
