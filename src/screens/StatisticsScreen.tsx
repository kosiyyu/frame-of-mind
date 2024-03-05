import Statistics from '@components/Statistics';
import React from 'react';
import { StatusBar } from 'react-native';

const StatisticsScreen: React.FC = () => {
  return (
    <>
      <StatusBar />
      <Statistics />
    </>
  );
};

export default StatisticsScreen;