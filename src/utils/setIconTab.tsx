import React from 'react';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

interface DataTab {
  focused: boolean;
  size: number;
  color: string;
}

export function setIcon(data: DataTab, name: string): JSX.Element {
  const { focused, size, color } = data;

  const iconName = focused ? name : `${name}-outline`;

  const iconSize = focused ? size + 5 : size;

  return <Icon name={iconName} color={color} size={iconSize} />;
}
