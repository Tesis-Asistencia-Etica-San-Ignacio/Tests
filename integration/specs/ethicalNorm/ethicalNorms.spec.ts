// specs/ethicalNorm/ethicalNorm.spec.ts
import request from 'supertest';
import { app } from '../../../../Backend/src/server';
import mongoose from 'mongoose';

// Función auxiliar para obtener cookies de autenticación
async function getAuthCookies(role = 'EVALUADOR') {
  // Usamos las credenciales según el rol requerido
  const loginData = {
    email: process.env.EVALUADOR_EMAIL || process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
  };

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send(loginData);

  return loginRes.headers['set-cookie'];
}

describe('EthicalNorm Controller', () => {
  let authCookies: string | string[];
  let testNormId: string;
  let testEvaluationId: string;

  // Antes de todas las pruebas, obtenemos las cookies de autenticación
  beforeAll(async () => {
    authCookies = await getAuthCookies('EVALUADOR');
    expect(Array.isArray(authCookies)).toBe(true);
    
    // Crear una evaluación de prueba o usar una existente
    // Esto dependerá de cómo esté estructurada tu aplicación
    testEvaluationId = new mongoose.Types.ObjectId().toString();
  });

  // Pruebas para el endpoint POST /api/ethicalRules
  describe('POST /api/ethicalRules', () => {
    it('debería crear una nueva norma ética', async () => {
      const normData = {
        evaluationId: testEvaluationId,
        description: 'Norma ética de prueba',
        status: 'APROBADO',
        justification: 'Justificación de prueba',
        cita: 'Cita de prueba',
        codeNumber: 'NE-001'
      };

      const res = await request(app)
        .post('/api/ethicalRules')
        .set('Cookie', authCookies as string[])
        .send(normData);

      expect(res.status).toBe(201);
      expect(res.body).toBeDefined();
      expect(res.body.description).toBe(normData.description);
      expect(res.body.status).toBe(normData.status);
      
      // Guardar el ID para pruebas posteriores
      testNormId = res.body.id || res.body._id;
    });

    it('debería rechazar la creación con datos inválidos', async () => {
      const invalidData = {
        // Falta evaluationId y otros campos requeridos
        description: 'Norma incompleta'
      };

      const res = await request(app)
        .post('/api/ethicalRules')
        .set('Cookie', authCookies as string[])
        .send(invalidData);

      expect(res.status).toBe(400);
    });

    it('debería rechazar acceso sin autenticación', async () => {
      const res = await request(app)
        .post('/api/ethicalRules')
        .send({});

      expect(res.status).toBe(403);
    });
  });

  // Pruebas para el endpoint GET /api/ethicalRules
  describe('GET /api/ethicalRules', () => {
    it('debería devolver todas las normas éticas', async () => {
      const res = await request(app)
        .get('/api/ethicalRules')
        .set('Cookie', authCookies as string[]);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('debería rechazar acceso sin autenticación', async () => {
      const res = await request(app)
        .get('/api/ethicalRules');

      expect(res.status).toBe(403);
    });
  });

  // Pruebas para el endpoint GET /api/ethicalRules/evaluation/:evaluationId
  describe('GET /api/ethicalRules/evaluation/:evaluationId', () => {
    it('debería devolver las normas éticas de una evaluación específica', async () => {
      const res = await request(app)
        .get(`/api/ethicalRules/evaluation/${testEvaluationId}`)
        .set('Cookie', authCookies as string[]);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('debería rechazar acceso sin autenticación', async () => {
      const res = await request(app)
        .get(`/api/ethicalRules/evaluation/${testEvaluationId}`);

      expect(res.status).toBe(403);
    });
  });

  // Pruebas para el endpoint PATCH /api/ethicalRules/:id
  describe('PATCH /api/ethicalRules/:id', () => {
    it('debería actualizar una norma ética existente', async () => {
      const updateData = {
        description: 'Norma ética actualizada',
        status: 'NO_APLICA'
      };

      const res = await request(app)
        .patch(`/api/ethicalRules/${testNormId}`)
        .set('Cookie', authCookies as string[])
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.description).toBe(updateData.description);
      expect(res.body.status).toBe(updateData.status);
    });

    it('debería devolver 404 para un ID inexistente', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app)
        .patch(`/api/ethicalRules/${nonExistentId}`)
        .set('Cookie', authCookies as string[])
        .send({ description: 'Actualización inválida' });

      expect(res.status).toBe(404);
    });

    it('debería rechazar acceso sin autenticación', async () => {
      const res = await request(app)
        .patch(`/api/ethicalRules/${testNormId}`)
        .send({});

      expect(res.status).toBe(403);
    });
  });

  // Pruebas para el endpoint DELETE /api/ethicalRules/:id
  describe('DELETE /api/ethicalRules/:id', () => {
    it('debería eliminar una norma ética existente', async () => {
      const res = await request(app)
        .delete(`/api/ethicalRules/${testNormId}`)
        .set('Cookie', authCookies as string[]);

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('eliminada correctamente');
    });

    it('debería devolver 404 para un ID inexistente', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app)
        .delete(`/api/ethicalRules/${nonExistentId}`)
        .set('Cookie', authCookies as string[]);

      expect(res.status).toBe(404);
    });

    it('debería rechazar acceso sin autenticación', async () => {
      const res = await request(app)
        .delete(`/api/ethicalRules/${testNormId}`);

      expect(res.status).toBe(403);
    });
  });
});
