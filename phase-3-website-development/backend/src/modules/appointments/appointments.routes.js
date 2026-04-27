import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, requireRole("patient", "admin"), async (req, res) => {
  try {
    const { doctorId, startAt, notes = "" } = req.body;
    if (!doctorId || !startAt) {
      return res.status(400).json({ message: "doctorId و startAt مطلوبان." });
    }

    const doctor = await prisma.doctor.findUnique({ where: { id: Number(doctorId) } });
    if (!doctor) {
      return res.status(404).json({ message: "الطبيب غير موجود." });
    }

    const exists = await prisma.appointment.findFirst({
      where: { doctorId: Number(doctorId), startAt: new Date(startAt), status: { not: "cancelled" } }
    });
    if (exists) {
      return res.status(409).json({ message: "الموعد محجوز مسبقا." });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: req.user.userId,
        doctorId: Number(doctorId),
        startAt: new Date(startAt),
        notes,
        status: "pending"
      }
    });
    return res.status(201).json(appointment);
  } catch (_error) {
    return res.status(500).json({ message: "تعذر إنشاء الموعد." });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    let where = {};

    if (req.user.role === "patient") {
      where = { patientId: req.user.userId };
    } else if (req.user.role === "doctor") {
      const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.userId } });
      if (!doctor) return res.status(404).json({ message: "ملف الطبيب غير موجود." });
      where = { doctorId: doctor.id };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: { patient: { select: { name: true } }, doctor: { include: { user: true } } },
      orderBy: { startAt: "asc" }
    });

    const mapped = appointments.map((a) => ({
      id: a.id,
      patientName: a.patient.name,
      doctorId: a.doctorId,
      doctorName: a.doctor.user.name,
      startAt: a.startAt,
      notes: a.notes,
      status: a.status,
      createdAt: a.createdAt
    }));
    return res.json(mapped);
  } catch (_error) {
    return res.status(500).json({ message: "تعذر جلب المواعيد." });
  }
});

router.patch(
  "/:appointmentId/status",
  requireAuth,
  requireRole("doctor", "admin"),
  async (req, res) => {
    try {
      const appointmentId = Number(req.params.appointmentId);
      const { status } = req.body;
      const allowedStatuses = ["pending", "confirmed", "completed", "cancelled", "no_show"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "حالة الموعد غير صالحة." });
      }

      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId }
      });
      if (!appointment) {
        return res.status(404).json({ message: "الموعد غير موجود." });
      }

      if (req.user.role === "doctor") {
        const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.userId } });
        if (!doctor || doctor.id !== appointment.doctorId) {
          return res.status(403).json({ message: "لا يمكنك تعديل هذا الموعد." });
        }
      }

      const updated = await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status }
      });
      return res.json(updated);
    } catch (_error) {
      return res.status(500).json({ message: "تعذر تحديث حالة الموعد." });
    }
  }
);

export default router;
