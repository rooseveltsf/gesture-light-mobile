import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import {
  Appbar,
  Colors,
  Title,
  Avatar,
  Paragraph,
  Headline,
  Snackbar,
} from 'react-native-paper';

import { RootMainParamList } from '../../routes/main.routes';
import { usePublication, Response } from '../../hooks/app';

import { Container, UserContainer, Image, DataContainer, Data } from './styles';

import { useAuth } from '../../hooks';
import ModalEdit, { ModalRef } from './components/ModalEdit';
import MenuOptions from './components/MenuOptions';
import api from '../../services/api';

type DetailNavigationProp = BottomTabNavigationProp<
  RootMainParamList,
  'Detail'
>;
type DetailRouteProp = RouteProp<RootMainParamList, 'Detail'>;

const Details: React.FC = () => {
  const [post, setPost] = useState<Response | undefined>(undefined);
  const [color, setColor] = useState('');
  const [isUserActive, setIsUserActive] = useState<null | boolean>(null);

  const [visibleSnackbar, setVisibleSnackbar] = useState(false);

  const modalRef = useRef<ModalRef>(null);

  const { params } = useRoute<DetailRouteProp>();
  const { goBack } = useNavigation<DetailNavigationProp>();

  const { posts, deletePost } = usePublication();
  const { user } = useAuth();

  useEffect(() => {
    if (params) {
      const { id } = params;
      const idUserAuth = user?.id;
      let colorStatus = '';

      const item = posts.find(i => i.id === id);
      const userIdPublication = item?.user_id;

      const isUser = idUserAuth === userIdPublication;
      setIsUserActive(isUser);

      if (item?.status === 'accessible') {
        colorStatus = '#009944';
      } else if (item?.status === 'notAccessible') {
        colorStatus = '#c53030';
      } else if (item?.status === 'neutro') {
        colorStatus = '#ffcc00';
      }

      setPost(item);
      setColor(colorStatus);
    }
  }, [params, posts, user?.id]);

  const handleDelete = useCallback(
    async (id: number) => {
      Alert.alert(
        'Aviso de exclusão',
        'Você tem certeza que deseja excluir esse post ?',
        [
          {
            text: 'Excluir',
            onPress: async () => {
              await deletePost(id);
              goBack();
            },
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
    },
    [deletePost, goBack]
  );

  const handleUpdate = useCallback(async (pub_id: number) => {
    await api.post(`/notifications/${pub_id}`);

    setVisibleSnackbar(true);
  }, []);

  const handleClickUpdate = useCallback(() => {
    Alert.alert(
      'Aviso',
      'Você está prestes a solicitar alteração ao usuário que criou a publicação. Você tem realmente certeza?',
      [
        {
          text: 'Solicitar alteração',
          onPress: () => handleUpdate(post?.id || 0),
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
  }, [handleUpdate, post?.id]);

  return (
    <>
      <Appbar.Header
        statusBarHeight={0}
        style={{ height: 70, backgroundColor: color }}
      >
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title="Detalhes" subtitle="Praia de Acaú" />
        {isUserActive ? (
          <MenuOptions
            functionModal={() => modalRef.current?.handleOpenModal()}
            functionDelete={() => handleDelete(post?.id || 0)}
            isNeutro={post?.status === 'neutro'}
          />
        ) : (
          <Appbar.Action icon="update" onPress={handleClickUpdate} animated />
        )}
      </Appbar.Header>
      {isUserActive && <ModalEdit ref={modalRef} post={post} />}
      <Snackbar
        visible={visibleSnackbar}
        action={{
          label: 'Undo',
          onPress: () => {
            setVisibleSnackbar(false);
          },
        }}
        onDismiss={() => setVisibleSnackbar(false)}
        wrapperStyle={{ backgroundColor: '#333' }}
      >
        Solicitação de editação enviada!
      </Snackbar>

      <Container>
        <DataContainer>
          <UserContainer>
            {post?.user.avatar ? (
              <Avatar.Image
                style={{ marginRight: 10 }}
                size={30}
                source={{ uri: post?.user.avatar.url }}
              />
            ) : (
              <Avatar.Icon
                style={{ marginRight: 10, backgroundColor: Colors.teal300 }}
                size={30}
                icon="account"
                color={Colors.white}
              />
            )}
            <Title>{post?.user.name}</Title>
          </UserContainer>
          <Image source={{ uri: post?.image.url }} />

          <Data>
            <Headline>Título:</Headline>
            <Paragraph>{post?.title}</Paragraph>

            <Title>Descrição:</Title>
            <Paragraph>{post?.description}</Paragraph>
          </Data>
        </DataContainer>
      </Container>
    </>
  );
};

export default Details;
