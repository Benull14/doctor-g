# المرحلة الثالثة - تطوير الموقع

إعداد معياري للمشروع:
- الواجهة الأمامية: React + TypeScript (Vite)
- الواجهة الخلفية: Node.js + Express + Prisma + PostgreSQL + JWT

## هيكل المشروع

- `frontend/` تطبيق الويب (React)
- `backend/` واجهة API (Express) مع Prisma ORM

## المتطلبات الأساسية

- Node.js 20+
- npm 10+
- Docker Desktop (لتشغيل PostgreSQL عبر حاوية)

## التشغيل السريع (تشغيل التطبيق كاملًا)

### 1) تشغيل قاعدة البيانات (Docker)

داخل مجلد `backend/`:

1. `docker compose up -d`
2. `docker compose ps`

يجب أن تعمل قاعدة Postgres على `localhost:5433`.

### 2) إعداد وتشغيل الواجهة الخلفية

داخل مجلد `backend/`:

1. `npm install`
2. نسخ `.env.example` إلى `.env`
3. ضبط القيم التالية في `.env` على الأقل:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `APP_BASE_URL`
4. تطبيق مخطط قاعدة البيانات:
   - الوضع القياسي: `npm run prisma:migrate`
   - إذا ظهر خطأ non-interactive: `npx prisma db push --accept-data-loss`
5. توليد Prisma Client: `npm run prisma:generate`
6. تحميل بيانات تجريبية: `npm run prisma:seed`
7. تشغيل API: `npm run dev`

تعمل الواجهة الخلفية على: `http://localhost:4000`

### 3) إعداد وتشغيل الواجهة الأمامية

داخل مجلد `frontend/`:

1. `npm install`
2. `npm run dev`

تعمل الواجهة الأمامية على: `http://localhost:5173`

## التشغيل اليومي (بعد الإعداد الأول)

عادة تكفي هذه الأوامر:

1. `docker compose up -d` (داخل `backend/`)
2. `npm run dev` داخل `backend/`
3. `npm run dev` داخل `frontend/`

## حسابات اختبار (من Seed)

- المشرف: `admin@doctor-g.local` / `Admin123!`
- طبيب: `noor@doctor-g.local` / `Doctor123!`
- طبيب: `sara@doctor-g.local` / `Doctor123!`
- مريض: `ahmad@doctor-g.local` / `Patient123!`

## SMTP / تأكيد البريد الإلكتروني

الحسابات الجديدة يجب أن تؤكد البريد الإلكتروني قبل السماح بتسجيل الدخول.

في `backend/.env`:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE` (`true` أو `false`)
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM` (مستحسن، مثل: `support@yourdomain.com`)

ملاحظات:
- إذا لم يتم ضبط SMTP، سيتم طباعة رابط التحقق في سجل الـBackend (وضع احتياطي).
- إذا تم ضبط SMTP (مثل SendGrid)، سيتم إرسال بريد حقيقي.

## أهم نقاط الـ API

- عامة (Public):
  - `GET /api/health`
  - `GET /api/doctors`
  - `GET /api/doctors/:id/availability`
- المصادقة (Auth):
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `GET /api/auth/verify-email?token=...`
- المواعيد (JWT protected):
  - `POST /api/appointments` (`patient`, `admin`)
  - `GET /api/appointments` (`patient`, `doctor`, `admin`)
  - `PATCH /api/appointments/:appointmentId/status` (`doctor`, `admin`)
- لوحة الطبيب (JWT protected):
  - `GET /api/doctor-dashboard/:doctorId` (`doctor`, `admin`)
  - `PUT /api/doctor-dashboard/:doctorId/availability` (`doctor`, `admin`)

## حل المشاكل الشائعة

- **الواجهة الخلفية غير متاحة (`ECONNREFUSED`)**
  - تأكد أن `backend` يعمل فعلًا عبر `npm run dev`.
- **خطأ في الواجهة الأمامية: `Failed to resolve import react-router-dom`**
  - داخل `frontend/` شغل `npm install` ثم أعد تشغيل dev server.
- **Prisma Migration لا تعمل في وضع non-interactive**
  - استخدم: `npx prisma db push --accept-data-loss`.
- **البريد لا يصل**
  - تأكد من إعدادات SMTP، وأن `SMTP_USER=apikey` (مع SendGrid)، وأن الدومين/عنوان المرسل موثق، وافحص مجلد Spam.
