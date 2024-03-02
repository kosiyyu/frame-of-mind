import React, { useRef, useMemo, useCallback, useState, useEffect,
  // useContext 
  } from 'react';
import { View, Text } from 'react-native';
import { colors, sizes } from '@constants/styles';
import { days } from '@constants/daysMonths';
import CalendarNav from '@components/CalendarNav';
import CalendarHeader from '@components/CalendarHeader';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import CalendarBoard from './CalendarBoard';
import { Day } from '@constants/types';
// import * as SQLite from "expo-sqlite";
import CalendarEmojiSelector from '@components/CalendarEmojiSelector';
// import Context from '@context/Context';
import { MoodEntrySimplified } from '@constants/types';
import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite/next';
import RippleEffect from './RippleEffect';

const Calendar: React.FC = () => {
  // const db = useContext(Context) as SQLite.SQLiteDatabase;
  const db = useSQLiteContext();
  // eslint-disable-next-line
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moodEntery, setMoodEntery] = useState<MoodEntrySimplified>({ mood: 0, date: ''});
  const [date, setDate] = useState(new Date());
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['22%', '22%'], []);
  
  // const generateDayString = (date: Date): string => {
  //   return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  // };

  const generateDayString = (date: Date, day: number): string => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${day}`;
  };

  const generatedDays = (date: Date): Day[] => {
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

  const autoDayTextColor = (day: Day): string => {
    if (currentDate.getDate() === day.dayNumber
      && currentDate.getMonth() === date.getMonth()
      && currentDate.getFullYear() === date.getFullYear()) {
      return colors.specialLight;
    }

    return colors.white;
  };

  const handlePresentModalPress = useCallback((day: Day) => {
    bottomSheetModalRef.current?.present();
    const dateString = generateDayString(date, day.dayNumber);
    setMoodEntery({...moodEntery, date: dateString });
  }, [date]);

  // const handlePresentModalPress = useCallback((day: Day) => {
  //   bottomSheetModalRef.current?.dismiss(); // dismiss the modal if it's open
  //   const dateString = generateDayString(date, day.dayNumber);
  //   setMoodEntery({...moodEntery, date: dateString });
  //   setTimeout(() => {
  //     bottomSheetModalRef.current?.present(); // present the modal after state is updated
  //   }, 0);
  // }, [date]);

  useEffect(() => {
    console.log('moodEntery', moodEntery);
  }, [moodEntery]);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    if(index === -1) {
      console.log('closed');
      //add(moodEntery.mood, moodEntery.date);
      getAll();
    }
  }, []);

  const getAll = async() => {
    try {
      await db.execAsync(`PRAGMA journal_mode = WAL;`);
      await db.withTransactionAsync(async () => {
        const result = await db.getAllAsync('SELECT * FROM mood_entery');
        console.log('result', result);
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  const add = async(mood: number, date: string) => {
    try {
      await db.withTransactionAsync(async () => {
        await db.runAsync("insert into mood_entery (mood, moodDate) values (?, ?)", [mood, date]);
        console.log('added');
      });
    } catch (error) {
      console.log('error', error);
    };
  };

  //   db.transaction(
  //     (tx) => {
  //       tx.executeSql("insert into mood_entery (mood, date) values (?, ?)", [mood, date]);
  //       tx.executeSql("select * from mood_entery", [], (_, { rows }) =>
  //         console.log(JSON.stringify(rows))
  //       );
  //     },
  //     null,
  //     {}
  //   );
  // };

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
      <CalendarNav decrementMonth={decrementMonth} incrementMonth={incrementMonth} date={date} />
      <CalendarHeader days={days} />
      <CalendarBoard 
        generatedDays={generatedDays(date)} 
        handlePresentModalPress={handlePresentModalPress} 
        autoDayTextColor={autoDayTextColor} 
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
          </View>
        </BottomSheetModal>
    </View>
  );
};

export default Calendar;