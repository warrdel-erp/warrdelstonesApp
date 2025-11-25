import React, { useEffect } from 'react';
import { ScreenId } from '../../navigation/navigationConstants.ts';
import { useScreenContext } from '../../context/ScreenContext.tsx';
import BaseScreen from '../../components/ui/BaseScreen.tsx';
import Button from '../../components/ui/Button.tsx';
import theme from '../../theme';
import TextInput from '../../components/ui/TextInput.tsx';
import Container from '../../components/ui/Container.tsx';
import { View } from 'react-native';
import { showErrorToast, showSuccessToast } from '../../utils';
import { services } from '../../network';

const ResetPasswordScreen: React.FC = ({ navigation }: any) => {
  const [emailId, setEmailId] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');

  const handleSubmit = async () => {
    // Handle password reset logic here
    if (newPassword !== confirmNewPassword) {
      showErrorToast('New passwords do not match!');
      return;
    }
    const response = await services.common.changePassword({
      email: emailId,
      oldPassword: currentPassword,
      password: newPassword,
      confirmPassword: confirmNewPassword,
    });
    if (response.success) {
      showSuccessToast('Password reset successfully!');
      navigation.goBack();
    } else {
      showErrorToast(response.error?.message[0]);
    }
  };

  return (
    <BaseScreen style={{ flex: 1, padding: theme.spacing.md }}>
      <View style={{ gap: theme.spacing.md }}>
        <TextInput
          label={'Email Id'}
          placeholder={'Enter your email id'}
          mandatory={true}
          onChangeText={setEmailId}
          value={emailId}
          inputType={'email'}
        />
        <TextInput
          label={'Current Password'}
          mandatory={true}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder={'Enter your current password'}
          inputType={'number'}
        />
        <TextInput
          label={'New Password'}
          mandatory={true}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder={'Enter new password'}
          inputType={'number'}
        />
        <TextInput
          label={'Confirm New Password'}
          mandatory={true}
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          placeholder={'Enter new password again'}
          inputType={'number'}
        />
      </View>
      <Button
        title={'Reset Password'}
        onPress={handleSubmit}
        disabled={!emailId || !currentPassword || !newPassword || !confirmNewPassword}
        style={{ marginTop: theme.spacing.lg }}
        variant={'outline'}
      />
    </BaseScreen>
  );
};

export default ResetPasswordScreen;
