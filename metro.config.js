const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Figma Make exported every icon as an .svg under public/assets. Render
// them as real vector components (react-native-svg) instead of trying to
// load them as remote/web image URLs, which don't work on native.
const { transformer, resolver } = config;
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],
};

module.exports = withNativeWind(config, { input: "./src/global.css" });
