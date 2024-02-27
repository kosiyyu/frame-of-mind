import App from '@components/App';
import React from 'react';
import { StatusBar, View, Text } from 'react-native';

const PremiumScreen: React.FC = () => {
  return (
    <>
      <StatusBar />
      <View>
        <App />
      </View>
    </>
  );
};

export default PremiumScreen;