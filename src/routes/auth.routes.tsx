import React, { useState, useEffect } from 'react';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import OnboardingScreen from '../pages/Onboarding';

const options: StackNavigationOptions = {
  cardStyle: { backgroundColor: '#fff' },
  cardOverlayEnabled: true,
  cardStyleInterpolator: ({ current: { progress } }) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1],
        extrapolate: 'clamp',
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
      }),
    },
  }),
};

export type RootStackParamList = {
  SignIn: { email: string } | undefined;
  SignUp: undefined;
  OnboardingScreen: undefined;
};

const Auth = createStackNavigator<RootStackParamList>();

const AuthRoute: React.FC = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<null | boolean>(null);

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      }
    });
  }, [isFirstLaunch]);

  return isFirstLaunch ? (
    <Auth.Navigator
      headerMode="none"
      initialRouteName="OnboardingScreen"
      screenOptions={options}
      mode="modal"
    >
      <Auth.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Auth.Screen name="SignIn" component={SignIn} />
      <Auth.Screen name="SignUp" component={SignUp} />
    </Auth.Navigator>
  ) : (
    <Auth.Navigator
      headerMode="none"
      initialRouteName="SignIn"
      screenOptions={options}
      mode="modal"
    >
      <Auth.Screen name="SignIn" component={SignIn} />
      <Auth.Screen name="SignUp" component={SignUp} />
    </Auth.Navigator>
  );
};
export default AuthRoute;
