import api from './axios';

export const searchBooks = async (query, page = 1) => {
    try {
        // Send page number to backend
        const response = await api.get(`/books/search?query=${query}&page=${page}`);
        return response.data; 
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// 2. Add a book to your shelf
export const addToShelf = async (bookData, status) => {
    try {
        // Status can be: "Reading", "Completed", or "TBR"
        const response = await api.post('/books/add-shelf', {
            ...bookData,
            status 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// 3. Get user's shelf (To check if book is already added)
export const getMyShelf = async () => {
    try {
        const response = await api.get('/books/my-shelf');
        console.log(response);
        
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateBookProgress = async (googleBookId, pagesRead) => {
    try {
        const response = await api.patch('/books/progress', { googleBookId, pagesRead });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};