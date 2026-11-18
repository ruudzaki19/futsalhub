# FUTSALHUB Design System

> **Mandat Desain**: Setiap halaman atau fitur baru wajib memakai token dan komponen dari design system ini. Dilarang menggunakan gradasi warna AI generik (ungu/pink/cyan neon) atau bayangan blur berlebihan.

---

## 1. Filosofi & Karakter Visual
- **Gaya**: Sporty Modern, Fotografis, Human-Crafted (Kualitas setara dengan standar proyek profesional seperti Sumber Teknik Dua).
- **Nuansa**: Flat, tajam, presisi, bernafaskan arena futsal nyata.
- **Bentuk Geometris**: Radius sudut 8–12px (`rounded-xl` / `rounded-2xl`), border tipis 1.5px tegas, bayangan offset keras (*hard offset shadow*).
- **Tipografi**:
  - **Headlines & Angka Raksasa**: `Bebas Neue` (`font-bebas`) — gagah, tinggi, athletic condensed.
  - **Body Copy, Form, & Tabel**: `Sora` (`font-sora`) — modern, mudah dibaca, proporsional untuk data tabular.

---

## 2. Palet Token Warna (Flat)

| Nama Token | Hex Code | Penggunaan Utama |
|---|---|---|
| `brand-blue` | `#1456D6` | Aksen tombol sekunder, border aktif, link, badge info |
| `brand-lime` | `#B8F03C` | Aksen aksi primer (*CTA*), sorotan item aktif sidebar, badge rating |
| `brand-navy` | `#0B1B3F` | Sidebar dashboard, card kontras gelap, footer, bayangan offset keras |
| `brand-ink` | `#0E1220` | Teks judul utama, background dark mode |
| `brand-line` | `#E3E7EF` | Garis pembatas (border 1.5px), divider antar section |
| `brand-dim` | `#5B6478` | Subtitle, helper text, label sekunder |
| `brand-bg` | `#F8FAFC` | Latar belakang halaman publik & dashboard (light mode) |

### Status Tokens:
- **Sukses / Tersedia**: Hijau `#10B981` (Tersedia untuk disewa)
- **Peringatan / Terkunci**: Amber `#F59E0B` (Terkunci proses checkout 10 menit)
- **Bahaya / Terpesan**: Merah `#EF4444` (Sudah lunas / terisi)
- **Info / Dipilih**: Biru `#1456D6` (Slot terpilih oleh user saat ini)

---

## 3. Hard Offset Shadows
Elemen aktif atau card menggunakan bayangan offset keras (tanpa blur lembut generik):
- `shadow-hard-navy`: `box-shadow: 4px 4px 0px #0B1B3F;`
- `shadow-hard-navy-lg`: `box-shadow: 6px 6px 0px #0B1B3F;`
- `shadow-hard-lime`: `box-shadow: 4px 4px 0px #B8F03C;`
- `shadow-hard-blue`: `box-shadow: 4px 4px 0px #1456D6;`

---

## 4. Tipografi

```tsx
// Judul Hero / Section Besar
<h1 className="font-bebas text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none text-brand-ink dark:text-white uppercase">
  MAIN SERU.
</h1>

// Label Section (Sporty Marker)
<div className="flex items-center gap-3">
  <span className="w-7 h-7 rounded-full bg-brand-navy text-brand-lime flex items-center justify-center font-bebas text-sm">A</span>
  <span className="font-bebas text-lg tracking-wider text-brand-dim uppercase">Tentang FutsalHub</span>
  <div className="h-[1.5px] flex-1 bg-brand-line dark:bg-white/10" />
</div>

// Angka Statistik Besar
<span className="font-bebas text-4xl sm:text-5xl text-brand-blue tracking-tight">15.000+</span>
```

---

## 5. Komponen Presentasional (`src/app/components/ui/`)

1. **Button** (`Button.tsx`):
   - `variant="primary"`: Latar `#B8F03C` (Lime), teks `#0B1B3F`, hover lift & border 1.5px.
   - `variant="dark"`: Latar `#0B1B3F` (Navy), teks putih, hover offset shadow.
   - `variant="blue"`: Latar `#1456D6`, teks putih.
   - `variant="outline"`: Garis border 1.5px, latar putih/transparan.
   - `variant="ghost"`: Minimalist hover.
   - `variant="danger"`: Merah aksi hapus/batal.
2. **Badge** (`Badge.tsx`):
   - Pilihan warna: `lime`, `blue`, `navy`, `success`, `warning`, `danger`, `neutral`.
3. **Card** (`Card.tsx`):
   - Border 1.5px `border-brand-line`, sudut `rounded-2xl`, opsional hover lift.
4. **Input & Select** (`Input.tsx`):
   - Border 1.5px, ring focus `#1456D6`, label rapi, feedback validasi jelas.
5. **Table** (`Table.tsx`):
   - Header navy/light tegas, padding rapat, baris hover halus, kompatibel mobile scroll.
6. **Modal & Drawer** (`Modal.tsx`):
   - Transisi cepat (0.2s), backdrop blur minimalis, sudut `rounded-2xl`.
7. **Sidebar** (`Sidebar.tsx`):
   - Dark navy `#0B1B3F`, item aktif dengan aksen lime `#B8F03C`, rapi dan padat.

---

## 6. Aturan Animasi
- **Scroll reveal**: Fade + slide-up 0.6s (dijalankan sekali, tidak berulang-ulang).
- **Hover**: Angkat kartu/tombol 2px – 4px (`hover:-translate-y-1 transition-transform`).
- **Modal / Drawer**: Muncul cepat 0.2s.
- **Counter angka**: Transisi lancar satu arah saat terlihat.
- **DILARANG**:
  - Marquee bergerak terus-menerus.
  - Elemen bola/awan melayang tiada henti.
  - Parallax mouse agresif.
  - Wajib menghormati media query `prefers-reduced-motion`.

---

## 7. Standar Foto & Visual
- **Gaya Foto**: Realistis, fotografi olahraga profesional editorial (atlet sungguhan, interlock futsal, pencahayaan alami/LED stadion bersih).
- **Rasio Foto**:
  - Hero Card: 16:9 atau 4:3.
  - Card Lapangan: 16:10.
  - Avatar / Profile: 1:1.
- **Zoom Hover**: Maksimal `hover:scale-103 transition-transform duration-500`.
- **Dilarang**: Gambar kartun generik, 3D clay, ilustrasi klise, atau foto ber-watermark.
