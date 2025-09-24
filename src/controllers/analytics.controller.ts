import { Request, Response } from "express";
import Courier from "../models/Courier";
import SOS from "../models/SOS";

export async function getAnalytics(req: Request, res: Response) {
  // Simple aggregated examples. Expand as needed.
  const totalCouriers = await Courier.countDocuments();
  const compliantCount = await Courier.countDocuments({
    "compliance.license": true,
    "compliance.insurance": true,
    "compliance.roadworthy": true
  });
  const latestSOS = await SOS.find().sort({ timestamp: -1 }).limit(10);

  res.json({
    totalCouriers,
    compliantCount,
    complianceRate: totalCouriers ? (compliantCount / totalCouriers) : 0,
    recentSOS: latestSOS
  });
}
