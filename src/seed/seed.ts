import { connectDB } from "../utils/db";
import User from "../models/User";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

async function seed() {
  await connectDB();
  const salt = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  await User.deleteMany({});

  const adminPass = await bcrypt.hash("adminpass", salt);
  const admin = await User.create({ username: "admin", password: adminPass, role: "admin", name: "Administrator" });

  const courierPass = await bcrypt.hash("courierpass", salt);
  await User.create({ 
    username: "courier1", 
    password: courierPass, 
    role: "courier", 
    name: "John Doe",
    email: "courier1@example.com",
    dvlaNumber: "DVLA-123456",
    ghanaCardNumber: "GHA-123456789-0",
    dateOfBirth: new Date('1990-01-01')
  });

  console.log("Seed complete. Admin user is 'admin' with password 'adminpass'");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
