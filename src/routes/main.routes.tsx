import React from 'react';
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';

import { MainProvider } from '../hooks/app';

import App from './app.routes';
import Details from '../pages/Details';

export type RootMainParamList = {
  App: undefined;
  Detail: { id: number } | undefined;
};

const Main = createStackNavigator<RootMainParamList>();

const MainRoutes: React.FC = () => (
  <MainProvider>
    <Main.Navigator headerMode="none">
      <Main.Screen name="App" component={App} />
      <Main.Screen name="Detail" component={Details} />
    </Main.Navigator>
  </MainProvider>
);

export default MainRoutes;
