import React from 'react';
import { View, TouchableNativeFeedback } from 'react-native';

import { colors } from '../theme';

export default function Touchable({ onPress, ...props }) {
  const background = TouchableNativeFeedback.Ripple(colors.white);

  return (
    <TouchableNativeFeedback {...{ onPress, background }}>
      <View {...props} />
    </TouchableNativeFeedback>
  );
}
