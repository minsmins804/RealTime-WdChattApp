import jwt from "jsonwebtoken"

export const generateToken = (userId, res) => {
    
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn:"7d"
    })

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //MS
        httpOnly: true, // ngăn chặn tấn công XSS
        sameSite: "strict", // Tấn công CSRF tấn công giả mạo yêu cầu chéo trang web
        secure: process.env.NODE_ENV !== "development" 
    })

    return token;
};