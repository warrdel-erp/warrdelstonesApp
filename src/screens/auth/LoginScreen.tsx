import React, { useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  AnimatePresence,
  Input,
  Label,
  Spinner,
  Text,
  View,
  XStack,
  YStack,
} from 'tamagui';
import { useAuthActions } from '../../hooks';
import { services } from '../../network';
import { AuthResponse } from '../../network/services/AuthService.ts';
import { ApiResponse } from '../../network/types/ApiResponseTypes.ts';
import { showErrorToast } from '../../utils';

// Brand palette derived from logo
const BRAND = {
  blue: '#3B7BF7',
  blueDark: '#1A56D4',
  blueDeep: '#0E2F7A',
  blueMid: '#1E47B8',
  bgDark: '#0B1A3F',
  bgCard: '#FFFFFF',
  inputBg: '#F4F7FF',
  inputBorder: '#DDE4FF',
  inputFocus: '#3B7BF7',
  textPrimary: '#0B1A3F',
  textSecondary: '#5C6B8A',
  textMuted: 'rgba(255,255,255,0.65)',
  textOnDark: '#FFFFFF',
};

interface LoginScreenProps {
  navigation: any;
}

// ─── Floating label input ─────────────────────────────────────────────────────
interface StyledInputProps {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: RNTextInput['props']['keyboardType'];
  autoCapitalize?: RNTextInput['props']['autoCapitalize'];
  returnKeyType?: RNTextInput['props']['returnKeyType'];
  onSubmitEditing?: () => void;
  inputRef?: React.RefObject<RNTextInput | null>;
}

const StyledInputField: React.FC<StyledInputProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  returnKeyType,
  onSubmitEditing,
  inputRef,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = secureTextEntry;

  const borderColor = focused ? BRAND.inputFocus : BRAND.inputBorder;
  const borderWidth = focused ? 2 : 1.5;

  return (
    <YStack gap="$1.5">
      <Label
        fontSize={12}
        fontWeight="600"
        color={BRAND.textSecondary}
        letterSpacing={0.6}
        textTransform="uppercase">
        {label}
      </Label>
      <XStack
        alignItems="center"
        borderRadius={14}
        paddingHorizontal="$4"
        backgroundColor={BRAND.inputBg}
        borderWidth={borderWidth}
        borderColor={borderColor}
        style={{ minHeight: 52 }}>
        <Input
          ref={inputRef as any}
          flex={1}
          unstyled
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={BRAND.textSecondary + '80'}
          color={BRAND.textPrimary}
          fontSize={15}
          fontWeight="500"
          style={{ paddingVertical: 14 }}
        />
        {isPassword && (
          <Icon
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={20}
            color={BRAND.textSecondary}
            onPress={() => setShowPassword(v => !v)}
            style={{ padding: 4 }}
          />
        )}
      </XStack>
    </YStack>
  );
};

// ─── Feature row ─────────────────────────────────────────────────────────────
const FeatureRow: React.FC<{
  icon: string;
  title: string;
  desc: string;
}> = ({ icon, title, desc }) => (
  <XStack alignItems="center" gap="$3" paddingVertical="$2">
    <View
      width={38}
      height={38}
      borderRadius={10}
      alignItems="center"
      justifyContent="center"
      backgroundColor="rgba(255,255,255,0.15)">
      <Icon name={icon} size={18} color="#FFFFFF" />
    </View>
    <YStack flex={1}>
      <Text fontSize={13} fontWeight="700" color={BRAND.textOnDark} lineHeight={18}>
        {title}
      </Text>
      <Text fontSize={12} color={BRAND.textMuted} lineHeight={17} marginTop={2}>
        {desc}
      </Text>
    </YStack>
  </XStack>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('User@gmail.com');
  const [password, setPassword] = useState('user');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const authActions = useAuthActions();
  const passwordRef = useRef<RNTextInput>(null);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: BRAND.bgDark }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: BRAND.bgDark }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}>

          {/* ── Hero / Brand section ─────────────────────── */}
          <YStack
            paddingHorizontal={24}
            paddingTop={40}
            paddingBottom={36}
            style={styles.heroBg}>

            {/* Decorative circles */}
            <View style={styles.circleTopRight} />
            <View style={styles.circleBottomLeft} />


            {/* Logo Section */}
            <YStack alignItems="center" marginTop={30}>
              <Image
                source={require('../../assets/images/brand_logo_full.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </YStack>
            {/* Tagline */}
            <YStack alignItems="center" marginTop="$5" marginBottom="$7">
              <Text textAlign="center" fontSize={22} fontWeight="800" color={BRAND.textOnDark} lineHeight={30}>
                Your stone business,{'\n'}
                <Text color={BRAND.blue} fontSize={22} fontWeight="800">
                  fully connected.
                </Text>
              </Text>
            </YStack>

            {/* Feature rows */}
            {/* <YStack gap="$1">
            {FEATURES.map(f => (
              <FeatureRow key={f.icon} icon={f.icon} title={f.title} desc={f.desc} />
            ))}
          </YStack> */}
          </YStack>

          {/* ── Login card ──────────────────────────────── */}
          <YStack
            flex={1}
            backgroundColor={BRAND.bgCard}
            borderRadius={28}
            marginTop={-20}
            paddingHorizontal={24}
            paddingTop={32}
            paddingBottom={insets.bottom + 32}
            style={styles.card}>

            <Text
              fontSize={20}
              fontWeight="800"
              color={BRAND.textPrimary}
              marginBottom="$1">
              Welcome back 👋
            </Text>
            <Text fontSize={13} color={BRAND.textSecondary} marginBottom="$6" lineHeight={20}>
              Sign in to continue to SlabFlare
            </Text>

            <YStack gap="$4">
              <StyledInputField
                label="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />

              <StyledInputField
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                inputRef={passwordRef}
              />
            </YStack>

            {/* Forgot password */}
            <XStack justifyContent="flex-end" marginTop="$2">
              <Text
                fontSize={13}
                fontWeight="600"
                color={BRAND.blue}
                onPress={() => navigation.replace('ForgotPassword')}
                pressStyle={{ opacity: 0.7 }}>
                Forgot Password?
              </Text>
            </XStack>

            {/* Sign In button */}
            <View
              marginTop="$6"
              borderRadius={14}
              style={[styles.signInBtn, loading && { opacity: 0.8 }]}
              onPress={handleLogin as any}>
              <AnimatePresence>
                {loading ? (
                  <Spinner color="white" size="small" />
                ) : (
                  <XStack alignItems="center" gap="$2">
                    <Text
                      fontSize={15}
                      fontWeight="700"
                      color="white"
                      letterSpacing={0.4}>
                      Sign In
                    </Text>
                    <Icon name="arrow-forward" size={16} color="white" />
                  </XStack>
                )}
              </AnimatePresence>
            </View>

            {/* Footer */}
            <XStack justifyContent="center" marginTop="$6" alignItems="center" gap="$1.5">
              <View width={40} height={1} backgroundColor={BRAND.inputBorder} />
              <Text fontSize={11} color={BRAND.textSecondary} paddingHorizontal="$2">
                Secure sign-in powered by SlabFlare
              </Text>
              <View width={40} height={1} backgroundColor={BRAND.inputBorder} />
            </XStack>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heroBg: {
    backgroundColor: BRAND.bgDark,
    overflow: 'hidden',
  },
  circleTopRight: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: BRAND.blue,
    opacity: 0.08,
    top: -60,
    right: -60,
  },
  circleBottomLeft: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: BRAND.blueDark,
    opacity: 0.12,
    bottom: 20,
    left: -40,
  },
  logo: {
    height: 40,
    width: 160,
    // tint to white so logo is readable on dark bg
    tintColor: '#FFFFFF',
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 8,
    minHeight: 420,
  },
  signInBtn: {
    backgroundColor: BRAND.blue,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
});

export default LoginScreen;
