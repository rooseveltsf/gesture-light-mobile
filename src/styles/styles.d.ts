import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    title: string;

    colors: {
      background: string;
      primary: string;
      inputs: string;
      error: string;

      notacessible: string;
      accessible: string;
      neutro: string;

      title: string;
      description: string;

      gray: string;
    };

    fonts: {
      regular: string;
      bold: string;
    };
  }
}
