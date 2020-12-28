import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Image, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Yup from 'yup';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { useAuth } from '../../hooks';

import getValidationErrors from '../../utils/getValidationErrors';

import Button from '../../components/Button';

import { Container, LogoContainer, FormContainer, TextForm } from './styles';

import logo from '../../assets/logo.png';
import { RootStackParamList } from '../../routes/auth.routes';

export interface SignInFormData {
  email: string;
  password: string;
}

type SignInNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const [loading, setLoading] = useState(false);

  const { signIn, error } = useAuth();

  const navigation = useNavigation<SignInNavigationProp>();

  useEffect(() => {
    formRef.current?.setErrors({});

    if (error) {
      const errorsFields = Object.keys(error);
      formRef.current?.setErrors(error);

      errorsFields.map(field => formRef.current?.clearField(field));
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    return () => {
      formRef.current?.setErrors({});
    };
  }, []);

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string()
            .required('Senha é obrigatória')
            .min(6, 'A senha deve possuir no mínimo 6 caracteres.'),
        });

        await schema.validate(data, { abortEarly: false });

        await signIn(data);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          const errorsFields = Object.keys(errors);
          errorsFields.map(field => formRef.current?.clearField(field));
          setLoading(false);
          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert(
          'Erro na autenticação',
          'Ocorreu um error ao fazer login, cheque as credenciais.'
        );
      }
    },
    [signIn]
  );

  return (
    <Container>
      <LogoContainer>
        <Image width={173} source={logo} />
      </LogoContainer>

      <FormContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <TextForm
            label="E-mail"
            name="email"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Informe seu e-mail de cadastro"
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
          />
          <TextForm
            label="Senha secreta"
            ref={passwordInputRef}
            name="password"
            secureTextEntry
            placeholder="Informe sua senha"
            returnKeyType="send"
            onSubmitEditing={() => formRef.current?.submitForm()}
          />
        </Form>
      </FormContainer>

      <Button
        color="#fff"
        style={{ backgroundColor: '#3b93fb', marginBottom: 12, marginTop: 12 }}
        icon="send"
        loading={loading}
        onPress={() => formRef.current?.submitForm()}
      >
        Entrar
      </Button>

      <Button
        mode="outlined"
        icon="account-arrow-right"
        onPress={() => navigation.navigate('SignUp')}
      >
        Criar nova conta
      </Button>
    </Container>
  );
};

export default SignIn;
