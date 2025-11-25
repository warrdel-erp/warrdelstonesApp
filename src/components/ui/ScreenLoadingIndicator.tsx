import React from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import theme from '../../theme';
import { Heading6 } from './Typography.tsx';

export type ScreenLoadingIndicatorProps = {
  title?: string
}

export const ScreenLoadingIndicator: React.FC<ScreenLoadingIndicatorProps> = (props) => {
  return <View style={{flex:1,gap: theme.spacing.lg, position:'absolute', height: Dimensions.get('window').height - 80 , top:0, left:0, right:0, bottom:0, justifyContent:'center', alignItems:'center',zIndex: 1000, backgroundColor:'rgba(0,0,0,0.3)'}}>
    <ActivityIndicator color={theme.colors.primary} />
    <Heading6>{props.title || 'Loading...'}</Heading6>
  </View>
}