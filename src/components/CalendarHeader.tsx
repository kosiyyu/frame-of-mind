import React from 'react';
import { View, Text } from 'react-native';
import { colors, fonts, sizes } from '@constants/styles';
import { days } from '@constants/daysMonths';

const CalendarHeader: React.FC = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.black,
      }}
    >
      {days.map((day, dayIndex) => (
        <View
          key={dayIndex}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: sizes.one,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.medium,
              color: dayIndex === 6 ? colors.specialLight : colors.white,
            }}
          >
            {day}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default React.memo(CalendarHeader);