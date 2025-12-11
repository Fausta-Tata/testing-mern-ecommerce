## Instruksi Pengujian (Testing Instructions)

Sebelum menjalankan *test script*, harap lakukan konfigurasi akun berikut:

### 1. Persiapan Akun User (User Test Script)
Untuk menjalankan pengujian fitur User, pastikan akun berikut telah tersedia:
* **Email:** `test@gmail.com`
* **Password:** `Test123456`

> **Catatan:** Jika akun belum ada, silakan lakukan registrasi terlebih dahulu dengan kredensial di atas.

### 2. Persiapan Akun Admin (Admin Test Script)
Untuk menjalankan pengujian fitur Admin, gunakan akun berikut:
* **Email:** `demo@gmail.com`
* **Password:** `helloWorld@123`

**Langkah Konfigurasi Admin:**
1.  Jika akun belum tersedia, lakukan **registrasi** menggunakan email dan password tersebut.
2.  Akses database Andadi MongoDB, cari akun tersebut, dan ubah field/properti **`isAdmin`** dari `false` menjadi **`true`**.

---

### Catatan Penting (Known Issues)
Saat ini, *test script* untuk Admin belum sepenuhnya valid/stabil karena masih dalam tahap pengembangan.
* Untuk melihat hasil pengujian yang dimaksud atau status terkini, silakan merujuk pada **file Excel** yang telah dilampirkan dalam repositori ini.
