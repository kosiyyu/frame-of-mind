import { useCallback } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import OptionsScreen from '@screens/OptionsScreen';
import CalendarScreen from '@screens/CalendarScreen';
import { Ionicons } from '@expo/vector-icons';
import { colors, sizes } from '@constants/styles';
import PremiumScreen from '@screens/PremiumScreen';
import StatisticsScreen from '@screens/StatisticsScreen';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Context from 'src/context/Context';
import { Platform } from 'react-native';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite/next';
import * as SQLite from 'expo-sqlite/next';
import { Suspense } from 'react';

SplashScreen.preventAutoHideAsync();

let db: SQLiteDatabase;

(async () => {
  db = await SQLite.openDatabaseAsync('test.db');
})();

const init = async () => {
  try {
    if (true) {
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS mood_entery (id INTEGER PRIMARY KEY NOT NULL, mood INTEGER NOT NULL, moodDate DATE NOT NULL UNIQUE);
      `);
      // await db.runAsync('INSERT INTO mood_entery (mood, moodDate) VALUES (?, ?)', 1, '2022-01-01');
      // await db.runAsync('INSERT INTO mood_entery (mood, moodDate) VALUES (?, ?)', 4, '2022-01-02');
      console.log('migrateDbIfNeeded', 'migrated to version 1');
    }
  } catch (error) {
    console.error('migrateDbIfNeeded', error);
  }
};

export default function App() {

  const [fontsLoaded, fontError] = useFonts({
    'Roboto-Light': require('./src/assets/fonts/Roboto-Light.ttf'),
    'Roboto-Regular': require('./src/assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Bold': require('./src/assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Medium': require('./src/assets/fonts/Roboto-Medium.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const Tab = createBottomTabNavigator();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Suspense>
        <SQLiteProvider databaseName="test.db" onInit={init} useSuspense>
          <BottomSheetModalProvider>
            <SafeAreaView
              onLayout={onLayoutRootView}
              style={{
                flex: 1,
              }}
            >
              <NavigationContainer>
                <Tab.Navigator screenOptions={{
                  tabBarShowLabel: false,
                  headerShown: false,
                  tabBarStyle: {
                    backgroundColor: colors.primary,
                    borderTopColor: colors.tertiary,
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    left: 0,
                    elevation: 0,
                    height: 60,
                  },
                }}
                >
                  <Tab.Screen
                    name="Calendar"
                    component={CalendarScreen}
                    options={{
                      tabBarIcon: ({ focused }) => (
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Ionicons name="calendar-outline" size={sizes.xl} color={focused ? colors.specialLight : colors.white} />
                          <Text style={{
                            color: focused ? colors.specialLight : colors.white,
                            fontSize: sizes.ten,
                            paddingTop: sizes.four,
                          }}
                          >
                            Calendar
                          </Text>
                        </View>
                      ),
                    }}
                  />
                  <Tab.Screen
                    name="Statistics"
                    component={StatisticsScreen}
                    options={{
                      tabBarIcon: ({ focused }) => (
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Ionicons name="stats-chart-outline" size={sizes.xl} color={focused ? colors.specialLight : colors.white} />
                          <Text style={{
                            color: focused ? colors.specialLight : colors.white,
                            fontSize: sizes.ten,
                            paddingTop: sizes.four,
                          }}
                          >
                            Statistics
                          </Text>
                        </View>
                      ),
                    }}
                  />
                  <Tab.Screen
                    name="Premium"
                    component={PremiumScreen}
                    options={{
                      tabBarIcon: ({ focused }) => (
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Ionicons name="diamond-outline" size={sizes.xl} color={focused ? colors.specialLight : colors.white} />
                          <Text style={{
                            color: focused ? colors.specialLight : colors.white,
                            fontSize: sizes.ten,
                            paddingTop: sizes.four,
                          }}
                          >
                            Premium
                          </Text>
                        </View>
                      ),
                    }}
                  />
                  <Tab.Screen
                    name="Settings"
                    component={OptionsScreen}
                    options={{
                      tabBarIcon: ({ focused }) => (
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Ionicons name="settings-outline" size={sizes.xl} color={focused ? colors.specialLight : colors.white} />
                          <Text style={{
                            color: focused ? colors.specialLight : colors.white,
                            fontSize: sizes.ten,
                            paddingTop: sizes.four,
                          }}
                          >
                            Settings
                          </Text>
                        </View>
                      ),
                    }}
                  />
                </Tab.Navigator>
              </NavigationContainer>
            </SafeAreaView>
          </BottomSheetModalProvider>
        </SQLiteProvider>
      </Suspense>
    </GestureHandlerRootView>
  );
};