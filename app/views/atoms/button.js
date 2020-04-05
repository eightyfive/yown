import React, { Fragment } from 'react';
import { Platform, Text, StyleSheet } from 'react-native';

import Theme, { colors, s } from '../theme';
import ActivityIndicator from './activity-indicator';
import Touchable from './touchable';

const isAndroid = Platform.OS === 'android';

export default function Button({
  compact = false,
  children: title,
  disabled = false,
  loading = false,
  mode = 'contained',
  onPress,
  style,
}) {
  const container = [
    styles.container.default,
    compact && styles.container.compact,
    disabled && styles.container.disabled,
    mode === 'text' && styles.container.link,
    style,
  ];

  const text = [
    styles.text.default,
    compact && styles.text.compact,
    mode === 'text' && styles.text.link,
    disabled && styles.text.disabled,
  ];

  const props = {
    onPress,
    disabled: disabled || loading,
  };

  return (
    <Touchable {...props} style={container}>
      <Fragment>
        {loading && <ActivityIndicator />}
        {!loading && (
          <Text style={text}>
            {isAndroid || compact ? title.toUpperCase() : title}
          </Text>
        )}
      </Fragment>
    </Touchable>
  );
}

const styles = {
  container: {
    default: {
      ...s.row5,
      padding: 12,
      borderRadius: Theme.roundness,
      backgroundColor: colors.primary,
      elevation: isAndroid ? 3 : 0,
    },
    compact: {
      padding: 6,
    },
    link: {
      backgroundColor: 'transparent',
    },
    disabled: {
      opacity: 0.8,
      backgroundColor: 'lightgrey', // TODO: Better "disabled" style
    },
  },
  text: {
    default: {
      textAlign: 'center',
      color: colors.white,
      fontSize: 17,
      fontWeight: isAndroid ? 'bold' : '600', // Semibold
    },
    compact: {
      fontSize: 13,
    },
    link: {
      color: colors.primary,
    },
    disabled: {
      color: colors.disabled,
    },
  },
};
