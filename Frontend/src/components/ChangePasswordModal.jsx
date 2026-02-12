import React, { useState } from 'react';
import { changePassword } from '../api/auth.service';
import { useToast } from '../context/ToastContext';
import { FaTimes, FaLock } from 'react-icons/fa';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (passwords.newPassword !== passwords.confirmPassword) {
            return addToast("New passwords do not match", "error");
        }
        if (passwords.newPassword.length < 6) {
            return addToast("Password must be at least 6 chars", "error");
        }

        setLoading(true);
        try {
            await changePassword({
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });
            addToast("Password changed successfully!", "success");
            onClose(); // Close modal on success
            setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            addToast(error.message || "Failed to change password", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setPasswords({...passwords, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1a0f0e] border border-[#ffba66]/30 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
                
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <FaTimes />
                </button>

                <h2 className="font-playfair text-2xl text-[#ffba66] mb-6 flex items-center gap-2">
                    <FaLock size={18} /> Security Settings
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input 
                        type="password" name="oldPassword" placeholder="Current Password"
                        value={passwords.oldPassword} onChange={handleChange}
                        className="p-3 bg-white/5 border border-white/10 rounded-lg text-white outline-none focus:border-[#ffba66]"
                    />
                    <input 
                        type="password" name="newPassword" placeholder="New Password"
                        value={passwords.newPassword} onChange={handleChange}
                        className="p-3 bg-white/5 border border-white/10 rounded-lg text-white outline-none focus:border-[#ffba66]"
                    />
                    <input 
                        type="password" name="confirmPassword" placeholder="Confirm New Password"
                        value={passwords.confirmPassword} onChange={handleChange}
                        className="p-3 bg-white/5 border border-white/10 rounded-lg text-white outline-none focus:border-[#ffba66]"
                    />

                    <button 
                        disabled={loading}
                        className="mt-4 bg-[#ffba66] text-black font-bold py-3 rounded-lg hover:bg-[#dda200] transition disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;