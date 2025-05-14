import 'dotenv/config';
import axios, { AxiosInstance } from 'axios';

export interface LoginInput { email: string; password: string }
export interface LoginResp { userType: string }

export const api: AxiosInstance = axios.create({
    baseURL: process.env.BACKEND_URL,
    withCredentials: true
});

export async function login(
    creds: LoginInput = {
        email: process.env.ADMIN_EMAIL!,
        password: process.env.ADMIN_PASSWORD!
    }
) {
    const res = await api.post<LoginResp>('/auth/login', creds);
    return {
        cookies: (res.headers['set-cookie'] ?? []).join('; '),
        userType: res.data.userType
    };
}
