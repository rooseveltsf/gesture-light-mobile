import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Alert, Platform, Dimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import {
  Appbar,
  Colors,
  Button as ResetFields,
  TouchableRipple,
  Chip,
} from 'react-native-paper';

import { usePublication } from '../../hooks/app';
import getInfoImage from '../../utils/getInfoImage';

import Button from '../../components/Button';
import {
  Container,
  FormContainer,
  ImagePost,
  TextInput,
  ButtonsContainer,
} from './styles';

interface FormPublication {
  title: string;
  description: string;
}

const CreatePublication: React.FC = () => {
  const [image, setImage] = useState('');

  const [accessible, setAccessible] = useState(false);
  const [neutro, setNeutro] = useState(false);
  const [notAccessible, setNotAccessible] = useState(false);

  const [statusLocal, setStatusLocal] = useState('');

  const [loading, setLoading] = useState(false);

  const formRef = useRef<FormHandles>(null);

  const { navigate } = useNavigation();
  const { createPost, currentPosition } = usePublication();

  useEffect(() => {
    async function getPermission(): Promise<void> {
      if (Platform.OS !== 'web') {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          Alert.alert(
            'Error',
            'Sorry, we need camera roll permissions to make this work!'
          );
        }
      }
    }

    getPermission();

    return () => {
      setNotAccessible(false);
      setNeutro(false);
      setAccessible(false);
    };
  }, []);

  const showImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 1,
        exif: true,
      });

      if (result.cancelled) {
        return;
      }
      if (!result.uri) {
        return;
      }
      if (!result.cancelled) {
        setImage(result.uri);
      }
    } catch (E) {
      Alert.alert(
        'Erro',
        'Erro ao adicionar foto, tente novamente em alguns minutos.'
      );
    }
  }, []);

  const resetFields = useCallback(() => {
    setStatusLocal('');
    setImage('');
    setNotAccessible(false);
    setNeutro(false);
    setAccessible(false);
    formRef.current?.clearField('title');
    formRef.current?.clearField('description');
  }, []);

  const handleSubmit = useCallback(
    async ({ title, description }: FormPublication) => {
      if (image === '') {
        Alert.alert(
          'Aviso',
          'Selecione uma imagem antes de realizar a publicação.'
        );
        return;
      }

      if (statusLocal === '') {
        Alert.alert(
          'Aviso',
          'Selecione um status antes de realizar a publicação.'
        );
        return;
      }

      if (title === '') {
        Alert.alert(
          'Aviso',
          'Adicione um título antes de realizar a publicação.'
        );
        return;
      }
      setLoading(true);
      const { name, type } = getInfoImage(image);

      const [addressPost] = await Location.reverseGeocodeAsync({
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
      });

      const { country, street, region } = addressPost;

      const address = `${street}, ${region}, ${country}`;

      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('status', statusLocal);
      form.append('address', address);
      form.append('latitude', currentPosition.latitude.toString());
      form.append('longitude', currentPosition.longitude.toString());
      form.append('file', {
        name,
        uri: image,
        type,
      });

      await createPost(form);

      formRef.current?.clearField('title');
      formRef.current?.clearField('description');
      setLoading(false);
      resetFields();
      navigate('Home');
    },
    [
      statusLocal,
      image,
      createPost,
      navigate,
      resetFields,
      currentPosition.latitude,
      currentPosition.longitude,
    ]
  );

  const getStatus = useCallback((statusField: string) => {
    setNotAccessible(false);
    setNeutro(false);
    setAccessible(false);

    if (statusField === 'accessible') {
      setAccessible(true);
    }
    if (statusField === 'neutro') {
      setNeutro(true);
    }
    if (statusField === 'notAccessible') {
      setNotAccessible(true);
    }
    setStatusLocal(statusField);
  }, []);

  return (
    <Container>
      <Appbar.Header statusBarHeight={0} style={{ backgroundColor: '#ddd' }}>
        <Appbar.Content title="Nova publicação" />
      </Appbar.Header>

      <FormContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <TouchableRipple
            disabled={!!image}
            rippleColor="rgba(59, 147, 251, 0.32)"
            style={{
              width: '100%',
              height: Dimensions.get('window').width / 2.0,
              backgroundColor: '#ddd',
              borderRadius: 4,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 20,
            }}
            onPress={showImage}
          >
            {image ? (
              <ImagePost
                source={{ uri: image }}
                style={{ resizeMode: 'contain' }}
              />
            ) : (
              <Icon name="camera" size={24} color={Colors.blue300} />
            )}
          </TouchableRipple>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 15,
            }}
          >
            <Chip
              selected={accessible}
              mode="outlined"
              icon="check"
              onPress={() => getStatus('accessible')}
              selectedColor={Colors.green300}
            >
              Acessível
            </Chip>
            <Chip
              selected={neutro}
              mode="outlined"
              icon="information"
              onPress={() => getStatus('neutro')}
              selectedColor={Colors.yellow800}
            >
              Neutro
            </Chip>
            <Chip
              selected={notAccessible}
              mode="outlined"
              icon="information"
              onPress={() => getStatus('notAccessible')}
              selectedColor={Colors.red300}
            >
              Sem acessibilidade
            </Chip>
          </View>

          <TextInput
            name="title"
            label="Título"
            placeholder="Informe o título"
          />

          <TextInput
            label="Descrição"
            name="description"
            textAlignVertical="top"
            placeholder="Informe uma descrição"
            multiline
            numberOfLines={8}
          />
        </Form>
        <ButtonsContainer>
          <Button
            loading={loading}
            style={{ backgroundColor: Colors.blue300 }}
            icon="send"
            color="#fff"
            onPress={() => formRef.current?.submitForm()}
          >
            Publicar
          </Button>

          <ResetFields
            color={Colors.red300}
            icon="delete"
            mode="outlined"
            onPress={resetFields}
          >
            Apagar dados
          </ResetFields>
        </ButtonsContainer>
      </FormContainer>
    </Container>
  );
};

export default CreatePublication;
