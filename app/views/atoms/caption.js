import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { colors } from '../theme';

const styles = StyleSheet.create({
  text: {
    color: colors.disabled,
    fontSize: 13,
  },
});

export default function Caption({ style, ...rest }) {
  return <Text {...rest} style={[styles.text, style]} />;
}
