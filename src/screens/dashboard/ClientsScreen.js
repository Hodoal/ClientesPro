import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Container from '../../components/layout/Container';
import Header from '../../components/layout/Header'; // Assuming a generic header
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button'; // For an "Add Client" button if not using FAB
import { useClients } from '../../hooks/useClients';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

const ClientsScreen = ({ navigation }) => {
  const { clients, loading, error, fetchClients } = useClients();

  // Fetch clients when the screen comes into focus and on initial mount
  useFocusEffect(
    useCallback(() => {
      fetchClients();
    }, [fetchClients])
  );

  const onRefresh = useCallback(() => {
    fetchClients();
  }, [fetchClients]);

  const renderClientItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ClientDetail', { clientId: item.id })}>
      <Card style={styles.clientItemCard}>
        <Text style={styles.clientName}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.clientEmail}>{item.email}</Text>
        {item.company && <Text style={styles.clientCompany}>{item.company}</Text>}
      </Card>
    </TouchableOpacity>
  );

  const ListEmptyComponent = () => (
    <View style={styles.centeredMessageContainer}>
      {!loading && !error && <Text style={styles.infoText}>No clients found. Add one to get started!</Text>}
    </View>
  );

  return (
    <Container>
      {/* Using a Header component that might be part of the StackNavigator or a custom one */}
      {/* For this example, let's assume the header is managed by the navigator,
          otherwise, a <Header title="Clients" navigation={navigation} /> could be here. */}

      {loading && clients.length === 0 && <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />}

      {error && (
        <View style={styles.centeredMessageContainer}>
          <Card style={styles.errorCard}><Text style={styles.errorText}>{error}</Text></Card>
        </View>
      )}

      {!error && ( // Only render FlatList if no error
        <FlatList
          data={clients}
          renderItem={renderClientItem}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()} // Ensure key is string and unique
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={loading && clients.length > 0} // Show refresh indicator only when loading more data
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}

      {/* "Add Client" Button - could be a FAB or a simple button */}
      <View style={styles.addButtonContainer}>
        <Button
          title="Add New Client"
          onPress={() => navigation.navigate('AddClient')}
          style={styles.addButton}
          // icon="plus" // If your Button component supports icons
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1, // To center it in the container if it's the only thing shown
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.large,
  },
  errorCard: {
    backgroundColor: colors.errorBackground,
    padding: spacing.medium,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.errorText,
    textAlign: 'center',
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  listContainer: {
    flexGrow: 1, // Ensures ListEmptyComponent can center itself
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
  },
  clientItemCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.large, // Increased padding for better touch target and visual balance
    marginBottom: spacing.medium,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  clientName: {
    ...typography.h4,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.tiny,
  },
  clientEmail: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.tiny,
  },
  clientCompany: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 13,
  },
  addButtonContainer: {
    padding: spacing.large,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background, // Match screen background or theme
  },
  addButton: {
    backgroundColor: colors.primary,
  }
});

export default ClientsScreen;
