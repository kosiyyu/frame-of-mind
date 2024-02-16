import React from 'react';
import { FlatList, StatusBar } from 'react-native';
import OptionItem from 'src/components/OptionItem';
import optionData from '@constants/optionData';
import OptionHeader from '@components/OptionHeader';

const Options: React.FC = () => {
  return (
    <>
      <StatusBar />
      <FlatList
        data={optionData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OptionItem data={item} />}
        ListHeaderComponent={() => <OptionHeader />}
      />
    </>
  );
};

export default Options;