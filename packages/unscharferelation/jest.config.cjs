module.exports = {
  verbose: true,
  bail: true,
  testRegex: '/__tests__/.+\\.spec\\.tsx?$',
  testPathIgnorePatterns: [
    'node_modules',
    'dist'
  ],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    'node_modules',
    'Mock'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@jamashita/genitore-(.*)$': '<rootDir>/node_modules/@jamashita/genitore-$1/src/index'
  },
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx'
  ],
  testURL: 'http://localhost'
};
