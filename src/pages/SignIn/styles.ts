import styled from 'styled-components/native';
import { DefaultTheme } from 'react-native-paper';
import Input from '../../components/Input';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
  background: ${DefaultTheme.colors.background};
`;

export const LogoContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

export const FormContainer = styled.View`
  align-self: stretch;
  margin-top: 50px;
`;

export const TextForm = styled(Input)``;
