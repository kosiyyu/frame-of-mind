import React, { useRef, useMemo, useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { colors, sizes } from '@constants/styles';
import { days } from '@constants/daysMonths';
import CalendarNav from '@components/CalendarNav';
import CalendarHeader from '@components/CalendarHeader';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import CalendarBoard from './CalendarBoard';
import { Day2  } from '@constants/types';
import CalendarEmojiSelector from '@components/CalendarEmojiSelector';
import { MoodEntrySimplified } from '@constants/types';
import { useSQLiteContext} from 'expo-sqlite/next';
import RippleEffect from './RippleEffect';
import { useSignal } from '@hooks/useSignal';

const Calendar: React.FC = () => {
  const db = useSQLiteContext();
  // eslint-disable-next-line
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moodEntery, setMoodEntery] = useState<MoodEntrySimplified>({ mood: 0, date: ''});
  const [date, setDate] = useState(new Date());
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['30%', '30%'], []);
  const [ boardCalendarReset, boardCalendarSignal ] = useSignal();

  const generatedDaysNEW = async(date: Date): Promise<Day2[]> => {
    const year: number = date.getFullYear();
    const month: number = date.getMonth();
    const daysInMonth: number = new Date(year, month + 1, 0).getDate();
    let firstDayOfMonth: number = new Date(year, month, 1).getDay();
    firstDayOfMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInLastMonth: number = new Date(year, month, 0).getDate();

    const fixed = (num: number): number | string => {
      return num < 10 ? `0${num}` : num;
    };

    const days: Day2[] = Array.from({ length: daysInMonth }, (_, i) => new Day2({mood: 0, date: `${year}-${fixed((month % 12) + 1)}-${fixed(i + 1)}`}, false));
    
    // add at the begginig of the array
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.unshift(new Day2({mood: 0, date: `${year}-${fixed(((month - 1) % 12) + 1)}-${fixed(daysInLastMonth - i)}`}, true));//`${year}-${month}-${i + 1}`daysInLastMonth - i
    }
  
    // add at the end of the array
    let num = 1;
    while ((days.length) % 7 !== 0) {
      days.push(new Day2({mood: 0, date: `${year}-${fixed(((month + 1) % 12) + 1)}-${fixed(num++)}`}, true));
    }
    //
     
    interface FetchedDay {
      id: number;
      mood: number;
      moodDate: string;
    }

    let fetchedDays: FetchedDay[];
    // first day of the month
    const dateFrom = `${year}-${fixed((month % 12) + 1)}-01`;

    // last day of the month
    const dateTo = `${year}-${fixed((month % 12) + 1)}-${fixed(daysInMonth)}`;

    try {
      await db.withExclusiveTransactionAsync(async (txn) => {
        fetchedDays = await txn.getAllAsync('SELECT * FROM mood_entery WHERE moodDate >= ? AND moodDate <= ?;', [dateFrom, dateTo]);
        for(let i = 0; i < days.length; i++) {
          for(let j = 0; j < fetchedDays.length; j++) {
            if(fetchedDays[j].moodDate === days[i].moodEntery.date) {
              days[i].moodEntery.mood = fetchedDays[j].mood;
            }
          }
        }
      });
    } catch (error) {
      console.log('error generatedDaysNEW', error);
    }
    return days;
  };

  const decrementMonth = (): void => {
    const newDate: Date = new Date(date); 
    newDate.setMonth(date.getMonth() - 1);
    setDate(newDate);
  };

  const incrementMonth = (): void => {
    const newDate: Date = new Date(date); 
    newDate.setMonth(date.getMonth() + 1);
    setDate(newDate);
  };

  const autoDayTextColor = useCallback((day: Day2): string => {
    if (currentDate.getDate().toString() === day.moodEntery.date.split('-')[2]
      && currentDate.getMonth() === date.getMonth()
      && currentDate.getFullYear() === date.getFullYear()) {
      return colors.specialLight;
    }

    return colors.white;
  }, [currentDate, date]);

  const handlePresentModalPress = useCallback((day: Day2) => {
    bottomSheetModalRef.current?.present();;
    const fixed = (num: number): number | string => {
      return num < 10 ? `0${num}` : num;
    };
    console.log('kkkk', day.moodEntery.mood);
    setMoodEntery({mood: day.moodEntery.mood, date: `${fixed(date.getFullYear())}-${fixed((date.getMonth() % 12) + 1)}-${day.moodEntery.date.split('-')[2]}` });
  }, [date]);
  
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    if(index === -1) {
      console.log('closed');
      add(moodEntery.mood, moodEntery.date);
      boardCalendarSignal();
    }
  }, [moodEntery, date]);

  const add = async(mood: number, date: string) => {
    db.withExclusiveTransactionAsync(async (txn) => {
      await txn.execAsync(`insert or replace into mood_entery (mood, moodDate) values (${mood}, '${date}');`);
    })
    .then(() => {
      console.log('added');
      boardCalendarSignal();
    }).catch(error => {
      console.log('error', error);
    });
  };

  const removeAll = async() => {
    try {
      await db.withTransactionAsync(async () => {
        await db.runAsync("DELETE FROM mood_entery");
        console.log('All entries removed');
      });
    } catch (error) {
      console.log('error', error);
    };
  };

  const onSelectedChange = (selected: number) => {
    setMoodEntery({...moodEntery, mood: selected });
  };

  const renderHandle = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.tertiary,
          borderTopRightRadius: sizes.medium,
          borderTopLeftRadius: sizes.medium,
        }}
      >
        <Ionicons name="chevron-down-outline" size={30} color={colors.white} />
      </View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: colors.black,
      }}
    >
      <CalendarNav 
        decrementMonth={decrementMonth} 
        incrementMonth={incrementMonth} 
        date={date} 
      />
      <CalendarHeader days={days} />
      <CalendarBoard 
        generatedDays={generatedDaysNEW(date)} 
        handlePresentModalPress={handlePresentModalPress} 
        autoDayTextColor={autoDayTextColor}
        boardCalendarReset={boardCalendarReset}
      />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          handleComponent={renderHandle}
          backgroundComponent={({ style }) => (
            <View 
              style={[style, { 
                backgroundColor: colors.primary,
                borderTopRightRadius: sizes.xxl,
                borderTopLeftRadius: sizes.xxl,
              }]} 
            />
          )}
        >
          <View style={{
            flex: 1,
            padding: sizes.medium,
            backgroundColor: colors.secondary,
            alignItems: 'center',
            // justifyContent: 'center',
          }}>
            <CalendarEmojiSelector moodEntery={moodEntery} onSelectedChange={onSelectedChange} />
            <RippleEffect onPress={() => add(moodEntery.mood, moodEntery.date)}>
              <Text>Add</Text>
            </RippleEffect>
            <RippleEffect onPress={() => removeAll()}>
              <Text>Remove all</Text>
            </RippleEffect>
            <RippleEffect onPress={() => generatedDaysNEW(new Date(moodEntery.date))}>
              <Text>generatedDaysNEW</Text>
            </RippleEffect>
          </View>
        </BottomSheetModal>
    </View>
  );
};

export default Calendar;