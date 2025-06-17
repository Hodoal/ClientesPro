import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import Container from '../../components/layout/Container';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    if (!isAdmin) {
      setStats(null); // Clear stats if not admin
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/stats/clients');
      if (response && response.data) {
        setStats(response.data);
      } else {
        setError('Failed to fetch statistics or data is not in expected format.');
        setStats(null);
      }
    } catch (err) {
      console.error("Fetch Stats Error:", err);
      setError(err.message || 'An error occurred while fetching statistics.');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch stats when the screen mounts or when user/isAdmin status changes.
    // This handles scenarios where `user` might be initially null and then populated.
    fetchStats();
  }, [user, isAdmin]); // Depend on user object to re-evaluate isAdmin and fetch

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchStats().then(() => setRefreshing(false));
  }, [isAdmin]); // isAdmin dependency for fetchStats inside onRefresh

  return (
    <Container>
      <Header title="Tableau de Bord" showBackButton={false} />
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary}/>}
      >
        <Text style={styles.welcomeText}>Bienvenue, {user?.username || 'Utilisateur'}!</Text>

        {isAdmin && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statistiques Administrateur</Text>
            {loading && !refreshing && <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />}
            {error && !loading && <Card style={styles.errorCard}><Text style={styles.errorText}>{error}</Text></Card>}
            {!loading && !error && stats && (
              <View style={styles.statsGrid}>
                <Card style={styles.statCard}>
                  <Text style={styles.statValue}>{stats.totalClients !== undefined ? stats.totalClients : 'N/A'}</Text>
                  <Text style={styles.statLabel}>Clients Totals</Text>
                </Card>
                <Card style={styles.statCard}>
                  <Text style={styles.statValue}>{stats.newClientsThisMonth !== undefined ? stats.newClientsThisMonth : 'N/A'}</Text>
                  <Text style={styles.statLabel}>Nouveaux Clients (Mois)</Text>
                </Card>
              </View>
            )}
             <Button
              title="Gérer les Utilisateurs"
              onPress={() => navigation.navigate('UserManagement')}
              style={styles.adminButton}
              // icon="users" // Assuming Button component supports an icon prop
            />
          </View>
        )}

        {!isAdmin && !loading && (
           <View style={styles.section}>
            <Card style={styles.infoCard}>
                <Text style={styles.standardUserText}>Bienvenue sur votre tableau de bord.</Text>
                {/* Add other non-admin specific quick actions or info here if needed */}
            </Card>
           </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions Rapides</Text>
          <Button
            title="Ajouter un Nouveau Client"
            onPress={() => navigation.navigate('AddClient')}
            style={styles.quickActionButton}
            // icon="plus-circle"
          />
          <Button
            title="Voir Tous les Clients"
            onPress={() => navigation.navigate('ClientsList')} // Ensure this route name is correct
            style={styles.quickActionButton}
            // icon="list"
          />
        </View>

      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  welcomeText: {
    ...typography.h2,
    color: colors.textPrimary,
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
    textAlign: 'center',
  },
  section: {
    marginTop: spacing.medium, // Reduced top margin for sections
    paddingHorizontal: spacing.large, // Consistent padding
    marginBottom: spacing.large, // Added bottom margin for separation
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textSecondary,
    marginBottom: spacing.medium,
    fontWeight: '600', // Make section titles a bit bolder
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Use space-between for better alignment if exactly two items
    marginBottom: spacing.medium,
  },
  statCard: {
    width: '48.5%', // Ensure they fit with a small gap
    alignItems: 'center',
    paddingVertical: spacing.large,
    backgroundColor: colors.surface,
    borderRadius: 8, // Add rounded corners to cards
    elevation: 2, // Subtle shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  statValue: {
    ...typography.h1,
    color: colors.primary,
    fontSize: 28, // Slightly larger stat value
  },
  statLabel: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.small,
    fontSize: 14, // Slightly smaller label
  },
  adminButton: {
    backgroundColor: colors.secondary,
    marginTop: spacing.medium, // Add some margin above the admin button
  },
  quickActionButton: {
    backgroundColor: colors.primary,
    marginBottom: spacing.medium,
  },
  loader: {
    marginVertical: spacing.xlarge, // Larger margin for loader
  },
  errorCard: {
    backgroundColor: colors.errorBackground,
    padding: spacing.medium,
    borderRadius: 8,
    marginBottom: spacing.medium,
    alignItems: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.errorText,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: colors.surface,
    padding: spacing.large,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 1,
  },
  standardUserText: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.body, // Improved line height
  }
});

export default DashboardScreen;
