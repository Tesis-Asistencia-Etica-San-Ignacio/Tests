import 'dotenv/config';
import request from 'supertest';
import { app } from '../../../Backend/src/server';

export interface LoginInput { 
    email: string; 
    password: string; 
}

export interface LoginResp { 
    message: string;
    userType: string; 
}

export async function login(
    creds: LoginInput = {
        email: process.env.ADMIN_EMAIL!,
        password: process.env.ADMIN_PASSWORD!
    }
) {
    const res = await request(app)
        .post('/api/auth/login')
        .send(creds);

    if (res.status !== 200) {
        throw new Error(`Login failed with status ${res.status}: ${res.body.message}`);
    }

    // Extraer cookies de las cabeceras
    const setCookieHeaders = res.headers['set-cookie'] || [];
    if (!Array.isArray(setCookieHeaders)) {
        throw new Error('set-cookie header is not an array');
    }
    const cookies = setCookieHeaders.join('; ');

    return {
        cookies,
        userType: res.body.userType,
        response: res.body
    };
}

// Helper adicional para extraer tokens específicos
export function extractTokenFromCookies(cookies: string, tokenName: 'accessToken' | 'refreshToken'): string | null {
    const match = cookies.match(new RegExp(`${tokenName}=([^;]+)`));
    return match ? match[1] : null;
}

// Helper para hacer peticiones autenticadas
export async function authenticatedRequest(method: 'get' | 'post' | 'put' | 'delete', endpoint: string, body?: any) {
    const { cookies } = await login();
    
    const request = require('supertest')(app)[method](endpoint).set('Cookie', cookies);
    
    if (body && (method === 'post' || method === 'put')) {
        request.send(body);
    }
    
    return await request;
}