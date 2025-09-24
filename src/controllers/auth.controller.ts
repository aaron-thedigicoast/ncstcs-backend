import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET: Secret = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN: SignOptions["expiresIn"] = (process.env.JWT_EXPIRES_IN as any) || "7d";
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

export async function register(req: Request, res: Response) {
  const { username, password, name, fullName, role, email, dvlaNumber, ghanaCardNumber, dateOfBirth, phone: rawPhone } = req.body as any;
  if (!username || !password) return res.status(400).json({ message: "Missing fields" });
  const existing = await User.findOne({ username });
  if (existing) return res.status(409).json({ message: "Username exists" });

  // Normalize Ghana phone numbers: input like 024XXXXXXX should be stored as +233XXXXXXXXX
  let phone: string | undefined = undefined;
  if (rawPhone) {
    const digits = String(rawPhone).replace(/\D/g, "");
    if (digits.length === 10 && digits.startsWith("0")) {
      phone = "+233" + digits.slice(1);
    } else if (digits.length === 12 && digits.startsWith("233")) {
      phone = "+" + digits;
    } else if (String(rawPhone).startsWith("+233") && String(rawPhone).length === 13) {
      phone = String(rawPhone);
    } else {
      return res.status(400).json({ message: "Invalid phone format. Use 024XXXXXXX" });
    }
  }
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    username,
    password: hashed,
    name: name || fullName,
    role: role || 'courier',
    email,
    phone,
    dvlaNumber,
    ghanaCardNumber,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined
  });
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
}

export async function login(req: Request, res: Response) {
  const { username, password, role } = req.body as { username: string; password: string; role?: string };
  if (!username || !password) return res.status(400).json({ message: "Missing fields" });
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  if (role && user.role !== role) return res.status(403).json({ message: "Unauthorized for selected role" });
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
}

export async function loginWithGhanaCard(req: Request, res: Response) {
  const { ghanaCardNumber, dateOfBirth } = req.body as { ghanaCardNumber?: string; dateOfBirth?: string };
  if (!ghanaCardNumber || !dateOfBirth) return res.status(400).json({ message: "Missing Ghana Card details" });
  const user = await User.findOne({ ghanaCardNumber: ghanaCardNumber.toUpperCase() });
  if (!user) return res.status(404).json({ message: "Ghana Card not found" });
  if (user.dateOfBirth && new Date(user.dateOfBirth).toISOString().slice(0, 10) !== new Date(dateOfBirth).toISOString().slice(0, 10)) {
    return res.status(401).json({ message: "Ghana Card verification failed" });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
}

export async function loginWithDVLA(req: Request, res: Response) {
  const { dvlaNumber, dateOfBirth } = req.body as { dvlaNumber?: string; dateOfBirth?: string };
  if (!dvlaNumber) return res.status(400).json({ message: "Missing DVLA number" });
  const user = await User.findOne({ dvlaNumber: dvlaNumber.toUpperCase() });
  if (!user) return res.status(404).json({ message: "DVLA number not found" });
  if (dateOfBirth && user.dateOfBirth && new Date(user.dateOfBirth).toISOString().slice(0, 10) !== new Date(dateOfBirth).toISOString().slice(0, 10)) {
    return res.status(401).json({ message: "DVLA verification failed" });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
}

export async function registerWithGhanaCard(req: Request, res: Response) {
  const { ghanaCardNumber, dateOfBirth } = req.body as { ghanaCardNumber?: string; dateOfBirth?: string };
  if (!ghanaCardNumber || !dateOfBirth) return res.status(400).json({ message: "Missing Ghana Card details" });
  // If user exists, log them in
  let user = await User.findOne({ ghanaCardNumber: ghanaCardNumber.toUpperCase() });
  if (user) {
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  }
  // Otherwise create a new courier with generated credentials
  const generatedUsername = `ghc-${ghanaCardNumber.slice(-4)}`;
  const generatedPassword = Math.random().toString(36).slice(-10);
  const hashed = await bcrypt.hash(generatedPassword, SALT_ROUNDS);
  user = await User.create({
    username: generatedUsername,
    password: hashed,
    role: 'courier',
    ghanaCardNumber: ghanaCardNumber.toUpperCase(),
    dateOfBirth: new Date(dateOfBirth)
  } as any);
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
}

