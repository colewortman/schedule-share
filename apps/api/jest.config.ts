import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  clearMocks: true,
  moduleNameMapper: {
    '^uuid$': '<rootDir>/tests/__mocks__/uuid.ts',
  },
};

export default config;
