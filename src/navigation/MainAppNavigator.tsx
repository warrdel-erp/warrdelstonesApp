import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import StaffNavigator from './StaffNavigator';

function MainAppNavigator() {
  const { loading } = useAuthContext();

  if (loading) {
    return null;
  }

  return <StaffNavigator />;
}

export default MainAppNavigator;
