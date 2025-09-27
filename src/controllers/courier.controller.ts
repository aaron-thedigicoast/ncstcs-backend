import { Request, Response } from "express";
import User from "../models/User";
import mongoose from "mongoose";

export async function getAllCouriers(req: Request, res: Response) {
  const { q } = req.query as { q?: string };
  const filter: any = { role: 'courier' };
  if (q) {
    filter.$or = [
      { name: new RegExp(String(q), 'i') },
      { username: new RegExp(String(q), 'i') },
      { email: new RegExp(String(q), 'i') },
      { dvlaNumber: new RegExp(String(q), 'i') },
      { ghanaCardNumber: new RegExp(String(q), 'i') },
    ];
  }
  const users = await User.find(filter).select('_id name username email dvlaNumber phone ghanaCardNumber dateOfBirth role createdAt dvlaLicenseImage ghanaCardImage isCompliant');
  res.json(users.map(u => ({
    id: u._id,
    name: u.name || u.username,
    username: u.username,
    email: u.email,
    phone: u.phone,
    dvlaNumber: (u as any).dvlaNumber,
    ghanaCardNumber: (u as any).ghanaCardNumber,
    dateOfBirth: (u as any).dateOfBirth,
    role: u.role,
    dvlaLicenseImage: (u as any).dvlaLicenseImage,
    ghanaCardImage: (u as any).ghanaCardImage,
    isCompliant: (u as any).isCompliant,
    createdAt: u.createdAt,
  })));
}

export async function getCourierById(req: Request, res: Response) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });
  const u = await User.findById(id).select('_id name username email dvlaNumber ghanaCardNumber phone dateOfBirth role createdAt dvlaLicenseImage ghanaCardImage isCompliant');
  if (!u) return res.status(404).json({ message: "Not found" });
  if (u.role !== 'courier') return res.status(404).json({ message: "Not found" });
  res.json({
    id: u._id,
    name: u.name || u.username,
    username: u.username,
    email: u.email,
    phone: u.phone,
    dvlaNumber: (u as any).dvlaNumber,
    ghanaCardNumber: (u as any).ghanaCardNumber,
    dateOfBirth: (u as any).dateOfBirth,
    role: u.role,
    dvlaLicenseImage: (u as any).dvlaLicenseImage,
    ghanaCardImage: (u as any).ghanaCardImage,
    isCompliant: (u as any).isCompliant,
    createdAt: u.createdAt,
  });
}
