import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Colors } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

// import { setIcon } from '../utils/setIconTab';

import Home from '../pages/Home';
import CreatePublication from '../pages/CreatePublication';
import Profile from '../pages/Profile';

type RootTabScreenList = {
  Home: undefined;
  CreatePublication: undefined;
  Profile: undefined;
};

const App = createMaterialBottomTabNavigator<RootTabScreenList>();

const AppRoute: React.FC = () => {
  return (
    <App.Navigator shifting sceneAnimationEnabled>
      <App.Screen
        name="Home"
        component={Home}
        options={{
          tabBarColor: Colors.brown300,
          tabBarLabel: 'Tela inicial',
          // tabBarBadge: true,
          tabBarIcon: ({ color, focused }) => (
            <Icon name="home" color={color} size={focused ? 20 : 25} />
          ),
        }}
      />
      <App.Screen
        name="CreatePublication"
        component={CreatePublication}
        options={{
          tabBarColor: Colors.blue300,
          tabBarLabel: 'Nova publicação',
          tabBarIcon: ({ color, focused }) => (
            <Icon name="camera" color={color} size={focused ? 20 : 25} />
          ),
        }}
      />
      <App.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarColor: Colors.teal300,
          tabBarLabel: 'Meu perfil',
          // tabBarBadge: true,
          tabBarIcon: ({ color, focused }) => (
            <Icon name="account" color={color} size={focused ? 20 : 25} />
          ),
        }}
      />
    </App.Navigator>
  );
};

export default AppRoute;
