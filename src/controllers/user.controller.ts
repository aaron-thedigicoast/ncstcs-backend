
import { Request, Response } from "express";
import User from "../models/User";
import { UploadedFile } from "../@types/express";
import path from "path";

export const uploadComplianceFiles = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const files = req.files as { [fieldname: string]: UploadedFile[] };

        if (files.dvlaLicense && files.dvlaLicense.length > 0) {
            user.dvlaLicenseImage = files.dvlaLicense[0].filename;
        }

        if (files.ghanaCard && files.ghanaCard.length > 0) {
            user.ghanaCardImage = files.ghanaCard[0].filename;
        }

        await user.save();

        res.status(200).json({ message: "Compliance files uploaded successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const serveComplianceFile = async (req: Request, res: Response) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, "../../uploads", filename);

        res.set("cross-origin-resource-policy", "cross-origin");
        res.sendFile(filePath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


 export const currentUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};