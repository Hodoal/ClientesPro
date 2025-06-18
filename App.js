import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/hooks/useAuth';

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </Provider>
  );
}