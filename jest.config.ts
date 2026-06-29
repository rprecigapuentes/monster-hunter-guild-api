export default {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/src/**/*.test.ts", "**/test/**/*.test.ts"],
    collectCoverage: true,
    coveragePathIgnorePatterns: ["/node_modules/", "/src/generated", "/dist"],
    coverageThreshold: {
        global: {
            branches: 80,
            lines: 80
        }
    }
};