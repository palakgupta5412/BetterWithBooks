import axios from 'axios';

// Create a custom instance of axios
const api = axios.create({
    baseURL: 'http://localhost:5000', // <--- REMOVE THE TRAILING SLASH
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;