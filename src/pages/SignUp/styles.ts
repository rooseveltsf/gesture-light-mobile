import styled from 'styled-components/native';
import { Animated } from 'react-native';
import { DefaultTheme } from 'react-native-paper';

import Input from '../../components/Input';
import Button from '../../components/Button';

export const Container = styled.SafeAreaView`
  flex: 1;
  padding: 0 30px;
  justify-content: center;
  background: ${DefaultTheme.colors.background};
`;

export const Header = styled(Animated.View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 24px 0;
  align-items: center;
  margin-bottom: 92px;
`;

export const FormContainer = styled.View`
  margin-bottom: 24px;
`;

export const InputForm = styled(Input)``;

export const ButtonContainer = styled.View`
  width: 100%;
  align-items: center;
`;

export const ButtonSubmit = styled(Button)``;
