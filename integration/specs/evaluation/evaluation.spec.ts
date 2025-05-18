// specs/evaluacion/evaluacion.spec.ts
import request from 'supertest';
import { app } from '../../../../Backend/src/server';
import mongoose from 'mongoose';

// Función auxiliar para obtener cookies de autenticación

//SI SE ESTA CORRIENDO EL FRONT TOCA APAGARLO PORQUE SI NO EL PUERTO 3000 
// esta ocupado y no pasa la prueba

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

describe('Evaluacion Controller', () => {
  let authCookies: string | string[];
  let testEvaluacionId: string;
  let userId: string;

  // Antes de todas las pruebas, obtenemos las cookies de autenticación
  beforeAll(async () => {
    authCookies = await getAuthCookies('EVALUADOR');
    expect(Array.isArray(authCookies)).toBe(true);
    
    // Obtener el ID del usuario autenticado
    const sessionRes = await request(app)
      .get('/api/auth/me')
      .set('Cookie', authCookies);
      
    userId = sessionRes.body.id;
    expect(userId).toBeDefined();
  });

  // Pruebas para el endpoint POST /api/evaluacion
  describe('POST /api/evaluacion', () => {
    it('debería crear una nueva evaluación', async () => {
      const evaluacionData = {
        uid: userId,
        id_fundanet: 'FUND-' + Date.now(),
        file: 'https://example.com/test-file.pdf',  
        estado: 'PENDIENTE',
        tipo_error: 'NINGUNO',
        aprobado: false,
        correo_estudiante: 'estudiante@test.com',
        version: 1
      };

      const res = await request(app)
        .post('/api/evaluacion')
        .set('Cookie', authCookies as string[])
        .send(evaluacionData);

      expect(res.status).toBe(201);
      expect(res.body).toBeDefined();
      expect(res.body.id_fundanet).toBe(evaluacionData.id_fundanet);
      expect(res.body.estado).toBe(evaluacionData.estado);
      
      // Guardar el ID para pruebas posteriores
      testEvaluacionId = res.body.id || res.body._id;
    });

    it('debería rechazar la creación con datos inválidos', async () => {
      const invalidData = {
        // Faltan campos requeridos
        id_fundanet: 'FUND-INVALID'
      };

      const res = await request(app)
        .post('/api/evaluacion')
        .set('Cookie', authCookies as string[])
        .send(invalidData);

      expect(res.status).toBe(400);
    });

    it('debería rechazar acceso sin autenticación', async () => {
      const res = await request(app)
        .post('/api/evaluacion')
        .send({});

      expect(res.status).toBe(403);
    });
  });

  // Pruebas para el endpoint GET /api/evaluacion
  describe('GET /api/evaluacion', () => {
    it('debería devolver todas las evaluaciones', async () => {
      const res = await request(app)
        .get('/api/evaluacion')
        .set('Cookie', authCookies as string[]);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('debería rechazar acceso sin autenticación', async () => {
      const res = await request(app)
        .get('/api/evaluacion');

      expect(res.status).toBe(403);
    });
  });

  // Pruebas para el endpoint GET /api/evaluacion/:id
  describe('GET /api/evaluacion/:id', () => {
    it('debería devolver una evaluación por ID', async () => {
      const res = await request(app)
        .get(`/api/evaluacion/${testEvaluacionId}`)
        .set('Cookie', authCookies as string[]);

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.id || res.body._id).toBe(testEvaluacionId);
    });

    it('debería devolver 404 para un ID inexistente', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app)
        .get(`/api/evaluacion/${nonExistentId}`)
        .set('Cookie', authCookies as string[]);

      expect(res.status).toBe(404);
    });

    it('debería rechazar acceso sin autenticación', async () => {
      const res = await request(app)
        .get(`/api/evaluacion/${testEvaluacionId}`);

      expect(res.status).toBe(403);
    });
  });

  // Pruebas para el endpoint GET /api/evaluacion/my
  describe('GET /api/evaluacion/my', () => {
    it('debería devolver las evaluaciones del usuario autenticado', async () => {
      const res = await request(app)
        .get('/api/evaluacion/my')
        .set('Cookie', authCookies as string[]);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      
      // Verificar que al menos una evaluación pertenece al usuario
      if (res.body.length > 0) {
        const userEvaluaciones = res.body.filter((e: any) => e.uid === userId);
        expect(userEvaluaciones.length).toBeGreaterThan(0);
      }
    });

    it('debería rechazar acceso sin autenticación', async () => {
      const res = await request(app)
        .get('/api/evaluacion/my');

      expect(res.status).toBe(403);
    });
  });

  // Pruebas para el endpoint PATCH /api/evaluacion/:id
  describe('PATCH /api/evaluacion/:id', () => {
    it('debería actualizar una evaluación existente', async () => {
      const updateData = {
        estado: 'EN_CURSO',
        tipo_error: 'ACTUALIZADO'
      };

      const res = await request(app)
        .patch(`/api/evaluacion/${testEvaluacionId}`)
        .set('Cookie', authCookies as string[])
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.estado).toBe(updateData.estado);
      expect(res.body.tipo_error).toBe(updateData.tipo_error);
    });

    it('debería devolver 404 para un ID inexistente', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app)
        .patch(`/api/evaluacion/${nonExistentId}`)
        .set('Cookie', authCookies as string[])
        .send({ estado: 'EVALUADO' });

      expect(res.status).toBe(404);
    });

    it('debería rechazar acceso sin autenticación', async () => {
      const res = await request(app)
        .patch(`/api/evaluacion/${testEvaluacionId}`)
        .send({});

      expect(res.status).toBe(403);
    });
  });

  // Pruebas para el endpoint DELETE /api/evaluacion/:id
  describe('DELETE /api/evaluacion/:id', () => {
    it('debería eliminar una evaluación existente', async () => {
      const res = await request(app)
        .delete(`/api/evaluacion/${testEvaluacionId}`)
        .set('Cookie', authCookies as string[]);

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('deleted successfully');
    });

    it('debería devolver 404 para un ID inexistente', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app)
        .delete(`/api/evaluacion/${nonExistentId}`)
        .set('Cookie', authCookies as string[]);

      expect(res.status).toBe(404);
    });

    it('debería rechazar acceso sin autenticación', async () => {
      const res = await request(app)
        .delete(`/api/evaluacion/${testEvaluacionId}`);

      expect(res.status).toBe(403);
    });
  });
});
