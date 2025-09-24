import { Request, Response } from "express";
import User from "../models/User";
import SOS from "../models/SOS";

export async function getAnalytics(req: Request, res: Response) {
  // Simple aggregated examples. Expand as needed.
  const totalCouriers = await User.countDocuments({ role: 'courier' });
  const compliantCount = 0; // placeholder until compliance is modeled on users
  const latestSOS = await SOS.find().sort({ timestamp: -1 }).limit(10);

  res.json({
    totalCouriers,
    compliantCount,
    complianceRate: totalCouriers ? (compliantCount / totalCouriers) : 0,
    recentSOS: latestSOS
  });
}
