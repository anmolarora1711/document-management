// jest.config.ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts'],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};

export default config;
