import React from 'react';
import { ActivityIndicator as RNActivityIndicator } from 'react-native';

export default function ActivityIndicator({ color = 'white', large = false, ...rest }) {
  const size = large ? 'large' : 'small';

  return <RNActivityIndicator {...{ color, size, ...rest }} />;
}