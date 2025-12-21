import axios from "axios";

// ============================================================================
// IMPORTANT: Your backend is confirmed working at the URL below
// We checked /health and got {"status":"OK"}
// ============================================================================

// STEP 1: Replace this with YOUR actual Render URL (without /api)
const RENDER_BACKEND_URL = "https://internship-lms-5fqf.onrender.com";

// STEP 2: This automatically detects if you're on Vercel or localhost
const isProduction = 
  window.location.hostname.includes('vercel.app') || 
  window.location.hostname !== 'localhost';

const BASE_URL = isProduction 
  ? `${RENDER_BACKEND_URL}/api`
  : "http://localhost:5000/api";

// Debug logging
console.log('🌍 Hostname:', window.location.hostname);
console.log('🏭 Is Production?', isProduction);
console.log('🎯 Using API URL:', BASE_URL);

export const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        const method = config.method?.toUpperCase() || 'UNKNOWN';
        const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
        console.log(`📡 ${method} →`, fullUrl);
        
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log('✅ Response:', response.status);
        return response;
    },
    (error) => {
        console.error('❌ Response Error:', error.message);
        if (error.code === 'ERR_NETWORK') {
            console.error('🔴 Cannot connect to:', BASE_URL);
            console.error('💡 Check CORS settings on backend');
        }
        return Promise.reject(error);
    }
);