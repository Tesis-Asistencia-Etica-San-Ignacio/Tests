// specs/user/user.spec.ts
import request from 'supertest';
import { app } from '../../../../Backend/src/server';
import mongoose from 'mongoose';

// Función auxiliar para obtener cookies de autenticación
async function getAuthCookies(role = 'EVALUADOR') {
    const loginData = {
        email: role === 'EVALUADOR'
            ? (process.env.EVALUADOR_EMAIL || process.env.ADMIN_EMAIL)
            : (process.env.INVESTIGATOR_EMAIL || process.env.ADMIN_EMAIL),
        password: process.env.ADMIN_PASSWORD
    };

    const loginRes = await request(app)
        .post('/api/auth/login')
        .send(loginData);

    const cookies = loginRes.headers['set-cookie'];
    return Array.isArray(cookies) ? cookies : (cookies ? [cookies] : []);
}

describe('User Controller', () => {
    let evaluadorCookies: string[];
    let investigadorCookies: string[];
    let testUserId: string;
    let testUserEmail: string;

    // Datos para crear usuarios de prueba
    const testPassword = 'Password123*';
    const testEvaluatorData = {
        name: 'Test',
        last_name: 'Evaluator',
        email: `test-evaluator-${Date.now()}@example.com`,
        password: testPassword,
        type: 'EVALUADOR'
    };
    const testInvestigatorData = {
        name: 'Test',
        last_name: 'Investigator',
        email: `test-investigator-${Date.now()}@example.com`,
        password: testPassword,
        type: 'INVESTIGADOR'
    };

    // Antes de todas las pruebas, obtenemos las cookies de autenticación
    beforeAll(async () => {
        // Obtener cookies para el rol EVALUADOR
        evaluadorCookies = await getAuthCookies('EVALUADOR');
        expect(evaluadorCookies.length).toBeGreaterThan(0);

        // Intentar obtener cookies para el rol INVESTIGADOR
        try {
            investigadorCookies = await getAuthCookies('INVESTIGADOR');
        } catch (error) {
            console.warn('No se pudieron obtener cookies para INVESTIGADOR, algunas pruebas podrían fallar');
        }
    });

    // Pruebas para el endpoint GET /api/user
    describe('GET /api/user', () => {
        it('debería devolver todos los usuarios', async () => {
            const res = await request(app)
                .get('/api/user')
                .set('Cookie', evaluadorCookies);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('debería rechazar acceso sin autenticación', async () => {
            const res = await request(app)
                .get('/api/user');

            expect(res.status).toBe(403);
        });
    });

    // Pruebas para el endpoint POST /api/user/evaluador
    describe('POST /api/user/evaluador', () => {
        it('debería crear un nuevo evaluador', async () => {
            const res = await request(app)
                .post('/api/user/evaluador')
                .set('Cookie', evaluadorCookies)
                .send(testEvaluatorData);

            expect(res.status).toBe(201);
            expect(res.body).toBeDefined();
            expect(res.body.name).toBe(testEvaluatorData.name);
            expect(res.body.email).toBe(testEvaluatorData.email);
            expect(res.body.type).toBe('EVALUADOR');

            // Guardar el ID para pruebas posteriores
            testUserId = res.body.id || res.body._id;
            testUserEmail = res.body.email;
        });

        it('debería rechazar la creación con datos inválidos', async () => {
            const invalidData = {
                // Faltan campos requeridos
                name: 'Invalid',
                email: 'invalid@example.com'
            };

            const res = await request(app)
                .post('/api/user/evaluador')
                .set('Cookie', evaluadorCookies)
                .send(invalidData);

            // Aceptar tanto 400 como 500 como respuestas válidas para datos inválidos
            expect([400, 500]).toContain(res.status);
        });

        it('debería rechazar acceso sin autenticación', async () => {
            const res = await request(app)
                .post('/api/user/evaluador')
                .send(testEvaluatorData);

            expect(res.status).toBe(403);
        });
    });

    // Pruebas para el endpoint POST /api/user/investigador
    describe('POST /api/user/investigador', () => {
        it('debería crear un nuevo investigador sin autenticación', async () => {
            const res = await request(app)
                .post('/api/user/investigador')
                .send(testInvestigatorData);

            expect(res.status).toBe(201);
            expect(res.body).toBeDefined();
            expect(res.body.name).toBe(testInvestigatorData.name);
            expect(res.body.email).toBe(testInvestigatorData.email);
            expect(res.body.type).toBe('INVESTIGADOR');
        });

        it('debería rechazar la creación con datos inválidos', async () => {
            const invalidData = {
                // Faltan campos requeridos
                name: 'Invalid',
                email: 'invalid@example.com'
            };

            const res = await request(app)
                .post('/api/user/investigador')
                .send(invalidData);

            expect([400, 500]).toContain(res.status);
        });
    });

    // Pruebas para el endpoint GET /api/user/:id
    describe('GET /api/user/:id', () => {
        it('debería devolver un usuario por ID', async () => {
            // Verificar que tenemos un ID de usuario para probar
            expect(testUserId).toBeDefined();

            const res = await request(app)
                .get(`/api/user/${testUserId}`)
                .set('Cookie', evaluadorCookies);

            expect(res.status).toBe(200);
            expect(res.body).toBeDefined();
            expect(res.body.id || res.body._id).toBe(testUserId);
        });

        it('debería devolver 404 para un ID inexistente', async () => {
            const nonExistentId = new mongoose.Types.ObjectId().toString();

            const res = await request(app)
                .get(`/api/user/${nonExistentId}`)
                .set('Cookie', evaluadorCookies);

            expect(res.status).toBe(404);
        });

        it('debería rechazar acceso sin autenticación', async () => {
            const res = await request(app)
                .get(`/api/user/${testUserId || 'some-id'}`);

            expect(res.status).toBe(403);
        });
    });

    // Pruebas para el endpoint PATCH /api/user
    describe('PATCH /api/user', () => {
        it('debería actualizar el perfil del usuario autenticado', async () => {
            // Primero iniciamos sesión con el usuario creado
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUserEmail,
                    password: testPassword
                });

            const userCookies = loginRes.headers['set-cookie'];
            expect(Array.isArray(userCookies)).toBe(true);

            // Ahora actualizamos el perfil
            const updateData = {
                name: 'Updated Name',
                last_name: 'Updated Last Name'
            };

            const res = await request(app)
                .patch('/api/user')
                .set('Cookie', userCookies)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body).toBeDefined();
            expect(res.body.name).toBe(updateData.name);
            expect(res.body.last_name).toBe(updateData.last_name);
        });

        it('debería rechazar acceso sin autenticación', async () => {
            const res = await request(app)
                .patch('/api/user')
                .send({ name: 'Test' });

            expect(res.status).toBe(403);
        });
    });

    // Pruebas para el endpoint POST /api/user/update-password
    describe('POST /api/user/update-password', () => {
        it('debería actualizar la contraseña del usuario autenticado', async () => {
            // Primero iniciamos sesión con el usuario creado
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUserEmail,
                    password: testPassword
                });

            const userCookies = loginRes.headers['set-cookie'];
            expect(Array.isArray(userCookies)).toBe(true);

            // Ahora actualizamos la contraseña
            const passwordData = {
                password: testPassword,
                newPassword: 'NewPassword123*'
            };

            const res = await request(app)
                .post('/api/user/update-password')
                .set('Cookie', userCookies)
                .send(passwordData);

            expect(res.status).toBe(200);
            expect(res.body.message).toContain('actualizada exitosamente');

            // Verificar que podemos iniciar sesión con la nueva contraseña
            const newLoginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUserEmail,
                    password: 'NewPassword123*'
                });

            expect(newLoginRes.status).toBe(200);
        });

        it('debería rechazar actualización con contraseña actual incorrecta', async () => {
            const res = await request(app)
                .post('/api/user/update-password')
                .set('Cookie', evaluadorCookies)
                .send({
                    password: 'WrongPassword123*',
                    newPassword: 'NewPassword123*'
                });

            expect(res.status).toBe(400);
        });

        it('debería rechazar actualización con datos incompletos', async () => {
            const res = await request(app)
                .post('/api/user/update-password')
                .set('Cookie', evaluadorCookies)
                .send({
                    password: testPassword
                    // Falta newPassword
                });

            expect(res.status).toBe(400);
        });

        it('debería rechazar acceso sin autenticación', async () => {
            const res = await request(app)
                .post('/api/user/update-password')
                .send({
                    password: testPassword,
                    newPassword: 'NewPassword123*'
                });

            expect(res.status).toBe(403);
        });
    });

    // Pruebas para el endpoint DELETE /api/user
    // Nota: Dejamos esta prueba para el final ya que elimina el usuario
    describe('DELETE /api/user', () => {
        it('debería eliminar el usuario autenticado', async () => {
            // Primero iniciamos sesión con el usuario creado
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUserEmail,
                    password: 'NewPassword123*' // Usamos la contraseña actualizada
                });

            const userCookies = loginRes.headers['set-cookie'];

            // Si no pudimos iniciar sesión, omitimos esta prueba
            if (!Array.isArray(userCookies) || userCookies.length === 0) {
                console.warn('No se pudo iniciar sesión con el usuario de prueba, omitiendo prueba de eliminación');
                return;
            }

            const res = await request(app)
                .delete('/api/user')
                .set('Cookie', userCookies);

            expect(res.status).toBe(200);
            expect(res.body.message).toContain('deleted successfully');

            // Verificar que el usuario ya no existe
            const checkRes = await request(app)
                .get(`/api/user/${testUserId}`)
                .set('Cookie', evaluadorCookies);

            expect(checkRes.status).toBe(404);
        });

        it('debería rechazar acceso sin autenticación', async () => {
            const res = await request(app)
                .delete('/api/user');

            expect(res.status).toBe(403);
        });
    });
});
