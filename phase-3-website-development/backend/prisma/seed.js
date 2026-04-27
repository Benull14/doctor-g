import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.appointment.deleteMany();
  await prisma.doctorAvailability.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("Admin123!", 10);
  await prisma.user.create({
    data: {
      name: "المشرف العام",
      email: "admin@doctor-g.local",
      passwordHash: adminPassword,
      role: "admin",
      emailVerified: true
    }
  });

  const doctorUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: "د. نور الحسن",
        email: "noor@doctor-g.local",
        phone: "0933000001",
        passwordHash: await bcrypt.hash("Doctor123!", 10),
        role: "doctor",
        emailVerified: true
      }
    }),
    prisma.user.create({
      data: {
        name: "د. سارة خوري",
        email: "sara@doctor-g.local",
        phone: "0933000002",
        passwordHash: await bcrypt.hash("Doctor123!", 10),
        role: "doctor",
        emailVerified: true
      }
    })
  ]);

  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        userId: doctorUsers[0].id,
        specialty: "أمراض القلب",
        city: "دمشق",
        phone: "0933000001",
        rating: 4.7
      }
    }),
    prisma.doctor.create({
      data: {
        userId: doctorUsers[1].id,
        specialty: "الأمراض الجلدية",
        city: "حمص",
        phone: "0933000002",
        rating: 4.4
      }
    })
  ]);

  await prisma.doctorAvailability.createMany({
    data: [
      { doctorId: doctors[0].id, weekday: "الاثنين", startTime: "09:00", endTime: "14:00" },
      { doctorId: doctors[0].id, weekday: "الثلاثاء", startTime: "09:00", endTime: "14:00" },
      { doctorId: doctors[1].id, weekday: "الأحد", startTime: "10:00", endTime: "15:00" }
    ]
  });

  const patient = await prisma.user.create({
    data: {
      name: "أحمد علي",
      email: "ahmad@doctor-g.local",
      passwordHash: await bcrypt.hash("Patient123!", 10),
      role: "patient",
      emailVerified: true
    }
  });

  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctors[0].id,
      startAt: new Date("2026-04-28T09:00:00.000Z"),
      notes: "زيارة متابعة",
      status: "pending"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed completed.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
