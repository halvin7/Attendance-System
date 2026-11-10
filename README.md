# WFH Attendance System

Aplikasi absensi Work From Home (WFH) untuk mencatat check-in dan check-out karyawan, menyimpan foto bukti absensi, serta membantu HRD mengelola data karyawan dan memantau riwayat kehadiran.

## Tech Stack

### Frontend

- **React** – membangun antarmuka aplikasi.
- **TypeScript** – type safety pada kode frontend.
- **Vite** – development server dan build tool.
- **Tailwind CSS** – styling dan responsive layout.
- **React Router** – navigasi halaman.
- **Axios** – komunikasi HTTP dengan backend.
- **Sonner** – notifikasi toast.

### Backend

- **Node.js + Bun** – runtime dan package manager.
- **NestJS** – framework backend.
- **NestJS Microservices (TCP)** – komunikasi antara API Gateway dan service.
- **TypeScript** – bahasa pemrograman backend.
- **TypeORM** – ORM untuk akses database.
- **MySQL** – relational database.

### Development Tools

- **MySQL Workbench** – mengelola database MySQL.
- **Postman** – testing REST API.
- **Prettier** – code formatter.
- **Git** – version control.

## Architecture

Backend menggunakan pendekatan microservices dengan tiga aplikasi:

| Application        | Description                                                               | Port |
| ------------------ | ------------------------------------------------------------------------- | ---: |
| API Gateway        | REST API, autentikasi JWT, upload foto, dan meneruskan request ke service | 3000 |
| Auth Service       | Login dan pengelolaan data karyawan                                       | 4001 |
| Attendance Service | Check-in, check-out, dan data absensi                                     | 4002 |

Frontend berkomunikasi dengan API Gateway melalui HTTP. API Gateway berkomunikasi dengan Auth Service dan Attendance Service menggunakan TCP.

## Main Features

- Login menggunakan email dan password.
- Autentikasi menggunakan JWT.
- Role pengguna: `HRD` dan `EMPLOYEE`.
- Check-in dengan foto bukti.
- Check-out dengan foto bukti.
- Melihat riwayat absensi pribadi.
- HRD dapat melihat data absensi karyawan.
- HRD dapat melihat, menambah, mengubah, dan menonaktifkan data karyawan.
- Validasi agar karyawan tidak melakukan check-in lebih dari satu kali pada tanggal yang sama.
- Validasi agar check-out hanya dapat dilakukan setelah check-in.

## Project Structure

```text
project-root/
├── frontend/
│   └── src/                     # React frontend
├── backend/
│   ├── apps/
│   │   ├── api-gateway/         # HTTP REST API
│   │   ├── auth-service/        # Authentication & employee service
│   │   └── attendance-service/  # Attendance service
│   ├── src/
│   │   ├── shared/
│   │   │   └── entities/        # TypeORM entities
│   │   └── seed.ts              # Demo data seeder
│   └── .env.example
├── database/
│   └── schema.sql               # Database schema
└── README.md
```

> Struktur folder dapat sedikit berbeda mengikuti kondisi source code yang digunakan.

## Requirements

Pastikan tools berikut sudah ter-install:

- [Bun](https://bun.sh/)
- [Node.js](https://nodejs.org/) (jika dibutuhkan oleh tooling)
- [MySQL](https://www.mysql.com/) atau MySQL Server melalui XAMPP
- [MySQL Workbench](https://www.mysql.com/products/workbench/)
- [Postman](https://www.postman.com/)

## Installation & Setup

### 1. Clone repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Setup database

1. Jalankan MySQL Server.
2. Buat database bernama `wfh_attendance`.
3. Jalankan file `database/schema.sql` melalui MySQL Workbench jika schema belum tersedia.
4. Pastikan konfigurasi database pada file environment sesuai dengan MySQL lokal Anda.

### 3. Setup backend

Masuk ke folder backend:

```bash
cd backend
```

Install dependencies:

```bash
bun install
```

Buat file `.env` berdasarkan `.env.example`, kemudian sesuaikan konfigurasi database dan JWT secret.

Jalankan database seeder:

```bash
bun run seed
```

### 4. Run backend services

Jalankan setiap aplikasi pada terminal terpisah dari folder `backend`:

**Terminal 1 – Auth Service**

```bash
bun run dev:auth
```

**Terminal 2 – Attendance Service**

```bash
bun run dev:attendance
```

**Terminal 3 – API Gateway**

```bash
bun run dev:gateway
```

API Gateway berjalan di:

```text
http://localhost:3000
```

### 5. Setup frontend

Buka terminal baru, lalu masuk ke folder frontend:

```bash
cd frontend
bun install
bun run dev
```

Frontend secara default berjalan di:

```text
http://localhost:5173
```

## API Endpoints

Base URL: `http://localhost:3000/api`

### Authentication

| Method | Endpoint      | Description    |
| ------ | ------------- | -------------- |
| POST   | `/auth/login` | Login pengguna |

### Attendance

| Method | Endpoint                | Description                     |
| ------ | ----------------------- | ------------------------------- |
| POST   | `/attendance/check-in`  | Check-in dengan upload foto     |
| POST   | `/attendance/check-out` | Check-out                       |
| GET    | `/attendance/me`        | Melihat riwayat absensi sendiri |
| GET    | `/attendance`           | Melihat data absensi (HRD)      |

### Employees (HRD)

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| GET    | `/employees`     | Mendapatkan daftar karyawan |
| GET    | `/employees/:id` | Mendapatkan detail karyawan |
| POST   | `/employees`     | Menambahkan karyawan        |
| PATCH  | `/employees/:id` | Mengubah data karyawan      |
| DELETE | `/employees/:id` | Menonaktifkan karyawan      |

Untuk check-in, kirim request sebagai `multipart/form-data` dengan field foto bernama `photo`.

## Demo Accounts

Jika seeder menyediakan akun demo, gunakan kredensial berikut:

| Role     | Email              | Password      |
| -------- | ------------------ | ------------- |
| HRD      | `adminHR@demo.com` | `HRAdmin123!` |
| Employee | `emp123@demo.com`  | `SoftEng123!` |

## Useful Backend Commands

Jalankan dari folder `backend`:

```bash
# Run services
bun run dev:gateway
bun run dev:auth
bun run dev:attendance

# Build backend applications
bun run build

# Seed demo data
bun run seed

# Format source code
bun run format

# Check formatting
bun run format:check
```

Developed as a technical test project.
