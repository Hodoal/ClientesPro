import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native'; // Added Text for error display
import Container from '../../components/layout/Container';
// import Header from '../../components/layout/Header'; // Assuming header is part of StackNavigator
import ClientForm from '../../components/forms/ClientForm'; // Using the existing form
import { useClients } from '../../hooks/useClients';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography'; // For error message styling

const AddClientScreen = ({ navigation }) => {
  const { addClient, loading: clientsHookLoading, error: clientsHookError } = useClients();
  const [submissionError, setSubmissionError] = useState(null);

  const handleSubmit = async (clientData) => {
    setSubmissionError(null); // Clear previous errors
    try {
      const newClient = await addClient(clientData);
      if (newClient) {
        // navigation.goBack(); // Go back to ClientsScreen, which should re-fetch or update
        // A more robust way, if ClientsScreen doesn't automatically refresh on focus:
        navigation.navigate('ClientsList', { refresh: true }); // Assuming ClientsList is the route name for ClientsScreen
      }
    } catch (err) {
      console.error("Add Client Submission Error:", err);
      setSubmissionError(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  // Combine loading state from the hook (general client list loading)
  // with a specific loading state for the submission if ClientForm doesn't have its own.
  // For this example, ClientForm is assumed to take an `isLoading` prop.
  const isLoading = clientsHookLoading; // Or a more specific state if addClient had its own loading flag in useClients

  return (
    <Container>
      {/* <Header title="Add New Client" navigation={navigation} /> */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Assuming ClientForm takes onSubmit, isLoading, and potentially an initialValues or errorMessage prop */}
        <ClientForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          // initialValues={{}} // Pass empty or default initial values
        />
        {submissionError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{submissionError}</Text>
          </View>
        )}
        {/* Display general hook error if it's relevant and not a submission error */}
        {clientsHookError && !submissionError && (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{clientsHookError}</Text>
            </View>
        )}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContentContainer: {
    flexGrow: 1, // Important for ScrollView to allow content to take space
    padding: spacing.large,
    justifyContent: 'center', // Center form if content is less than screen height
  },
  errorContainer: {
    marginTop: spacing.medium,
    padding: spacing.medium,
    backgroundColor: colors.errorBackground,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.errorText,
    textAlign: 'center',
  },
  // Add other styles if ClientForm needs specific layout adjustments within this screen
});

export default AddClientScreen;
