import { NavigationContainerRef } from '@react-navigation/native';
import React from 'react';
import { NavigationTarget, ScreenIdType, StackIdType } from './navigationConstants';

export const navigationRef = React.createRef<NavigationContainerRef<any>>();

class NavigationService {
  navigate(target: NavigationTarget | ScreenIdType, params?: any) {
    if (typeof target === 'string') {
      this.navigateInCurrentStack(target, params);
    } else {
      this.navigateToTarget(target, params);
    }
  }

  private navigateInCurrentStack(routeName: string, params?: any) {
    console.log('Navigating within current stack to:', { routeName, params });

    navigationRef.current?.navigate(routeName as string, params);
  }

  navigateToDrawerItem(stackId: StackIdType, params?: any) {
    console.log('Navigating to drawer item:', { stackId, params });

    navigationRef.current?.navigate(stackId as string, params);
  }

  private navigateToTarget(target: NavigationTarget, params?: any) {
    const { stack, screen } = target;
    navigationRef.current?.navigate(stack, {
      screen: screen,
      params,
    });
  }

  push(routeName: ScreenIdType, params?: Record<string, any>) {
    this.navigate(routeName, params);
  }

  goBack() {
    navigationRef.current?.goBack();
  }

  canGoBack(): boolean {
    return navigationRef.current?.canGoBack() ?? false;
  }
}

export default new NavigationService();
