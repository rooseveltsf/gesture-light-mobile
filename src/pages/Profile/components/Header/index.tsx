import React, { useCallback, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  Appbar,
  Title,
  Text,
  Avatar,
  Colors,
  TouchableRipple,
} from 'react-native-paper';

import getInfoImage from '../../../../utils/getInfoImage';
import { useAuth } from '../../../../hooks';

import { Container, GroupContainer, GroupInfo, ImageContainer } from './styles';

interface Props {
  openNotifications: () => void;
}

const Header: React.FC<Props> = ({ openNotifications }) => {
  const { signOut, user, addAvatar } = useAuth();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {
          status,
        } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Sorry, we need camera roll permissions to make this work!'
          );
        }
      }
    })();
  }, []);

  const addImage = useCallback(
    async (uri: string) => {
      const { name, type } = getInfoImage(uri);

      const file = new FormData();
      file.append('file', {
        name,
        type,
        uri,
      });

      await addAvatar(file);
    },
    [addAvatar]
  );

  const selectImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      Alert.alert(
        'Avatar',
        'Tem certeza que deseja adicionar este avatar para seu perfil?',
        [
          {
            text: 'Sim, tenho certeza',
            onPress: () => addImage(result.uri),
          },
          {
            text: 'Escolher novamente',
            onPress: () => selectImage(),
          },
          {
            text: 'Escolher depois',
            style: 'cancel',
          },
        ],
        {
          cancelable: false,
        }
      );
    }
  }, [addImage]);

  const editImage = useCallback(() => {
    Alert.alert(
      'Aviso',
      'Deseja editar avatar?',
      [
        {
          text: 'Sim',
          onPress: () => selectImage(),
        },
        {
          text: 'Não',
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  }, [selectImage]);

  const handleSignOut = useCallback(async () => {
    Alert.alert(
      'Aviso',
      'Você está prestes a sair da sua conta.',
      [
        {
          text: 'Quero sair',
          onPress: () => signOut(),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      {
        cancelable: false,
      }
    );
  }, [signOut]);

  return (
    <>
      <Appbar.Header statusBarHeight={0} style={{ backgroundColor: '#ddd' }}>
        <Appbar.Content title="Meu perfil" />
        <Appbar.Action
          color={Colors.teal300}
          icon="bell-outline"
          onPress={openNotifications}
        />
        <Appbar.Action
          color={Colors.teal300}
          icon="power"
          onPress={handleSignOut}
        />
      </Appbar.Header>
      <Appbar style={{ height: 160, backgroundColor: '#ddd' }}>
        <Container>
          <GroupContainer>
            <GroupInfo>
              <Title>Nome completo:</Title>
              <Text>{user?.name}</Text>
            </GroupInfo>

            <GroupInfo>
              <Title>Endereço:</Title>
              <Text>{user?.address}</Text>
            </GroupInfo>
          </GroupContainer>

          <ImageContainer>
            {user?.avatar ? (
              <TouchableRipple style={{ borderRadius: 65 }} onPress={editImage}>
                <Avatar.Image size={130} source={{ uri: user.avatar.url }} />
              </TouchableRipple>
            ) : (
              <TouchableRipple onPress={selectImage}>
                <Avatar.Icon
                  icon="account"
                  size={130}
                  style={{ backgroundColor: Colors.teal300 }}
                  color={Colors.white}
                />
              </TouchableRipple>
            )}
          </ImageContainer>
        </Container>
      </Appbar>
    </>
  );
};

export default Header;
