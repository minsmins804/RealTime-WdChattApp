import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token){
            return res.status(401).json({message: "Không được phép - Không cung cấp mã thông báo"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({message: "Không được phép - Token không hợp lệ"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({message: "Không tìm thấy người dùng"});
        }

        req.user = user
        
        next();

    } catch (error) {
        console.log("Eror in protectRoute middleware: ", error.message);
        res.status(500).json({message: "Internal Sever Error"});
    }
}