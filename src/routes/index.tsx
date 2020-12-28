import React from 'react';
import { AppLoading } from 'expo';

import { useAuth } from '../hooks';

import AuthRoutes from './auth.routes';
import MainRoutes from './main.routes';

const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AppLoading autoHideSplash />;
  }

  return user ? <MainRoutes /> : <AuthRoutes />;
};

export default Routes;
