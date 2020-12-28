import React from 'react';
import { useAuth, AuthProvider } from './auth';

export { useAuth };

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

export default AppProvider;
