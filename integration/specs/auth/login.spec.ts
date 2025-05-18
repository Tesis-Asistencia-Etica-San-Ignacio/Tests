// specs/auth/login.spec.ts
import request from 'supertest';
import { app } from '../../../../Backend/src/server';

describe('POST /api/auth/login', () => {
    it('debería responder 200 y devolver cookies de acceso y refresh', async () => {
        const loginData = {
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD
        };

        console.log(loginData);

        const res = await request(app)
            .post('/api/auth/login')
            .send(loginData);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Inicio de sesión exitoso');
        expect(res.body.userType).toBeDefined();

        // Verificar que se establecieron las cookies
        const setCookieHeaders = res.headers['set-cookie'];
        expect(setCookieHeaders).toBeDefined();

        if (Array.isArray(setCookieHeaders)) {
            expect(setCookieHeaders.length).toBeGreaterThan(0);

            // Verificar contenido de cookies
            const cookiesString = setCookieHeaders.join('; ');
            expect(cookiesString).toContain('accessToken=');
            expect(cookiesString).toContain('refreshToken=');

            // Verificar cookies individualmente
            const accessTokenCookie = setCookieHeaders.find(cookie =>
                cookie.includes('accessToken='));
            const refreshTokenCookie = setCookieHeaders.find(cookie =>
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

    it('debería rechazar credenciales inválidas', async () => {
        const invalidLoginData = {
            email: 'invalid@example.com',
            password: 'wrongpassword'
        };

        const res = await request(app)
            .post('/api/auth/login')
            .send(invalidLoginData);

        expect(res.status).toBe(401);
        expect(res.body.message).toBeDefined();

        // No debería establecer cookies en caso de error
        const setCookieHeaders = res.headers['set-cookie'];
        expect(setCookieHeaders).toBeUndefined();
    });

    it('debería rechazar petición sin credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({});

        expect(res.status).toBe(401);
        expect(res.body.message).toBeDefined();
    });

    it('debería rechazar email vacío', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: '',
                password: process.env.ADMIN_PASSWORD
            });

        expect(res.status).toBe(401);
        expect(res.body.message).toBeDefined();
    });

    it('debería rechazar password vacío', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: process.env.ADMIN_EMAIL,
                password: ''
            });

        expect(res.status).toBe(401);
        expect(res.body.message).toBeDefined();
    });
});

