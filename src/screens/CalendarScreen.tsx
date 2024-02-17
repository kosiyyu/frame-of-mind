import React from 'react';
import { StatusBar } from 'react-native';
import Calendar from '@components/Calendar';

const CalendarScreen: React.FC = () => {
  return (
    <>
      <StatusBar />
      <Calendar />
    </>
  );
};

export default CalendarScreen;