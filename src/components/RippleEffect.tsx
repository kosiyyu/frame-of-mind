import React from 'react';
import { View, TouchableNativeFeedback, StyleProp, ViewStyle } from 'react-native';
import { colors } from '@constants/styles';

interface RippleEffectProps {
  children: React.ReactNode;
  color?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const RippleEffect: React.FC<RippleEffectProps> = ({children, color = colors.specialLight, style, onPress, ...props}) => {
  return (
    <View style={style}>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple(color, false)}
        onPress={onPress}
        {...props}
      >
        {children}
      </TouchableNativeFeedback>
    </View>
  );
};

export default RippleEffect;