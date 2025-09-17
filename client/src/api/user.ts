import axios from 'axios';

const API_URL = import.meta.env.VITE_USER_API_BASE_URL || 'http://localhost:3000';

const userClient = axios.create({
  baseURL: API_URL,
});

userClient.interceptors.request.use(
(config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
},
(error) => {
    return Promise.reject(error);
}
);


export const register = (username: string, password: string) => userClient.post('/api/auth/register', { username, password });
export const login = (username: string, password: string) => userClient.post('/api/auth/login', { username, password });
