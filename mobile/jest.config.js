module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^react-redux$": "<rootDir>/node_modules/react-redux/dist/cjs/index.js",
    "^@reduxjs/toolkit$": "<rootDir>/node_modules/@reduxjs/toolkit/dist/cjs/index.js",
    "^immer$": "<rootDir>/node_modules/immer/dist/cjs/index.js",
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|@react-navigation/.*|react-redux))"
  ],
};