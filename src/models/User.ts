import mongoose, { Schema } from "mongoose";

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  role: "admin" | "agency" | "operator" | "courier";
  name?: string;
  email?: string;
  phone?: string;
  dvlaNumber?: string;
  ghanaCardNumber?: string;
  dateOfBirth?: Date;
  dvlaLicenseImage?: string;
  ghanaCardImage?: string;
  isCompliant?: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "agency", "operator", "courier"], default: "courier" },
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  dvlaNumber: { type: String, unique: true, sparse: true },
  ghanaCardNumber: { type: String, unique: true, sparse: true },
  dateOfBirth: { type: Date },
  dvlaLicenseImage: { type: String },
  ghanaCardImage: { type: String },
  isCompliant: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IUser>("User", UserSchema);
