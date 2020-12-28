import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { DefaultTheme } from 'react-native-paper';

import { Response } from '../../hooks/app';

export const Container = styled.View`
  flex: 1;
`;

export const ListPost = styled(FlatList as new () => FlatList<Response>)`
  flex: 1;
  background: ${DefaultTheme.colors.background};
  padding: 20px 20px 0;
`;
