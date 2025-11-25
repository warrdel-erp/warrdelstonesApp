import React from 'react';
import theme from '../../theme';
import { Image } from 'react-native';
import { Heading4 } from './Typography.tsx';
import { Container } from './index.tsx';

export const EmptyList: React.FC<{message?: string}> = ({message = "No data available"}) => {
  return <Container style={{flex:1, justifyContent:'center', alignItems:'center', padding: theme.spacing.lg}}>
    <Image
      source={require('../../assets/images/empty-box.png')}
      resizeMode={'center'}
    />
    <Heading4 color={theme.colors.text.caption} >{message}</Heading4>
  </Container>
}