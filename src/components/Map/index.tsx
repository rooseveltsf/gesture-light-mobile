import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import MapView, { Marker, Region } from 'react-native-maps';
import { AppLoading } from 'expo';
import { Response, usePublication } from '../../hooks/app';

interface Props {
  posts: Response[];
}

const Map: React.FC<Props> = ({ posts }) => {
  const [region, setRegion] = useState<Region | null>(null);
  const [location, setIsLocation] = useState(true);
  const { currentPosition } = usePublication();

  const { navigate } = useNavigation();

  useEffect(() => {
    setRegion({
      latitude: currentPosition?.latitude,
      longitude: currentPosition?.longitude,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    });
    setIsLocation(false);
  }, [currentPosition?.latitude, currentPosition?.longitude]);

  if (location) {
    return <AppLoading />;
  }

  return (
    <MapView region={region || undefined} style={{ flex: 1 }}>
      {posts.map(post => {
        let color = '';
        let status = '';
        if (post.status === 'accessible') {
          color = '#009944';
          status = 'Acessível';
        }
        if (post.status === 'neutro') {
          color = '#ffcc00';
          status = 'Neutro';
        }
        if (post.status === 'notAccessible') {
          color = '#c53030';
          status = 'Inacessível';
        }
        return (
          <Marker
            key={post.id}
            onPress={() => {
              navigate('Detail', {
                id: post.id,
              });
            }}
            style={{
              width: 90,
              height: 80,
            }}
            coordinate={{
              latitude: Number(post.latitude),
              longitude: Number(post.longitude),
            }}
          >
            <View
              style={{
                width: 90,
                height: 70,
                backgroundColor: color,
                flexDirection: 'column',
                borderRadius: 8,
                overflow: 'hidden',
                alignItems: 'center',
              }}
            >
              <Image
                style={{
                  width: 90,
                  height: 45,
                  resizeMode: 'cover',
                }}
                source={{ uri: post.image.url }}
              />
              <Text
                style={{
                  flex: 1,
                  color: '#FFF',
                  fontSize: 12,
                  lineHeight: 23,
                }}
              >
                {status}
              </Text>
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
};

export default Map;
