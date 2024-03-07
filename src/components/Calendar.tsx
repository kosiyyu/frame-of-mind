import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { colors, sizes, fonts } from '@constants/styles';
import CalendarNav from '@components/CalendarNav';
import CalendarHeader from '@components/CalendarHeader';
import CalendarEmojiSelector from '@components/CalendarEmojiSelector';
import CalendarEmojiSwitch from '@components/CalendarEmojiSwitch';
import RippleEffect from '@components/RippleEffect';
import CalendarModalHandle from '@components/CalendarModalHandle';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Day, FetchedDay } from '@constants/types';
import { MoodEntrySimplified } from '@constants/types';
import { useSQLiteContext } from 'expo-sqlite/next';
import { ensureTwoDigits } from '@utils/calendar';
import { Animated } from 'react-native';

const Calendar: React.FC = () => {
  const db = useSQLiteContext();
  // eslint-disable-next-line
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moodEntery, setMoodEntery] = useState<MoodEntrySimplified>({ mood: 0, date: '' });
  const [date, setDate] = useState(new Date());
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['30%', '30%'], []);
  const [days, setDays] = useState<Day[]>([]);
  const [slideAnim] = useState(new Animated.Value(0));

  const slideOut = () => {
    Animated.spring(slideAnim, {
      toValue: 1,
      friction: 6, // bounciness
      tension: 70, // speed
      useNativeDriver: true,
    }).start();
  };

  const generateDays = async (date: Date): Promise<Day[]> => {
    const start = Date.now();
    const year: number = date.getFullYear();
    const month: number = date.getMonth();
    const daysInMonth: number = new Date(year, month + 1, 0).getDate();
    let firstDayOfMonth: number = new Date(year, month, 1).getDay();
    firstDayOfMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInLastMonth: number = new Date(year, month, 0).getDate();

    const days: Day[] = Array.from({ length: daysInMonth }, (_, i) => new Day({ mood: 0, date: `${year}-${ensureTwoDigits((month % 12) + 1)}-${ensureTwoDigits(i + 1)}` }, false));

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.unshift(new Day({ mood: 0, date: `${year}-${ensureTwoDigits(((month - 1) % 12) + 1)}-${ensureTwoDigits(daysInLastMonth - i)}` }, true));//`${year}-${month}-${i + 1}`daysInLastMonth - i
    }

    let num = 1;
    while ((days.length) % 7 !== 0) {
      days.push(new Day({ mood: 0, date: `${year}-${ensureTwoDigits(((month + 1) % 12) + 1)}-${ensureTwoDigits(num++)}` }, true));
    }

    let fetchedDays: FetchedDay[];
    const dateFrom = `${year}-${ensureTwoDigits((month % 12) + 1)}-01`;
    const dateTo = `${year}-${ensureTwoDigits((month % 12) + 1)}-${ensureTwoDigits(daysInMonth)}`;

    try {
      await db.withExclusiveTransactionAsync(async (txn) => {
        fetchedDays = await txn.getAllAsync('SELECT * FROM mood_entery WHERE moodDate >= ? AND moodDate <= ?;', [dateFrom, dateTo]);
        for (let i = 0; i < days.length; i++) {
          for (let j = 0; j < fetchedDays.length; j++) {
            if (fetchedDays[j].moodDate === days[i].moodEntery.date) {
              days[i].moodEntery.mood = fetchedDays[j].mood;
            }
          }
        }
      });
    } catch (error) {
      console.log('error generatedDaysNEW', error);
    }
    const end = Date.now();
    console.log(`Execution time: ${end - start} ms`);
    return days;
  };

  useEffect(() => {
    generateDays(date)
      .then((days) => {
        setDays(days);
        slideAnim.setValue(0);
        setTimeout(() => {
          slideOut();
        }, 100);
      }).catch(error => {
        console.log('error', error);
      });
  }, [date]);

  const decrementMonth = (): void => {
    //console.log('decrementMonth');
    const newDate: Date = new Date(date);
    newDate.setMonth(date.getMonth() - 1);
    setDate(newDate);
  };

  const incrementMonth = (): void => {
    //console.log('incrementMonth');
    const newDate: Date = new Date(date);
    newDate.setMonth(date.getMonth() + 1);
    setDate(newDate);
  };

  const handlePresentModalPress = useCallback((day: Day) => {
    //console.log('handlePresentModalPress');
    bottomSheetModalRef.current?.present();
    //console.log('kkkk', day.moodEntery.mood);
    setMoodEntery({ mood: day.moodEntery.mood, date: `${ensureTwoDigits(date.getFullYear())}-${ensureTwoDigits((date.getMonth() % 12) + 1)}-${day.moodEntery.date.split('-')[2]}` });
  }, [date]);

  const handleSheetChanges = useCallback((index: number) => {
    //console.log('handleSheetChanges');
    if (index === -1) {
      //console.log('closed');
      add(moodEntery.mood, moodEntery.date);
      generateDays(date)
      .then((days) => {
        setDays(days);
        slideAnim.setValue(0);
        setTimeout(() => {
          slideOut();
        }, 100);
      }).catch(error => {
        console.log('error', error);
      });
    }
  }, [moodEntery, date]);

  const add = async (mood: number, date: string) => {
    //console.log('add');
    db.withExclusiveTransactionAsync(async (txn) => {
      await txn.execAsync(`insert or replace into mood_entery (mood, moodDate) values (${mood}, '${date}');`);
    })
      .then(() => {
        console.log('added');
      }).catch(error => {
        console.log('error', error);
      });
  };

  const onSelectedChange = (selected: number) => {
    console.log('onSelectedChange');
    setMoodEntery({ ...moodEntery, mood: selected });
  };

  // useEffect(() => {
  //   //console.log('useEffect');
  //   generateDays(date)
  //     .then((days) => {
  //       setDays(days);
  //       setTimeout(() => {
  //         slideAnim.setValue(0);
  //         slideOut();
  //       }, 200);
  //     }).catch(error => {
  //       console.log('error', error);
  //     });
  // }, []);

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
      <CalendarHeader />
      <Animated.FlatList
        style={{
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-500, 0]
              }),
            },
          ],
          opacity: slideAnim,
        }}
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
              <CalendarEmojiSwitch mood={day.moodEntery.mood} />
              <Text
                style={{
                  fontFamily: fonts.medium,
                  color: colors.white,
                }}
              >
                {parseInt(day.moodEntery.date.split('-')[2])}
              </Text>
            </View>
          </RippleEffect>
        )}
        keyExtractor={(item, index) => index.toString()}
        removeClippedSubviews={true}
        initialNumToRender={7}
        maxToRenderPerBatch={7}
        windowSize={7}
      />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        handleComponent={CalendarModalHandle}
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
        </View>
      </BottomSheetModal>
    </View>
  );
};

export default Calendar;