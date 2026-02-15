import api from './axios'; // Assuming you have a configured axios instance with interceptors

export const createQuote = async (data) => {
    try {
        const response = await api.post('/quotes', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getMyQuotes = async () => {
    try {
        const response = await api.get('/quotes/my-quotes');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getAllQuotes = async () => {
    try {
        const response = await api.get('/quotes/all');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};