import express from "express";
import cors from "cors";
import doctorsRoutes from "./modules/doctors/doctors.routes.js";
import appointmentsRoutes from "./modules/appointments/appointments.routes.js";
import doctorDashboardRoutes from "./modules/doctor-dashboard/doctor-dashboard.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "doctor-g-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/doctor-dashboard", doctorDashboardRoutes);

export default app;
