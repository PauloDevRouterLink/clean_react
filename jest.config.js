module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/.jest/setup-tests.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/cypress'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js.ts.jsx.tsx}',
    '!<rootDir>/src/main/**/*',
    '!**/*.d.ts',
  ],
  coverageDirectory: '.coverage',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '\\.scss$': 'identity-obj-proxy',
  },
  // transform: {
  //   '.+\\.(ts|tsx)$': 'ts-jest',
  // },
  // transform: {
  //   '\\.[jt]sx?$': 'babel-jest',
  // },
}
