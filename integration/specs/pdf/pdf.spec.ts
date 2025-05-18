// specs/pdf/pdf.spec.ts
import request from 'supertest';
import { app } from '../../../../Backend/src/server';
import mongoose from 'mongoose';

// Mock de la generación de PDFs
jest.mock('../../../../Backend/src/application/useCases/pdf/previewPdf.useCase', () => {
  const mockPdfBuffer = Buffer.from('%PDF-1.5\nMock PDF content', 'utf-8');
  
  return {
    sharedPreviewPdf: {
      execute: jest.fn().mockImplementation((templateName, data) => {
        return Promise.resolve({
          buf: mockPdfBuffer,
          pdfId: 'mock-pdf-id-' + Date.now()
        });
      }),
      getBuffer: jest.fn().mockReturnValue(mockPdfBuffer),
      clear: jest.fn()
    },
    PreviewPdfUseCase: jest.fn().mockImplementation(() => ({
      execute: jest.fn().mockImplementation((templateName, data) => {
        return Promise.resolve({
          buf: mockPdfBuffer,
          pdfId: 'mock-pdf-id-' + Date.now()
        });
      })
    }))
  };
});

// Función auxiliar para obtener cookies de autenticación
async function getAuthCookies(role = 'EVALUADOR') {
  // Implementación como en tu código actual
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

describe('PDF Controller', () => {
  let evaluadorCookies: string[];
  let investigadorCookies: string[];
  let testEvaluationId: string;
  let hasInvestigadorRole = false;

  // Antes de todas las pruebas, obtenemos las cookies de autenticación
  beforeAll(async () => {
    // Obtener cookies para el rol EVALUADOR
    evaluadorCookies = await getAuthCookies('EVALUADOR');
    expect(evaluadorCookies.length).toBeGreaterThan(0);
    
    // Intentar obtener cookies para el rol INVESTIGADOR
    investigadorCookies = await getAuthCookies('INVESTIGADOR');
    hasInvestigadorRole = investigadorCookies.length > 0;
    
    // Obtener una evaluación para usar en las pruebas
    if (evaluadorCookies.length > 0) {
      const evaluacionesRes = await request(app)
        .get('/api/evaluacion')
        .set('Cookie', evaluadorCookies);
        
      if (evaluacionesRes.body && Array.isArray(evaluacionesRes.body) && evaluacionesRes.body.length > 0) {
        testEvaluationId = evaluacionesRes.body[0].id || evaluacionesRes.body[0]._id;
      } else {
        // Crear un ID de evaluación ficticio si no hay evaluaciones reales
        testEvaluationId = new mongoose.Types.ObjectId().toString();
      }
    }
  });

  // Pruebas para el endpoint POST /api/pdf/preview-evaluator
  describe('POST /api/pdf/preview-evaluator', () => {
    it('debería generar un PDF de evaluador correctamente', async () => {
      const requestData = {
        evaluationId: testEvaluationId
      };

      const res = await request(app)
        .post('/api/pdf/preview-evaluator')
        .set('Cookie', evaluadorCookies)
        .send(requestData);

      // Verificar que la respuesta sea un PDF
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toBe('application/pdf');
      expect(res.headers['x-pdf-id']).toBeDefined();
    });

    it('debería rechazar solicitud sin evaluationId', async () => {
      const res = await request(app)
        .post('/api/pdf/preview-evaluator')
        .set('Cookie', evaluadorCookies)
        .send({});

      expect(res.status).toBe(400);
    });

    it('debería rechazar acceso sin autenticación', async () => {
      const requestData = {
        evaluationId: testEvaluationId
      };

      const res = await request(app)
        .post('/api/pdf/preview-evaluator')
        .send(requestData);

      expect(res.status).toBe(403);
    });
  });

  // Pruebas para el endpoint POST /api/pdf/preview-investigator
  describe('POST /api/pdf/preview-investigator', () => {
    it('debería generar un PDF de investigador correctamente', async () => {
      // Omitir si no tenemos cookies de investigador
      if (!hasInvestigadorRole) {
        console.warn('Omitiendo prueba: No hay cookies de investigador disponibles');
        return;
      }

      const requestData = {
        nombre_proyecto: 'Proyecto de prueba',
        fecha: new Date().toISOString().split('T')[0],
        version: '1.0',
        codigo: 'TEST-001',
        investigador: 'Dr. Test',
        institucion: 'Universidad de Prueba',
        descripcion: 'Descripción del proyecto de prueba'
      };

      const res = await request(app)
        .post('/api/pdf/preview-investigator')
        .set('Cookie', investigadorCookies)
        .send(requestData);

      // Verificar que la respuesta sea un PDF
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toBe('application/pdf');
      expect(res.headers['x-pdf-id']).toBeDefined();
    });

    it('debería rechazar solicitud con datos incompletos', async () => {
      // Omitir si no tenemos cookies de investigador
      if (!hasInvestigadorRole) {
        console.warn('Omitiendo prueba: No hay cookies de investigador disponibles');
        return;
      }

      // Faltan campos requeridos
      const incompleteData = {
        nombre_proyecto: 'Proyecto incompleto'
      };

      const res = await request(app)
        .post('/api/pdf/preview-investigator')
        .set('Cookie', investigadorCookies)
        .send(incompleteData);

      expect(res.status).toBe(400);
    });

    it('debería rechazar acceso sin autenticación', async () => {
      const requestData = {
        nombre_proyecto: 'Proyecto de prueba',
        fecha: new Date().toISOString().split('T')[0],
        version: '1.0',
        codigo: 'TEST-001'
      };

      const res = await request(app)
        .post('/api/pdf/preview-investigator')
        .send(requestData);

      expect(res.status).toBe(403);
    });
  });
});
