import React from 'react';
import {DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import {Routes} from './Routes';


const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#521972',
    accent: '#fcd601',
    
  },
};

export default function App() {


  return (
    <PaperProvider theme={theme}>
      <Routes />
    </PaperProvider>
  );
}
