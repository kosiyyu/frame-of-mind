import { View, Text, FlatList } from 'react-native';
import { colors, sizes, fonts } from '@constants/styles';
import RippleEffect from '@components/RippleEffect';
import { Day2 } from '@constants/types';
import React, { useEffect, useState } from 'react';
import EmojiAngery from '@components/EmojiAngery';
import EmojiShock from '@components/EmoijShock';
import EmojiSad from '@components/EmojiSad';
import HappyEmoji from '@components/EmojiHappy';
import NeutralEmoji from '@components/EmojiNeutral';

const MemoizedHappyEmoji = React.memo(HappyEmoji);
const MemoizedNeutralEmoji = React.memo(NeutralEmoji);
const MemoizedEmojiSad = React.memo(EmojiSad);
const MemoizedEmojiAngery = React.memo(EmojiAngery);
const MemoizedEmojiShock = React.memo(EmojiShock);

const moodToEmoji = (num: number) => {
  switch (num) {
    case 1:
      return <MemoizedHappyEmoji width={40} height={40} />;
    case 2:
      return <MemoizedNeutralEmoji width={40} height={40} />;
    case 3:
      return <MemoizedEmojiSad width={40} height={40} />;
    case 4:
      return <MemoizedEmojiAngery width={40} height={40} />;
    case 5:
      return <MemoizedEmojiShock width={40} height={40} />;
    default:
      return <MemoizedHappyEmoji width={40} height={40} />;
  } 
};

interface CalendarBoardProps {
  generatedDays: Promise<Day2[]>;
  handlePresentModalPress: (day: Day2) => void;
  autoDayTextColor: (day: Day2) => string;
  boardCalendarReset: boolean;
}

const CalendarBoard: React.FC<CalendarBoardProps> = ({generatedDays, handlePresentModalPress, autoDayTextColor}) => {
  const [days, setDays] = useState<Day2[]>([]);
  
  useEffect(() => {
    generatedDays.then((days) => {
      setDays(days);
    }).catch((error) => {
      console.log('error', error);
    });
  }, [generatedDays]);

  return (
    <FlatList
      data={days}
      numColumns={7}
      renderItem={({ item: day }) => (
        <RippleEffect
          style={{ flex: 1 }}
          onPress={() => handlePresentModalPress(day)}
          isDisabled={day.isDisabled}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: sizes.one,
              backgroundColor: day.isDisabled ? colors.black : colors.secondary,
            }}
          >
            {moodToEmoji(day.moodEntery.mood)}
            <Text
              style={{
                fontFamily: fonts.medium,
                color: autoDayTextColor(day),
              }}
            >
              {parseInt(day.moodEntery.date.split('-')[2])}
            </Text>
          </View>
        </RippleEffect>
      )}
      keyExtractor={(item, index) => index.toString()}
      removeClippedSubviews={true}
    />
  );
};

export default CalendarBoard;