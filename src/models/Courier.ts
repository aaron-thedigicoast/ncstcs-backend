import mongoose, { Schema } from "mongoose";

export interface ICourier extends mongoose.Document {
  name: string;
  vehiclePlate: string;
  operatorId?: string;
  phone?: string;
  status: "active" | "inactive" | "suspended";
  compliance: {
    license: boolean;
    insurance: boolean;
    roadworthy: boolean;
  };
  location?: { type: "Point"; coordinates: [number, number] } | null;
  history: Array<{
    timestamp: Date;
    coordinates: [number, number];
  }>
}

const CourierSchema = new Schema<ICourier>({
  name: { type: String, required: true },
  vehiclePlate: { type: String, required: true, unique: true },
  operatorId: { type: Schema.Types.ObjectId, ref: "User" },
  phone: String,
  status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
  compliance: {
    license: { type: Boolean, default: false },
    insurance: { type: Boolean, default: false },
    roadworthy: { type: Boolean, default: false }
  },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] }
  },
  history: [{ timestamp: Date, coordinates: [Number] }]
}, { timestamps: true });

CourierSchema.index({ location: "2dsphere" });

export default mongoose.model<ICourier>("Courier", CourierSchema);
