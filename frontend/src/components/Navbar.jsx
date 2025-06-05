import { Link } from "react-router-dom";
import { useAuthStore } from "../store/UseAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
    const { logout, AuthUser } = useAuthStore();

    return (
        <header
            className="fixed top-0 z-40 w-full border-b border-base-300 bg-base-100
    bg-base-100/80 backdrop-blur-lg"
        >
            <div className="container mx-auto h-16 px-4">
                <div className="flex h-full items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2.5 transition-all hover:opacity-80">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                                <MessageSquare className="h-5 w-5 text-primary" />
                            </div>
                            <h1 className="text-lg font-bold">ChatApp</h1>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            to={"/settings"}
                            className={`
                            btn btn-sm gap-2 transition-colors`}
                        >
                            <Settings className="h-4 w-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </Link>

                        {AuthUser && (
                            <>
                                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                                    <User className="size-5" />
                                    <span className="hidden sm:inline">Profile</span>
                                </Link>

                                <button className="flex items-center gap-2" onClick={logout}>
                                    <LogOut className="size-5" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Navbar;