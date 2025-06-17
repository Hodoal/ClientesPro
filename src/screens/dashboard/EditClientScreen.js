import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Container from '../../components/layout/Container';
// import Header from '../../components/layout/Header'; // Assuming header is part of StackNavigator
import ClientForm from '../../components/forms/ClientForm';
import { useClients } from '../../hooks/useClients';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

const EditClientScreen = ({ navigation }) => {
  const route = useRoute();
  const { clientData } = route.params; // Client data passed from ClientDetailScreen

  const { updateClient, clientLoading, clientError: hookError } = useClients();
  const [submissionError, setSubmissionError] = useState(null);

  const handleSubmit = async (formData) => {
    setSubmissionError(null);
    try {
      const updatedClient = await updateClient(clientData.id, formData);
      if (updatedClient) {
        // Navigate back to ClientDetailScreen, which should then re-fetch or use updated currentClient
        navigation.goBack();
        // Optionally, if ClientDetailScreen doesn't auto-refresh on focus,
        // you might pass a param to trigger refresh, or rely on global state update if using Redux etc.
        // navigation.navigate('ClientDetail', { clientId: clientData.id, refresh: true });
      }
    } catch (err) {
      console.error("Edit Client Submission Error:", err);
      setSubmissionError(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  // The ClientForm will need an `initialValues` prop to be pre-filled.
  // And an `isLoading` prop for the submission state.
  // And an `errorMessage` prop to display submission errors.

  return (
    <Container>
      {/* <Header title="Edit Client" navigation={navigation} /> */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ClientForm
          onSubmit={handleSubmit}
          initialValues={clientData} // Pre-fill form with existing client data
          isLoading={clientLoading} // Use clientLoading from the hook for submission state
          // Pass a combined error message or prioritize submission error
          submitButtonText="Update Client" // Customize button text for edit mode
        />
        {submissionError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{submissionError}</Text>
          </View>
        )}
        {/* Display general hook error if it's relevant (e.g., from a failed previous operation) */}
        {hookError && !submissionError && (
             <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{hookError}</Text>
            </View>
        )}
        {/* A general loading indicator if the whole screen needs to be in a loading state,
            though clientLoading is passed to the form. */}
        {/* {clientLoading && <ActivityIndicator size="large" color={colors.primary} />} */}
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
    flexGrow: 1,
    padding: spacing.large,
    justifyContent: 'center',
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
});

export default EditClientScreen;
