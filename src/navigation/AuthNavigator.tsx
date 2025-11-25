import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false, // Hide headers for auth screens
      }}
      initialRouteName="Login">
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
