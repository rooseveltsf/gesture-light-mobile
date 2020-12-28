import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import socketio from 'socket.io-client';
import {
  Headline,
  Dialog,
  Portal,
  List,
  TouchableRipple,
  Colors,
  Divider,
} from 'react-native-paper';

import { useAuth } from '../../hooks';
import { usePublication, Response } from '../../hooks/app';

import ItemProfile from '../../components/Item';

import { Container, PublicationList, ListPublications } from './styles';

import Header from './components/Header';
import api from '../../services/api';

interface Notification {
  _id: string;
  content: string;
  publication: number;
  read: boolean;
}

const Profile: React.FC = () => {
  const [postsUser, setPostsUser] = useState<Response[]>([]);
  const [notificationsList, setNotificationsList] = useState<Notification[]>(
    []
  );

  const [visibleNotification, setVisibleNotification] = useState(false);

  const { navigate } = useNavigation();

  const { user } = useAuth();
  const { posts } = usePublication();

  const socket = useMemo(
    () =>
      socketio('https://gesture-light.herokuapp.com', {
        query: {
          user_id: user?.id,
        },
      }),
    [user?.id]
  );

  useEffect(() => {
    socket.on('notification', (notification: Notification) => {
      setNotificationsList(oldNotifications => [
        notification,
        ...oldNotifications,
      ]);
    });
  }, [socket]);

  useEffect(() => {
    const items = posts.filter(item => item.user_id === user?.id);
    setPostsUser(items);
  }, [posts, user?.id]);

  useEffect(() => {
    async function loadNotifications(): Promise<void> {
      const notifications = await api.get('notifications');

      setNotificationsList(notifications.data);
    }

    loadNotifications();
  }, []);

  const handleUpdatePost = useCallback(
    async (read: boolean, id: number, idNotification: string) => {
      setVisibleNotification(false);
      if (read) {
        navigate('Detail', {
          id,
        });
        return;
      }

      await api.put(`/notifications/${idNotification}`);
      const notifications = await api.get('notifications');

      setNotificationsList(notifications.data);
      navigate('Detail', {
        id,
      });
    },
    [navigate]
  );

  return (
    <Container>
      <Header openNotifications={() => setVisibleNotification(true)} />

      <PublicationList>
        <Headline style={{ marginVertical: 20 }}>Lista de publicações</Headline>

        <Portal>
          <Dialog
            visible={visibleNotification}
            onDismiss={() => setVisibleNotification(false)}
          >
            <ScrollView>
              <List.Section>
                <List.Subheader>Lista de notificações</List.Subheader>
                {notificationsList.map(notification => {
                  const { _id, content, publication, read } = notification;
                  return (
                    <Animatable.View animation="bounceIn" key={_id}>
                      <Divider />
                      <TouchableRipple
                        onPress={() => {
                          handleUpdatePost(read, publication, _id);
                        }}
                      >
                        <List.Item
                          title="Aviso"
                          style={{
                            alignItems: 'center',
                            alignSelf: 'center',
                          }}
                          titleStyle={{
                            fontSize: 20,
                            color: '#666',
                            fontWeight: 'bold',
                          }}
                          descriptionNumberOfLines={2}
                          // style={{ backgroundColor: '#999' }}
                          description={content}
                          left={({ color, style }) => (
                            <Animatable.View
                              animation={read ? undefined : 'swing'}
                              iterationCount="infinite"
                            >
                              <List.Icon
                                color={read ? color : Colors.red300}
                                style={style}
                                icon={read ? 'bell-outline' : 'bell-alert'}
                              />
                            </Animatable.View>
                          )}
                        />
                      </TouchableRipple>
                    </Animatable.View>
                  );
                })}
              </List.Section>
            </ScrollView>
          </Dialog>
        </Portal>

        <ListPublications
          data={postsUser}
          keyExtractor={item => `${item.id}`}
          renderItem={({ item }) => <ItemProfile post={item} />}
          showsVerticalScrollIndicator={false}
        />
      </PublicationList>
    </Container>
  );
};

export default Profile;
