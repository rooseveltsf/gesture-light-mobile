import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { View } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';

import { useField } from '@unform/core';
import { Colors } from 'react-native/Libraries/NewAppScreen';

type InputProps = React.ComponentProps<typeof TextInput> & {
  name: string;
};

interface InputValueReference {
  value: string;
}

interface inputRef {
  focus(): void;
}

const Input: React.ForwardRefRenderFunction<inputRef, InputProps> = (
  { name, ...rest },
  ref
) => {
  const inputElementRef = useRef<any>(null);
  const { fieldName, registerField, error, defaultValue = '' } = useField(name);

  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(_, value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  return (
    <View>
      <TextInput
        error={!!error}
        defaultValue={defaultValue}
        mode="outlined"
        theme={{
          colors: {
            placeholder: '#999',
          },
        }}
        onChangeText={value => {
          inputValueRef.current.value = value;
        }}
        ref={inputElementRef}
        {...rest}
      />
      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>
    </View>
  );
};

export default forwardRef(Input);
