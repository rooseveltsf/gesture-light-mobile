import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { DefaultTheme } from 'react-native-paper';
import { Response } from '../../hooks/app';

export const Container = styled.View`
  flex: 1;
  background: ${DefaultTheme.colors.background};
`;

export const PublicationList = styled.View`
  flex: 1;
  padding: 0 20px;
`;

export const ListPublications = styled(
  FlatList as new () => FlatList<Response>
)``;
