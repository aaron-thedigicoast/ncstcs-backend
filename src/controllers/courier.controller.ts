import { Request, Response } from "express";
import Courier from "../models/Courier";
import mongoose from "mongoose";

export async function getAllCouriers(req: Request, res: Response) {
  const { q, status, compliant } = req.query;
  const filter: any = {};
  if (status) filter.status = status;
  if (compliant === "true") {
    filter["compliance.license"] = true; // simplistic
    filter["compliance.insurance"] = true;
  }
  if (q) filter.$or = [
    { name: new RegExp(String(q), "i") },
    { vehiclePlate: new RegExp(String(q), "i") }
  ];
  const couriers = await Courier.find(filter).limit(200);
  res.json(couriers);
}

export async function getCourierById(req: Request, res: Response) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });
  const courier = await Courier.findById(id);
  if (!courier) return res.status(404).json({ message: "Not found" });
  res.json(courier);
}

export async function createCourier(req: Request, res: Response) {
  const { name, vehiclePlate, phone, compliance } = req.body;
  const courier = await Courier.create({ name, vehiclePlate, phone, compliance });
  res.status(201).json(courier);
}

export async function updateCourierLocation(req: Request, res: Response) {
  const { id } = req.params;
  const { coordinates } = req.body; // [lng, lat]
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return res.status(400).json({ message: "Invalid coordinates" });
  }
  const [lng, lat] = coordinates as number[];
  if (
    typeof lng !== "number" ||
    typeof lat !== "number" ||
    Number.isNaN(lng) ||
    Number.isNaN(lat)
  ) {
    return res.status(400).json({ message: "Coordinates must be numbers in [lng, lat] format" });
  }
  const coordTuple: [number, number] = [lng, lat];
  const courier = await Courier.findById(id);
  if (!courier) return res.status(404).json({ message: "Not found" });
  courier.location = { type: "Point", coordinates: coordTuple };
  courier.history.push({ timestamp: new Date(), coordinates: coordTuple });
  await courier.save();
  res.json({ ok: true });
}

export async function getCourierHistory(req: Request, res: Response) {
  const { id } = req.params;
  const courier = await Courier.findById(id);
  if (!courier) return res.status(404).json({ message: "Not found" });
  res.json(courier.history || []);
}
