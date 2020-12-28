import React from 'react';
import { Button } from 'react-native-paper';

type ButtonProps = React.ComponentProps<typeof Button>;

const ButtonApp: React.FC<ButtonProps> = ({
  children,
  loading,
  icon,
  ...rest
}) => {
  return (
    <Button loading={loading} icon={icon} {...rest}>
      {children}
    </Button>
  );
};

export default ButtonApp;
