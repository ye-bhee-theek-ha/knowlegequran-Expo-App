// metro.config.js

// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const resolveFrom = require("resolve-from");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('cjs');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName.startsWith('event-target-shim') &&
    context.originModulePath.includes('react-native-webrtc')
) {
    const updatedModuleName = moduleName.endsWith('/index')
        ? moduleName.replace('/index', '')
        : moduleName;

    const eventTargetShimPath = resolveFrom(context.originModulePath, updatedModuleName);

    return {
        filePath: eventTargetShimPath,
        type: 'sourceFile',
    };
}

return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;