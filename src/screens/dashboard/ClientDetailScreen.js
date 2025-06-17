import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import Container from '../../components/layout/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useClients } from '../../hooks/useClients';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

const ClientDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { clientId } = route.params;

  const {
    currentClient,
    clientLoading,
    clientError,
    fetchClientById,
    deleteClient
  } = useClients();

  const loadClientData = useCallback(() => {
    if (clientId) {
      fetchClientById(clientId);
    }
  }, [clientId, fetchClientById]);

  // Fetch client details when the screen comes into focus or clientId changes
  useFocusEffect(loadClientData);

  const handleEdit = () => {
    // Navigate to an EditClientScreen or AddClientScreen in edit mode
    // Pass currentClient data to pre-fill the form
    navigation.navigate('EditClient', { clientData: currentClient });
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete client "${currentClient?.firstName} ${currentClient?.lastName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteClient(clientId);
              Alert.alert('Success', 'Client deleted successfully.');
              navigation.goBack(); // Or navigate to ClientsList
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to delete client.');
            }
          }
        }
      ]
    );
  };

  if (clientLoading && !currentClient) { // Show full screen loader only on initial load
    return (
      <Container style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Container>
    );
  }

  if (clientError && !currentClient) { // Show error if client couldn't be fetched at all
    return (
      <Container style={styles.centeredContainer}>
        <Card style={styles.errorCard}><Text style={styles.errorText}>{clientError}</Text></Card>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </Container>
    );
  }

  if (!currentClient) { // Handles case where client is null after loading (e.g. not found, or error cleared it)
     return (
      <Container style={styles.centeredContainer}>
        <Text style={styles.infoText}>Client not found or no data available.</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </Container>
    );
  }

  return (
    <Container>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
            <RefreshControl
                refreshing={clientLoading && !!currentClient} // Show refresh indicator if loading while data is present
                onRefresh={loadClientData}
                colors={[colors.primary]}
                tintColor={colors.primary}
            />
        }
      >
        <Card style={styles.detailCard}>
          <Text style={styles.clientName}>{currentClient.firstName} {currentClient.lastName}</Text>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>{currentClient.email || 'N/A'}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Phone:</Text>
            <Text style={styles.detailValue}>{currentClient.phone || 'N/A'}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Address:</Text>
            <Text style={styles.detailValue}>{currentClient.address || 'N/A'}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Company:</Text>
            <Text style={styles.detailValue}>{currentClient.company || 'N/A'}</Text>
          </View>

          {/* Display other fields as needed, e.g., createdAt, updatedAt */}
           <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Added On:</Text>
            <Text style={styles.detailValue}>{currentClient.createdAt ? new Date(currentClient.createdAt).toLocaleDateString() : 'N/A'}</Text>
          </View>
        </Card>

        {clientError && <Card style={styles.errorCardInline}><Text style={styles.errorText}>{clientError}</Text></Card>}

        <View style={styles.actionsContainer}>
          <Button
            title="Edit Client"
            onPress={handleEdit}
            style={styles.actionButton}
            disabled={clientLoading}
          />
          <Button
            title="Delete Client"
            onPress={handleDelete}
            style={[styles.actionButton, styles.deleteButton]}
            disabled={clientLoading}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.large,
  },
  scrollContainer: {
    paddingVertical: spacing.large,
    paddingHorizontal: spacing.medium,
  },
  detailCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.large,
    marginBottom: spacing.large,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  clientName: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: spacing.large,
    textAlign: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 2,
    textAlign: 'right',
  },
  actionsContainer: {
    marginTop: spacing.medium,
    paddingHorizontal: spacing.small, // Align with card padding visually
  },
  actionButton: {
    backgroundColor: colors.primary,
    marginBottom: spacing.medium,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  errorCard: { // For full screen error
    backgroundColor: colors.errorBackground,
    padding: spacing.large,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  errorCardInline: { // For error below details but above buttons
    backgroundColor: colors.errorBackground,
    padding: spacing.medium,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: spacing.small,
    marginBottom: spacing.medium,
  },
  errorText: {
    ...typography.body,
    color: colors.errorText,
    textAlign: 'center',
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center'
  }
});

export default ClientDetailScreen;
