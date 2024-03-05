import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RippleEffect from './RippleEffect';
import { colors, fonts, sizes } from '@constants/styles';
import { months } from '@constants/daysMonths';

interface CalendarNavProps {
  decrementMonth: () => void;
  incrementMonth: () => void;
  date: Date;
}

const CalendarNav: React.FC<CalendarNavProps> = ({ decrementMonth, incrementMonth, date }) => {
  const [lastPressDecrement, setLastPressDecrement] = useState(0);
  const [lastPressIncrement, setLastPressIncrement] = useState(0);
  
  const handleDecrement = (): void => {
    const now = new Date().getTime();
    const timeDiff = now - lastPressDecrement;
    if (timeDiff < 300) {
      return;
    }
    setLastPressDecrement(now);
    decrementMonth();
  };

  const handleIncrement = (): void => {
    const now = new Date().getTime();
    const timeDiff = now - lastPressIncrement;
    if (timeDiff < 300) {
      return;
    }
    setLastPressIncrement(now);
    incrementMonth();
  };


  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.black,
      }}
    >

      <RippleEffect
        style={{
          height: 60,
          width: 60,
        }}
        onPress={handleDecrement}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.black,
            height: 60,
          }}
        >
          <Ionicons name="arrow-back-outline" size={24} color={colors.white} />
        </View>
      </RippleEffect>

      <View>
        <Text
          style={{
            color: colors.white,
            fontFamily: fonts.medium,
            fontSize: sizes.xl,
          }}
        >
          {months[date.getMonth()]} {date.getFullYear()}
        </Text>
      </View>

      <RippleEffect
        style={{
          height: 60,
          width: 60,
        }}
        onPress={handleIncrement}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.black,
            height: 60,
          }}
        >
          <Ionicons name="arrow-forward-outline" size={24} color={colors.white} />
        </View>
      </RippleEffect>

    </View>
  );
};

export default React.memo(CalendarNav);