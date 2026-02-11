import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // 1. If we are still checking if the user is logged in, show nothing (or a spinner)
    // This prevents "flickering" where it kicks you out before the check is done.
    if (loading) return <div className="h-screen bg-[#1a0f0e]"></div>;

    // 2. If check is done and NO user found -> Kick to Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. If user exists -> Let them through!
    // (Render children if provided, otherwise render the child Route via Outlet)
    return children ? children : <Outlet />;
};

export default ProtectedRoute;