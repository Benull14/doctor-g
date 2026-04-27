import { Router } from "express";
import prisma from "../../lib/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { name = "", specialty = "", city = "" } = req.query;

    const doctors = await prisma.doctor.findMany({
      where: {
        specialty: { contains: String(specialty), mode: "insensitive" },
        city: { contains: String(city), mode: "insensitive" },
        user: { name: { contains: String(name), mode: "insensitive" } }
      },
      include: { user: true },
      orderBy: { id: "asc" }
    });

    const mapped = doctors.map((doctor) => ({
      id: doctor.id,
      name: doctor.user.name,
      specialty: doctor.specialty,
      city: doctor.city,
      rating: doctor.rating,
      phone: doctor.phone,
      availableToday: doctor.availableToday
    }));

    return res.json(mapped);
  } catch (_error) {
    return res.status(500).json({ message: "تعذر جلب قائمة الأطباء." });
  }
});

router.get("/:id/availability", async (req, res) => {
  try {
    const doctorId = Number(req.params.id);
    const availability = await prisma.doctorAvailability.findMany({
      where: { doctorId },
      orderBy: { id: "asc" }
    });
    return res.json(availability);
  } catch (_error) {
    return res.status(500).json({ message: "تعذر جلب أوقات عمل الطبيب." });
  }
});

export default router;
