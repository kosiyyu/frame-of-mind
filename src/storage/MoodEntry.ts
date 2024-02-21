import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Key {
  date: Date;
}

export interface Value {
  mood: number;
}

export type MoodEntry = Key & Value;

export const set = async (key: Key, value: Value) => {
  try {
    // console.log(`item { key: ${JSON.stringify(key)}, value: ${JSON.stringify(value)} } added`);
    await AsyncStorage.setItem(JSON.stringify(key), JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

export const get = async (key: Key) => {
  try {
    const value = await AsyncStorage.getItem(JSON.stringify(key));
    if(value !== null) {
      // console.log(`item { key: ${JSON.stringify(key)}, value: ${JSON.parse(value)} }`);
      return JSON.parse(value);
    }
  } catch(error) {
    console.log(error);
    return null;
  }
};

export const getAll = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const values = await AsyncStorage.multiGet(keys);
    return values;
    // return items.map(([key, value]) => ({ date: new Date(JSON.parse(key)), mood: JSON.parse(value) }));
  } catch (error) {
    console.log(error);
  }
};

export const remove = async (key: Key) => {
  try {
    // console.log(`item { key: ${JSON.stringify(key)} removed`);
    await AsyncStorage.removeItem(JSON.stringify(key));
  } catch(error) {
    console.log(error);
  }
};