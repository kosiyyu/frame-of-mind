import React from 'react';
import { View } from 'react-native';
import { colors, sizes } from '@constants/styles';
import { Ionicons } from '@expo/vector-icons';

const CalendarModalHandle: React.FC = () => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.tertiary,
        borderTopRightRadius: sizes.medium,
        borderTopLeftRadius: sizes.medium,
      }}
    >
      <Ionicons name="chevron-down-outline" size={30} color={colors.white} />
    </View>
  );
};

export default React.memo(CalendarModalHandle);