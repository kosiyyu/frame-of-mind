import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { colors, sizes, fonts } from '@constants/styles';
import { days } from '@constants/daysMonths';
import FaceTest from './FaceTest';
import RippleEffect from './RippleEffect';
import CalendarNav from '@components/CalendarNav';
import CalendarHeader from '@components/CalendarHeader';

class Day {
  public dayNumber: number;
  public isDisabled: boolean;

  public constructor(dayNumber: number, isDisabled: boolean) {
    this.dayNumber = dayNumber;
    this.isDisabled = isDisabled;
  }
}

function generateDays(date: Date): Day[] {
  const month: number = date.getMonth();
  const year: number = date.getFullYear();
  const daysInMonth: number = new Date(year, month + 1, 0).getDate();
  let firstDayOfMonth: number = new Date(year, month, 1).getDay();
  firstDayOfMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInLastMonth: number = new Date(year, month, 0).getDate();
  const days: Day[] = Array.from({ length: daysInMonth }, (_, i) => new Day(i + 1, false));

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.unshift(new Day(daysInLastMonth - i, true));
  }

  let num = 1;
  while ((days.length) % 7 !== 0) {
    days.push(new Day(num++, true));
  }

  return days;
}

const Calendar: React.FC = () => {
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // eslint-disable-next-line
  const [currentDate, setCurrentDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const generatedDays = generateDays(date);

  const decrementMonth = (): void => {
    const newDate: Date = new Date(date); newDate.setMonth(date.getMonth() - 1);
    setDate(newDate);
  };

  const incrementMonth = (): void => {
    const newDate: Date = new Date(date); newDate.setMonth(date.getMonth() + 1);
    setDate(newDate);
  };

  const autoDayTextColor = (day: Day): string => {
    if (currentDate.getDate() === day.dayNumber
      && currentDate.getMonth() === date.getMonth()
      && currentDate.getFullYear() === date.getFullYear()) {
      return colors.specialLight;
    }

    // if(day.isDisabled) {
    //   return colors.white;
    // }

    return colors.white;
  };

  return (
    <View
      style={{
        backgroundColor: colors.black,
      }}
    >
      <CalendarNav decrementMonth={decrementMonth} incrementMonth={incrementMonth} date={date} />
      <CalendarHeader days={days} />
      {Array.from({ length: Math.ceil(generatedDays.length / 7) }).map((_, weekIndex) => (
        <View
          key={weekIndex}
          style={{
            flexDirection: 'row',
          }}
        >
          {generatedDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => (
            <RippleEffect
              key={dayIndex}
              style={{
                flex: 1,
              }}
              onPress={() => console.log(day.dayNumber)}
              isDisabled={day.isDisabled}
            >
              <View
                key={dayIndex}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: sizes.one,
                  backgroundColor: day.isDisabled ? colors.black : colors.secondary,
                }}
              >
                <FaceTest />
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    color: autoDayTextColor(day),
                  }}
                >
                  {day.dayNumber}
                </Text>
              </View>
            </RippleEffect>
          ))}
        </View>
      ))}
    </View>
  );
};

export default Calendar;