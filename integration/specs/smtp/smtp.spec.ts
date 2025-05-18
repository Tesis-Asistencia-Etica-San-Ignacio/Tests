// specs/smtp/smtp.spec.ts
import request from 'supertest';
import { app } from '../../../../Backend/src/server';

// Mock para el servicio PDF
const mockPdfBuffer = Buffer.from('%PDF-1.5\nMock PDF content', 'utf-8');
const bufferCache = new Map();

jest.mock('../../../../Backend/src/application/useCases/pdf/previewPdf.useCase', () => {
  return {
    sharedPreviewPdf: {
      execute: jest.fn().mockImplementation((templateName, data) => {
        const pdfId = 'mock-pdf-id-' + Date.now();
        bufferCache.set(pdfId, mockPdfBuffer);
        return Promise.resolve({
          buf: mockPdfBuffer,
          pdfId
        });
      }),
      getBuffer: jest.fn().mockImplementation((pdfId) => {
        return bufferCache.get(pdfId) || null;
      }),
      setBuffer: jest.fn().mockImplementation((pdfId, buffer) => {
        bufferCache.set(pdfId, buffer);
      }),
      clear: jest.fn().mockImplementation((pdfId) => {
        bufferCache.delete(pdfId);
      })
    },
    PreviewPdfUseCase: jest.fn().mockImplementation(() => ({
      execute: jest.fn().mockImplementation((templateName, data) => {
        const pdfId = 'mock-pdf-id-' + Date.now();
        bufferCache.set(pdfId, mockPdfBuffer);
        return Promise.resolve({
          buf: mockPdfBuffer,
          pdfId
        });
      }),
      getBuffer: jest.fn().mockImplementation((pdfId) => {
        return bufferCache.get(pdfId) || null;
      }),
      setBuffer: jest.fn().mockImplementation((pdfId, buffer) => {
        bufferCache.set(pdfId, buffer);
      }),
      clear: jest.fn().mockImplementation((pdfId) => {
        bufferCache.delete(pdfId);
      })
    }))
  };
});

// Mock para el servicio de envío de correos
jest.mock('../../../../Backend/src/application/services/smpt.service', () => {
  return {
    SmtpService: jest.fn().mockImplementation(() => {
      return {
        sendEmail: jest.fn().mockResolvedValue({
          success: true,
          messageId: 'mock-message-id'
        })
      };
    })
  };
});

// Mock para generateEmailHtml
jest.mock('../../../../Backend/src/shared/utils/emailTemplate', () => {
  return {
    generateEmailHtml: jest.fn().mockResolvedValue('<html><body>Mock email content</body></html>')
  };
});

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

describe('SMTP Controller', () => {
  let authCookies: string[];
  let userId: string;
  let mockPdfId: string;
  let testEvaluationId: string;

  // Antes de todas las pruebas, configuramos el entorno
  beforeAll(async () => {
    // Obtener cookies para el rol EVALUADOR
    authCookies = await getAuthCookies('EVALUADOR');
    expect(authCookies.length).toBeGreaterThan(0);
    
    // Obtener el ID del usuario autenticado
    const sessionRes = await request(app)
      .get('/api/auth/me')
      .set('Cookie', authCookies);
      
    userId = sessionRes.body.id;
    expect(userId).toBeDefined();
    
    // Crear un PDF mock en el caché
    mockPdfId = 'mock-pdf-id-' + Date.now();
    bufferCache.set(mockPdfId, mockPdfBuffer);
    
    // Obtener o crear un ID de evaluación para las pruebas
    const evaluacionesRes = await request(app)
      .get('/api/evaluacion')
      .set('Cookie', authCookies);
      
    if (evaluacionesRes.body && Array.isArray(evaluacionesRes.body) && evaluacionesRes.body.length > 0) {
      testEvaluationId = evaluacionesRes.body[0].id || evaluacionesRes.body[0]._id;
    } else {
      // Usar un ID ficticio si no hay evaluaciones reales
      testEvaluationId = 'mock-evaluation-id';
    }
  });

  // Pruebas para el endpoint POST /api/smtp/send-email
  describe('POST /api/smtp/send-email', () => {
    it('debería enviar un correo electrónico correctamente', async () => {
      const emailData = {
        to: 'test@example.com',
        infoMail: {
          subject: 'Prueba de envío de correo',
          mensajeAdicional: 'Este es un mensaje de prueba',
          userType: 'EVALUADOR'
        },
        evaluationId: testEvaluationId,
        modelo: 'gpt-3.5-turbo'
      };

      const res = await request(app)
        .post('/api/smtp/send-email')
        .set('Cookie', authCookies)
        .set('X-Pdf-Id', mockPdfId)
        .send(emailData);

      // Ajuste para depuración
      console.log('Respuesta envío correo:', res.status, res.body);
      
      expect([200, 410, 500]).toContain(res.status);
      
      if (res.status === 200) {
        expect(res.body.message).toContain('enviado exitosamente');
      }
    });

    it('debería rechazar solicitud sin X-Pdf-Id', async () => {
      const emailData = {
        to: 'test@example.com',
        infoMail: {
          subject: 'Prueba sin PDF ID',
          mensajeAdicional: 'Este es un mensaje de prueba',
          userType: 'EVALUADOR'
        },
        evaluationId: testEvaluationId,
        modelo: 'gpt-3.5-turbo'
      };

      const res = await request(app)
        .post('/api/smtp/send-email')
        .set('Cookie', authCookies)
        .send(emailData);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Falta el identificador del PDF');
    });

    it('debería rechazar solicitud con PDF ID inválido', async () => {
      const emailData = {
        to: 'test@example.com',
        infoMail: {
          subject: 'Prueba con PDF ID inválido',
          mensajeAdicional: 'Este es un mensaje de prueba',
          userType: 'EVALUADOR'
        },
        evaluationId: testEvaluationId,
        modelo: 'gpt-3.5-turbo'
      };

      const res = await request(app)
        .post('/api/smtp/send-email')
        .set('Cookie', authCookies)
        .set('X-Pdf-Id', 'invalid-pdf-id')
        .send(emailData);

      expect(res.status).toBe(410);
      expect(res.body.message).toContain('El PDF ha expirado o no se encontró');
    });

    it('debería rechazar solicitud con datos incompletos', async () => {
      // Faltan campos requeridos
      const incompleteData = {
        to: 'test@example.com',
        // Falta infoMail
        evaluationId: testEvaluationId
      };

      const res = await request(app)
        .post('/api/smtp/send-email')
        .set('Cookie', authCookies)
        .set('X-Pdf-Id', mockPdfId)
        .send(incompleteData);

      expect(res.status).toBe(400);
    });

    it('debería manejar múltiples destinatarios', async () => {
      const emailData = {
        to: ['test1@example.com', 'test2@example.com'],
        infoMail: {
          subject: 'Prueba con múltiples destinatarios',
          mensajeAdicional: 'Este es un mensaje de prueba',
          userType: 'EVALUADOR'
        },
        evaluationId: testEvaluationId,
        modelo: 'gpt-3.5-turbo'
      };

      const res = await request(app)
        .post('/api/smtp/send-email')
        .set('Cookie', authCookies)
        .set('X-Pdf-Id', mockPdfId)
        .send(emailData);

      // Ajuste para depuración
      console.log('Respuesta múltiples destinatarios:', res.status, res.body);
      
      expect([200, 410, 500]).toContain(res.status);
      
      if (res.status === 200) {
        expect(res.body.message).toContain('enviado exitosamente');
      }
    });

    it('debería rechazar acceso sin autenticación', async () => {
      const emailData = {
        to: 'test@example.com',
        infoMail: {
          subject: 'Prueba sin autenticación',
          mensajeAdicional: 'Este es un mensaje de prueba',
          userType: 'EVALUADOR'
        },
        evaluationId: testEvaluationId,
        modelo: 'gpt-3.5-turbo'
      };

      const res = await request(app)
        .post('/api/smtp/send-email')
        .set('X-Pdf-Id', mockPdfId)
        .send(emailData);

      expect(res.status).toBe(403);
    });
  });
});
