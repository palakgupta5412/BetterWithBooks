import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // Initialize loading to TRUE so we don't flash the login screen
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // 1. Check LocalStorage FIRST (Fastest)
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }

                // 2. Verify with Backend (Secure)
                const response = await api.get('/users/current-user');
                if (response.data.success) {
                    const userData = response.data.data;
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                }
            } catch (error) {
                // If backend check fails, clear everything
                setUser(null);
                localStorage.removeItem('user');
            } finally {
                // CRITICAL: Ensure loading is FALSE after checks are done
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = (userData) => {
        // 1. Update State
        setUser(userData);
        // 2. Update Storage
        localStorage.setItem('user', JSON.stringify(userData));
        // 3. Update Loading (Just in case)
        setLoading(false); 
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('user');
        setLoading(false);
        try {
            await api.post('/users/logout');
        } catch (e) {
            console.error("Logout error", e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {/* RENDER CHILDREN ALWAYS. Do not block here. */}
            {children} 
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);