import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import StaffNavigator from './StaffNavigator.tsx';
import StudentNavigator from './StudentNavigator.tsx';

function MainAppNavigator() {
  const { loading, authState } = useAuthContext();

  if (loading) {
    return null;
  }

  return !authState?.user?.email ? <StaffNavigator /> : <StudentNavigator />;
}

export default MainAppNavigator;
