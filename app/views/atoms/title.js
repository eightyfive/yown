import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { colors } from '../theme';

const styles = StyleSheet.create({
  text: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default function Title({ style, ...rest }) {
  return <Text {...rest} style={[styles.text, style]} />;
}
