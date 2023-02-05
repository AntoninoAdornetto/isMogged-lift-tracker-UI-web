module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.spec.tsx"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@src(.*)$": "<rootDir>/src/$1",
    "^@assets(.*)$": "<rootDir>/src/assets/$1",
    "^@components(.*)$": "<rootDir>/src/components/$1",
    "^@context(.*)$": "<rootDir>/src/context/$1",
    "^@data(.*)$": "<rootDir>/src/data/$1",
    "^@lib(.*)$": "<rootDir>/src/lib/$1",
    "^@layouts(.*)$": "<rootDir>/src/layouts/$1",
    "^@pages(.*)$": "<rootDir>/src/pages/$1",
    "^@utils(.*)$": "<rootDir>/src/utils/$1",
    "^@services(.*)$": "<rootDir>/src/services/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};
