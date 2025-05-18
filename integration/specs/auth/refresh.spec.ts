// specs/auth/refresh.spec.ts
import request from 'supertest';
import { app } from '../../../../Backend/src/server';

describe('POST /api/auth/refresh', () => {
    it('debería renovar tokens correctamente cuando se proporciona un refreshToken válido', async () => {
        // Primero necesitamos iniciar sesión para obtener un refreshToken válido
        const loginData = {
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD
        };

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send(loginData);

        // Verificar que el login fue exitoso
        expect(loginRes.status).toBe(200);
        
        const cookies = loginRes.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(Array.isArray(cookies)).toBe(true);
        
        // Ahora usamos las cookies para hacer la solicitud de refresh
        const refreshRes = await request(app)
            .post('/api/auth/refresh')
            .set('Cookie', cookies);
            
        // Verificar la respuesta del refresh
        expect(refreshRes.status).toBe(200);
        expect(refreshRes.body.message).toBe('Tokens renovados correctamente');
        expect(refreshRes.body.userType).toBeDefined();
        
        // Verificar que se establecieron nuevas cookies
        const newCookies = refreshRes.headers['set-cookie'];
        expect(newCookies).toBeDefined();
        
        if (Array.isArray(newCookies)) {
            expect(newCookies.length).toBeGreaterThan(0);
            
            // Verificar contenido de cookies
            const cookiesString = newCookies.join('; ');
            expect(cookiesString).toContain('accessToken=');
            expect(cookiesString).toContain('refreshToken=');
            
            // Verificar cookies individualmente
            const accessTokenCookie = newCookies.find(cookie => 
                cookie.includes('accessToken='));
            const refreshTokenCookie = newCookies.find(cookie => 
                cookie.includes('refreshToken='));
                
            expect(accessTokenCookie).toBeDefined();
            expect(refreshTokenCookie).toBeDefined();
            
            // Verificar propiedades de seguridad
            expect(accessTokenCookie).toContain('HttpOnly');
            expect(refreshTokenCookie).toContain('HttpOnly');
        } else {
            fail('set-cookie header is not an array');
        }
    });
    
    it('debería rechazar solicitud sin refreshToken', async () => {
        const res = await request(app)
            .post('/api/auth/refresh')
            .send({});
            
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('No se encontró el token de actualización');
        
        // No debería establecer cookies en caso de error
        const setCookieHeaders = res.headers['set-cookie'];
        expect(setCookieHeaders).toBeUndefined();
    });
    
    it('debería rechazar refreshToken inválido', async () => {
        // Crear una cookie con un token inválido
        const invalidCookie = ['refreshToken=invalid_token_value; HttpOnly; Path=/'];
        
        const res = await request(app)
            .post('/api/auth/refresh')
            .set('Cookie', invalidCookie);
            
        expect(res.status).toBe(401);
        expect(res.body.message).toBeDefined();
        
        // No debería establecer cookies en caso de error
        const setCookieHeaders = res.headers['set-cookie'];
        expect(setCookieHeaders).toBeUndefined();
    });
});
