# QA Execution Guide -- MERN E-Commerce

UAS Software Testing & Quality Assurance

## 1. Prerequisites

Pastikan perangkat berikut telah terpasang sebelum menjalankan
pengujian:

-   **Node.js & NPM** -- diperlukan untuk Cypress\
-   **Java Development Kit (JDK 8+)** -- untuk JMeter & OWASP ZAP\
-   **Apache JMeter** -- untuk Performance Testing\
-   **OWASP ZAP** -- untuk Security Testing

------------------------------------------------------------------------

## 2. Menjalankan Aplikasi (System Under Test)

Sebelum menjalankan skrip pengujian, pastikan **Frontend** dan
**Backend** sudah berjalan.

### Langkah:

1.  Ikuti panduan instalasi pada README utama repo.\

2.  Jalankan aplikasi:

        npm start

3.  Pastikan dapat diakses:

    -   Frontend: `http://localhost:3000`\
    -   Backend: `http://localhost:8000`

> Jika aplikasi tidak berjalan, tes Cypress akan gagal (Connection
> Refused).

------------------------------------------------------------------------

## 3. Functional Testing (Cypress)

Pengujian mencakup Authentication, Shopping Flow, User Account
Management, dan Admin Dashboard.

### A. Mode Visual (Interaktif)

Untuk melihat proses tes langsung di browser.

    npx cypress open

Langkah: - Pilih **E2E Testing**\
- Pilih browser\
- Jalankan file tes: - `authentication.cy.js` - `shopping-flow.cy.js` -
`user-account-management.cy.js` - `admin-dashboard.cy.js`

### B. Mode Headless (Cepat)

Jalankan semua tes secara otomatis:

    npx cypress run

Output: - Video: `cypress/videos/`\
- Screenshot error: `cypress/screenshots/`

------------------------------------------------------------------------

## 4. Non‑Functional Testing

### 1. Performance Testing (JMeter)

1.  Buka **Apache JMeter**\
2.  File → Open\
3.  Pilih folder `tests/performance/`\
4.  Pilih file `.jmx` (contoh: `LoadTest_Homepage.jmx`)\
5.  Klik **Start**

### 2. Security Testing (OWASP ZAP)

1.  Buka **OWASP ZAP**\
2.  Pilih **Automated Scan**\
3.  Masukkan URL: `http://localhost:3000`\
4.  Klik **Attack**\
5.  Generate report via **Report → Generate Report**

### 3. Accessibility Testing (Lighthouse)

1.  Buka Chrome → `http://localhost:3000`\
2.  Klik kanan → Inspect\
3.  Tab **Lighthouse**\
4.  Centang **Accessibility**\
5.  Klik **Analyze page load**

------------------------------------------------------------------------

## 5. Struktur File & Lokasi Laporan

  Kategori         Lokasi Folder           Deskripsi
  ---------------- ----------------------- -----------------------
  Script Cypress   `/cypress/e2e/`         Tes fungsional
  Data Dummy       `/cypress/fixtures/`    Data user & produk
  Laporan      `/test-document`     Test Report & Test Plan
  

> Pastikan port **3000** dan **8000** tidak dipakai aplikasi lain untuk
> menghindari konflik.
