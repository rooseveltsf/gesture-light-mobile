import React, { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { Menu, Appbar, Colors } from 'react-native-paper';

interface MenuProps {
  functionModal: () => void;
  functionDelete: () => void;
  isNeutro: boolean;
}

interface ButtonMenuProps {
  funcOpenMenu: () => void;
  isNeutro: boolean;
}

const MenuOptions: React.FC<MenuProps> = ({
  functionModal,
  functionDelete,
  isNeutro,
}) => {
  const [visible, setVisible] = useState(false);

  const openMenu = useCallback(() => {
    setVisible(true);
  }, []);

  const closeMenu = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={<ButtonMenu isNeutro={isNeutro} funcOpenMenu={openMenu} />}
    >
      <Menu.Item onPress={functionModal} title="Editar" />
      <Menu.Item onPress={functionDelete} title="Excluir" />
    </Menu>
  );
};

const ButtonMenu: React.FC<ButtonMenuProps> = ({ funcOpenMenu, isNeutro }) => {
  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

  return (
    <Appbar.Action
      color={isNeutro ? undefined : Colors.white}
      icon={MORE_ICON}
      onPress={funcOpenMenu}
    />
  );
};

export default MenuOptions;
