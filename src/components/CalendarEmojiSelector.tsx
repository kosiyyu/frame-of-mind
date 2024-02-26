import React, { useState } from 'react';
import { View } from 'react-native';
import { colors, sizes } from '@constants/styles';
import EmojiAngery from '@components/EmojiAngery';
import EmojiShock from '@components/EmoijShock';
import EmojiSad from '@components/EmojiSad';
import HappyEmoji from '@components/EmojiHappy';
import NeutralEmoji from '@components/EmojiNeutral';
import RippleEffect from './RippleEffect';

interface CalendarEmojiSelectorProps {
  mood: number;
}

const CalendarEmojiSelector: React.FC<CalendarEmojiSelectorProps> = ({mood}) => {
  const [selected, setSelected] = useState<number>(mood || 0);
  const previouslySelected = mood || 0;

  const handleSize = (index: number) => {
    return selected === index ? 60 : 40;
  };

  const handleSelect = (index: number) => {
    return () => setSelected(index);
  };
  
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      backgroundColor: colors.tertiary,
      borderRadius: sizes.xxl,
      height: 60,
      overflow: 'hidden',
    }}>
      <RippleEffect onPress={handleSelect(0)}>
        <HappyEmoji width={handleSize(0)} height={handleSize(0)}/>
      </RippleEffect>
      <RippleEffect onPress={handleSelect(1)}>
        <HappyEmoji width={handleSize(1)} height={handleSize(1)}/>
      </RippleEffect>
      <RippleEffect onPress={handleSelect(2)}>
        <NeutralEmoji width={handleSize(2)} height={handleSize(2)}/>
      </RippleEffect>
      <RippleEffect onPress={handleSelect(3)}>
        <EmojiSad width={handleSize(3)} height={handleSize(3)}/>
      </RippleEffect>
      <RippleEffect onPress={handleSelect(4)}>
        <EmojiAngery width={handleSize(4)} height={handleSize(4)}/>
      </RippleEffect>
      <RippleEffect onPress={handleSelect(5)}>
        <EmojiShock width={handleSize(5)} height={handleSize(5)}/>
      </RippleEffect>
    </View>
  );
};

export default CalendarEmojiSelector;