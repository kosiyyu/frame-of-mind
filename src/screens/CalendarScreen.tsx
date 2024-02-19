import React from 'react';
import { StatusBar } from 'react-native';
import { View } from 'react-native';
import Calendar from '@components/Calendar';
import { colors } from '@constants/styles';

const CalendarScreen: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.black,
      }}
    >
      <StatusBar />
      <Calendar />
    </View>
  );
};

export default CalendarScreen;