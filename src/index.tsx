import React from 'react';
import { StatusBar } from 'react-native';
import { AppLoading } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import {
  Ubuntu_400Regular,
  Ubuntu_700Bold,
  useFonts,
} from '@expo-google-fonts/ubuntu';

import theme from './styles/theme/default';

import AppProvider from './hooks';

import Routes from './routes';

const Main: React.FC = () => {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    Ubuntu_400Regular,
    Ubuntu_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <AppProvider>
        <PaperProvider theme={theme}>
          <StatusBar barStyle="light-content" />
          <Routes />
        </PaperProvider>
      </AppProvider>
    </NavigationContainer>
  );
};

export default Main;
