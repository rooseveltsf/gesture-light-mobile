import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Colors,
  Dialog,
} from 'react-native-paper';

import { Response } from '../../hooks/app';

export type Status = 'accessible' | 'notAccessible' | 'neutro';

interface ItemProps {
  post: Response;
}

const Item: React.FC<ItemProps> = ({ post }) => {
  const { navigate } = useNavigation();

  const [MESSAGE_STATUS, setMessageStatus] = useState('');
  const [MESSAGE_DIALOG, setMessageDialog] = useState('');
  const [COLOR_STATUS, setColorStatus] = useState('');
  const [ICON_STATUS, setIconStatus] = useState('');
  const [DialogVisible, setDialogVisible] = useState(false);

  const {
    id,
    title,
    status,
    address_post,
    image: { url },
    createdAt,
  } = post;

  useEffect(() => {
    let color = '';
    let message = '';
    let icon = '';
    let dialogMessage = '';
    if (status === 'accessible') {
      message = 'Local Acessível';
      dialogMessage =
        'Este local possui acessibildade, você poderá visitar sem risco de problemas';
      color = Colors.green300;
      icon = 'check';
    } else if (status === 'notAccessible') {
      message = 'Local Inacessível';
      dialogMessage =
        'Este local não possui acessibildade, não é recomendado o acesso ao local.';
      color = Colors.red300;
      icon = 'information';
    } else if (status === 'neutro') {
      message = 'Local Neutro';
      dialogMessage =
        'Este local possui o estado neutro, você poderá visitar o local, porém não é garantido que haverá acessibilidade';
      color = Colors.yellow800;
      icon = 'information-variant';
    }

    setMessageStatus(message);
    setMessageDialog(dialogMessage);
    setIconStatus(icon);
    setColorStatus(color);
  }, [status]);

  const handleDetail = useCallback(() => {
    navigate('Detail', {
      id,
    });
  }, [navigate, id]);

  return (
    <Animatable.View animation="bounceIn">
      <Card
        theme={{ animation: { scale: 5 } }}
        elevation={5}
        style={{ marginBottom: 30, borderRadius: 4 }}
      >
        <Card.Title title={title} subtitle={address_post} />
        <Card.Cover source={{ uri: url }} />
        <Card.Content>
          <Title>Data da publicação</Title>
          <Paragraph>{createdAt}</Paragraph>
        </Card.Content>
        <Card.Actions
          style={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Chip
            selectedColor={COLOR_STATUS || undefined}
            mode="flat"
            icon={ICON_STATUS}
            onPress={() => setDialogVisible(true)}
          >
            {MESSAGE_STATUS}
          </Chip>
          <Button
            onPress={handleDetail}
            icon="information"
            color={Colors.brown300}
            mode="outlined"
          >
            Detalhes
          </Button>
        </Card.Actions>

        <Dialog visible={DialogVisible}>
          <Dialog.Title>Alerta sobre local</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{MESSAGE_DIALOG}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              color={COLOR_STATUS}
              onPress={() => setDialogVisible(false)}
            >
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Card>
    </Animatable.View>
  );
};

export default Item;
