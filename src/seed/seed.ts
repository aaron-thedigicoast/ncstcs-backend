import { connectDB } from "../utils/db";
import User from "../models/User";
import Courier from "../models/Courier";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

async function seed() {
  await connectDB();
  const salt = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  await User.deleteMany({});
  await Courier.deleteMany({});

  const adminPass = await bcrypt.hash("adminpass", salt);
  const admin = await User.create({ username: "admin", password: adminPass, role: "admin", name: "Administrator" });

  await Courier.create({
    name: "John Doe",
    vehiclePlate: "GR-1234-21",
    phone: "+233201234567",
    status: "active",
    compliance: { license: true, insurance: true, roadworthy: false },
    location: { type: "Point", coordinates: [-0.186964, 5.603717] },
    history: [
      { timestamp: new Date(), coordinates: [-0.186964, 5.603717] }
    ]
  });

  console.log("Seed complete. Admin user is 'admin' with password 'adminpass'");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
