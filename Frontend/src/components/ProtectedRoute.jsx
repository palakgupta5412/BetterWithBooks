import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    // 1. SHOW SPINNER (If we are still checking who the user is)
    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#1a0f0e]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffba66]"></div>
            </div>
        );
    }

    // 2. REDIRECT (If check is done and user is still null)
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. RENDER PAGE (User is logged in)
    return <Outlet />;
};

export default ProtectedRoute;