module.exports = {
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    moduleFileExtensions: ['js', 'ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    setupFiles: [],
    transformIgnorePatterns: ['/node_modules/'],
    testPathIgnorePatterns: ['__testUtils__'],
    clearMocks: true,
    restoreMocks: true,
    testMatch: ['**/*.spec.(js|ts)'],
    roots: ['<rootDir>/src'],
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        resources: "usable"
    },
    globals: {
        __DEV__: true
    }
}
