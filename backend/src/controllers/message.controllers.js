import user from "../models/user.model.js";
import Message from "../models/message.model.js"

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await user.find({
            _id: {
                $ne: loggedInUserId
            }
        }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({
            error: "Internal sever error"
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const {
            id: userToChatId
        } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [{
                    senderId: myId,
                    receiverId: userToChatId
                },
                {
                    senderId: userToChatId,
                    receiverId: myId
                },
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const {
            text,
            image
        } = req.body;
        const {
            id: receiverId
        } = req.params;
        const senderId = req.user._id;

        let uploadedImageUrls = [];
        if (images && Array.isArray(images)) {
            for (const base64 of images) {
                const uploadRes = await cloudinary.uploader.upload(base64, {
                    folder: "chat_images",
                });
                uploadedImageUrls.push(uploadRes.secure_url);
            }
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: uploadedImageUrls[0] || null, // Use the first image as the main image if available
            images: uploadedImageUrls.length > 0 ? uploadedImageUrls : [],
        });

        await newMessage.save();

        // Realtime 
        const io = req.app.get("io");
        const onlineUsers = req.app.get("onlineUsers");
        const receiverSocketId = onlineUsers.get(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};