import { Animated } from 'react-native';
import styled from 'styled-components/native';

export const InfoHeader = styled(Animated.View)`
  flex: 1;
  padding: 0 13px;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ContainerGraphics = styled.View`
  flex: 1;
  justify-content: center;
`;

export const PublicationContainer = styled.View`
  flex: 1;
`;

export const GroupInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
`;

export const BallNotification = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  margin-right: 5px;
`;
