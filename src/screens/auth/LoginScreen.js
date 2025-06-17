import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAuth } from '../../hooks/useAuth'; // Added useAuth
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { colors, spacing, typography } from '../../styles/theme';

export default function LoginScreen({ navigation }) {
  // const dispatch = useDispatch(); // Replaced by useAuth
  // const { loading, error } = useSelector((state) => state.auth); // Replaced by useAuth
  const { login, user, isAuthenticated, loading, error, clearAuthenticationError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (error) {
      // dispatch(clearError()); // Replaced by useAuth's clearAuthenticationError
      clearAuthenticationError();
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // console.log(`Attempting login with email: ${formData.email}`); // Optional: for debugging
    try {
      // await dispatch(loginUser({ // Replaced by useAuth's login
      //   email: formData.email,
      //   password: formData.password,
      // })).unwrap();
      await login({ email: formData.email, password: formData.password });
      // Navigation will be handled by useEffect watching isAuthenticated
    } catch (error) { // Error should be in state.auth.error from useAuth
      // Alert.alert('Error', error); // This error is from dispatch().unwrap(), useAuth's error is preferred.
      // Error is now in `error` from `useAuth()`, handled by useEffect
      console.log("Login dispatch caught an error (now in state.auth.error from useAuth):", error);
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>FRAVE</Text>
          </View>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Tab Headers */}
          <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.activeTab}>
              <Text style={styles.activeTabText}>SIGN IN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.inactiveTab} onPress={navigateToSignUp}>
              <Text style={styles.inactiveTabText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>

          {/* Display Loading and Error States from useAuth */}
          {loading && <ActivityIndicator animating={true} color={colors.primary} style={{marginBottom: spacing.md}} />}
          {error && <Text style={styles.errorText}>Error: {error}</Text>}

          {/* Form Fields */}
          <View style={styles.formFields}>
            <Input
              placeholder="Email Address"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email"
            />

            <Input
              placeholder="Password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry={!showPassword}
              leftIcon="lock"
              rightIcon={showPassword ? 'visibility-off' : 'visibility'}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <TouchableOpacity onPress={navigateToForgotPassword} style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="SIGN IN"
              onPress={handleLogin}
              loading={loading}
              style={styles.signInButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// useEffects to handle responses from useAuth hook
useEffect(() => {
  if (error) {
    // Display error in an Alert and log it
    Alert.alert("Login Error", error);
    console.log("Login Error (from useAuth state):", error);
    // Clear the error from Redux state after displaying it to prevent re-triggering
    clearAuthenticationError();
  }
}, [error, clearAuthenticationError]); // Dependencies for the error effect

useEffect(() => {
  if (isAuthenticated && user) {
    // Display success message and potentially navigate
    // Using user.name (if available from your user object structure) or user.email
    Alert.alert("Login Success", `Welcome ${user.name || user.email || "User"}!`);
    console.log("Login successful (from useAuth state), user:", user);
    // Example: navigate to the main part of the app and prevent going back to login screen
    // navigation.replace('MainAppStack');
  }
}, [isAuthenticated, user, navigation]); // Dependencies for the authentication success effect

const styles = StyleSheet.create({
  errorText: {
    color: colors.danger || 'red', // Use danger color from theme or fallback to 'red'
    textAlign: 'center',
    marginBottom: spacing.md,
    fontSize: typography.sizes.sm || 14, // Use sm size from theme or fallback
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: 1,
  },
  formContainer: {
    flex: 0.6,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    minHeight: 400,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  activeTab: {
    flex: 1,
    paddingVertical: spacing.md,
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  inactiveTab: {
    flex: 1,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  activeTabText: {
    textAlign: 'center',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.text,
    letterSpacing: 0.5,
  },
  inactiveTabText: {
    textAlign: 'center',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.gray500,
    letterSpacing: 0.5,
  },
  formFields: {
    flex: 1,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  forgotPasswordText: {
    fontSize: typography.sizes.sm,
    color: colors.gray500,
    fontWeight: typography.weights.medium,
  },
  signInButton: {
    marginTop: spacing.md,
  },
});