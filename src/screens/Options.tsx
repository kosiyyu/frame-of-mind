import React from 'react';
import { View, Text, FlatList } from 'react-native';
import OptionItem from 'src/components/OptionItem';
import optionData from '@constants/optionData';

const Options: React.FC = () => {
  return (
    <>
      <FlatList
        data={optionData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OptionItem data={item} />}
        ListHeaderComponent={() => <View><Text>Header</Text></View>}
        ListFooterComponent={() => <View><Text>Footer</Text></View>}
      />
    </>
  );
};

export default Options;