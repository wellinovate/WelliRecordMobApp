// Expo normally generates these into expo-env.d.ts the first time `expo
// start` runs (this sandbox can't run a simulator to trigger that), so
// they're declared by hand here instead.
declare module "*.png" {
  import type { ImageSourcePropType } from "react-native";
  const value: ImageSourcePropType;
  export default value;
}
declare module "*.jpg" {
  import type { ImageSourcePropType } from "react-native";
  const value: ImageSourcePropType;
  export default value;
}
declare module "*.jpeg" {
  import type { ImageSourcePropType } from "react-native";
  const value: ImageSourcePropType;
  export default value;
}
declare module "*.gif" {
  import type { ImageSourcePropType } from "react-native";
  const value: ImageSourcePropType;
  export default value;
}
declare module "*.webp" {
  import type { ImageSourcePropType } from "react-native";
  const value: ImageSourcePropType;
  export default value;
}
