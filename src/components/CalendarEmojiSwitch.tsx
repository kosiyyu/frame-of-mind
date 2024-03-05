import React from 'react';
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

interface CalendarEmojiSwitchProps {
  mood: number;
}

const CalendarEmojiSwitch: React.FC<CalendarEmojiSwitchProps> = ({mood}) => {
  switch (mood) {
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

export default React.memo(CalendarEmojiSwitch);