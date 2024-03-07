export interface FetchedDay {
  id: number;
  mood: number;
  moodDate: string;
}

export interface EmojiProps {
  width?: number;
  height?: number;
};

export interface MoodEntery {
  mood: number;
  date: Date;
};

export interface MoodEntrySimplified {
  mood: number;
  date: string;
};

export class Day {
  public moodEntery: MoodEntrySimplified;
  public isDisabled: boolean;

  public constructor(moodEntery: MoodEntrySimplified, isDisabled: boolean) {
    this.moodEntery = moodEntery;
    this.isDisabled = isDisabled;
  };
};