import React, { 
  //useContext, 
  useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { colors, sizes } from '@constants/styles';
import EmojiAngery from '@components/EmojiAngery';
import EmojiShock from '@components/EmoijShock';
import EmojiSad from '@components/EmojiSad';
import HappyEmoji from '@components/EmojiHappy';
import NeutralEmoji from '@components/EmojiNeutral';
import RippleEffect from './RippleEffect';
// import Context from '@context/Context';
// import * as SQLite from "expo-sqlite";
import { MoodEntrySimplified } from '@constants/types';
import { months } from '@constants/daysMonths';

interface CalendarEmojiSelectorProps {
  moodEntery: MoodEntrySimplified;
  onSelectedChange: (selected: number) => void;
}

const CalendarEmojiSelector: React.FC<CalendarEmojiSelectorProps> = ({ moodEntery, onSelectedChange }) => {
  //const db = useContext(Context) as SQLite.SQLiteDatabase;
  const [selected, setSelected] = useState<number>(moodEntery.mood || 0);
  const previouslySelected = moodEntery || 0;

  useEffect(() => {
    console.log('moodEntery.mood', moodEntery.mood);
    const isUpdateRequired = selected !== previouslySelected.mood;
    if (!isUpdateRequired) {
      return;
    }
    onSelectedChange(selected);
  }, [selected]);

  const handleSize = (index: number) => {
    return selected === index ? 60 : 40;
  };

  const handleSelect = (index: number) => {
    console.log('index', index);
    setSelected(index);
  };

  const dateDisplay = moodEntery.date.split('-');

  return (
    <View>
      <Text
        style={{
          color: colors.white,
          textAlign: 'center',
          fontSize: sizes.medium,
          marginBottom: sizes.xl,
        }}
      >
        {dateDisplay[2] + ' ' + months[parseInt(dateDisplay[1]) - 1] + ' ' + dateDisplay[0]}
      </Text>
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: colors.tertiary,
        borderRadius: sizes.xxl,
        height: 60,
        overflow: 'hidden',
      }}>
        <RippleEffect onPress={() => handleSelect(0)}>
          <HappyEmoji width={handleSize(0)} height={handleSize(0)} />
        </RippleEffect>
        <RippleEffect onPress={() => handleSelect(1)}>
          <HappyEmoji width={handleSize(1)} height={handleSize(1)} />
        </RippleEffect>
        <RippleEffect onPress={() => handleSelect(2)}>
          <NeutralEmoji width={handleSize(2)} height={handleSize(2)} />
        </RippleEffect>
        <RippleEffect onPress={() => handleSelect(3)}>
          <EmojiSad width={handleSize(3)} height={handleSize(3)} />
        </RippleEffect>
        <RippleEffect onPress={() => handleSelect(4)}>
          <EmojiAngery width={handleSize(4)} height={handleSize(4)} />
        </RippleEffect>
        <RippleEffect onPress={() => handleSelect(5)}>
          <EmojiShock width={handleSize(5)} height={handleSize(5)} />
        </RippleEffect>
      </View>
    </View>
  );
};

export default CalendarEmojiSelector;