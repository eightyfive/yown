import React from 'react';
import { TextInput as RNTextInput, StyleSheet } from 'react-native';

import Theme, { colors, s } from '../theme';

const styles = StyleSheet.create({
  input: {
    ...s.p3,
    fontSize: 17,
    borderRadius: Theme.roundness,
    backgroundColor: colors.surface,
    color: colors.text,
  },
});

export default function TextInput({ style, ...rest }) {
  return (
    <RNTextInput
      {...rest}
      placeholderTextColor={colors.disabled}
      style={[styles.input, style]}
    />
  );
}
