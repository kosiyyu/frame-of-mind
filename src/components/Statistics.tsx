import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { View, Text, FlatList } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';
import { ensureTwoDigits } from '@utils/calendar';
import { FetchedDay } from '@constants/types';
import { colors, sizes, fonts } from '@constants/styles';
import { days } from '@constants/daysMonths';
import LineChart, { Point } from '@components/LineChart';

const Statistics: React.FC = () => {
  const db = useSQLiteContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weeklyActivityData, setWeeklyActivityData] = useState<Point[]>([]);

  useEffect(() => {
    generate()
      .then((data) => {
        setWeeklyActivityData(data);
        console.log('data', data);
      }).catch((error) => {
        console.log('error generate', error);
      });
  }, []);

  const generate = async (): Promise<Point[]> => {
    const dayOfWeek = (currentDate.getDay() + 6) % 7;
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - dayOfWeek));
    const endOfWeek = new Date(currentDate.setDate(startOfWeek.getDate() + 6));

    const days: FetchedDay[] = [];
    for (let i = 0; i <= 6; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      const formattedDate = `${currentDay.getFullYear()}-${ensureTwoDigits(currentDay.getMonth() + 1)}-${ensureTwoDigits(currentDay.getDate())}`;
      days.push({ id: 0, mood: 0, moodDate: formattedDate });
    }

    const dateFrom = `${startOfWeek.getFullYear()}-${ensureTwoDigits(startOfWeek.getMonth() + 1)}-${ensureTwoDigits(startOfWeek.getDate())}`;
    const dateTo = `${endOfWeek.getFullYear()}-${ensureTwoDigits(endOfWeek.getMonth() + 1)}-${ensureTwoDigits(endOfWeek.getDate())}`;

    try {
      await db.withExclusiveTransactionAsync(async (txn) => {
        const fetchedDays: FetchedDay[] = await txn.getAllAsync('SELECT * FROM mood_entery WHERE moodDate >= ? AND moodDate <= ?;', [dateFrom, dateTo]);
        for (let i = 0; i < days.length; i++) {
          for (let j = 0; j < fetchedDays.length; j++) {
            if (fetchedDays[j].moodDate === days[i].moodDate) {
              days[i].mood = fetchedDays[j].mood;
            }
          }
        }
      });
    } catch (error) {
      console.log('error generatedDaysNEW', error);
    }

    // brute
    const result = days.map((day, index) => {
      return { x: index, y: day.mood };
    });

    return result;
  };

  const data: Point[] = [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 3, y: 0 },
    { x: 4, y: 4 },
    { x: 5, y: 5 },
    { x: 6, y: 4 },
  ];

  const xLabel = days;
  const yLabel = ['0', '1', '2', '3', '4', '5'];

  const width = Dimensions.get('window').width - 70;
  const height = Dimensions.get('window').width - 70 - 70;

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.black,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: colors.secondary,
          padding: sizes.medium,
          borderRadius: sizes.medium,
          margin: sizes.medium,
        }}
      >
        <Text
          style={{
            color: colors.white,
            fontFamily: fonts.bold,
            fontSize: sizes.medium,
          }}
        >
          Weekly Activity
        </Text>
        {weeklyActivityData.length > 0 && (
          <LineChart
            data={weeklyActivityData}
            xLabel={xLabel}
            yLabel={yLabel}

            lineWidth={2}
            width={width}
            height={height}

            backgroundColor={colors.secondary}
            xLineColor={colors.white}
            yLineColor={colors.white}
            lineColor={colors.specialLight}
            gradientStartColor={colors.specialLight}
            gradientEndColor={colors.specialLight}
            gridColor={colors.white}
            xLabelTextColor={colors.white}
            yLabelTextColor={colors.white}

            gradientStartOpacity='0.5'
            gradientEndOpacity='0'

            displayGrid={false}
          />
        )}
      </View>
    </View>
  );
};

export default Statistics;