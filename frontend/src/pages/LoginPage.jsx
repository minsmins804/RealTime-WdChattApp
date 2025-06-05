import { useState } from "react";
import { useAuthStore } from "../store/UseAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const LoginPage = () => {
        const { login, isLoggingIn } = useAuthStore();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await login(formData);
        navigate("/"); // Đăng nhập thành công → chuyển trang
        } catch (err) {
        const msg = err?.response?.data?.message || "Login failed";
        setError(msg);
        toast.error(msg);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Chat App</h2>

                <form onSubmit={handleSubmit}>
                {error && (
                    <div className="mb-4 text-red-600 text-sm text-center bg-red-100 border border-red-300 rounded p-2">
                    {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-blue-600">Email Address</label>
                    <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-gray-600 bg-gray-100"
                    />
                </div>

                <div className="mb-4 relative">
                    <label className="block mb-1 text-sm font-medium text-blue-600">Password</label>
                    <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-gray-600 bg-gray-100"
                    />
                    <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                    >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <input
                    type="submit"
                    value={isLoggingIn ? "Logging in..." : "Continue to Chat"}
                    disabled={isLoggingIn}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 cursor-pointer"
                />
                </form>

                <div className="text-center mt-4 text-sm text-gray-500">
                Not yet signed up? <a href="/signup" className="text-blue-600 hover:underline">Signup now</a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
