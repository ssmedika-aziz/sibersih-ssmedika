# Si B3RSIH — Sistem B3 Rumah Sakit Indonesia Hygien
Aplikasi B3 RS (Dokumentasi, Evalusi, Dasar Kebijakan)

Aplikasi **dokumentasi & monitoring kepatuhan B3 + kebersihan rumah sakit** berbasis **Google Apps Script** (Web App). Database memakai **Google Sheets**, foto temuan disimpan di **Google Drive**. Bisa dibuka di desktop maupun HP (mobile browser) — sudah ada navigasi mobile (drawer + bottom nav).

## Fitur
- **Role ganda**: `Managemen` & `Pelaksana` (berdasarkan email akun Google).
- **Dashboard Informasi**: total unit, item diperiksa bulan ini, % kepatuhan, temuan aktif, grafik kepatuhan per unit, tren 6 bulan, pie status temuan, temuan terbaru.
- **Data Unit**: kelola ruangan/unit yang diawasi.
- **Ceklis Kebersihan**: template item (B3 + hygiene + APD), jawab Sesuai/Tidak + keterangan, per shift.
- **Temuan**: lapor dengan foto (maks 4, otomatis di-resize), keterangan, tanggal tercatat otomatis; status Terbuka → Dalam Perbaikan → Selesai + tindak lanjut oleh Managemen.
- **Rekap & Evaluasi** (Managemen): rekap kepatuhan per unit per periode + export CSV → dasar kebijakan & monitoring.
- **Kelola Template Ceklis & Pengguna/Role** (Managemen).
- **Log aktivitas** tersimpan di Sheet.

## Cara Instalasi (±10 menit)

1. Buka [script.google.com](https://script.google.com) → **New project**.
2. Hapus isi default `Code.gs`, lalu **tempel seluruh isi file `Code.gs`**.
3. Klik ikon **+** → **HTML** → beri nama `Index` (harus persis `Index`). Hapus isinya, tempel seluruh isi file `Index.html`.
4. Tampilkan file manifest: menu **Project Settings (⚙️)** → centang **"Show appsscript.json manifest file in editor"**. Buka tab `appsscript.json`, ganti isinya dengan isi file `appsscript.json` dari paket ini. Simpan.
5. **Jalankan setup sekali**: di editor, pilih fungsi `setup` (dropdown di sebelah tombol Run) → klik **Run**. Izinkan akses (klik Advanced → Go to ...). Ini akan membuat:
   - Spreadsheet **"Si B3RSIH - Database"** (6 sheet: Pengguna, Unit, TemplateCeklis, CeklisHarian, Temuan, Log) + data awal (10 unit & 15 item ceklis).
   - Folder Drive **"Si B3RSIH - Foto Temuan"**.
   - Akun Anda (pemilik) otomatis terdaftar sebagai **Managemen**.
6. **Deploy**: klik **Deploy → New deployment** → pilih tipe **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone with Google account** (atau domain rumah sakit jika memakai Google Workspace)
   - Klik **Deploy**, salin **URL Web App**.
7. Buka URL tersebut di browser desktop/HP. Selesai.

> Setelah mengubah kode, lakukan **Deploy → Manage deployments → Edit → Version: New version** agar perubahan aktif.

## Daftarkan Pengguna
- Buka menu **Pengguna & Role** (hanya Managemen) → masukkan **email akun Google** petugas + nama + role.
- Email yang **tidak terdaftar** otomatis masuk sebagai **Pelaksana** (bisa input ceklis & lapor temuan).
- Untuk Pelaksana, opsional di-set 1 unit → dashboard & daftar temuan otomatis terfilter ke unitnya.

## Tips Penggunaan Mobile
- Buka URL Web App di Chrome/HP, lalu **"Add to Home screen"** → tampil seperti aplikasi.
- Di HP muncul **bottom navigation** (Dashboard, Ceklis, Temuan, Daftar Temuan) untuk akses cepat.
- Foto bisa langsung diambil dari kamera HP saat melaporkan temuan.

## Struktur Data (Sheet)
| Sheet | Isi |
|---|---|
| Pengguna | email, nama, role (Managemen/Pelaksana), unit_id |
| Unit | daftar ruangan/unit |
| TemplateCeklis | item pemeriksaan (bisa ditambah/hapus) |
| CeklisHarian | 1 baris = 1 item jawaban ceklis |
| Temuan | temuan + link foto (dipisah `\|` jika >1) |
| Log | jejak aktivitas pengguna |

## Batasan & Catatan
- Ukuran foto otomatis di-resize maks 1280px & kompres JPEG agar cepat. Maks 4 foto per temuan.
- Akses **anonymous (tanpa login Google)** membuat email tidak terbaca → semua pengguna jadi Pelaksana tanpa nama. Disarankan akses login.
- Jika grafik tidak muncul, pastikan HP/desktop terhubung internet (Chart.js dimuat dari CDN).
- Backup: spreadsheet database bisa di-copy manual berkala.

## Dukungan
Untuk menambah parameter ceklis, gunakan menu **Template Ceklis** di aplikasi (tidak perlu ubah kode).

---

# Mode Lanjutan: GitHub Pages + PWA (Offline Sync) v1.2.0

Sejak v1.2.0, aplikasi punya **dua mode akses** dengan satu basis kode yang sama:

| Mode | Hosting | Login | Offline? |
|---|---|---|---|
| **A. Web App GAS** | script.google.com | Akun Google otomatis | Tidak (perlu online) |
| **B. GitHub Pages + PWA** | github.io (static) | Email + password (manual) | **Ya** — input tersimpan offline, sinkron otomatis saat online |

Backend tetap **satu script Apps Script yang sama**. Data & foto tetap di Google Sheets & Drive.

## Langkah 1 — Update kode & jalankan `setupPasswords`
1. Ganti isi `Code.gs`, `Index.html`, `appsscript.json` di editor Apps Script dengan versi terbaru dari paket ini. **Save**.
2. Di editor, pilih fungsi **`setupPasswords`** → klik **Run** sekali. Ini memberi password default **`admin123`** untuk akun Managemen yang belum punya password.
3. (Opsional) Tambah/reset password pengguna lain: login ke aplikasi → menu **Pengguna & Role** → tombol **Set PW** di baris pengguna tersebut. Setiap pengguna juga bisa ganti password sendiri lewat sidebar (bagian Akun → **Ganti Password**).

## Langkah 2 — Buat 2 Deployment di Apps Script (project yang sama)
> Satu deployment tidak bisa punya dua level akses sekaligus, jadi kita buat dua.

- **Deployment 1 (UI GAS, login Google):** Deploy → New deployment → Web app → **Execute as: Me**, **Who has access: Anyone with Google account**. Ini URL lama Anda (mode A).
- **Deployment 2 (API untuk GitHub/PWA):** Deploy → New deployment → Web app → **Execute as: Me**, **Who has access: Anyone** (paling bawah, *anonymous*). Salin URL `/exec`-nya → ini yang dimasukkan ke `config.js`.

> Setelah setiap ubah kode: **Manage deployments → pilih masing-masing deployment → Edit → Version: New version** (keduanya harus di-update versinya).

## Langkah 3 — Deploy ke GitHub Pages
1. Buat repo baru di GitHub (mis. `sibersih`), bisa Public.
2. Upload **seluruh isi folder `github-pages/`** ke root repo:
   - `index.html` (sama persis dengan `Index.html` versi GAS)
   - `config.js` → **edit dulu**, ganti `apiUrl` dengan URL Deployment 2 (API anonymous) dari Langkah 2.
   - `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`
   - Jika Anda sudah punya icon sendiri, timpa `icon-192.png` & `icon-512.png` dengan milik Anda (nama & ukuran harus sama).
3. Repo Settings → **Pages** → Source: **Deploy from a branch** → branch `main`, folder `/ (root)` → Save.
4. Tunggu ±1 menit, buka `https://USERNAME.github.io/sibersih/`. Akan muncul **halaman Login**. Masuk dengan email + password (admin default: email Managemen Anda, password `admin123`). **Segera ganti password** setelah login.

## Fitur PWA & Offline
- **Install aplikasi:** saat dibuka di Chrome/Edge (desktop/Android), muncul banner **"Install Aplikasi"** + tombol **Install Aplikasi (PWA)** di sidebar (bagian Akun). Di iOS Safari: Share → Add to Home Screen.
- **Offline sync:** saat tanpa sinyal, semua input (ceklis, temuan + foto, limbah) **tetap bisa disimpan** — masuk antrian offline (lihat indikator di sidebar). Saat HP dapat sinyal lagi, data **terkirim otomatis** ke server. Data bacaan (dashboard, daftar temuan, dll.) yang pernah dimuat tetap bisa dibuka offline.
- **Keamanan:** versi GitHub dilindungi **login email + password** (token SHA-256, masa sesi 30 hari, auto-perpanjang). Deployment API anonymous hanya menerima panggilan dengan token valid; tanpa token = ditolak.

## Catatan Penting
- Gunakan **manifest minimal** dari paket ini (scope: spreadsheets, drive, userinfo.email). Scope tambahan seperti `blogger`, `script.scriptapp`, `script.external_request` **tidak diperlukan** dan sebaiknya dihapus untuk mengurangi permintaan izin.
- Foto temuan saat offline disimpan dulu di HP (IndexedDB) lalu di-upload saat online — pastikan ukuran foto tidak terlalu besar (otomatis di-resize ≤1280px).
- Jika lupa password: minta admin (Managemen) reset lewat menu **Pengguna & Role → Set PW**, atau jalankan `setupPasswords` ulang di editor (hanya menyetel ulang Managemen yang belum punya password ke `admin123`).
