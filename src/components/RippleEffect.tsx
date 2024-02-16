import React from 'react';
import { View, TouchableNativeFeedback, StyleProp, ViewStyle } from 'react-native';
import { colors } from '@constants/styles';

interface RippleEffectProps {
  children: React.ReactNode;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const RippleEffect: React.FC<RippleEffectProps> = ({children, color = colors.specialLight, style, ...props}) => {
  return (
    <View style={style}>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple(color, false)}
        {...props}
      >
        {children}
      </TouchableNativeFeedback>
    </View>
  );
};

export default RippleEffect;