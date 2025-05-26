const path = require('path');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/specs'],
    testMatch: ['<rootDir>/specs/**/*.spec.ts'],
    transform: {
        '^.+\\.ts': 'ts-jest',
    },
    // Configurar el setup ANTES de cualquier import
    setupFiles: ['<rootDir>/specs/setup-env.ts'],
    setupFilesAfterEnv: ['<rootDir>/specs/setup.ts'],
    // Remover setupFilesAfterEnv por ahora hasta crear el archivo
    // setupFilesAfterEnv: ['<rootDir>/specs/setup.ts'],
    collectCoverageFrom: [
        '../../Backend/src/**/*.ts',
        '!../../Backend/src/**/*.d.ts',
        '!../../Backend/src/server.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    verbose: true,
    forceExit: true,
    detectOpenHandles: false,
    testTimeout: 30000,
    // Configurar el path para resolver módulos relativos al backend
    moduleNameMapper: {
        '^@/(.*)': '<rootDir>/../../Backend/src/$1',
    },
};