import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ALL_ROLES, ScreenId, ScreenItem } from '../../navigationConstants.ts';
import { createHeaderComponent } from '../../headerFactory.tsx';
import ProfileScreen from '../../../screens/profile/ProfileScreen.tsx';
import { TempScreen } from '../../../screens/TempScreen.tsx';

const Stack = createStackNavigator();

export const RETURNS_SCREENS: ScreenItem[] = [
  {
    id: ScreenId.RETURNS_LIST,
    title: 'All Returns',
    parentStack: 'Returns',
    component: TempScreen,
    roles: ALL_ROLES,
    isRoot: true,
  },
];

export const ReturnsNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      {RETURNS_SCREENS.map(screen => (
        <Stack.Screen
          name={screen.id}
          key={screen.title}
          component={screen.component}
          options={{
            header: createHeaderComponent(
              screen.id,
              'Returns',
              screen.title,
              screen.isRoot,
            ),
          }}
        />
      ))}
    </Stack.Navigator>
  );
};
