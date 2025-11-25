import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createHeaderComponent } from '../../headerFactory.tsx';
import { INVENTORY_SCREENS } from '../inventory/InventoryNavigator.tsx';
import { ALL_ROLES, ScreenId, ScreenItem } from '../../navigationConstants.ts';
import { AttendanceScreen } from '../../../screens';
import ProfileScreen from '../../../screens/profile/ProfileScreen.tsx';
import { useAuthState, useStudentsState } from '../../../store/hooks.ts';
import ResetPasswordScreen from '../../../screens/profile/ResetPasswordScreen.tsx';

const Stack = createStackNavigator();

export const StudentProfileScreens: ScreenItem[] = [
  {
    id: ScreenId.PROFILE,
    title: 'Student Profile',
    component: ProfileScreen,
    roles: ALL_ROLES,
  },
  {
    id: ScreenId.RESET_PASSWORD,
    title: 'Reset Password',
    component: ResetPasswordScreen,
    roles: ALL_ROLES,
  },
];
export const StudentProfileNavigator: React.FC = () => {
  const { authResponse } = useAuthState();
  const { studentDetails } = authResponse?.userPermission?.userDetails?.[0];

  return (
    <Stack.Navigator>
      {StudentProfileScreens.map(screen => (
        <Stack.Screen
          name={screen.id}
          key={screen.title}
          component={screen.component}
          options={{
            header: createHeaderComponent(
              screen.id,
              screen.id === ScreenId.PROFILE
                ? `${studentDetails?.firstName || ''} ${studentDetails?.middleName || ''} ${studentDetails?.lastName || ''}`
                : undefined,
              screen.title,
              screen.id === ScreenId.PROFILE,
            ),
          }}
        />
      ))}
    </Stack.Navigator>
  );
};
