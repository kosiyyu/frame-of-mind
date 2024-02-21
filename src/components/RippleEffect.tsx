import React from 'react';
import { View, TouchableNativeFeedback, StyleProp, ViewStyle } from 'react-native';
import { colors } from '@constants/styles';

interface RippleEffectProps {
  children: React.ReactNode;
  color?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  isDisabled?: boolean;
}

const RippleEffect: React.FC<RippleEffectProps> = ({ children, color = colors.specialLight, style, onPress, isDisabled = false, ...props }) => {
  return (
    <View style={style}>
      {isDisabled ? (
        <View {...props}>
          {children}
        </View>
      ) : (
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple(color, false)}
          onPress={onPress}
          {...props}
        >
          {children}
        </TouchableNativeFeedback>
      )}
    </View>
  );
};

export default RippleEffect;