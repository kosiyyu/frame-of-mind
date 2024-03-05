import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';
import { ensureTwoDigits } from '@utils/calendar';
import { FetchedDay } from '@constants/types';

const Statistics: React.FC = () => {
  const db = useSQLiteContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weeklyActivityData, setWeeklyActivityData] = useState<FetchedDay[]>([]);

  useEffect(() => {
    weeklyActivity()
    .then((data) => {
      setWeeklyActivityData(data);
    }).catch((error) => {
      console.log('error weeklyActivity', error);
    });
  }, []);

  const weeklyActivity = async () => {
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

    return days;
  };

  return (
    <View>
      <View>
        <Text>Weekly activity</Text>
        <View>
          <FlatList
            data={weeklyActivityData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View>
                <Text>{item.moodDate}</Text>
                <Text>{item.mood}</Text>
              </View>
            )}
          />
        </View>
      </View>

    </View>
  );
};

export default Statistics;