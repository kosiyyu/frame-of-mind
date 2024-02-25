import { View, Text } from 'react-native';
import { colors, sizes, fonts } from '@constants/styles';
import FaceTest from '@components/FaceTest';
import RippleEffect from '@components/RippleEffect';
import { Day } from '@constants/types';

interface CalendarBoardProps {
  generatedDays: Day[];
  handlePresentModalPress: (day: Day) => void;
  autoDayTextColor: (day: Day) => string;
}

const CalendarBoard: React.FC<CalendarBoardProps> = ({generatedDays, handlePresentModalPress, autoDayTextColor}) => {
  return (
    <>
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
            onPress={() => handlePresentModalPress(day)}
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
    </>
  );
};

export default CalendarBoard;