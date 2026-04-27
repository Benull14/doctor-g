# Semester Project - Phase 2: System Design  
# مشروع فصلي - المرحلة الثانية: تصميم النظام

## 1) Design Goals | أهداف التصميم
- Build a scalable and maintainable web system for doctor directory and appointment booking.  
  بناء نظام ويب قابل للتوسع وسهل الصيانة لدليل الأطباء وحجز المواعيد.
- Separate concerns between UI, API, business logic, and database.  
  فصل المسؤوليات بين الواجهة الأمامية وواجهة البرمجة والمنطق التجاري وقاعدة البيانات.
- Ensure secure role-based access (Patient, Doctor, Admin).  
  ضمان وصول آمن قائم على الأدوار (مريض، طبيب، مشرف).

## 2) High-Level Architecture | البنية العامة للنظام

```mermaid
flowchart LR
    U[Users: Patients, Doctors, Admins] --> FE[React Frontend: Vite + TypeScript]
    FE --> API[REST API: Node.js + Express]
    API --> DB[(PostgreSQL)]
    API --> FS[File Storage: Certificates/Images]
    API --> NTF[Notification Service: Email/SMS optional]
```

### Components | المكونات
- **Frontend (React):** pages, forms, search, dashboards.  
  الواجهة الأمامية: الصفحات، النماذج، البحث، ولوحات التحكم.
- **Backend (Express):** authentication, authorization, booking logic, validations.  
  الخلفية: المصادقة، الصلاحيات، منطق الحجز، والتحقق من البيانات.
- **Database (PostgreSQL):** persistent storage for users, doctors, availability, appointments, ratings.  
  قاعدة البيانات: تخزين المستخدمين، الأطباء، التوفر، المواعيد، والتقييمات.

## 3) Core Modules | الوحدات الأساسية
- **Auth Module | وحدة المصادقة:** register/login, JWT tokens, role checks.  
- **Doctor Directory Module | وحدة دليل الأطباء:** profiles, specialties, location filters.  
- **Availability Module | وحدة التوفر:** weekly schedules + exceptions (time off).  
- **Appointment Module | وحدة المواعيد:** create, confirm, reschedule, cancel, status tracking.  
- **Rating Module | وحدة التقييم:** patient ratings, average score calculation, moderation.

## 4) Database Design (ERD) | تصميم قاعدة البيانات

```mermaid
erDiagram
    USERS ||--o{ APPOINTMENTS : books
    USERS ||--o{ RATINGS : writes
    DOCTORS ||--o{ APPOINTMENTS : receives
    DOCTORS ||--o{ RATINGS : has
    DOCTORS ||--o{ DOCTOR_AVAILABILITY : defines
    DOCTORS ||--o{ DOCTOR_TIME_OFF : blocks
    SPECIALTIES ||--o{ DOCTORS : categorizes

    USERS {
      int id PK
      string full_name
      string email
      string phone
      string password_hash
      string role "patient|doctor|admin"
      datetime created_at
    }

    DOCTORS {
      int id PK
      int user_id FK
      int specialty_id FK
      string clinic_address
      string city
      string certificates_url
      int consultation_minutes
      bool is_active
    }

    SPECIALTIES {
      int id PK
      string name_en
      string name_ar
    }

    DOCTOR_AVAILABILITY {
      int id PK
      int doctor_id FK
      int weekday "0-6"
      time start_time
      time end_time
      time break_start
      time break_end
    }

    DOCTOR_TIME_OFF {
      int id PK
      int doctor_id FK
      date start_date
      date end_date
      string reason
    }

    APPOINTMENTS {
      int id PK
      int patient_user_id FK
      int doctor_id FK
      datetime start_at
      datetime end_at
      string status "pending|confirmed|completed|cancelled|no_show"
      string notes
      datetime created_at
    }

    RATINGS {
      int id PK
      int appointment_id FK
      int patient_user_id FK
      int doctor_id FK
      int stars "1-5"
      string comment
      datetime created_at
    }
```

## 5) API Design (Draft) | تصميم واجهات API (مسودة)

### Authentication | المصادقة
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/verify-email?token=...`

### Doctors Directory | دليل الأطباء
- `GET /api/doctors?specialty=&city=&name=`
- `GET /api/doctors/:id`
- `PATCH /api/doctors/:id` (doctor/admin)

### Availability Management | إدارة التوفر
- `GET /api/doctor/availability`
- `PUT /api/doctor/availability`
- `POST /api/doctor/time-off`
- `DELETE /api/doctor/time-off/:id`

### Appointment Management | إدارة المواعيد
- `POST /api/appointments` (patient)
- `GET /api/appointments/my` (patient/doctor by role)
- `PATCH /api/appointments/:id/status` (doctor/admin)
- `PATCH /api/appointments/:id/reschedule` (doctor/patient rules)

### Ratings | التقييمات
- `POST /api/ratings` (patient after completed appointment)
- `GET /api/doctors/:id/ratings`
- `DELETE /api/ratings/:id` (admin moderation)

## 6) Role & Permission Model | نموذج الأدوار والصلاحيات

```mermaid
flowchart TB
    P[Patient] --> P1[Search Doctors]
    P --> P2[Book Appointment]
    P --> P3[Cancel Own Appointment]
    P --> P4[Rate Doctor]

    D[Doctor] --> D1[Manage Profile]
    D --> D2[Manage Availability]
    D --> D3[Confirm/Reschedule/Cancel Appointments]
    D --> D4[View Own Ratings]

    A[Admin] --> A1[Manage Doctors]
    A --> A2[Moderate Ratings]
    A --> A3[Manage System Data]
```

## 7) Main Workflows | سير العمل الرئيسي

### 7.1 Appointment Booking Flow | تدفق حجز الموعد

```mermaid
sequenceDiagram
    participant Patient
    participant Frontend
    participant API
    participant DB

    Patient->>Frontend: Search doctor and open profile
    Frontend->>API: GET /api/doctors/:id
    API->>DB: Read doctor + availability
    DB-->>API: Doctor data
    API-->>Frontend: Profile + available slots
    Patient->>Frontend: Select slot and confirm
    Frontend->>API: POST /api/appointments
    API->>DB: Validate slot + insert appointment
    DB-->>API: Appointment created
    API-->>Frontend: Booking confirmation
```

### 7.2 Doctor Schedule Management Flow | تدفق إدارة جدول الطبيب

```mermaid
sequenceDiagram
    participant Doctor
    participant Frontend
    participant API
    participant DB

    Doctor->>Frontend: Update weekly availability
    Frontend->>API: PUT /api/doctor/availability
    API->>DB: Save schedule rules
    DB-->>API: Updated
    API-->>Frontend: Success response
    Doctor->>Frontend: Confirm/reschedule an appointment
    Frontend->>API: PATCH /api/appointments/:id/status
    API->>DB: Update appointment status
    DB-->>API: Updated
    API-->>Frontend: Success response
```

## 8) Frontend Page Structure | هيكل صفحات الواجهة الأمامية
- `/` Home + quick search | الصفحة الرئيسية + بحث سريع
- `/doctors` Search results | نتائج البحث
- `/doctors/:id` Doctor profile + available slots | ملف الطبيب + المواعيد المتاحة
- `/login` / `/register` Authentication | تسجيل الدخول / إنشاء حساب
- `/patient/appointments` My appointments | مواعيدي
- `/doctor/dashboard` Doctor panel | لوحة الطبيب
- `/admin/dashboard` Admin panel | لوحة المشرف

## 9) Validation & Business Rules | قواعد التحقق والمنطق
- No overlapping appointments for same doctor and time slot.  
  عدم السماح بتداخل المواعيد للطبيب نفسه.
- Rating allowed only for completed appointments.  
  التقييم مسموح فقط بعد إتمام الموعد.
- Doctors can manage only their own schedules and appointments.  
  الطبيب يدير جدوله ومواعيده فقط.
- Admin can override for moderation and support.  
  يمكن للمشرف التدخل لأغراض الإدارة والدعم.

## 10) Security Design | التصميم الأمني
- JWT-based authentication with role claims.  
  مصادقة باستخدام JWT تتضمن الأدوار.
- Password hashing with bcrypt.  
  تشفير كلمات المرور باستخدام bcrypt.
- Input validation and sanitization on all APIs.  
  التحقق وتنقية المدخلات في جميع الواجهات.
- Rate limiting on auth and booking endpoints.  
  تقييد المعدل على نقاط الدخول الحساسة.
- Audit logs for sensitive actions (status changes, deletions).  
  سجلات تدقيق للعمليات الحساسة.

## 13) Registration and Email Verification Design | تصميم التسجيل وتأكيد البريد
- Separate registration paths for patient and doctor roles in frontend routes.  
  مسارات تسجيل منفصلة للمريض والطبيب في الواجهة الأمامية.
- Registration stores account as unverified (`emailVerified = false`) with verification token and expiry.  
  يتم إنشاء الحساب كغير مؤكد مع رمز تأكيد وتاريخ صلاحية.
- Verification email includes one-time link (`/verify-email?token=...`).  
  رسالة التأكيد تتضمن رابطا لمرة واحدة.
- Login endpoint denies unverified accounts until email confirmation succeeds.  
  نقطة تسجيل الدخول ترفض الحسابات غير المؤكدة.
- Guest access is allowed for doctor search and availability viewing only.  
  يسمح للزوار بالبحث ومشاهدة أوقات العمل فقط.
- Booking and rating are protected features requiring authenticated accounts.  
  الحجز والتقييم ميزات محمية تتطلب تسجيل دخول.

## 11) Deployment View | منظور النشر

```mermaid
flowchart LR
    FEHost[Vercel / Netlify] --> APIServer[Render / Railway]
    APIServer --> PG[(PostgreSQL Managed DB)]
    APIServer --> Storage[(Cloud Storage)]
```

## 12) Deliverables of Phase 2 | مخرجات المرحلة الثانية
- System architecture diagram | مخطط معمارية النظام
- ERD/data model | نموذج الكيانات والعلاقات
- API endpoints draft | مسودة واجهات API
- Main sequence diagrams | مخططات التسلسل الأساسية
- Role-permission matrix | مصفوفة الأدوار والصلاحيات
