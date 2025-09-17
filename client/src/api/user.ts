import axios from 'axios';

const userClient = axios.create({
  baseURL: 'http://localhost:3000',
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
