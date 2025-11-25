import React, { useState } from 'react';
import { StyleSheet, Image, ImageBackground, ScrollView, View } from 'react-native';
import { theme } from '../../theme';
import BaseScreen from '../../components/ui/BaseScreen.tsx';
import { Container, TextInput } from '../../components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeatureCard } from '../../components/ui/FeatureCard.tsx';
import { showErrorToast } from '../../utils';
import { services } from '../../network';
import { useAuthActions } from '../../hooks';
import { ApiResponse } from '../../network/types/ApiResponseTypes.ts';
import { AuthResponse } from '../../network/services/AuthService.ts';
import Button from '../../components/ui/Button.tsx';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('User@gmail.com');
  const [password, setPassword] = useState('user');
  const [loading, setLoading] = useState(false);
  const useInsets = useSafeAreaInsets();
  const authActions = useAuthActions();

  const handleLogin = async () => {
    if (!email || !password) {
      showErrorToast('Please enter both email and password.');
      return;
    }
    setLoading(true);
    const response = await services.auth.login({ email, password });
    handleLoginResponse(response);
    setLoading(false);
  };

  const handleLoginResponse = (response: ApiResponse<AuthResponse>) => {
    if (response.success && response.data) {
      const loginResponse = response.data;
      if (loginResponse.success) {
        authActions.loginUser(loginResponse);
      } else {
        showErrorToast(loginResponse.message);
      }
    } else {
      showErrorToast(response.error?.message?.[0] || 'Login failed');
    }
  };

  return (
    <BaseScreen scrollable={true} style={{ backgroundColor: theme.colors.background }}>
      <View
        style={{
          paddingTop: useInsets.top + theme.spacing.lg,
          paddingBottom: theme.spacing.md,
          backgroundColor: theme.colors.primaryLight,
          borderBottomStartRadius: theme.borderRadius.lg,
          borderBottomEndRadius: theme.borderRadius.lg,
        }}>
        <Image
          source={require('../../assets/images/brand_logo_full.png')}
          style={{ height: 50, alignSelf: 'center', marginBottom: theme.spacing.md }}
          resizeMode={'contain'}
        />
        <FeatureCard
          title={'Streamline Operations'}
          description={'Improve accuracy, control and productivity throughout multiple locations.'}
          iconName={'assured-workload'}
        />
        <FeatureCard
          title={'Track Inventory'}
          description={'Efficient slab Inventory tracking from size to stages'}
          iconName={'shuffle'}
        />
        <FeatureCard
          title={'Schedule deliveries'}
          description={'Schedule your delivery and returns with ease'}
          iconName={'calendar-today'}
        />
        <FeatureCard
          title={'Accounting & reports'}
          description={'Manage your books and ledger all from one place'}
          iconName={'book'}
        />
      </View>

      <Container style={styles.scrollContainer}>
        <TextInput
          label={'Email'}
          placeholder={'Enter your email'}
          value={email}
          onChangeText={setEmail}
          inputType={'email'}
        />
        <TextInput
          label={'Password'}
          containerStyle={{ marginTop: theme.spacing.md }}
          value={password}
          onChangeText={setPassword}
        />
        <Button
          title={'Forgot Password?'}
          variant={'text'}
          size={'small'}
          style={styles.forgotPassword}
          onPress={() => navigation.replace('ForgotPassword')}></Button>

        <Button
          variant={'primary'}
          title={'Sign In'}
          onPress={handleLogin}
          loading={loading}></Button>
      </Container>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: theme.colors.text.onPrimary,
  },
  subtitle: {
    color: theme.colors.text.onSurface,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
    alignItems: 'center',
  },
  signupText: {
    color: theme.colors.text.primary,
    fontSize: 14,
  },
  signupLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;
