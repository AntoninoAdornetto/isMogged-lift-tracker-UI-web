module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.spec.tsx", "**/*.spec.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@src(.*)$": "<rootDir>/src/$1",
    "^@assets(.*)$": "<rootDir>/src/assets/$1",
    "^@components(.*)$": "<rootDir>/src/components/$1",
    "^@lib(.*)$": "<rootDir>/src/lib/$1",
    "^@layouts(.*)$": "<rootDir>/src/layouts/$1",
    "^@pages(.*)$": "<rootDir>/src/pages/$1",
    "^@utils(.*)$": "<rootDir>/src/utils/$1",
    "^@services(.*)$": "<rootDir>/src/services/$1",
    "\\.css": "identity-obj-proxy",
  },
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};
