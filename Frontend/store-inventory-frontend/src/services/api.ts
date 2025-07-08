import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // keep it true if you use cookies/auth sessions
  timeout: 10000, // optional timeout
});

// Optional: Add interceptors (e.g. for auth tokens or errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    // You can handle global errors here (e.g., redirect on 401)
    return Promise.reject(error);
  }
);

export default api;
