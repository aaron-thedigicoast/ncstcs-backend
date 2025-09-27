import { Request, Response } from "express";
import User from "../models/User";

export const getDashboardData = async (req: Request, res: Response) => {
    try {
        const totalCouriers = await User.countDocuments({ role: "courier" });
        const activeCouriers = await User.countDocuments({ role: "courier", status: "active" });
        const pendingVerifications = await User.countDocuments({
            role: "courier",
            isCompliant: false,
            $or: [
                { dvlaLicenseImage: { $exists: true, $ne: null } },
                { ghanaCardImage: { $exists: true, $ne: null } },
            ],
        });

        const compliantCouriers = await User.countDocuments({ role: "courier", isCompliant: true });
        const complianceRate = totalCouriers > 0 ? (compliantCouriers / totalCouriers) * 100 : 0;

        res.status(200).json({
            totalCouriers,
            activeCouriers,
            pendingVerifications,
            complianceRate,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};