import api from './axios';

// 1. Register User
export const registerUser = async (userData) => {
    try {
        const response = await api.post('/users/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// 2. Login User
export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/users/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// 3. Logout User
export const logoutUser = async () => {
    try {
        const response = await api.post('/users/logout');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const changePassword = async (data) => {
    try {
        const response = await api.post('/users/change-password', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};