// integration/specs/setup-env.ts
// Este archivo se ejecuta ANTES que cualquier otro import
const path = require('path');

// Cargar el .env.test del directorio integration
require('dotenv').config({
    path: path.resolve(__dirname, '../.env.test')
});

// También cargar el .env del backend como fallback
require('dotenv').config({
    path: path.resolve(__dirname, '../../../Backend/.env')
});

// También cargar el .env de la raíz de tests
require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
});

// Establecer valores por defecto para testing si no existen
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.PORT = process.env.PORT || '3000';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:secret123@mongo:27017/tuDB?authSource=admin';
process.env.CONVENTION_API = process.env.CONVENTION_API || '/api';
process.env.JWT_SECRET = process.env.JWT_SECRET || '2b2fd4d284fc1a93625ab4cf4aa36f48';
process.env.JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH || '2b2fdfa284fc1a93625ab4cf4aa36f48a86a8zxc64c4feef541ea45ae78d161f';
process.env.SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
process.env.SMTP_PORT = process.env.SMTP_PORT || '587';
process.env.SMTP_USER = process.env.SMTP_USER || 'jmanuelrardilla@gmail.com';
process.env.SMTP_PASS = process.env.SMTP_PASS || 'rjqc owxj qoez opif';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
process.env.BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin-husi@gmail.com';
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Password123*';

// Log para verificar que las variables se cargaron
console.log('✅ Environment variables loaded for integration tests');
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'Loaded' : 'NOT LOADED'}`);