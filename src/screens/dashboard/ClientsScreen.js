import React, { useEffect } from "react";
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useClients } from "../../hooks/useClients"; // Adjusted path
import { useNavigation } from "@react-navigation/native"; // To navigate to AddClientScreen

const ClientsScreen = () => {
  const navigation = useNavigation(); // Hook for navigation
  const { clients, loading, error, getClients, clearClientsError } = useClients();

  useEffect(() => {
    console.log("ClientsScreen: Fetching clients...");
    getClients(); // Fetch clients when the component mounts
  }, [getClients]); // getClients is memoized in the hook, so this effect runs once on mount

  useEffect(() => {
    if (error) {
      console.error("ClientsScreen Error:", error);
      Alert.alert("Error", `Failed to fetch clients: ${error}`);
      // clearClientsError(); // Optionally clear error after showing
    }
  }, [error]);

  const renderClient = ({ item }) => (
    <View style={styles.clientItem}>
      <Text style={styles.clientName}>{item.name || `Client ID: ${item.id}`}</Text>
      {/* Add more client details here as needed */}
      {/* Example: <Text>{item.email}</Text> */}
      <Button title="Details" onPress={() => navigation.navigate("ClientDetail", { clientId: item.id })} />
    </View>
  );

  if (loading && clients.length === 0) { // Show full screen loader only if no clients are loaded yet
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
        <Text>Loading Clients...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Clients</Text>
        <Button
            title="Add Client"
            onPress={() => navigation.navigate("AddClient")} // Navigate to AddClientScreen
        />
      </View>
      {loading && <ActivityIndicator style={styles.inlineLoader} />}
      {error && !loading && (
        <View style={styles.centered}>
          <Text style={{ color: "red", marginBottom:10 }}>Error fetching clients: {error}</Text>
          <Button title="Retry" onPress={getClients} />
          <Button title="Clear Error (Dev)" onPress={clearClientsError} />
        </View>
      )}
      {!loading && !error && clients.length === 0 && (
        <View style={styles.centered}>
          <Text>No clients found.</Text>
        </View>
      )}
      <FlatList
        data={clients}
        renderItem={renderClient}
        keyExtractor={(item) => item.id.toString()} // Ensure id is a string
        contentContainerStyle={clients.length === 0 && styles.emptyList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal:10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  clientItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clientName: {
    fontSize: 18,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inlineLoader: {
    marginVertical: 10,
  }
});

export default ClientsScreen;
