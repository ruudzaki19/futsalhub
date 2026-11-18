# Aturan Pengembangan Proyek FUTSALHUB

Proyek ini terhubung ke GitHub (`ruudzaki19/futsalhub` branch `main`) dan terintegrasi langsung dengan Vercel (`https://futsalhub-theta.vercel.app/`).

## Aturan Alur Kerja Otomatis:
1. **Verifikasi Build**:
   - Setiap kali selesai membuat atau mengubah kode apa pun, selalu jalankan `npm run build` untuk memverifikasi tidak ada error TypeScript atau ESLint.
2. **Otomatis Commit & Push ke Vercel**:
   - Jika build sukses dan ada perubahan, langsung jalankan:
     `git add .`
     `git commit -m "<pesan singkat dan jelas>"`
     `git push origin main`
     agar Vercel otomatis men-deploy versi terbaru tanpa perlu disuruh lagi oleh pengguna.
3. **Server Lokal**:
   - Jaga agar `npm run dev` tetap berjalan di `http://localhost:3000`.
