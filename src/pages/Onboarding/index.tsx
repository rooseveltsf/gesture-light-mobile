import React from 'react';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Onboarding from 'react-native-onboarding-swiper';
import { Colors } from 'react-native-paper';

import onboardingImage01 from '../../assets/Onboarding/onboarding01.png';
import onboardingImage02 from '../../assets/Onboarding/onboarding02.png';
import onboardingImage03 from '../../assets/Onboarding/onboarding03.png';
import onboardingImage04 from '../../assets/Onboarding/onboarding04.png';

const OnboardingScreen: React.FC = () => {
  const { navigate } = useNavigation();
  return (
    <Onboarding
      onSkip={() => navigate('SignIn')}
      onDone={() => navigate('SignIn')}
      pages={[
        {
          backgroundColor: Colors.brown300,
          image: <Image source={onboardingImage01} />,
          title: 'Para começar',
          subtitle:
            'Observe lugares que podem causar dificuldades na mobilidade dos cadeirantes.',
        },
        {
          backgroundColor: Colors.blue300,
          image: <Image source={onboardingImage02} />,
          title: 'Auxiliar...',
          subtitle: 'Tire foto dos locais que não possuem acessibilidade.',
        },
        {
          backgroundColor: Colors.teal300,
          image: <Image source={onboardingImage03} />,
          title: 'Ser ajudado..',
          subtitle:
            'Procure os locais em que desejar ir no mapa, para visualizar se possui acessibilade.',
        },
        {
          backgroundColor: '#999',
          image: <Image source={onboardingImage04} />,
          title: 'Ajudar e ser ajudado...',
          subtitle: 'Possibilite uma vida melhor pra seu próximo.',
        },
      ]}
    />
  );
};

export default OnboardingScreen;
