# Semester Project - Phase 1: Requirements Analysis  
# مشروع فصلي - المرحلة الأولى: تحليل المتطلبات

## Project Information | معلومات المشروع
- **University | الجامعة:** Al-Wataniya Private University (الجامعة الوطنية الخاصة)
- **Department | القسم:** _To be filled | لم يتم تعبئته بعد_
- **Project Name (Arabic) | اسم المشروع (عربي):** نظام حجز مواعيد ودليل أطباء
- **Project Name (English) | اسم المشروع (إنجليزي):** Doctor Appointment Booking and Directory System

## Team Members | المشاركون
- **أبي الزعيم (Abi Al-Zaim)** - Tel: 0934904628
- **بلال شومل (Bilal Shoumel)** - Tel: 0988744697

## 1) Project Overview | نظرة عامة على المشروع
This project is a web-based platform to provide a digital doctors directory with appointment booking.  
يهدف المشروع إلى إنشاء منصة ويب توفر دليلا رقميا للأطباء مع إمكانية حجز المواعيد.

Users can search doctors by specialty, location, and availability, then book appointments easily.  
يمكن للمستخدمين البحث عن الأطباء حسب الاختصاص والموقع ومواعيد العمل ثم حجز موعد بسهولة.

## 2) Problem Statement | المشكلة
Patients often struggle to find suitable doctors because information is scattered, incomplete, or outdated.  
يواجه المرضى صعوبة في العثور على طبيب مناسب بسبب تشتت المعلومات أو نقصها أو قدمها.

A centralized and reliable platform is needed for search, profiles, booking, and ratings.  
توجد حاجة إلى منصة مركزية وموثوقة للبحث والملفات الشخصية والحجز والتقييم.

## 3) Objectives (Phase 1) | أهداف المرحلة الأولى
- Provide an easy and fast doctor search experience.  
  توفير تجربة بحث سهلة وسريعة عن الأطباء.
- Standardize doctor profile information.  
  توحيد معلومات الملف الشخصي للطبيب.
- Enable online appointment booking.  
  تمكين حجز المواعيد عبر الإنترنت.
- Add a transparent patient rating system.  
  إضافة نظام تقييم واضح من قبل المرضى.
- Prepare a scalable foundation for later phases.  
  تجهيز أساس قابل للتوسع للمراحل القادمة.

## 4) Stakeholders | أصحاب المصلحة
- **Patients | المرضى:** search doctors, book appointments, submit ratings.  
  البحث عن طبيب، حجز موعد، وإضافة تقييم.
- **Doctors | الأطباء:** manage profile details and availability.  
  إدارة بيانات الملف الشخصي وأوقات العمل.
- **Administrators | المشرفون:** manage doctors data and moderate ratings.  
  إدارة بيانات الأطباء ومراجعة التقييمات.

## 5) Functional Requirements | المتطلبات الوظيفية

### FR-01 Search System | نظام البحث
- Search by **specialty**, **location/region**, and **doctor name**.  
  البحث حسب **الاختصاص** و**المنطقة/الموقع** و**اسم الطبيب**.
- Support combined filters.  
  دعم استخدام عدة فلاتر معا.
- Show concise result cards (name, specialty, location, rating).  
  عرض نتائج مختصرة (الاسم، الاختصاص، الموقع، التقييم).

### FR-02 Doctor Profile | صفحة ملف الطبيب
- Display at least: name, specialty, address, phone, certifications, working hours.  
  عرض: الاسم، الاختصاص، العنوان، رقم الهاتف، الشهادات، أوقات العمل.
- Show average rating clearly.  
  عرض متوسط التقييم بشكل واضح.

### FR-03 Appointment Booking | حجز المواعيد
- Show available time slots.  
  عرض المواعيد المتاحة.
- Allow selecting and submitting an appointment request.  
  السماح باختيار الموعد وإرساله.
- Confirm successful booking to the user.  
  تأكيد نجاح عملية الحجز للمستخدم.

### FR-04 Rating System | نظام التقييم
- Patients can rate doctors (e.g., 1-5 stars).  
  يمكن للمريض تقييم الطبيب (مثلا من 1 إلى 5 نجوم).
- Average rating appears on doctor profile.  
  يظهر متوسط التقييم في صفحة الطبيب.
- Optional short review/comment.  
  تعليق قصير اختياري.

### FR-05 Admin Management | إدارة المشرف
- Add/edit/deactivate doctor profiles.  
  إضافة وتعديل وتعطيل ملفات الأطباء.
- Hide inappropriate reviews when necessary.  
  إخفاء التقييمات غير المناسبة عند الحاجة.

### FR-06 Doctor Availability and Schedule Management | إدارة توفر الطبيب والجدول
- Doctors can define weekly availability (working days, start/end times, and break times).  
  يمكن للطبيب تحديد أوقات التوفر الأسبوعية (أيام العمل، وقت البداية/النهاية، وأوقات الاستراحة).
- Doctors can add exceptions such as vacation, leave, or special closures.  
  يمكن للطبيب إضافة استثناءات مثل الإجازات أو الغياب أو الإغلاق الخاص.
- Doctors can confirm, reschedule, or cancel appointments based on real availability.  
  يمكن للطبيب تأكيد المواعيد أو إعادة جدولتها أو إلغاؤها حسب التوفر الفعلي.
- The system must prevent double-booking for the same time slot.  
  يجب أن يمنع النظام الحجز المزدوج لنفس الفترة الزمنية.

### FR-07 Guest Access + Mandatory Login for Booking/Rating | وصول الزائر + إلزام تسجيل الدخول للحجز والتقييم
- Guests can search doctors and view working hours without login.  
  يمكن للزائر البحث عن الأطباء ومشاهدة أوقات العمل دون تسجيل دخول.
- Booking and rating actions require an authenticated account.  
  يجب تسجيل الدخول للحجز أو إضافة تقييم.
- If user has no account, registration must be available for patient and doctor roles.  
  إذا لم يكن لدى المستخدم حساب، يجب توفير التسجيل كـ مريض أو طبيب.

### FR-08 Email Verification after Registration | تأكيد البريد الإلكتروني بعد التسجيل
- New users must verify email before first login.  
  يجب على المستخدم الجديد تأكيد البريد قبل أول تسجيل دخول.
- System sends a verification link to the registered email address.  
  يرسل النظام رابط تأكيد إلى البريد الإلكتروني المسجل.
- Login is blocked until email verification is completed.  
  يتم منع تسجيل الدخول حتى يكتمل تأكيد البريد.

## 6) Non-Functional Requirements | المتطلبات غير الوظيفية
- **Usability | سهولة الاستخدام:** clean navigation and simple forms.  
  تنقل واضح ونماذج إدخال سهلة.
- **Performance | الأداء:** fast loading of search results and profile pages.  
  سرعة تحميل نتائج البحث وصفحات الأطباء.
- **Security | الأمان:** protect personal data and validate user input.  
  حماية البيانات الشخصية والتحقق من المدخلات.
- **Availability | التوفر:** stable and reliable website access.  
  ضمان استقرار وإتاحة الموقع.
- **Maintainability | قابلية الصيانة:** modular architecture for future features.  
  بنية مرنة تسهل الإضافة والصيانة.
- **Responsive Design | التصميم المتجاوب:** support desktop, tablet, and mobile.  
  دعم أجهزة الكمبيوتر والأجهزة اللوحية والهواتف.

## 7) Use Cases | حالات الاستخدام

### UC-01 Search for a Doctor | البحث عن طبيب
- **Actor | الممثل:** Patient | المريض
- **Precondition | الشرط المسبق:** Website is accessible | الموقع متاح
- **Main Flow | السيناريو الرئيسي:**
  1. Patient opens search page. | يفتح المريض صفحة البحث.
  2. Patient enters specialty/location/name filters. | يدخل معايير البحث.
  3. System displays matching doctors. | يعرض النظام الأطباء المطابقين.
- **Outcome | النتيجة:** Relevant doctors list is shown. | تظهر قائمة الأطباء المناسبة.

### UC-02 View Doctor Profile | عرض ملف الطبيب
- **Actor | الممثل:** Patient | المريض
- **Precondition | الشرط المسبق:** Search results exist | وجود نتائج بحث
- **Main Flow | السيناريو الرئيسي:**
  1. Patient clicks a doctor from list. | يضغط المريض على طبيب من القائمة.
  2. System opens doctor profile page. | يفتح النظام صفحة الطبيب.
  3. Patient views details and ratings. | يطالع المريض التفاصيل والتقييمات.
- **Outcome | النتيجة:** Patient can decide to book. | يستطيع المريض اتخاذ قرار الحجز.

### UC-03 Book Appointment | حجز موعد
- **Actor | الممثل:** Patient | المريض
- **Precondition | الشرط المسبق:** Patient is on doctor profile page | وجود المريض في صفحة الطبيب
- **Main Flow | السيناريو الرئيسي:**
  1. Patient selects an available slot. | يختار المريض موعدا متاحا.
  2. Patient confirms booking request. | يؤكد طلب الحجز.
  3. System saves booking and shows confirmation. | يحفظ النظام الحجز ويعرض التأكيد.
- **Outcome | النتيجة:** Appointment is created. | يتم إنشاء الموعد.

### UC-04 Submit Rating | إضافة تقييم
- **Actor | الممثل:** Patient | المريض
- **Precondition | الشرط المسبق:** Appointment is completed | إتمام الموعد
- **Main Flow | السيناريو الرئيسي:**
  1. Patient opens rating section. | يفتح المريض قسم التقييم.
  2. Patient submits stars and optional comment. | يرسل عدد النجوم وتعليقا اختياريا.
  3. System updates average rating. | يحدث النظام متوسط التقييم.
- **Outcome | النتيجة:** Rating is recorded and visible. | يتم حفظ التقييم وإظهاره.

### UC-05 Manage Doctors Data | إدارة بيانات الأطباء
- **Actor | الممثل:** Administrator | المشرف
- **Precondition | الشرط المسبق:** Admin is authenticated | تسجيل دخول المشرف
- **Main Flow | السيناريو الرئيسي:**
  1. Admin creates or updates doctor profile. | ينشئ المشرف الملف أو يعدله.
  2. System validates data. | يتحقق النظام من صحة البيانات.
  3. Changes are published. | يتم نشر التعديلات.
- **Outcome | النتيجة:** Directory stays up to date. | يبقى الدليل محدثا.

### UC-06 Manage Availability and Appointments | إدارة التوفر والمواعيد
- **Actor | الممثل:** Doctor | الطبيب
- **Precondition | الشرط المسبق:** Doctor is authenticated | تسجيل دخول الطبيب
- **Main Flow | السيناريو الرئيسي:**
  1. Doctor opens schedule management page. | يفتح الطبيب صفحة إدارة الجدول.
  2. Doctor sets available working hours and break periods. | يحدد الطبيب ساعات العمل المتاحة وفترات الاستراحة.
  3. Doctor reviews appointment requests and confirms/reschedules/cancels them. | يراجع الطبيب طلبات المواعيد ويقوم بالتأكيد أو إعادة الجدولة أو الإلغاء.
  4. System updates patient-facing availability in real time. | يقوم النظام بتحديث التوفر الظاهر للمرضى بشكل مباشر.
- **Outcome | النتيجة:** Calendar remains accurate and manageable. | يبقى جدول المواعيد دقيقا وسهل الإدارة.

### UC-07 Guest Browsing | تصفح كزائر
- **Actor | الممثل:** Guest | زائر
- **Precondition | الشرط المسبق:** Website is accessible | الموقع متاح
- **Main Flow | السيناريو الرئيسي:**
  1. Guest opens doctors search page. | يفتح الزائر صفحة البحث عن الأطباء.
  2. Guest filters by specialty/city/name. | يقوم بالتصفية حسب الاختصاص/المدينة/الاسم.
  3. Guest views doctor profile and working hours. | يعرض الملف الشخصي وأوقات العمل.
- **Outcome | النتيجة:** Guest can explore doctors without account. | يمكنه الاستعراض دون حساب.

### UC-08 Register and Verify Email | التسجيل وتأكيد البريد الإلكتروني
- **Actor | الممثل:** Guest (future patient/doctor) | زائر (مريض/طبيب مستقبلا)
- **Precondition | الشرط المسبق:** User does not have account | لا يوجد حساب مسبق
- **Main Flow | السيناريو الرئيسي:**
  1. User opens patient or doctor registration page. | يفتح صفحة تسجيل المريض أو الطبيب.
  2. User submits form with email and password. | يرسل النموذج مع البريد وكلمة المرور.
  3. System sends email verification link. | يرسل النظام رابط التأكيد إلى البريد.
  4. User confirms email through verification link. | يؤكد المستخدم بريده عبر الرابط.
  5. User logs in and gets full features. | يسجل الدخول ويصل للميزات الكاملة.
- **Outcome | النتيجة:** Account is activated and ready for protected actions. | يتم تفعيل الحساب لاستخدام العمليات المحمية.

## 8) Acceptance Criteria | معايير القبول
- Search works correctly with combined filters.  
  يعمل البحث بشكل صحيح مع الفلاتر المتعددة.
- Doctor profile includes all required fields.  
  يحتوي ملف الطبيب على جميع الحقول المطلوبة.
- Booking flow is clear and completes successfully.  
  مسار الحجز واضح وينتهي بنجاح.
- New ratings affect average score correctly.  
  يؤثر كل تقييم جديد بشكل صحيح على المتوسط.
- Core pages are mobile responsive.  
  الصفحات الأساسية متوافقة مع الهواتف.
- Doctors can manage availability and appointment statuses without conflicts.  
  يمكن للطبيب إدارة التوفر وحالات المواعيد دون تعارض.
- Guest can browse search and working hours without login.  
  يستطيع الزائر التصفح والبحث وأوقات العمل دون تسجيل دخول.
- Booking/rating endpoints reject unauthenticated requests.  
  ترفض نقاط الحجز والتقييم الطلبات غير المسجلة.
- New account cannot login before email confirmation.  
  الحساب الجديد لا يمكنه تسجيل الدخول قبل تأكيد البريد.

## 9) Scope and Assumptions (Phase 1) | النطاق والافتراضات (المرحلة الأولى)
- Phase 1 focuses on analysis and specification only.  
  تركز المرحلة الأولى على التحليل والتوصيف فقط.
- Online payments are out of scope for the first version.  
  الدفع الإلكتروني خارج نطاق النسخة الأولى.
- Advanced multilingual UX can be expanded in later phases.  
  يمكن توسيع دعم تعدد اللغات في مراحل لاحقة.

## 10) Planned Tech Stack (React-based) | التقنية المقترحة (مبنية على React)

### Frontend
- **React** with **TypeScript**
- **Vite**
- **React Router**
- **Axios**
- **Tailwind CSS** or **Material UI**
- **React Hook Form**

### Backend (Recommended)
- **Node.js + Express**
- **JWT** authentication
- **Bcrypt** password hashing

### Database
- **PostgreSQL**
- **Prisma ORM**

### Quality and Deployment
- **Git + GitHub**
- **ESLint + Prettier**
- **Vitest + React Testing Library**
- Frontend: **Vercel / Netlify**  
- Backend: **Render / Railway**

## 11) Next Step (Phase 2) | الخطوة التالية (المرحلة الثانية)
Design artifacts to be produced in Phase 2:  
المخرجات التصميمية المتوقعة في المرحلة الثانية:
- ERD and data model | مخطط قاعدة البيانات
- API endpoints specification | توصيف نقاط API
- Page structure and wireframes | هيكل الصفحات والنماذج الأولية
- Roles and permissions model | نموذج الصلاحيات والأدوار
