const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFiles: ['<rootDir>/src/__tests__/setupEnv.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/server.ts', '!src/config/**'],
  coverageThreshold: { 
    global: { 
      lines: 70, 
      statements: 70, 
      branches: 70, 
      functions: 70 
    } 
  },
  clearMocks: true,
};

export default config;


