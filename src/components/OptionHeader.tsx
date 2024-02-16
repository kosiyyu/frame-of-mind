import React from 'react';
import { Text, View } from 'react-native';
import OptionHeaderSvg from '@components/OptionHeaderSvg';
import { colors, sizes, fonts } from '@constants/styles';

const OptionHeader: React.FC = () => {
  return (
    <>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.black,
          position: 'relative',
        }}
      >
      <OptionHeaderSvg />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute'
          }}
        >
          <Text
            style={{
              color: colors.white,
              fontSize: sizes.xxl,
              fontFamily: fonts.bold,
              letterSpacing: sizes.two * 2,
            }}
          >
            Karol Kos
          </Text>
          <Text
            style={{
              color: colors.white,
              fontSize: sizes.xl,
              fontFamily: fonts.bold,
              letterSpacing: sizes.two,
            }}
          >
            kosiyyu@gmail.com
          </Text>
        </View>
      </View>
    </>
  );
};

export default OptionHeader;