import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { DefaultTheme } from 'react-native-paper';

import Input from '../../components/Input';

export const Container = styled.View`
  flex: 1;
  background: ${DefaultTheme.colors.background};
`;

export const FormContainer = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    paddingVertical: 10,
  },
})`
  flex: 1;
  padding: 0 20px;
`;

export const ImagePost = styled.Image`
  width: ${Dimensions.get('window').width}px;
  height: ${Dimensions.get('window').width / 2.0}px;
`;

export const TextInput = styled(Input)``;

export const ButtonsContainer = styled.View`
  flex-direction: row;

  align-items: center;
  justify-content: space-between;
`;
