import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useClients } from "../../hooks/useClients"; // Adjusted path
import { useNavigation } from "@react-navigation/native";

const AddClientScreen = () => {
  const navigation = useNavigation();
  const { addClient, loading, error, clearClientsError } = useClients();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // Example additional field

  // Clear error when component mounts or when inputs change after an error
  useEffect(() => {
    if(error) {
        // Alert.alert("Error", error); // Show alert on error
        console.log("AddClientScreen Error:", error);
    }
    // return () => clearClientsError(); // Optional: clear error on unmount
  }, [error]);

  const handleAddClient = async () => {
    if (!name || !email) {
      Alert.alert("Validation Error", "Name and email are required.");
      return;
    }
    console.log(`Attempting to add client: ${name}, ${email}, ${phone}`);
    try {
      // The createClient thunk in clientsSlice expects a single clientData object
      const resultAction = await addClient({ name, email, phone }); // addClient is an async thunk
      // Check if the thunk was fulfilled
      if (addClient.fulfilled.match(resultAction)) {
        Alert.alert("Success", "Client added successfully!");
        navigation.goBack(); // Go back to the previous screen (e.g., ClientsScreen)
      } else {
        // If the thunk was rejected, the error is already in the state.
        // The useEffect for 'error' will handle displaying it.
        // You could also access specific error message from resultAction.payload if needed for rejected cases
        console.log("Failed to add client. Error should be in state:", resultAction.payload || error);
      }
    } catch (e) {
      // This catch block might not be strictly necessary if thunks always update state.auth.error correctly
      console.error("Error dispatching addClient outside of thunk result:", e);
      Alert.alert("Error", "An unexpected error occurred while adding the client.");
    }
  };

  const handleInputChange = () => {
    if (error) {
      clearClientsError();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Client</Text>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text>Adding Client...</Text>
        </View>
      )}
      {error && !loading && (
         <View>
            <Text style={{ color: "red", textAlign:"center", marginBottom:10 }}>Error: {error}</Text>
            <Button title="Clear Error" onPress={clearClientsError} />
         </View>
      )}
      <TextInput
        style={styles.input}
        placeholder="Client Name"
        value={name}
        onChangeText={(text) => { setName(text); handleInputChange(); }}
        disabled={loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Client Email"
        value={email}
        onChangeText={(text) => { setEmail(text); handleInputChange(); }}
        keyboardType="email-address"
        autoCapitalize="none"
        disabled={loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Client Phone (Optional)"
        value={phone}
        onChangeText={(text) => { setPhone(text); handleInputChange(); }}
        keyboardType="phone-pad"
        disabled={loading}
      />
      <Button title="Save Client" onPress={handleAddClient} disabled={loading} />
      <Button title="Cancel" onPress={() => navigation.goBack()} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)", // Semi-transparent overlay
    zIndex: 1, // Ensure it is on top
  }
});

export default AddClientScreen;
