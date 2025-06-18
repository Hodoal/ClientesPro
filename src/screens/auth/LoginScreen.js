import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import colors from '../../styles/colors'; // Importamos colors directamente

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const result = await login(email, password);
      
      if (result.success) {
        console.log('Login exitoso:', result);
      } else {
        Alert.alert('Error', result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error completo:', error);
      Alert.alert(
        'Error de inicio de sesión',
        error.message === 'Error al iniciar sesión' 
          ? 'Las credenciales proporcionadas son incorrectas. Por favor, verifica tu email y contraseña.'
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={colors.gray[500]}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={colors.gray[500]}
        />

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: colors.primary,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: colors.dark,
  },
  loginButton: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonDisabled: {
    backgroundColor: colors.gray[400],
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    color: colors.gray[600],
    fontSize: 14,
  },
  signUpButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});