// src/components/forms/LoginForm.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { colors, typography, spacing } from '../../styles/theme';
import { login } from '../../store/slices/authSlice';

const LoginForm = ({ onForgotPassword, onSignUp }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Llamada a la API de login
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Dispatch login action
        dispatch(login({
          token: result.token,
          user: result.user
        }));
      } else {
        Alert.alert('Error', result.message || 'Credenciales inválidas');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) || 'Email inválido';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SIGN IN</Text>
        <TouchableOpacity onPress={onSignUp}>
          <Text style={styles.switchText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email es requerido',
            validate: validateEmail
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Email Address"
              value={value}
              onChangeText={onChange}
              leftIcon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Contraseña es requerida',
            minLength: {
              value: 6,
              message: 'La contraseña debe tener al menos 6 caracteres'
            }
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Password"
              value={value}
              onChangeText={onChange}
              leftIcon="lock"
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />

        <TouchableOpacity 
          onPress={onForgotPassword}
          style={styles.forgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          title="SIGN IN"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          style={styles.submitButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text
  },
  switchText: {
    fontSize: typography.fontSizes.base,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium
  },
  form: {
    flex: 1
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
    marginTop: -spacing.sm
  },
  forgotPasswordText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary
  },
  submitButton: {
    marginTop: spacing.md
  }
});

export default LoginForm;

// src/components/forms/SignUpForm.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { colors, typography, spacing } from '../../styles/theme';
import { login } from '../../store/slices/authSlice';

const SignUpForm = ({ onSignIn }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      mobile: '',
      password: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        dispatch(login({
          token: result.token,
          user: result.user
        }));
      } else {
        Alert.alert('Error', result.message || 'Error al crear la cuenta');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) || 'Email inválido';
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile) || 'Número de móvil inválido (10 dígitos)';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onSignIn}>
          <Text style={styles.switchText}>SIGN IN</Text>
        </TouchableOpacity>
        <Text style={styles.title}>SIGN UP</Text>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="username"
          rules={{
            required: 'Nombre de usuario es requerido',
            minLength: {
              value: 3,
              message: 'Mínimo 3 caracteres'
            }
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Username"
              value={value}
              onChangeText={onChange}
              leftIcon="user"
              error={errors.username?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email es requerido',
            validate: validateEmail
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Email Address"
              value={value}
              onChangeText={onChange}
              leftIcon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="mobile"
          rules={{
            required: 'Número móvil es requerido',
            validate: validateMobile
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Mobile"
              value={value}
              onChangeText={onChange}
              leftIcon="phone"
              keyboardType="phone-pad"
              error={errors.mobile?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Contraseña es requerida',
            minLength: {
              value: 6,
              message: 'La contraseña debe tener al menos 6 caracteres'
            }
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Password"
              value={value}
              onChangeText={onChange}
              leftIcon="lock"
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />

        <Button
          title="SIGN UP"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          style={styles.submitButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text
  },
  switchText: {
    fontSize: typography.fontSizes.base,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium
  },
  form: {
    flex: 1
  },
  submitButton: {
    marginTop: spacing.lg
  }
});

export default SignUpForm;