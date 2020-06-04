import React from 'react';
import { StatusBar } from 'react-native';
import { AppLoading } from 'expo';
import { useFonts, Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';

import Routes from './src/routes';

export default function App() {
  const [fontsLoaded] = useFonts({
    Ubuntu_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
  });

  if (!fontsLoaded) return <AppLoading />

  return (
    <>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <Routes />
    </>
  );
}
