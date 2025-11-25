import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { theme } from '../../theme';
import BaseScreen from '../../components/ui/BaseScreen.tsx';
import { BodyText, Button, Caption, Heading2, TextInput } from '../../components/ui';

interface ForgotPasswordScreenProps {
  navigation: any;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual password reset logic here
      // For now, we'll simulate a successful password reset request
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Success', 'Password reset instructions have been sent to your email.', [
          { text: 'OK', onPress: () => navigation.replace('Login') },
        ]);
      }, 1000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to send reset email. Please try again.');
    }
  };

  return (
    <BaseScreen style={styles.container}>
      <View style={styles.scrollContainer}>
        <View style={styles.header}>
          <Heading2>Reset Password</Heading2>
          <BodyText style={styles.subtitle}>
            Enter your email address and we'll send you instructions to reset your password.
          </BodyText>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              inputType={'email'}
              label={'Email address'}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Button
            title={'Reset Password'}
            onPress={handleResetPassword}
            disabled={loading}
            loading={loading}
          />

          <View style={styles.backToLoginContainer}>
            <Caption style={styles.backToLoginText}>Remember your password? </Caption>
            <Button
              title={'Sign in'}
              variant={'text'}
              size={'small'}
              style={{ paddingHorizontal: theme.spacing.xs, paddingVertical: theme.spacing.none }}
              onPress={() => navigation.replace('Login')}
            />
          </View>
        </View>
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
  },
  scrollContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  resetButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backToLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  backToLoginText: {
    color: theme.colors.text.primary,
    fontSize: 14,
  },
  backToLoginLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;
