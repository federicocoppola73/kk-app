import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { SupportedLocale } from '../i18n/locales';
import { colors } from '../theme/colors';
import { continueAsGuest, registerWithEmail, signInWithEmail } from '../services/auth';

type Mode = 'choice' | 'login' | 'register';

type Props = {
  locale: SupportedLocale;
  onAuthenticated: () => void;
};

export default function AuthScreen({ locale, onAuthenticated }: Props) {
  const italian = locale === 'it';
  const [mode, setMode] = useState<Mode>('choice');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const copy = {
    eyebrow: italian ? 'BENVENUTO NEL GIOCO' : 'WELCOME TO THE GAME',
    title: italian ? 'ENTRA IN PARTITA.' : 'GET IN THE GAME.',
    subtitle: italian ? 'Accedi per salvare i tuoi progressi e scalare la classifica.' : 'Sign in to save your progress and climb the leaderboard.',
    guest: italian ? 'CONTINUA COME OSPITE' : 'CONTINUE AS GUEST',
    login: italian ? 'ACCEDI' : 'LOG IN',
    register: italian ? 'CREA ACCOUNT' : 'CREATE ACCOUNT',
    email: italian ? 'EMAIL' : 'EMAIL',
    nickname: italian ? 'NICKNAME' : 'NICKNAME',
    password: italian ? 'PASSWORD' : 'PASSWORD',
    confirm: italian ? 'CONFERMA PASSWORD' : 'CONFIRM PASSWORD',
    submitLogin: italian ? 'ACCEDI' : 'LOG IN',
    submitRegister: italian ? 'CREA ACCOUNT' : 'CREATE ACCOUNT',
    back: italian ? 'INDIETRO' : 'BACK',
    switchLogin: italian ? 'Hai già un account? Accedi' : 'Already have an account? Log in',
    switchRegister: italian ? 'Non hai un account? Registrati' : "Don't have an account? Sign up",
    guestNote: italian ? 'Potrai creare un account in seguito e conservare i tuoi progressi.' : 'You can create an account later and keep your progress.',
    footer: 'KNOW THE GAME. OWN THE GAME.',
    passwordMismatch: italian ? 'Le password non coincidono.' : 'Passwords do not match.',
    required: italian ? 'Compila tutti i campi richiesti.' : 'Please complete all required fields.',
    genericError: italian ? 'Operazione non riuscita. Controlla i dati e riprova.' : 'Something went wrong. Check your details and try again.',
  };

  const friendlyError = (reason: unknown) => {
    const code = typeof reason === 'object' && reason !== null && 'code' in reason
      ? String((reason as { code: unknown }).code)
      : '';
    if (code.includes('invalid-email')) return italian ? 'Indirizzo email non valido.' : 'Invalid email address.';
    if (code.includes('user-not-found') || code.includes('invalid-credential') || code.includes('wrong-password')) return italian ? 'Email o password non corretti.' : 'Incorrect email or password.';
    if (code.includes('email-already-in-use')) return italian ? 'Questa email è già associata a un account.' : 'This email is already in use.';
    if (code.includes('weak-password')) return italian ? 'La password deve contenere almeno 6 caratteri.' : 'Password must be at least 6 characters.';
    if (code.includes('network-request-failed')) return italian ? 'Connessione assente. Controlla Internet.' : 'Network error. Check your connection.';
    if (code.includes('operation-not-allowed')) return italian ? 'Questo metodo di accesso non è attivo in Firebase.' : 'This sign-in method is not enabled in Firebase.';
    return copy.genericError;
  };

  const run = async (action: () => Promise<void>) => {
    setError('');
    setBusy(true);
    try {
      await action();
      onAuthenticated();
    } catch (reason) {
      setError(friendlyError(reason));
    } finally {
      setBusy(false);
    }
  };

  const submit = () => {
    if (!email.trim() || !password || (mode === 'register' && !nickname.trim())) {
      setError(copy.required);
      return;
    }
    if (mode === 'register' && password !== confirmPassword) {
      setError(copy.passwordMismatch);
      return;
    }
    if (mode === 'register') {
      void run(() => registerWithEmail(email, nickname, password));
    } else {
      void run(() => signInWithEmail(email, password));
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.brandRow}>
            <Text style={styles.brand}>KIT <Text style={styles.brandAccent}>&</Text> KICK</Text>
            <Text style={styles.kicker}>FOOTBALL QUIZ & GAMING</Text>
          </View>

          <View style={styles.hero}>
            <View style={styles.ballMark}><Text style={styles.ball}>⚽</Text></View>
            <Text style={styles.eyebrow}>{copy.eyebrow}</Text>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.subtitle}>{copy.subtitle}</Text>
          </View>

          {mode === 'choice' ? (
            <View style={styles.actions}>
              <Pressable disabled={busy} onPress={() => void run(continueAsGuest)} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed, busy && styles.disabled]}>
                {busy ? <ActivityIndicator color={colors.midnightNavy} /> : <Text style={styles.primaryText}>{copy.guest}</Text>}
              </Pressable>
              <Pressable onPress={() => { setError(''); setMode('login'); }} style={styles.secondaryButton}>
                <Text style={styles.secondaryText}>{copy.login}</Text>
              </Pressable>
              <Pressable onPress={() => { setError(''); setMode('register'); }} style={styles.outlineButton}>
                <Text style={styles.outlineText}>{copy.register}</Text>
              </Pressable>
              <Text style={styles.note}>{copy.guestNote}</Text>
            </View>
          ) : (
            <View style={styles.form}>
              <Pressable onPress={() => { setError(''); setMode('choice'); }} style={styles.backButton}>
                <Text style={styles.backText}>‹  {copy.back}</Text>
              </Pressable>
              {mode === 'register' && (
                <>
                  <Text style={styles.fieldLabel}>{copy.nickname}</Text>
                  <TextInput value={nickname} onChangeText={setNickname} placeholder={copy.nickname} placeholderTextColor="#7186A1" autoCapitalize="words" maxLength={24} style={styles.input} />
                </>
              )}
              <Text style={styles.fieldLabel}>{copy.email}</Text>
              <TextInput value={email} onChangeText={setEmail} placeholder="name@example.com" placeholderTextColor="#7186A1" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} textContentType="emailAddress" style={styles.input} />
              <Text style={styles.fieldLabel}>{copy.password}</Text>
              <TextInput value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor="#7186A1" secureTextEntry textContentType={mode === 'register' ? 'newPassword' : 'password'} style={styles.input} />
              {mode === 'register' && (
                <>
                  <Text style={styles.fieldLabel}>{copy.confirm}</Text>
                  <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="••••••••" placeholderTextColor="#7186A1" secureTextEntry textContentType="newPassword" style={styles.input} />
                </>
              )}
              <Pressable disabled={busy} onPress={submit} style={({ pressed }) => [styles.primaryButton, styles.formSubmit, pressed && styles.pressed, busy && styles.disabled]}>
                {busy ? <ActivityIndicator color={colors.midnightNavy} /> : <Text style={styles.primaryText}>{mode === 'register' ? copy.submitRegister : copy.submitLogin}</Text>}
              </Pressable>
              <Pressable onPress={() => { setError(''); setMode(mode === 'login' ? 'register' : 'login'); }} style={styles.switchButton}>
                <Text style={styles.switchText}>{mode === 'login' ? copy.switchRegister : copy.switchLogin}</Text>
              </Pressable>
            </View>
          )}

          {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <Text style={styles.footer}>{copy.footer}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.midnightNavy },
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: (StatusBar.currentHeight ?? 0) + 22, paddingBottom: 46, justifyContent: 'space-between' },
  brandRow: { alignItems: 'center' },
  brand: { color: colors.white, fontSize: 25, fontWeight: '900', letterSpacing: 2 },
  brandAccent: { color: colors.iceBlue },
  kicker: { color: colors.muted, fontSize: 9, fontWeight: '800', letterSpacing: 2, marginTop: 5 },
  hero: { alignItems: 'center', marginTop: 30, marginBottom: 28 },
  ballMark: { width: 66, height: 66, borderRadius: 22, backgroundColor: '#142F4D', borderWidth: 1, borderColor: '#28527A', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  ball: { fontSize: 32 },
  eyebrow: { color: colors.gold, fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  title: { color: colors.white, fontSize: 30, lineHeight: 36, fontWeight: '900', textAlign: 'center', marginTop: 10 },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 10, maxWidth: 300 },
  actions: { gap: 12, marginTop: 8 },
  primaryButton: { minHeight: 54, borderRadius: 14, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  primaryText: { color: colors.midnightNavy, fontSize: 13, fontWeight: '900', letterSpacing: 0.8 },
  secondaryButton: { minHeight: 52, borderRadius: 14, backgroundColor: colors.electricBlue, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: colors.white, fontSize: 13, fontWeight: '900', letterSpacing: 0.8 },
  outlineButton: { minHeight: 52, borderRadius: 14, borderWidth: 1, borderColor: colors.iceBlue, alignItems: 'center', justifyContent: 'center' },
  outlineText: { color: colors.iceBlue, fontSize: 13, fontWeight: '900', letterSpacing: 0.8 },
  note: { color: colors.muted, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 3 },
  form: { gap: 9, marginTop: 2 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 5, marginBottom: 5 },
  backText: { color: colors.iceBlue, fontSize: 12, fontWeight: '800' },
  fieldLabel: { color: colors.gold, fontSize: 10, fontWeight: '900', letterSpacing: 1, marginTop: 4 },
  input: { minHeight: 49, borderRadius: 12, borderWidth: 1, borderColor: '#294968', backgroundColor: colors.surface, color: colors.white, paddingHorizontal: 14, fontSize: 14 },
  formSubmit: { marginTop: 12 },
  switchButton: { alignItems: 'center', paddingVertical: 10 },
  switchText: { color: colors.iceBlue, fontSize: 12, fontWeight: '700' },
  error: { color: '#FF8D8D', backgroundColor: '#3A202A', borderRadius: 10, padding: 11, fontSize: 12, textAlign: 'center', marginTop: 14 },
  footer: { color: colors.iceBlue, fontSize: 9, fontWeight: '900', letterSpacing: 1.4, textAlign: 'center', marginTop: 30 },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.6 },
});
