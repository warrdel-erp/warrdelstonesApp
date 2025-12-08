import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import DrawerNavigator from './DrawerNavigator.tsx';

function MainAppNavigator() {
  const { loading, authState } = useAuthContext();

  if (loading) {
    return null;
  }

  return <DrawerNavigator />;
}

export default MainAppNavigator;
