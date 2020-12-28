import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,

  colors: {
    ...DefaultTheme.colors,
    primary: '#3B93FB',
    onSurface: '#fff',
  },
};

export default theme;

// const defaultTheme: DefaultTheme = {
//   title: 'default',

//   colors: {
//     background: '#f4ede8',
//     primary: '#3B93FB',
//     inputs: '#eee',
//     error: '#c53030',

//     accessible: '#009944',
//     neutro: '#ffcc00',
//     notacessible: '#c53030',

//     title: '#666',
//     description: '#999',

//     gray: '#ddd',
//   },

//   fonts: {
//     regular: ' Roboto_400Regular',
//     bold: 'Roboto_700Bold',
//   },
// };

// export default defaultTheme;
