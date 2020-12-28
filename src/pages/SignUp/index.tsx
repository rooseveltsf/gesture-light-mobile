import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Image,
  Keyboard,
  Animated,
  TextInput,
  Alert,
  View,
} from 'react-native';
import { Colors, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container,
  Header,
  FormContainer,
  InputForm,
  ButtonContainer,
  ButtonSubmit,
} from './styles';
import logo from '../../assets/logo.png';
import { RootStackParamList } from '../../routes/auth.routes';

interface SignUpFormData {
  name: string;
  address: string;
  email: string;
  password: string;
}

type SignUpNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUp: React.FC = () => {
  const [marginBottom] = useState(new Animated.Value(30));
  const [loading, setLoading] = useState(false);

  const formRef = useRef<FormHandles>(null);

  const addressRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const { goBack } = useNavigation<SignUpNavigationProp>();

  const keyboardDidShow = useCallback(() => {
    Animated.spring(marginBottom, {
      toValue: 0,
      speed: 20,
      bounciness: 20,
      useNativeDriver: false,
    }).start();
  }, [marginBottom]);

  const keyboardDidHide = useCallback(() => {
    Animated.spring(marginBottom, {
      toValue: 30,
      speed: 20,
      bounciness: 20,
      useNativeDriver: false,
    }).start();
  }, [marginBottom]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', keyboardDidHide);
    };
  }, [keyboardDidShow, keyboardDidHide]);

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório'),
          address: Yup.string().required('Endereço é obrigatório'),
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, '6 dígitos no minimo.'),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post('users', data);

        setLoading(false);
        Alert.alert('Criação de conta', 'Conta criada com sucesso!');
        goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          setLoading(false);
          return;
        }

        Alert.alert(
          'Erro na criação de conta',
          'Ocorreu um error ao tentar criar uma conta, cheque as credenciais.'
        );
      }
    },
    [goBack]
  );

  return (
    <Container>
      <Header style={{ marginBottom }}>
        <IconButton
          icon="arrow-left"
          color="#3B93FB"
          size={28}
          onPress={() => goBack()}
        />

        <Image source={logo} />
      </Header>

      <View>
        <FormContainer>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <InputForm
              autoCapitalize="words"
              label="Nome completo"
              name="name"
              placeholder="Maria da Silva Santos"
              returnKeyType="next"
              onSubmitEditing={() => addressRef.current?.focus()}
            />

            <InputForm
              ref={addressRef}
              autoCapitalize="words"
              name="address"
              label="Endereço"
              placeholder="Praia de Acaú"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />

            <InputForm
              ref={emailRef}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              name="email"
              label="Endereço de E-mail"
              placeholder="maria@example.com"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <InputForm
              ref={passwordRef}
              name="password"
              label="Senha secreta"
              placeholder="M@ria24900"
              textContentType="newPassword"
              secureTextEntry
              returnKeyType="send"
              onSubmitEditing={() => formRef.current?.submitForm()}
            />
          </Form>
        </FormContainer>

        <ButtonContainer>
          <ButtonSubmit
            loading={loading}
            icon="account-plus"
            style={{ backgroundColor: Colors.blue300 }}
            color="#fff"
            onPress={() => formRef.current?.submitForm()}
          >
            Cadastrar
          </ButtonSubmit>
        </ButtonContainer>
      </View>
    </Container>
  );
};

export default SignUp;
