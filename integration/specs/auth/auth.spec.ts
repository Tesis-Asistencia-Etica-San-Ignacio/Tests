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

