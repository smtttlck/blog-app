import "@testing-library/jest-native/extend-expect";

jest.mock("@expo/vector-icons", () => ({
  AntDesign: "Icon",
  Fontisto: "Icon",
  Ionicons: "Icon",
}));

jest.mock(
  "@react-native-async-storage/async-storage",
  () => require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("expo-font", () => ({
  useFonts: () => [true],
}));
jest.mock("expo-asset");