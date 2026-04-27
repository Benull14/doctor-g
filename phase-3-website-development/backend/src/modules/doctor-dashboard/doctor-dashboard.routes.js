import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";

const router = Router();

router.get("/:doctorId", requireAuth, requireRole("doctor", "admin"), async (req, res) => {
  try {
    const doctorId = Number(req.params.doctorId);
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { user: true }
    });

    if (!doctor) {
      return res.status(404).json({ message: "الطبيب غير موجود." });
    }

    if (req.user.role === "doctor" && doctor.userId !== req.user.userId) {
      return res.status(403).json({ message: "ليس لديك صلاحية لهذا الطبيب." });
    }

    const [availability, appointments] = await Promise.all([
      prisma.doctorAvailability.findMany({ where: { doctorId }, orderBy: { id: "asc" } }),
      prisma.appointment.findMany({
        where: { doctorId },
        include: { patient: { select: { name: true } } },
        orderBy: { startAt: "asc" }
      })
    ]);

    return res.json({
      doctor: {
        id: doctor.id,
        name: doctor.user.name,
        specialty: doctor.specialty,
        city: doctor.city,
        rating: doctor.rating,
        phone: doctor.phone,
        availableToday: doctor.availableToday
      },
      availability,
      appointments: appointments.map((item) => ({
        id: item.id,
        patientName: item.patient.name,
        doctorId: item.doctorId,
        startAt: item.startAt,
        notes: item.notes,
        status: item.status,
        createdAt: item.createdAt
      }))
    });
  } catch (_error) {
    return res.status(500).json({ message: "تعذر جلب لوحة الطبيب." });
  }
});

router.put(
  "/:doctorId/availability",
  requireAuth,
  requireRole("doctor", "admin"),
  async (req, res) => {
    try {
      const doctorId = Number(req.params.doctorId);
      const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });

      if (!doctor) {
        return res.status(404).json({ message: "الطبيب غير موجود." });
      }

      if (req.user.role === "doctor" && doctor.userId !== req.user.userId) {
        return res.status(403).json({ message: "ليس لديك صلاحية لهذا الطبيب." });
      }

      const { availability } = req.body;
      if (!Array.isArray(availability)) {
        return res.status(400).json({ message: "البيانات يجب أن تكون مصفوفة." });
      }

      const isValid = availability.every((slot) => {
        return (
          typeof slot.weekday === "string" &&
          typeof slot.startTime === "string" &&
          typeof slot.endTime === "string"
        );
      });

      if (!isValid) {
        return res.status(400).json({ message: "كل خانة يجب أن تحتوي اليوم ووقت البدء والانتهاء." });
      }

      await prisma.$transaction([
        prisma.doctorAvailability.deleteMany({ where: { doctorId } }),
        prisma.doctorAvailability.createMany({
          data: availability.map((slot) => ({
            doctorId,
            weekday: slot.weekday,
            startTime: slot.startTime,
            endTime: slot.endTime
          }))
        })
      ]);

      const updated = await prisma.doctorAvailability.findMany({
        where: { doctorId },
        orderBy: { id: "asc" }
      });
      return res.json({ doctorId, availability: updated });
    } catch (_error) {
      return res.status(500).json({ message: "تعذر تحديث التوفر." });
    }
  }
);

export default router;
