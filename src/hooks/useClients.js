import { useSelector, useDispatch } from "react-redux";
import {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
  setSearchTerm,
  clearError, // Assuming clearError is an action in clientsSlice
} from "../store/slices/clientsSlice"; // Assuming clientsSlice.js exports these actions

const useClients = () => {
  const dispatch = useDispatch();

  const { clients, loading, error, searchTerm } = useSelector(
    (state) => state.clients
  );

  // Action dispatchers
  const getClients = () => {
    return dispatch(fetchClients()); // fetchClients is an async thunk
  };

  const addClient = (clientData) => {
    return dispatch(createClient(clientData)); // createClient is an async thunk
  };

  const editClient = (id, data) => {
    return dispatch(updateClient({ id, data })); // updateClient is an async thunk
  };

  const removeClient = (id) => {
    return dispatch(deleteClient(id)); // deleteClient is an async thunk
  };

  const searchClients = (term) => {
    dispatch(setSearchTerm(term));
  };

  const clearClientsError = () => {
    dispatch(clearError()); // Assuming clearError action exists in clientsSlice
  };

  return {
    clients,
    loading,
    error,
    searchTerm,
    getClients,
    addClient,
    editClient,
    removeClient,
    searchClients,
    clearClientsError,
  };
};

export default useClients;
