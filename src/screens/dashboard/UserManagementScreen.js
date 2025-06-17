import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import Container from '../../components/layout/Container';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button'; // Assuming Button can be used in modal
import Modal from '../../components/ui/Modal'; // Import Modal
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';
// For Picker - if not available, will use simple buttons for role selection
// import { Picker } from '@react-native-picker/picker';

const UserManagementScreen = ({ navigation }) => {
  const { user: loggedInUser } = useAuth();
  const isAdmin = loggedInUser?.role === 'admin';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false); // For edit/delete actions
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [modalError, setModalError] = useState('');

  const fetchUsers = async (showLoadingIndicator = true) => {
    if (!isAdmin) {
      setError('You are not authorized to view this page.');
      setUsers([]);
      return;
    }
    if (showLoadingIndicator) setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/users');
      if (response && response.data && response.data.users) {
        setUsers(response.data.users);
      } else {
        setError('Failed to fetch users or data is not in expected format.');
        setUsers([]);
      }
    } catch (err) {
      console.error("Fetch Users Error:", err);
      setError(err.message || 'An error occurred while fetching users.');
      setUsers([]);
    } finally {
      if (showLoadingIndicator) setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isAdmin, loggedInUser]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers(false).then(() => setRefreshing(false)); // Pass false to avoid main loader
  }, [isAdmin]);

  const openEditModal = (userToEdit) => {
    setSelectedUser(userToEdit);
    setNewRole(userToEdit.role); // Pre-fill with current role
    setModalError('');
    setIsModalVisible(true);
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;

    // Frontend check: Prevent sole admin from changing their own role
    if (loggedInUser.id === selectedUser.id && selectedUser.role === 'admin' && newRole !== 'admin') {
        const adminCount = users.filter(u => u.role === 'admin').length;
        if (adminCount <= 1) {
            setModalError('Cannot remove admin role from the sole administrator.');
            return;
        }
    }

    setActionLoading(true);
    setModalError('');
    try {
      await api.put(`/admin/users/${selectedUser.id}`, { role: newRole });
      setIsModalVisible(false);
      setSelectedUser(null);
      await fetchUsers(false); // Re-fetch users to show changes
      Alert.alert('Success', 'User role updated successfully.');
    } catch (err) {
      console.error("Update Role Error:", err);
      setModalError(err.message || 'Failed to update role.');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDeleteUser = (userToDelete) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete user "${userToDelete.username}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => handleDeleteUser(userToDelete.id) }
      ]
    );
  };

  const handleDeleteUser = async (userIdToDelete) => {
    setActionLoading(true); // Use a general action loader or specific delete loader
    try {
      await api.delete(`/admin/users/${userIdToDelete}`);
      await fetchUsers(false); // Re-fetch users
      Alert.alert('Success', 'User deleted successfully.');
    } catch (err) {
      console.error("Delete User Error:", err);
      Alert.alert('Error', err.message || 'Failed to delete user.');
    } finally {
      setActionLoading(false);
    }
  };

  const renderUserItem = ({ item }) => {
    const isCurrentUser = item.id === loggedInUser.id;
    return (
      <Card style={styles.userItemCard}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.username}{isCurrentUser ? " (You)" : ""}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        <View style={styles.userRoleContainer}>
          <Text style={[styles.roleText, item.role === 'admin' ? styles.adminRoleText : styles.userRoleText]}>
            {item.role.toUpperCase()}
          </Text>
        </View>
        {!isCurrentUser && ( // Don't show buttons for the logged-in admin themselves
          <View style={styles.actionsContainer}>
            <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Edit Role</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDeleteUser(item)} style={[styles.actionButton, styles.deleteButton]}>
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>
    );
  };

  if (!isAdmin && !loading) {
    return (
      <Container>
        <Header title="Gestion des Utilisateurs" navigation={navigation} />
        <View style={styles.centeredMessageContainer}>
          <Text style={styles.errorText}>{error || 'You are not authorized to view this page.'}</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Header title="Gestion des Utilisateurs" navigation={navigation} />
      {loading && !refreshing && <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />}
      {error && !loading && (
        <View style={styles.centeredMessageContainer}>
           <Card style={styles.errorCard}><Text style={styles.errorText}>{error}</Text></Card>
        </View>
      )}
      {!loading && !error && users.length === 0 && (
         <View style={styles.centeredMessageContainer}>
          <Text style={styles.infoText}>Aucun utilisateur trouvé.</Text>
        </View>
      )}
      {!loading && !error && users.length > 0 && (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary}/>}
        />
      )}

      {selectedUser && (
        <Modal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Role for {selectedUser.username}</Text>
            <Text style={styles.currentRoleText}>Current Role: {selectedUser.role.toUpperCase()}</Text>

            {/* Simple Role Selector using Buttons */}
            <View style={styles.roleSelector}>
                <Button
                    title="User"
                    onPress={() => setNewRole('user')}
                    style={[styles.roleButton, newRole === 'user' && styles.selectedRoleButton]}
                    textStyle={newRole === 'user' ? styles.selectedRoleButtonText : styles.roleButtonText}
                />
                <Button
                    title="Admin"
                    onPress={() => setNewRole('admin')}
                    style={[styles.roleButton, newRole === 'admin' && styles.selectedRoleButton]}
                    textStyle={newRole === 'admin' ? styles.selectedRoleButtonText : styles.roleButtonText}
                />
            </View>

            {/* Alternative: Picker for role selection - install @react-native-picker/picker if used
            <Picker
              selectedValue={newRole}
              onValueChange={(itemValue) => setNewRole(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="User" value="user" />
              <Picker.Item label="Admin" value="admin" />
            </Picker>
            */}

            {modalError && <Text style={styles.modalErrorText}>{modalError}</Text>}

            <Button
              title="Update Role"
              onPress={handleRoleChange}
              loading={actionLoading}
              style={styles.updateButton}
            />
            <Button
              title="Cancel"
              onPress={() => setIsModalVisible(false)}
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
            />
          </View>
        </Modal>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  loader: { marginTop: spacing.xlarge },
  centeredMessageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.large },
  errorCard: { backgroundColor: colors.errorBackground, padding: spacing.medium, borderRadius: 8, width: '90%', alignItems: 'center' },
  errorText: { ...typography.body, color: colors.errorText, textAlign: 'center' },
  infoText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  listContainer: { paddingVertical: spacing.medium, paddingHorizontal: spacing.large },
  userItemCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  userInfo: { marginBottom: spacing.small },
  userName: { ...typography.h4, color: colors.textPrimary, fontWeight: '600' },
  userEmail: { ...typography.body, color: colors.textSecondary, fontSize: 14 },
  userRoleContainer: { alignSelf: 'flex-start', marginVertical: spacing.small },
  roleText: { ...typography.caption, fontWeight: 'bold', paddingVertical: spacing.tiny, paddingHorizontal: spacing.small, borderRadius: 4, overflow: 'hidden' },
  userRoleText: { backgroundColor: colors.info, color: colors.white },
  adminRoleText: { backgroundColor: colors.accent, color: colors.white },
  actionsContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: spacing.medium, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.medium },
  actionButton: { paddingVertical: spacing.small, paddingHorizontal: spacing.medium, borderRadius: 4, marginHorizontal: spacing.small, backgroundColor: colors.primary },
  actionButtonText: { ...typography.button, color: colors.white, textAlign: 'center' },
  deleteButton: { backgroundColor: colors.danger },
  deleteButtonText: { color: colors.white },

  // Modal Styles
  modalContent: { backgroundColor: colors.surface, padding: spacing.large, borderRadius: 8, width: '90%', alignSelf: 'center' },
  modalTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.medium, textAlign: 'center' },
  currentRoleText: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.medium, textAlign: 'center' },
  roleSelector: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.large },
  roleButton: { flex: 1, marginHorizontal: spacing.small, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.primary },
  roleButtonText: { color: colors.primary },
  selectedRoleButton: { backgroundColor: colors.primary },
  selectedRoleButtonText: { color: colors.white },
  // picker: { width: '100%', marginBottom: spacing.medium }, // For Picker
  modalErrorText: { ...typography.body, color: colors.errorText, textAlign: 'center', marginBottom: spacing.medium },
  updateButton: { backgroundColor: colors.primary, marginBottom: spacing.small },
  cancelButton: { backgroundColor: colors.greyLight, borderWidth: 0}, // Assuming greyLight is a lighter shade
  cancelButtonText: { color: colors.textPrimary },
});

export default UserManagementScreen;
