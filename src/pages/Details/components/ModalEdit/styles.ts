import styled from 'styled-components/native';
import { DefaultTheme } from 'react-native-paper';

export const FormContainer = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    paddingVertical: 10,
  },
})`
  padding: 0 20px;
  background: ${DefaultTheme.colors.background};
  flex: 1;
`;

export const ContainerChip = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 30px 0 20px;
`;
