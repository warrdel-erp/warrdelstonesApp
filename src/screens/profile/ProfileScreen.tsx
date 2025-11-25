import React, { useEffect, useCallback, useMemo } from 'react';
import BaseScreen from '../../components/ui/BaseScreen.tsx';
import theme from '../../theme';
import { Heading6, ImageLoader, LabelValue } from '../../components/ui';
import { View } from 'react-native';
import Tabs from '../../components/ui/Tabs.tsx';
import PagerView from 'react-native-pager-view';
import { services } from '../../network';
import { ScreenProps } from '../../types/NavigationTypes.ts';

type ProfileScreenProps = ScreenProps<{ studentId?: number }>;

const ProfileScreen: React.FC<ProfileScreenProps> = (props: ProfileScreenProps) => {
  return (
    <BaseScreen style={{ flex: 1 }}>
      <View style={headerStyle}>
        <Heading6>Profile</Heading6>
      </View>
    </BaseScreen>
  );
};

export default ProfileScreen;
