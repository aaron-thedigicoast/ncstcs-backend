import { Request, Response } from "express";
import SOS from "../models/SOS";
import mongoose from "mongoose";

export async function getAllSOS(req: Request, res: Response) {
  const alerts = await SOS.find().populate("courierId").sort({ timestamp: -1 }).limit(500);
  res.json(alerts);
}

export async function createSOS(req: Request, res: Response) {
  const { courierId, coordinates } = req.body;
  if (!courierId || !Array.isArray(coordinates) || coordinates.length !== 2) {
    return res.status(400).json({ message: "Bad payload" });
  }
  const soc = await SOS.create({
    courierId,
    location: { type: "Point", coordinates }
  });
  res.status(201).json(soc);
}

export async function resolveSOS(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.user?.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });
  const alert = await SOS.findById(id);
  if (!alert) return res.status(404).json({ message: "Not found" });
  alert.resolved = true;
  // Ensure resolvedBy is an ObjectId
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  alert.resolvedBy = new mongoose.Types.ObjectId(userId);
  await alert.save();
  res.json({ ok: true });
}
