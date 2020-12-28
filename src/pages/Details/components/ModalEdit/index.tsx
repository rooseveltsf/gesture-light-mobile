import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Modal, ModalProps, View } from 'react-native';
import { Appbar, Colors, Chip, Banner } from 'react-native-paper';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { Response, usePublication } from '../../../../hooks/app';

import Input from '../../../../components/Input';
import Button from '../../../../components/Button';
import { FormContainer, ContainerChip } from './styles';

interface FormPublication {
  title: string;
  description: string;
}

export interface ModalRef {
  handleOpenModal: () => void;
}

interface PropsModal extends ModalProps {
  post: Response | undefined;
}

const ModalEdit: React.ForwardRefRenderFunction<ModalRef, PropsModal> = (
  { post },
  ref
) => {
  const [accessible, setAccessible] = useState(false);
  const [neutro, setNeutro] = useState(false);
  const [notAccessible, setNotAccessible] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const [visible, setVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [visibleBanner, setVisibleBanner] = useState(true);

  const { editPost } = usePublication();

  const formRef = useRef<FormHandles>(null);

  useEffect(() => {
    if (post?.status === 'accessible') {
      setAccessible(true);
    } else if (post?.status === 'neutro') {
      setNeutro(true);
    } else {
      setNotAccessible(true);
    }
  }, [post?.status, post?.description, post?.title]);

  const openModal = useCallback(() => {
    setVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setVisible(false);
  }, []);

  useImperativeHandle(ref, () => ({
    handleOpenModal() {
      openModal();
    },
  }));

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
    setNewStatus(statusField);
  }, []);

  const handleSubmit = useCallback(
    async ({ title, description }: FormPublication) => {
      setLoading(true);
      const isNewTitle = !!title;
      const isNewDescription = !!description;

      const newDataPublication = {
        title: isNewTitle ? title : post?.title,
        description: isNewDescription ? description : post?.description,
        status: newStatus,
      };

      await editPost(post?.id, newDataPublication);

      setLoading(false);
      closeModal();
    },
    [newStatus, editPost, post?.id, post?.description, post?.title, closeModal]
  );

  return (
    <Modal
      animationType="fade"
      visible={visible}
      onRequestClose={closeModal}
      onDismiss={closeModal}
    >
      <Appbar.Header style={{ backgroundColor: '#009cb8' }} statusBarHeight={0}>
        <Appbar.BackAction onPress={closeModal} />
        <Appbar.Content
          color="#fff"
          title="Tela de edição"
          subtitle="Informe as alterações"
        />
      </Appbar.Header>

      <FormContainer>
        <Banner
          visible={visibleBanner}
          actions={[
            {
              label: 'Fechar',
              onPress: () => setVisibleBanner(false),
            },
          ]}
          icon="information"
        >
          Informe o que mudou neste local, caso o novo status seja Acessível,
          adicione no título e descrição informações sobre.
        </Banner>

        <Form ref={formRef} onSubmit={handleSubmit}>
          <ContainerChip>
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
          </ContainerChip>

          <Input
            name="title"
            defaultValue={post?.title}
            label="Título"
            placeholder="Informe o título"
          />
          <Input
            label="Descrição"
            // autoFocus
            defaultValue={post?.description}
            name="description"
            textAlignVertical="top"
            placeholder="Informe uma descrição"
            multiline
            numberOfLines={8}
          />
        </Form>
        <View>
          <Button
            loading={loading}
            onPress={() => formRef.current?.submitForm()}
            style={{ backgroundColor: '#009cb8' }}
            icon="update"
            color="#fff"
          >
            Realizar Edição
          </Button>
        </View>
      </FormContainer>
    </Modal>
  );
};

export default forwardRef(ModalEdit);
