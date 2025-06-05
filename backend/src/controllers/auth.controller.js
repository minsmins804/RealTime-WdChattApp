import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({message: "Phải điền đầy đủ các thông tin"});
        }

        //hash pass
        if (password.length < 6){
            return res.status(400).json({message: "Mật khẩu phải ít nhất 6 kí tự"});    
        }

        if (req.file) {
            const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
            const uploadResponse = await cloudinary.uploader.upload(base64String);
            profilePicUrl = uploadResponse.secure_url;
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.findOne({email})

        if (user) return res.status(400).json({message: "Email đã tồn tại"});


        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            profilePic: profilePicUrl,
        })
        await newUser.save();

        if (newUser) {
            //generate jwt token
            generateToken(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                createdAt: newUser.createdAt,
            });
        }
        else {
            res.status(400).json({message: "Dữ liệu người dùng không hợp lệ"});
        }

    } 
    catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({message: "Internal Sever Error"});
    }
};

export const login = async (req, res) => {
    const { email, password} = req.body
    try {
        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({message: "Thông tin xác thực không hợp lệ"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({message: "Thông tin xác thực không hợp lệ"})
        }

        generateToken(user._id, res)

        res.status(200).json({
            _id:user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
        });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({message: "Internal Sever Error"});
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Đăng xuất thành công"});
    } catch (error) {
        console.log("Error in loggout controller", error.message);
        res.status(500).json({message: "Internal Sever Error"});
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({message: "Yêu cầu ảnh thông tin"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateUser = await User.findByIdAndUpdate(
            userId,
            {profilePic: uploadResponse.secure_url},
            {new: true}
        );

        res.status(200).json(updateUser);
    } catch (error) {
        console.log("Error in update profile:" , error);
        res.status(500).json({message: "Internal sever error"});
    }
};

 export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth Controller", error.message);
        res.status(500).json({message: "Internal Sever Error"});
    }
 }