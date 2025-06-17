import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/Button';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Gestiona tus Clientes',
    subtitle: 'Organiza toda la información de tus clientes en un solo lugar',
    icon: '👥',
    description: 'Mantén un registro completo de contactos, historiales y preferencias de cada cliente.',
  },
  {
    id: 2,
    title: 'Seguimiento Avanzado',
    subtitle: 'Realiza seguimiento detallado de interacciones y ventas',
    icon: '📊',
    description: 'Visualiza métricas importantes y el progreso de tus relaciones comerciales.',
  },
  {
    id: 3,
    title: 'Reportes Profesionales',
    subtitle: 'Genera reportes detallados para tomar mejores decisiones',
    icon: '📈',
    description: 'Obtén insights valiosos sobre tu base de clientes y performance de ventas.',
  },
];

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = (event) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(page);
  };

  const goToPage = (page) => {
    scrollViewRef.current.scrollTo({ x: page * width, animated: true });
    setCurrentPage(page);
  };

  const handleGetStarted = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('Login');
    });
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  const renderOnboardingItem = ({ title, subtitle, icon, description }) => (
    <View style={styles.slide} key={title}>
      <View style={styles.slideContent}>
        {/* Icono */}
        <View style={styles.iconContainer}>
          <Text style={styles.slideIcon}>{icon}</Text>
        </View>

        {/* Contenido de texto */}
        <View style={styles.textContent}>
          <Text style={styles.slideTitle}>{title}</Text>
          <Text style={styles.slideSubtitle}>{subtitle}</Text>
          <Text style={styles.slideDescription}>{description}</Text>
        </View>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentPage && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header con botón Skip */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>ClientesPro</Text>
          </View>
          <Button
            title="Saltar"
            variant="text"
            onPress={handleSkip}
            textStyle={styles.skipText}
          />
        </View>

        {/* Contenido principal */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {onboardingData.map((item) => renderOnboardingItem(item))}
        </ScrollView>

        {/* Paginación */}
        {renderPagination()}

        {/* Botones de navegación */}
        <View style={styles.buttonContainer}>
          {currentPage < onboardingData.length - 1 ? (
            <View style={styles.navigationButtons}>
              <Button
                title="Anterior"
                variant="outline"
                onPress={() => goToPage(currentPage - 1)}
                disabled={currentPage === 0}
                style={[
                  styles.navButton,
                  currentPage === 0 && styles.disabledButton,
                ]}
              />
              <Button
                title="Siguiente"
                onPress={() => goToPage(currentPage + 1)}
                style={styles.navButton}
              />
            </View>
          ) : (
            <View style={styles.finalButtons}>
              <Button
                title="Iniciar Sesión"
                variant="outline"
                onPress={() => navigation.navigate('Login')}
                style={styles.finalButton}
              />
              <Button
                title="Comenzar"
                onPress={handleGetStarted}
                style={styles.finalButton}
              />
            </View>
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  skipText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  slideContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 2,
    borderColor: colors.primary + '20',
  },
  slideIcon: {
    fontSize: 60,
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  slideTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  slideSubtitle: {
    fontSize: typography.sizes.lg,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
    fontWeight: typography.weights.medium,
  },
  slideDescription: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    flex: 0.45,
  },
  disabledButton: {
    opacity: 0.5,
  },
  finalButtons: {
    gap: spacing.md,
  },
  finalButton: {
    width: '100%',
  },
});

export default WelcomeScreen;