import Navbar from './components/Navbar.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from "./store/UseAuthStore";
import { useThemeStore } from './store/UseThemeStore';   
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";


const App = () => {
    const { AuthUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
    const { theme } = useThemeStore();
    console.log({ onlineUsers });

    useEffect(() => {
    checkAuth();
    }, [checkAuth]);
    console.log({ AuthUser });

    useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme);
    }, [theme]);

    if (isCheckingAuth && !AuthUser)
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader className="size-10 animate-spin" />
        </div>
    );

    return (
        <div data-theme={theme}>
            <Navbar />
            <div className="pt-16">
                <Routes>
                    <Route path="/" element={AuthUser ? <HomePage /> : <Navigate to="/login" />} />
                    <Route path="/signup" element={!AuthUser ? <SignUpPage /> : <Navigate to="/" />} />
                    <Route path="/login" element={!AuthUser ? <LoginPage /> : <Navigate to="/" />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/profile" element={AuthUser ? <ProfilePage /> : <Navigate to="/login" />} />
                </Routes>
                </div>
            <Toaster />
        </div>
    );
}
export default App;