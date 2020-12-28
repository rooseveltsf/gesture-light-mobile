import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';

import api from '../services/api';

export interface Post {
  title: string;
  description: string;
  status: string;
  address: string;
  latitude: number;
  longitude: number;
  file: FormData;
}

interface CountPublication {
  acessibleCount: number;
  neutroCount: number;
  notacessibleCount: number;
}

interface CurrentPosition {
  latitude: number;
  longitude: number;
}

interface MainContextData {
  posts: Response[];
  count: CountPublication;
  loading: boolean;
  currentPosition: CurrentPosition;
  // avatarUser: Avatar;

  createPost: (data: FormData) => Promise<void>;
  // addAvatar: (data: FormData) => Promise<void>;
  loadPublications: () => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  editPost: (id: number | undefined, item: {}) => Promise<void>;
}

type Status = 'accessible' | 'notAccessible' | 'neutro';
export interface Response {
  id: number;
  createdAt: string;
  title: string;
  description: string;
  status: Status;
  address_post: string;
  latitude: number;
  longitude: number;
  user_id: number;
  image: {
    path: string;
    url: string;
  };
  user: {
    address: string;
    email: string;
    name: string;
    avatar: {
      path: string;
      url: string;
    };
  };
}

const MainContext = createContext({} as MainContextData);

export const MainProvider: React.FC = ({ children }) => {
  const [posts, setPosts] = useState<Response[]>([]);
  const [count, setCount] = useState({} as CountPublication);
  const [currentPosition, setCurrentPosition] = useState({} as CurrentPosition);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getLocation(): Promise<void> {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'A permissão para acessar o local foi negada');
        return;
      }

      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        enableHighAccuracy: true,
      });

      setCurrentPosition({
        latitude,
        longitude,
      });
    }
    getLocation();
  }, []);

  const loadPublications = useCallback(async () => {
    const response = await api.get<Response[]>('/publish');

    const acessibleCount = response.headers['x-total-countacessible'];
    const notacessibleCount = response.headers['x-total-countnotacessible'];
    const neutroCount = response.headers['x-total-countneutro'];

    const listPost = response.data.map(post => {
      const date = new Date(post.createdAt);
      const formatedDate = `${`0${date.getDate()}`.substr(-2)}/${`0${
        date.getMonth() + 1
      }`.substr(-2)}/${date.getFullYear()}`;

      return {
        ...post,
        createdAt: formatedDate,
      };
    });

    setPosts(listPost);
    setCount({
      acessibleCount,
      neutroCount,
      notacessibleCount,
    });

    setLoading(false);
  }, []);

  const createPost = useCallback(
    async post => {
      await api.post('publish', post);

      loadPublications();
    },
    [loadPublications]
  );

  const editPost = useCallback(
    async (id: number | undefined, post: {}) => {
      await api.put(`/publish/${id}`, post);

      loadPublications();
    },
    [loadPublications]
  );

  const deletePost = useCallback(
    async id => {
      await api.delete(`/publish/${id}`);

      loadPublications();
    },
    [loadPublications]
  );

  return (
    <MainContext.Provider
      value={{
        posts,
        count,
        currentPosition,
        loading,
        createPost,
        deletePost,
        editPost,
        loadPublications,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export function usePublication(): MainContextData {
  const context = useContext(MainContext);

  return context;
}
