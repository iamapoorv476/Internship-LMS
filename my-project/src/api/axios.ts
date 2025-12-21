import axios from "axios";

// ==============================================================================
// CRITICAL: Replace the URL below with YOUR actual Render backend URL
// ==============================================================================
// Go to Render Dashboard → Your Backend Service → Copy the URL at the top
// It looks like: https://internship-lms-backend-xxxx.onrender.com
// Add /api to the end
// ==============================================================================

const PRODUCTION_API_URL = "https://internship-lms-5fqf.onrender.com";
// ☝️ CHANGE THIS URL TO YOUR ACTUAL RENDER URL!

const DEVELOPMENT_API_URL = "http://localhost:5000/api";

// Use production URL when deployed, localhost for local development
const BASE_URL = import.meta.env.MODE === 'production' 
    ? PRODUCTION_API_URL 
    : DEVELOPMENT_API_URL;

// Debug logs
console.log('==========================================');
console.log('🚀 API Base URL:', BASE_URL);
console.log('🌍 Environment MODE:', import.meta.env.MODE);
console.log('📦 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('==========================================');

export const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000, // 15 second timeout for Render (cold starts can be slow)
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable cookies if needed
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Safe logging
        const method = config.method?.toUpperCase() || 'UNKNOWN';
        const url = `${config.baseURL || ''}${config.url || ''}`;
        console.log('📡 Making request:', method, url);
        
        return config;
    },
    (error) => {
        console.error('❌ Request setup failed:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        const url = response.config?.url || 'unknown';
        console.log('✅ Success:', response.status, url);
        return response;
    },
    (error) => {
        const url = error.config?.url || 'unknown';
        console.error('❌ Request failed:', url);
        console.error('Error details:', error.message);
        
        if (error.code === 'ERR_NETWORK') {
            console.error('🔴 NETWORK ERROR!');
            console.error('📍 Trying to connect to:', BASE_URL);
            console.error('💡 Check:');
            console.error('   1. Is your backend running?');
            console.error('   2. Is the URL correct?');
            console.error('   3. Are CORS settings configured?');
        }
        
        if (error.response?.status === 404) {
            console.error('🔴 404 - Route not found on backend');
        }
        
        return Promise.reject(error);
    }
);