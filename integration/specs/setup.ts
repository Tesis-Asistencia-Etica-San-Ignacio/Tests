// integration/specs/setup.ts
// Este archivo se ejecuta después de que Jest esté configurado
import mongoose from 'mongoose';
// Configuración global para los tests
beforeAll(async () => {
    console.log('🚀 Setting up integration test environment...');
    console.log(`Running tests against: ${process.env.BACKEND_URL}`);
});

afterAll(async () => {
    try {
    await mongoose.disconnect();
    console.log('MongoDB connection closed successfully');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
    console.log('🧹 Cleaning up integration test environment...');

});

// Configurar timeouts globales
jest.setTimeout(30000);

// Configurar expect globalmente si necesitas matchers personalizados
expect.extend({
    toContainCookie(received: string[], cookieName: string) {
        const found = received.some(cookie => cookie.includes(`${cookieName}=`));
        return {
            message: () => `expected cookies to ${found ? 'not ' : ''}contain ${cookieName}`,
            pass: found,
        };
    },
});