// specs/auth/session.spec.ts
import request from 'supertest';
import { app } from '../../../../Backend/src/server';

describe('GET /api/auth/me', () => {
    it('debería devolver información del usuario con un accessToken válido', async () => {
        // Primero necesitamos iniciar sesión para obtener un accessToken válido
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
        
        if(!Array.isArray(cookies)) {
            fail('set-cookie header is not an array');
        }
        // Extraer solo la cookie de accessToken
        const accessTokenCookie = cookies.find(cookie => cookie.includes('accessToken='));
        expect(accessTokenCookie).toBeDefined();
        
        // Ahora usamos la cookie de accessToken para hacer la solicitud de sesión
        const sessionRes = await request(app)
            .get('/api/auth/me')
            .set('Cookie', [accessTokenCookie]);
            
        // Verificar la respuesta de la sesión
        expect(sessionRes.status).toBe(200);
        
        // Verificar que la respuesta contiene información del usuario
        expect(sessionRes.body).toBeDefined();
        expect(sessionRes.body.id).toBeDefined();
        expect(sessionRes.body.email).toBe(process.env.ADMIN_EMAIL);
        expect(sessionRes.body.type).toBeDefined();  // Usar type en lugar de role
    });
    
    it('debería rechazar solicitud sin accessToken', async () => {
        const res = await request(app)
            .get('/api/auth/me');
            
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('No se encontró token de acceso');
    });
    
    it('debería rechazar accessToken inválido', async () => {
        // Crear una cookie con un token inválido
        const invalidCookie = ['accessToken=invalid_token_value; HttpOnly; Path=/'];
        
        const res = await request(app)
            .get('/api/auth/me')
            .set('Cookie', invalidCookie);
            
        expect(res.status).toBe(401);
        expect(res.body.message).toBeDefined();
    });
});
