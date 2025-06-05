import { create } from 'zustand';
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:7000" : "/";
export const useAuthStore = create((set, get) => ({
    AuthUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ AuthUser: res.data });
            localStorage.setItem("user", JSON.stringify(res.data));
            get().connectSocket();
        } catch (error) {
            if (error.response?.status === 401) {
                console.log("Chưa đăng nhập");
            } else {
                console.error("Lỗi khác trong checkAuth:", error);
            }            
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                const parsed = JSON.parse(savedUser);
                set({ AuthUser: parsed });
                get().connectSocket();
            } else {
                set({ AuthUser: null });
            }
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        console.log("GỌI SIGNUP");
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ AuthUser: res.data });
            localStorage.setItem("user", JSON.stringify(res.data)); // Store user data in localStorage
            toast.success("Tạo tài khoản thành công");
            // Connect to the socket after successful signup
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message || "Đăng ký thất bại");
            throw error;
        } finally {
            set({ isSigningUp: false });
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ AuthUser: res.data });
            localStorage.setItem("user", JSON.stringify(res.data)); // Store user data in localStorage
            toast.success("Đăng nhập thành công");
            // Connect to the socket after successful login
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message || "Đăng nhập thất bại");
            throw error;
        } finally {
            set({ isLoggingIn: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            localStorage.removeItem("user"); // Clear user data from localStorage
            set({ AuthUser: null, onlineUsers: [] });
            if (get().socket) {
                get().socket.disconnect();
                set({ socket: null });
            }
            toast.success("Đăng xuất thành công");
        } catch (error) {
            console.log("Error in logout:", error);
            toast.error(error.response?.data?.message || "Đăng xuất thất bại");
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ AuthUser: res.data });
            toast.success("Cập nhật thông tin thành công");
        } catch (error) {
            console.log("Error in update Profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    connectSocket: () => {
    const { AuthUser, socket } = get();
    if (!AuthUser || socket) return;

    const newSocket = io(BASE_URL, {
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });

    set({ socket: newSocket });

    newSocket.on("connect", () => {
        console.log("Connected:", newSocket.id);

        // Emit addUser chỉ khi đã kết nối thành công
        newSocket.emit("addUser", AuthUser._id);
    });

    newSocket.on("disconnect", () => {
        console.log("Disconnected");
        set({ socket: null });
    });

    // Gắn listener trước khi server emit
    newSocket.on("onlineUsers", (users) => {
        set({ onlineUsers: users });
    });

    newSocket.on("newMessage", (message) => {
        console.log("New message:", message);
    });
},
}));