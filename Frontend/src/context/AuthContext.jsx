import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios'; // Your axios helper

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // This runs ONCE when the app starts
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Ask backend: "Who am I?"
                const response = await api.get('/users/current-user');
                if (response.data.success) {
                    setUser(response.data.data); // Save the user info (name, email, avatar)
                }
            } catch (error) {
                // If 401 Unauthorized, it means no cookie or invalid cookie.
                // We just stay as "guest" (user = null)
                setUser(null);
            } finally {
                setLoading(false); // Finished checking
            }
        };

        checkAuth();
    }, []);

    // Helper to manually update user (e.g., after login/register)
    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await api.post('/users/logout');
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {/* We don't render the app until we know if you are logged in or not */}
            {!loading && children} 
        </AuthContext.Provider>
    );
};

// Custom Hook to use this easily in any component
export const useAuth = () => useContext(AuthContext);