// specs/case/case.spec.ts
import request from 'supertest';
import { app } from '../../../../Backend/src/server';
import mongoose from 'mongoose';

// Función auxiliar para obtener cookies de autenticación
async function getAuthCookies(role = 'INVESTIGADOR') {
  // Usamos las credenciales según el rol requerido
  const loginData = {
    email: process.env.INVESTIGATOR_EMAIL,
    password: process.env.ADMIN_PASSWORD
  };

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send(loginData);

  return loginRes.headers['set-cookie'];
}

describe('Case Controller', () => {
  let authCookies: string | string[];
  let testCaseId: string;

  // Antes de todas las pruebas, obtenemos las cookies de autenticación
  beforeAll(async () => {
    authCookies = await getAuthCookies('INVESTIGADOR');
    expect(Array.isArray(authCookies)).toBe(true);
  });

  // Pruebas para el endpoint GET /api/cases/my
  describe('GET /api/cases/my', () => {
    it('debería devolver los casos del usuario autenticado', async () => {
      const res = await request(app)
        .get('/api/cases/my')
        .set('Cookie', authCookies as string[]);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('debería rechazar acceso sin autenticación', async () => {
      const res = await request(app)
        .get('/api/cases/my');

      expect(res.status).toBe(403);
    });
  });

  // Pruebas para el endpoint POST /api/cases
  describe('POST /api/cases', () => {
    // Esta prueba es más compleja debido a la lógica de creación de PDF
    // Necesitaremos simular el proceso de previsualización de PDF primero
    it('debería rechazar la creación sin el header X-Pdf-Id', async () => {
      const caseData = {
        nombre_proyecto: 'Proyecto de prueba',
        fecha: new Date().toISOString(),
        version: '1.0',
        codigo: 'TEST-001'
      };

      const res = await request(app)
        .post('/api/cases')
        .set('Cookie', authCookies as string[])
        .send(caseData);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Falta el identificador del PDF');
    });

    it('debería rechazar acceso sin autenticación', async () => {
      const res = await request(app)
        .post('/api/cases')
        .send({});

      expect(res.status).toBe(403);
    });
  });

  // Pruebas para el endpoint GET /api/cases/:id
  describe('GET /api/cases/:id', () => {
    it('debería devolver 404 para un ID inexistente', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app)
        .get(`/api/cases/${nonExistentId}`)
        .set('Cookie', authCookies as string[]);

      expect(res.status).toBe(404);
    });

    it('debería rechazar acceso sin autenticación', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app)
        .get(`/api/cases/${nonExistentId}`);

      expect(res.status).toBe(403);
    });
  });

  // Pruebas para el endpoint PATCH /api/cases/:id
  describe('PATCH /api/cases/:id', () => {
    it('debería devolver 404 para un ID inexistente', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app)
        .patch(`/api/cases/${nonExistentId}`)
        .set('Cookie', authCookies as string[])
        .send({ nombre_proyecto: 'Nombre actualizado' });

      expect(res.status).toBe(404);
    });

    it('debería rechazar acceso sin autenticación', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app)
        .patch(`/api/cases/${nonExistentId}`)
        .send({ nombre_proyecto: 'Nombre actualizado' });

      expect(res.status).toBe(403);
    });
  });

  // Pruebas para el endpoint DELETE /api/cases/:id
  describe('DELETE /api/cases/:id', () => {
    it('debería devolver 404 para un ID inexistente', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app)
        .delete(`/api/cases/${nonExistentId}`)
        .set('Cookie', authCookies as string[]);

      expect(res.status).toBe(404);
    });

    it('debería rechazar acceso sin autenticación', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app)
        .delete(`/api/cases/${nonExistentId}`);

      expect(res.status).toBe(403);
    });
  });
});
