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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
