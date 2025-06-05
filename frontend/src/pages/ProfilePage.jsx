import { useAuthStore } from '../store/UseAuthStore';
import { Camera, Mail, User } from 'lucide-react';
import React, { useState } from 'react';

const ProfilePage = () => {
    const { AuthUser, isUpdatingProfile, updateProfile } = useAuthStore();
    const [selectedImage, setSelectedImage] = useState(AuthUser?.profilePic || null);
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result; // Get base64 string without prefix
            setSelectedImage(base64Image);
            await updateProfile({ profilePic: base64Image });
        };
        reader.readAsDataURL(file);
    };
        return (
            <div className="h-screen pt-20">
                <div className="mx-auto max-w-2xl p-4 py-8">
                    <div className="space-y-8 rounded-xl bg-base-300 p-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-semibold text-primary">Profile</h1>
                            <p className="mt-2">Your profile information</p>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <img src={selectedImage || AuthUser?.profilePic || "/avatar.png"} alt="Profile"
                                    className="h-32 w-32 rounded-full border-4 object-cover" />
                                <label htmlFor="avatar_upload"
                                    className={`absolute bottom-0 right-0 cursor-pointer rounded-full bg-base-content 
                                                p-2 transition-all duration-200 hover:scale-105
                                                ${isUpdatingProfile ? 'pointer-events-none animate-pulse' : ''}`}
                                >
                                    <Camera className="h-5 w-5 text-base-200" />
                                    <input type="file" id="avatar_upload" accept="image/*"
                                        onChange={handleImageChange} disabled={isUpdatingProfile}
                                        className="hidden" />
                                </label>                           
                            </div> 
                            <p className="text-sm text-zinc-400">
                            {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <User className="h-4 w-4" />
                                Full Name
                            </div>
                            <p className="rounded-lg border bg-base-200 px-4 py-2.5">{AuthUser?.fullName}</p>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <Mail className="h-4 w-4" />
                                Email Address
                            </div>
                            <p className="rounded-lg border bg-base-200 px-4 py-2.5">{AuthUser?.email}</p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl bg-base-300 p-6">
                        <h2 className="mb-4 text-lg font-medium">Account Information</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between border-b border-zinc-700 py-2">
                                <span>Member Since</span>
                                {AuthUser && AuthUser.createdAt ? (
                                <span>{new Date(AuthUser.createdAt).toLocaleDateString()}</span>
                                ) : (
                                <span>N/A</span>
                                )}
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span>Account Status</span>
                                <span className="text-green-500">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
}
export default ProfilePage;