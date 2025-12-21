import axios from "axios";

// Use environment variable or fallback to localhost for development
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Debug: Log the API URL being used
console.log('🚀 API Base URL:', BASE_URL);
console.log('🌍 Environment:', import.meta.env.MODE);

export const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Debug: Log the full request URL with safe optional chaining
        const method = config.method?.toUpperCase() || 'UNKNOWN';
        const url = `${config.baseURL || ''}${config.url || ''}`;
        console.log('📡 Request:', method, url);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        const url = response.config?.url || 'unknown';
        console.log('✅ Response:', response.status, url);
        return response;
    },
    (error) => {
        console.error('❌ Response Error:', error.message);
        if (error.code === 'ERR_NETWORK') {
            console.error('🔴 Network Error - Check if backend is running at:', BASE_URL);
        }
        return Promise.reject(error);
    }
);