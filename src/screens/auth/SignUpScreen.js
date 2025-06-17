import React, { useState, useEffect } from 'react'; // Ensure useEffect is imported
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
import { useAuth } from '../../hooks/useAuth'; // Added useAuth
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { colors, spacing, typography } from '../../styles/theme';

export default function SignUpScreen({ navigation }) {
  // const dispatch = useDispatch(); // Replaced by useAuth
  // const { loading, error } = useSelector((state) => state.auth); // Replaced by useAuth
  const { register, user, isAuthenticated, loading, error, clearAuthenticationError } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
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

  const validateForm = () => {
    if (!formData.username.trim()) {
      Alert.alert('Error', 'El nombre de usuario es requerido');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'El email es requerido');
      return false;
    }
    if (!formData.mobile.trim()) {
      Alert.alert('Error', 'El teléfono es requerido');
      return false;
    }
    if (!formData.password.trim()) {
      Alert.alert('Error', 'La contraseña es requerida');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      // await dispatch(registerUser({ // Replaced by useAuth's register
      //   username: formData.username,
      //   email: formData.email,
      //   mobile: formData.mobile,
      //   password: formData.password,
      // })).unwrap();
      await register({ // Data for registration
        username: formData.username,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      });
      // Navigation/success alert will be handled by useEffect watching isAuthenticated
    } catch (error) { // Error should be in state.auth.error from useAuth
      // Alert.alert('Error', error); // This was for unwrap() error, now handled by error effect
      console.log("SignUp dispatch caught an error (now in state.auth.error from useAuth):", error);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
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
            <TouchableOpacity style={styles.inactiveTab} onPress={navigateToLogin}>
              <Text style={styles.inactiveTabText}>SIGN IN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.activeTab}>
              <Text style={styles.activeTabText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>

          {/* Display Loading and Error States from useAuth */}
          {loading && <Text style={styles.loadingText}>Creating account...</Text>}
          {error && <Text style={styles.errorText}>Error: {error}</Text>}

          {/* Form Fields */}
          <View style={styles.formFields}>
            <Input
              placeholder="Username"
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
              leftIcon="person"
              autoCapitalize="words"
            />

            <Input
              placeholder="Email Address"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email"
            />

            <Input
              placeholder="Mobile"
              value={formData.mobile}
              onChangeText={(value) => handleInputChange('mobile', value)}
              keyboardType="phone-pad"
              leftIcon="phone"
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

            <Button
              title="SIGN UP"
              onPress={handleSignUp}
              loading={loading}
              style={styles.signUpButton}
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
    Alert.alert("Sign Up Error", error);
    console.log("SignUp Error (from useAuth state):", error);
    // Clear the error from Redux state after displaying it
    clearAuthenticationError();
  }
}, [error, clearAuthenticationError]); // Dependencies for the error effect

useEffect(() => {
  if (isAuthenticated && user) {
    // Display success message and navigate to Login
    Alert.alert("Sign Up Success", `Welcome ${user.username || user.name || "User"}! Please login.`);
    console.log("SignUp successful (from useAuth state), user:", user);
    navigation.navigate("Login");
  }
}, [isAuthenticated, user, navigation]); // Dependencies for the success effect

const styles = StyleSheet.create({
  errorText: {
    color: colors.danger || 'red',
    textAlign: 'center',
    marginBottom: spacing.md,
    fontSize: typography.sizes.sm || 14,
  },
  loadingText: {
    textAlign: 'center',
    color: colors.text, // Or a specific loading color
    marginBottom: spacing.md,
    fontSize: typography.sizes.sm || 14,
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    flex: 0.3,
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
    flex: 0.7,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    minHeight: 500,
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
  signUpButton: {
    marginTop: spacing.xl,
  },
});