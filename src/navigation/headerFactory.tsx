import React from 'react';
import { ScreenId, ScreenIdType, StackIdType } from './navigationConstants';
import DefaultHeader from '../components/DefaultHeader';
import { HomeScreenHeader } from '../components/HomeScreenHeader.tsx';
import theme from '../theme';
import MultiActionsHeader from '../components/MultiActionsHeader.tsx';
import { SearchBarHeader } from '../components/SearchBarHeader.tsx';

export const createHeaderComponent = (
  routeId: ScreenIdType | StackIdType,
  title?: string,
  subtitle?: string,
  showMenuButton: boolean = false,
) => {
  return ({ navigation, route }: { navigation: any; route: any }) => {
    const onBackPress = route?.params?.onBackPress;

    switch (routeId) {
      case ScreenId.HOME:
        return <HomeScreenHeader navigation={navigation} />;
      case ScreenId.NOTICE_BOARD:
        return (
          <MultiActionsHeader
            title={title}
            subtitle={subtitle}
            icons={[]}
            navigation={navigation}
            onBackPress={onBackPress}
          />
        );
      case ScreenId.STUDENT_LIST:
        return (
          <SearchBarHeader
            title={title}
            subtitle={subtitle}
            navigation={navigation}
            showMenuButton={showMenuButton}
          />
        );
      default:
        return (
          <DefaultHeader
            title={title}
            showMenuButton={showMenuButton}
            subtitle={subtitle}
            navigation={navigation}
            onBackPress={onBackPress}
          />
        );
    }
  };
};
