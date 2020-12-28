import React from 'react';
import { PieChart } from 'react-native-svg-charts';
import { Appbar, Colors, Paragraph } from 'react-native-paper';

import { usePublication } from '../../hooks/app';

import {
  InfoHeader,
  ContainerGraphics,
  PublicationContainer,
  GroupInfo,
  BallNotification,
} from './styles';

interface Props {
  isMapActive: boolean;
  setMap: (value: boolean) => void;
}

const Header: React.FC<Props> = ({ isMapActive, setMap }) => {
  const { count } = usePublication();
  const { acessibleCount, neutroCount, notacessibleCount } = count;

  const data = [
    {
      value: Number(notacessibleCount),
      svg: { fill: Colors.red400 },
      key: `keyNotAcessible-${notacessibleCount}`,
    },
    {
      value: Number(acessibleCount),
      svg: { fill: Colors.green400 },
      key: `keyAcessible-${acessibleCount}`,
    },
    {
      value: Number(neutroCount),
      svg: { fill: Colors.yellow400 },
      key: `keyNeutro-${neutroCount}`,
    },
  ];

  const ICON_BUTTON = isMapActive ? 'format-list-bulleted-square' : 'map';
  const pieData = data.filter(item => item.value > 0);

  return (
    <>
      <Appbar.Header statusBarHeight={0} style={{ backgroundColor: '#ddd' }}>
        <Appbar.Content title="Publicações" />
        <Appbar.Action
          color={Colors.brown300}
          icon={ICON_BUTTON}
          onPress={() => setMap(!isMapActive)}
        />
      </Appbar.Header>
      <Appbar style={{ backgroundColor: '#ddd', height: 160 }}>
        <InfoHeader>
          <ContainerGraphics>
            <PieChart
              style={{
                height: 130,
                width: 130,
              }}
              animate
              animationDuration={2000}
              data={pieData}
            />
          </ContainerGraphics>
          <PublicationContainer>
            <GroupInfo>
              <BallNotification style={{ backgroundColor: Colors.red300 }} />
              <Paragraph>Sem acessibilidade</Paragraph>
            </GroupInfo>
            <GroupInfo>
              <BallNotification style={{ backgroundColor: Colors.yellow300 }} />
              <Paragraph>Neutro</Paragraph>
            </GroupInfo>
            <GroupInfo>
              <BallNotification style={{ backgroundColor: Colors.green300 }} />
              <Paragraph>Acessível</Paragraph>
            </GroupInfo>
          </PublicationContainer>
        </InfoHeader>
      </Appbar>
    </>
  );
};

export default Header;
