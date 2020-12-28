import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';
import { SignInFormData } from '../pages/SignIn';

export interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  avatar?: {
    path: string;
    url: string;
  };
}

interface AuthState {
  user: User;
  token: string;
}

interface ErrorSignIn {
  [key: string]: string;
}

interface AuthContextData {
  loading: boolean;
  user: User | null;
  signIn(data: SignInFormData): Promise<void>;
  signOut(): Promise<void>;
  addAvatar(file: FormData): Promise<void>;
  error: ErrorSignIn | null;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);

  const [loading, setLoading] = useState(false);
  const [errorSignIn, setErrorSignIn] = useState<ErrorSignIn | null>(null);

  useEffect(() => {
    async function loadStorage(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@GestureLight:token',
        '@GestureLight:user',
      ]);

      if (token[1] && user[1]) {
        api.defaults.headers.authorization = `Bearer ${token[1]}`;

        setData({ token: token[1], user: JSON.parse(user[1]) });
        setLoading(false);
      }
    }

    loadStorage();
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInFormData) => {
    try {
      const response = await api.post<AuthState>('session', {
        email,
        password,
      });

      setErrorSignIn(null);

      const { user, token } = response.data;

      await AsyncStorage.multiSet([
        ['@GestureLight:token', token],
        ['@GestureLight:user', JSON.stringify(user)],
      ]);

      api.defaults.headers.authorization = `Bearer ${token}`;

      setData({ user, token });
    } catch (error) {
      setErrorSignIn(error);
    }
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove([
      '@GestureLight:token',
      '@GestureLight:user',
    ]);

    setData({} as AuthState);
  }, []);

  const addAvatar = useCallback(async file => {
    const user = await api.put('avatar', file);

    const { avatar } = user.data;

    setData(oldData => {
      return {
        ...oldData,
        user: {
          ...oldData.user,
          avatar,
        },
      };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        user: data.user,
        signIn,
        signOut,
        addAvatar,
        error: errorSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}
