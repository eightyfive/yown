import React from 'react';
import { StyleSheet, Text as RNText } from 'react-native';

import { colors } from '../theme';

const styles = StyleSheet.create({
  text: {
    color: colors.text,
  },
});

export default function Text({ style, ...rest }) {
  return <RNText {...rest} style={[styles.text, style]} />;
}
