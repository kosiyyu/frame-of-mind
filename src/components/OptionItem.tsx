import React from 'react';
import { View, Text } from 'react-native';
import { IOptionData } from '@constants/optionData';
import { colors, sizes, fonts } from '@constants/styles';
import RippleEffect from '@components/RippleEffect';


interface Props {
  data: IOptionData;
}

const setBorderBottom = (index: number, length: number): number => {
  if (index === length - 1) {
    return 0;
  } else {
    return sizes.one;
  }
};

const OptionItem: React.FC<Props> = ({ data }) => {
  return (
    <View
      style={{
        alignItems: 'flex-start',
      }}
    >
      <Text
        style={{
          backgroundColor: colors.black,
          width: '100%',
          color: colors.white,
          fontSize: sizes.large,
          fontFamily: fonts.bold,
          paddingTop: sizes.xl,
          paddingBottom: sizes.base,
          paddingHorizontal: sizes.base,
        }}
      >
        {data.title}
      </Text>
      <View style={{
        width: '100%',
        borderWidth: sizes.one,
        borderTopColor: colors.tertiary,
        borderBottomColor: colors.tertiary,
        backgroundColor: colors.secondary,
      }}>
        {data.optionArray.map((option, index) => (
          <View key={index}>
            <RippleEffect key={index}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  padding: sizes.medium,
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontSize: sizes.medium,
                    fontFamily: fonts.regular,
                  }}
                >
                  {option}
                </Text>
              </View>
            </RippleEffect>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  borderBottomWidth: setBorderBottom(index, data.optionArray.length),
                  borderBottomColor: colors.tertiary,
                  height: sizes.one,
                  width: '95%',
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default OptionItem;