import React from 'react';
import { StatusBar, View, Text } from 'react-native';
import { Key, Value, MoodEntry, set, get, getAll, remove } from '@storage/MoodEntry';

const StatisticsScreen: React.FC = () => {
  return (
    <>
      <StatusBar />
      <View>
        <Text>Statistics</Text>
        <Text onPress={getAll}>getAll</Text>
        <Text onPress={() => set({ date: new Date('2022-01-01') }, { mood: 3 })}>set</Text>
        <Text onPress={() => get({ date: new Date('2022-01-01') })}>get</Text>
        <Text onPress={() => remove({ date: new Date('2022-01-01') })}>remove</Text>
      </View>
    </>
  );
};

export default StatisticsScreen;