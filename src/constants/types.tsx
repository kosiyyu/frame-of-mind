export class Day {
  public dayNumber: number;
  public isDisabled: boolean;

  public constructor(dayNumber: number, isDisabled: boolean) {
    this.dayNumber = dayNumber;
    this.isDisabled = isDisabled;
  };
};


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

export class Day2 {
  public moodEntery: MoodEntrySimplified;
  public isDisabled: boolean;

  public constructor(moodEntery: MoodEntrySimplified, isDisabled: boolean) {
    this.moodEntery = moodEntery;
    this.isDisabled = isDisabled;
  };
};