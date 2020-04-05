import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { s } from '../theme';

const styles = StyleSheet.create({
  outer: {
    flex: 1,
  },
  container: {
    ...s.p3,
    flexGrow: 1,
  },
});

export default function Content({ style, ...rest }) {
  return (
    <SafeAreaView style={styles.outer}>
      <ScrollView contentContainerStyle={[styles.container, style]} {...rest} />
    </SafeAreaView>
  );
}
