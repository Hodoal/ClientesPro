import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator, TextInput } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useClients } from "../../hooks/useClients";

const ClientDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { clientId } = route.params; // Get clientId passed via navigation params

  const { clients, getClients, updateClient, deleteClient, loading, error, clearClientsError } = useClients();

  const [client, setClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  // const [editPhone, setEditPhone] = useState(""); // Example if phone is also editable

  // Find the client from the Redux state or fetch if not available
  useEffect(() => {
    // Ensure clients are loaded. If getClients is memoized, this is efficient.
    if (clients.length === 0) {
      console.log("ClientDetailScreen: clients list empty, fetching clients...");
      getClients();
    }
  }, [clients.length, getClients]); // Depend on clients.length to re-evaluate if it changes

  useEffect(() => {
    const currentClient = clients.find(c => c.id === clientId);
    if (currentClient) {
      setClient(currentClient);
      setEditName(currentClient.name || "");
      setEditEmail(currentClient.email || "");
      // setEditPhone(currentClient.phone || ""); // If phone is editable
    } else if (clients.length > 0 && !loading && !client) {
      // Added !client to prevent alert if client was just deleted and component is about to unmount/go back
      console.warn(`ClientDetailScreen: Client with ID ${clientId} not found in the list after clients loaded.`);
      Alert.alert("Not Found", "Client details could not be found. They may have been removed or the ID is incorrect.");
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  }, [clientId, clients, loading, navigation, client]); // Added client to dependency list

  useEffect(() => {
    if (error) {
      console.error("ClientDetailScreen Error:", error);
      Alert.alert("Error", `An error occurred: ${error}`);
      // clearClientsError(); // Optionally clear, but might hide persistent load errors
    }
  }, [error]);

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete ${client?.name}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            console.log(`Attempting to delete client ID: ${clientId}`);
            const resultAction = await deleteClient(clientId);
            if (deleteClient.fulfilled.match(resultAction)) {
              Alert.alert("Success", "Client deleted successfully.");
              navigation.goBack();
            } else {
              // Error state from useClients hook will be updated by the thunk's rejection
              // The useEffect for 'error' can handle displaying it.
              // Or, access specific error from resultAction.payload:
              const errorMessage = resultAction.payload?.message || resultAction.error?.message || "Failed to delete client.";
              Alert.alert("Error", errorMessage);
              console.log("Failed to delete client:", resultAction);
            }
          },
        },
      ]
    );
  };

  const handleUpdate = async () => {
    if (!editName.trim() || !editEmail.trim()) { // Added trim() for validation
        Alert.alert("Validation Error", "Name and email cannot be empty.");
        return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmail.trim())) {
        Alert.alert('Validation Error', 'Please enter a valid email address.');
        return;
    }

    console.log(`Attempting to update client ID: ${clientId} with Name: ${editName}, Email: ${editEmail}`);
    // Include other fields like editPhone if they are part of the update
    const clientDataToUpdate = { name: editName.trim(), email: editEmail.trim() };
    // if (editPhone.trim()) clientDataToUpdate.phone = editPhone.trim();


    const resultAction = await updateClient({ id: clientId, data: clientDataToUpdate });
    if (updateClient.fulfilled.match(resultAction)) {
        Alert.alert("Success", "Client updated successfully.");
        setIsEditing(false);
        // Client state in Redux is updated by the thunk, local client state updates via useEffect listening to `clients`
    } else {
        const errorMessage = resultAction.payload?.message || resultAction.error?.message || "Failed to update client.";
        Alert.alert("Error", errorMessage);
        console.log("Failed to update client:", resultAction);
    }
  };

  const handleInputChange = () => {
    if (error) { // Clear general errors when user starts typing
      clearClientsError();
    }
  };

  if (loading && !client && clients.length === 0) { // More specific loading condition
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
        <Text>Loading Client Details...</Text>
      </View>
    );
  }

  if (!client && !loading) { // If client not found and not currently loading
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Client data is not available.</Text>
         <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  if (!client) { // Fallback for initial render before useEffects might run or if client becomes null
     return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
        <Text>Fetching client...</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      {isEditing ? (
        <>
          <Text style={styles.title}>Edit Client</Text>
          <TextInput
            style={styles.input}
            value={editName}
            onChangeText={(text) => { setEditName(text); handleInputChange();}}
            placeholder="Name"
            disabled={loading}
          />
          <TextInput
            style={styles.input}
            value={editEmail}
            onChangeText={(text) => { setEditEmail(text); handleInputChange();}}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            disabled={loading}
          />
          {/* Example for phone field if editable
          <TextInput
            style={styles.input}
            value={editPhone}
            onChangeText={(text) => { setEditPhone(text); handleInputChange();}}
            placeholder="Phone"
            keyboardType="phone-pad"
            disabled={loading}
          />
          */}
          <Button title="Save Changes" onPress={handleUpdate} disabled={loading} />
          <Button title="Cancel Edit" onPress={() => setIsEditing(false)} disabled={loading} />
        </>
      ) : (
        <>
          <Text style={styles.title}>Client Details</Text>
          <Text style={styles.detailText}>ID: {client.id}</Text>
          <Text style={styles.detailText}>Name: {client.name}</Text>
          <Text style={styles.detailText}>Email: {client.email}</Text>
          {client.phone && <Text style={styles.detailText}>Phone: {client.phone}</Text>}
          <View style={styles.buttonContainer}>
            <Button title="Edit" onPress={() => setIsEditing(true)} disabled={loading} />
            <Button title="Delete" onPress={handleDelete} color={styles.deleteButton.color} disabled={loading} />
          </View>
        </>
      )}
      {loading && <ActivityIndicator style={styles.inlineLoader}/>}
      {/* Error display can be more specific if needed, or rely on global error effect alert */}
      {error && !isEditing && <Text style={styles.errorText}>Error: {error}</Text>}
      {!isEditing && <Button title="Clear Error (Dev)" onPress={clearClientsError} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Assuming a white background
  },
  centered: {
    flex: 1, // Ensure centered takes full screen
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#333', // Darker color for title
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555', // Slightly lighter color for details
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  input: {
    height: 45, // Slightly taller input
    borderColor: "#ccc", // Lighter border color
    borderWidth: 1,
    marginBottom: 15, // More space below input
    paddingHorizontal: 10,
    borderRadius: 8, // More rounded corners
    backgroundColor: '#f9f9f9', // Slight off-white for input background
  },
  inlineLoader: {
    marginTop: 15,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  deleteButton: { // Specific style for delete button text color (though Button prop is 'color')
    color: 'red',
  }
});

export default ClientDetailScreen;
