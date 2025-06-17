// Basic configuration file
// For Expo, you can use environment variables: https://docs.expo.dev/guides/environment-variables/
// Example: process.env.EXPO_PUBLIC_API_URL
// For bare React Native, consider react-native-config or similar.

export const Config = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  // Add other global configurations here
};
