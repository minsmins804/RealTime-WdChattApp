import { useState } from "react";
import { useAuthStore } from "../store/UseAuthStore";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        image: null,
    });

    const { signup, isSigningUp } = useAuthStore();

    const validateForm = () => {
        if (!formData.firstName.trim()) return toast.error("First name is required");
        if (!formData.lastName.trim()) return toast.error("Last name is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
        if (!formData.password) return toast.error("Password is required");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        if (validateForm() !== true) return;

        setIsSubmitting(true);


        try {
            const signupData = new FormData();
            signupData.append("fullName", `${formData.firstName} ${formData.lastName}`);
            signupData.append("email", formData.email);
            signupData.append("password", formData.password);
            if (formData.image) signupData.append("profilePic", formData.image);
            console.log("Form gửi:", signupData);

            const res = await signup(signupData);

            console.log("Đăng ký thành công", res);
            toast.success("Đăng ký thành công");
        } catch (error) {
            console.error("Đăng ký lỗi:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Đăng ký thất bại");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
                <h2 className="text-2xl font-bold text-blue-600 text-left mb-6">Chat app</h2>

                <form onSubmit={handleSubmit}>
                <div className="flex gap-4 mb-4">
                    <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1 text-blue-600">First Name</label>
                    <input
                        type="text"
                        name="fname"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md text-gray-600 bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    </div>
                    <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1 text-blue-600">Last Name</label>
                    <input
                        type="text"
                        name="lname"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md text-gray-600 bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-blue-600">Email Address</label>
                    <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-gray-600 bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>

                <div className="mb-4 relative">
                    <label className="block text-sm font-medium mb-1 text-blue-600">Password</label>
                    <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-gray-600 bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                    >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="mb-4">
                    <button
                    type="submit"
                    disabled={isSigningUp}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 cursor-pointer flex justify-center items-center gap-2"
                    >
                    {isSigningUp && <Loader2 className="animate-spin h-5 w-5" />}
                    {isSigningUp ? "Loading..." : "Continue to Chat"}
                    </button>
                </div>
                </form>

                <div className="text-center text-sm text-gray-500">
                Already signed up?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                    Login now
                </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
