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
import { ensureTwoDigits, updateDate } from '@utils/calendar';
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

    //const days: Day[] = Array.from({ length: daysInMonth }, (_, i) => new Day({ mood: 0, date: `${year}-${ensureTwoDigits((month % 12) + 1)}-${ensureTwoDigits(i + 1)}` }, false));
    const days: Day[] = Array.from({ length: daysInMonth }, (_, i) => new Day({ mood: 0, date: updateDate(date, i + 1, 0) }, false));


    for (let i = 0; i < firstDayOfMonth; i++) {
      //days.unshift(new Day({ mood: 0, date: `${year}-${ensureTwoDigits(((month - 1) % 12) + 1)}-${ensureTwoDigits(daysInLastMonth - i)}` }, true));
      days.unshift(new Day({ mood: 0, date: updateDate(date, daysInLastMonth - i, -1) }, true));
    }

    let num = 1;
    while ((days.length) % 7 !== 0) {
      //days.push(new Day({ mood: 0, date: `${year}-${ensureTwoDigits(((month + 1) % 12) + 1)}-${ensureTwoDigits(num++)}` }, true));
      days.push(new Day({ mood: 0, date: updateDate(date, num++, 1) }, true));
    }

    let fetchedDays: FetchedDay[];
    const dateFrom = updateDate(date, 1, -4);
    const dateTo = updateDate(date, daysInMonth, 4);

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

  const generateCalendarPage = (date: Date, daysInMonth: number, daysInLastMonth: number, firstDayOfMonth: number): Day[] => {
    //const days: Day[] = Array.from({ length: daysInMonth }, (_, i) => new Day({ mood: 0, date: `${year}-${ensureTwoDigits((month % 12) + 1)}-${ensureTwoDigits(i + 1)}` }, false));
    const days: Day[] = Array.from({ length: daysInMonth }, (_, i) => new Day({ mood: 0, date: updateDate(date, i + 1, 0) }, false));
    for (let i = 0; i < firstDayOfMonth; i++) {
      //days.unshift(new Day({ mood: 0, date: `${year}-${ensureTwoDigits(((month - 1) % 12) + 1)}-${ensureTwoDigits(daysInLastMonth - i)}` }, true));
      days.unshift(new Day({ mood: 0, date: updateDate(date, daysInLastMonth - i, -1) }, true));
    }
    let num = 1;
    while ((days.length) % 7 !== 0) {
      //days.push(new Day({ mood: 0, date: `${year}-${ensureTwoDigits(((month + 1) % 12) + 1)}-${ensureTwoDigits(num++)}` }, true));
      days.push(new Day({ mood: 0, date: updateDate(date, num++, 1) }, true));
    }
    return days;
  };

  const genrateCalendarPages = async (date: Date): Promise<Day[][]> => {
    const year: number = date.getFullYear();
    const month: number = date.getMonth();
    const daysInMonth: number = new Date(year, month + 1, 0).getDate();
    let firstDayOfMonth: number = new Date(year, month, 1).getDay();
    firstDayOfMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInLastMonth: number = new Date(year, month, 0).getDate();

    const calendarPages: Day[][] = [];

    calendarPages.push(generateCalendarPage(date, daysInMonth, daysInLastMonth, firstDayOfMonth));

    for(let i = 1; i <= 4; i++) {
      const currentMonth = new Date(updateDate(date, 1, -i));
      const currentMonthFlag = new Date(updateDate(date, 1, -i + 1));
      currentMonthFlag.setDate(currentMonthFlag.getDate() - 1);
      const currentMonthLength = currentMonthFlag.getDate();

      const firstDayOfCurrentMonth = currentMonth.getDay() === 0 ? 6 : currentMonth.getDay() - 1;

      const perviousMonthFlag = new Date(updateDate(date, 1, -i));
      perviousMonthFlag.setDate(perviousMonthFlag.getDate() - 1);
      const prevoiusMonthLength = perviousMonthFlag.getDate();

      const page = generateCalendarPage(currentMonth, currentMonthLength, prevoiusMonthLength, firstDayOfCurrentMonth);
      calendarPages.unshift(page);
    }

    for(let i = 1; i <= 4; i++) {
      const currentMonth = new Date(updateDate(date, 1, i));
      const currentMonthFlag = new Date(updateDate(date, 1, i + 1));
      currentMonthFlag.setDate(currentMonthFlag.getDate() - 1);
      const currentMonthLength = currentMonthFlag.getDate();

      const firstDayOfCurrentMonth = currentMonth.getDay() === 0 ? 6 : currentMonth.getDay() - 1;

      const nextMonthFlag = new Date(updateDate(date, 1, i + 2));
      nextMonthFlag.setDate(nextMonthFlag.getDate() - 1);
      const nextMonthLength = nextMonthFlag.getDate();

      const page = generateCalendarPage(currentMonth, currentMonthLength, nextMonthLength, firstDayOfCurrentMonth);
      calendarPages.push(page);
    }

    let localYear: number = year;
    let localMonth: number = month - 4;
    if (localMonth < 0) {
      localYear--;
      localMonth += 12;
    }
    const dateFrom = `${localYear}-${ensureTwoDigits(localMonth)}-01`;

    localYear = year;
    localMonth = month + 4;
    if (localMonth > 11) {
      localYear++;
      localMonth += 12;
    }
    const localDaysInMonth = new Date(localYear, localMonth + 1, 0).getDate();
    const dateTo = `${localYear}-${ensureTwoDigits(localMonth)}-${ensureTwoDigits(localDaysInMonth)}`;

    let fetchedDays: FetchedDay[];

    try {
      await db.withExclusiveTransactionAsync(async (txn) => {
        fetchedDays = await txn.getAllAsync('SELECT * FROM mood_entery WHERE moodDate >= ? AND moodDate <= ?;', [dateFrom, dateTo]);
        for(const page of calendarPages) {
          for(const day of page) {
            for (let j = 0; j < fetchedDays.length; j++) {
              if (fetchedDays[j].moodDate === day.moodEntery.date) {
                day.moodEntery.mood = fetchedDays[j].mood;
              }
            }
          }
        }
      });
    } catch (error) {
      console.log('generateCalendarPages', error);
    }
    
    // for(const page of calendarPages) {
    //   console.log('-----------------');
    //   for(const day of page) {
    //     console.log(day.moodEntery.date, day.moodEntery.mood);
    //   }
    //   console.log('-----------------');
    // }
    return calendarPages;
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
      genrateCalendarPages(date);
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