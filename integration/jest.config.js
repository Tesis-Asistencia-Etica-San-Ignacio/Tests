/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  roots: ['<rootDir>/specs'],
  setupFiles: ['dotenv/config'], 
  globals: { 'ts-jest': { tsconfig: 'tsconfig.json' } }
};
