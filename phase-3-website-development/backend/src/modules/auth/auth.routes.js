import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/auth.js";
import { sendVerificationEmail } from "../../lib/mailer.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "patient",
      phone,
      specialty = "",
      city = ""
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "الاسم والبريد وكلمة المرور مطلوبة." });
    }

    if (!["patient", "doctor", "admin"].includes(role)) {
      return res.status(400).json({ message: "الدور غير صالح." });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "البريد مستخدم مسبقا." });
    }

    const emailVerifyToken = crypto.randomBytes(24).toString("hex");
    const emailVerifyTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const passwordHash = await bcrypt.hash(password, 10);
    const createdUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role,
        emailVerified: false,
        emailVerifyToken,
        emailVerifyTokenExpiresAt
      }
    });

    if (role === "doctor") {
      await prisma.doctor.create({
        data: {
          userId: createdUser.id,
          specialty: specialty || "غير محدد",
          city: city || "غير محدد",
          phone: phone || "",
          rating: 5
        }
      });
    }

    const appBaseUrl = process.env.APP_BASE_URL || "http://localhost:5173";
    const verifyUrl = `${appBaseUrl}/verify-email?token=${emailVerifyToken}`;
    await sendVerificationEmail({ to: createdUser.email, name: createdUser.name, verifyUrl });

    return res.status(201).json({
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
      message: "تم إنشاء الحساب. يرجى تأكيد البريد الإلكتروني عبر الرابط المرسل."
    });
  } catch (_error) {
    return res.status(500).json({ message: "حدث خطأ أثناء إنشاء الحساب." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "البريد وكلمة المرور مطلوبان." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "بيانات الدخول غير صحيحة." });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!user.emailVerified) {
      return res.status(403).json({
        message: "يرجى تأكيد البريد الإلكتروني قبل تسجيل الدخول."
      });
    }
    if (!isValid) {
      return res.status(401).json({ message: "بيانات الدخول غير صحيحة." });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );

    const doctor = user.role === "doctor"
      ? await prisma.doctor.findUnique({
          where: { userId: user.id },
          select: { id: true }
        })
      : null;

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        doctorId: doctor?.id ?? null
      }
    });
  } catch (_error) {
    return res.status(500).json({ message: "حدث خطأ أثناء تسجيل الدخول." });
  }
});

router.get("/verify-email", async (req, res) => {
  try {
    const token = String(req.query.token || "");
    if (!token) {
      return res.status(400).json({ message: "رابط التحقق غير صالح." });
    }

    const user = await prisma.user.findFirst({
      where: {
        emailVerifyToken: token,
        emailVerifyTokenExpiresAt: { gte: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: "رمز التحقق غير صالح أو منتهي الصلاحية." });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
        emailVerifyTokenExpiresAt: null
      }
    });

    return res.json({ message: "تم تأكيد البريد الإلكتروني بنجاح." });
  } catch (_error) {
    return res.status(500).json({ message: "تعذر تأكيد البريد الإلكتروني." });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        doctor: { select: { id: true } }
      }
    });
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود." });
    }
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      doctorId: user.doctor?.id ?? null,
      emailVerified: user.emailVerified
    });
  } catch (_error) {
    return res.status(500).json({ message: "تعذر جلب بيانات المستخدم." });
  }
});

export default router;
