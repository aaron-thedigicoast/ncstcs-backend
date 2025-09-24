import mongoose, { Schema } from "mongoose";

export interface ISOS extends mongoose.Document {
  courierId: mongoose.Types.ObjectId;
  location: { type: "Point"; coordinates: [number, number] };
  timestamp: Date;
  resolved: boolean;
  resolvedBy?: mongoose.Types.ObjectId;
}

const SossSchema = new Schema<ISOS>({
  courierId: { type: Schema.Types.ObjectId, ref: "Courier" },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }
  },
  timestamp: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
  resolvedBy: { type: Schema.Types.ObjectId, ref: "User" }
});

SossSchema.index({ location: "2dsphere" });

export default mongoose.model<ISOS>("SOS", SossSchema);
