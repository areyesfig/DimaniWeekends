module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^@env$': '<rootDir>/src/shared/services/__tests__/__mocks__/env.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/src/shared/services/__tests__/setup.ts'],
};
