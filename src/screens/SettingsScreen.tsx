import React, { useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import type { User } from 'firebase/auth';
import { colors } from '../theme/colors';
import type { SupportedLocale } from '../i18n/locales';
import { translations } from '../i18n/translations';
import { registerWithEmail } from '../services/auth';

type Props = {
  locale: SupportedLocale;
  selectedLocale: SupportedLocale | null;
  authUser: User;
  onChangeLocale: (locale: SupportedLocale | null) => void;
  onBack: () => void;
};

const languages: { code: SupportedLocale | null; label: string; nativeLabel: string }[] = [
  { code: null, label: 'Automatic', nativeLabel: 'Automatica' },
  { code: 'it', label: 'Italiano', nativeLabel: 'Italiano' },
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'es', label: 'Español', nativeLabel: 'Español' },
  { code: 'fr', label: 'Français', nativeLabel: 'Français' },
  { code: 'de', label: 'Deutsch', nativeLabel: 'Deutsch' },
];

export default function SettingsScreen({ locale, selectedLocale, authUser, onChangeLocale, onBack }: Props) {
  const t = translations[locale];
  const italian = locale === 'it';
  const [showRegistration, setShowRegistration] = useState(false);
  const [nickname, setNickname] = useState(authUser.displayName?.startsWith('Guest_') ? '' : authUser.displayName ?? '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [linked, setLinked] = useState(false);

  const copy = {
    account: italian ? 'ACCOUNT' : 'ACCOUNT',
    guest: italian ? 'Stai giocando come ospite' : 'You are playing as a guest',
    registered: italian ? 'Account registrato' : 'Registered account',
    guestInfo: italian ? 'Crea un account per collegare un’email e una password alla tua identità ospite. Il collegamento mantiene lo stesso UID Firebase.' : 'Create an account to link an email and password to your guest identity. Linking preserves the same Firebase UID.',
    create: italian ? 'CREA ACCOUNT E CONSERVA L’IDENTITÀ' : 'CREATE ACCOUNT & KEEP IDENTITY',
    nickname: italian ? 'NICKNAME' : 'NICKNAME',
    email: 'EMAIL',
    password: italian ? 'PASSWORD' : 'PASSWORD',
    confirm: italian ? 'CONFERMA PASSWORD' : 'CONFIRM PASSWORD',
    submit: italian ? 'COLLEGA ACCOUNT' : 'LINK ACCOUNT',
    cancel: italian ? 'ANNULLA' : 'CANCEL',
    required: italian ? 'Compila tutti i campi.' : 'Please complete all fields.',
    mismatch: italian ? 'Le password non coincidono.' : 'Passwords do not match.',
    success: italian ? 'Account creato e collegato. La tua identità Firebase (UID) è stata mantenuta.' : 'Account created and linked. Your Firebase identity (UID) has been preserved.',
    generic: italian ? 'Registrazione non riuscita. Controlla i dati e riprova.' : 'Registration failed. Check your details and try again.',
  };

  const submitRegistration = async () => {
    setError('');
    if (!nickname.trim() || !email.trim() || !password || !confirmPassword) {
      setError(copy.required);
      return;
    }
    if (password !== confirmPassword) {
      setError(copy.mismatch);
      return;
    }
    setBusy(true);
    try {
      await registerWithEmail(email, nickname, password);
      setLinked(true);
      setShowRegistration(false);
    } catch (reason) {
      const code = typeof reason === 'object' && reason !== null && 'code' in reason
        ? String((reason as { code: unknown }).code)
        : '';
      if (code.includes('email-already-in-use')) setError(italian ? 'Questa email è già associata a un account.' : 'This email is already in use.');
      else if (code.includes('invalid-email')) setError(italian ? 'Indirizzo email non valido.' : 'Invalid email address.');
      else if (code.includes('weak-password')) setError(italian ? 'La password deve contenere almeno 6 caratteri.' : 'Password must contain at least 6 characters.');
      else if (code.includes('network-request-failed')) setError(italian ? 'Connessione assente. Controlla Internet.' : 'Network error. Check your connection.');
      else setError(copy.generic);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>‹  {t.settingsBack}</Text></Pressable>
        <Text style={styles.eyebrow}>KIT & KICK</Text>
        <Text style={styles.title}>{t.settingsTitle}</Text>

        <Text style={styles.section}>{copy.account}</Text>
        <View style={styles.accountCard}>
          <Text style={styles.accountStatus}>{authUser.isAnonymous ? copy.guest : copy.registered}</Text>
          <Text style={styles.description}>{authUser.isAnonymous ? copy.guestInfo : [authUser.displayName, authUser.email].filter(Boolean).join('\n')}</Text>
          {authUser.isAnonymous && !linked && !showRegistration && (
            <Pressable onPress={() => { setError(''); setShowRegistration(true); }} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{copy.create}</Text>
            </Pressable>
          )}
          {linked && <Text style={styles.success}>{copy.success}</Text>}
          {showRegistration && (
            <View style={styles.form}>
              <Text style={styles.fieldLabel}>{copy.nickname}</Text>
              <TextInput value={nickname} onChangeText={setNickname} placeholder={copy.nickname} placeholderTextColor="#7186A1" autoCapitalize="words" maxLength={24} style={styles.input} />
              <Text style={styles.fieldLabel}>{copy.email}</Text>
              <TextInput value={email} onChangeText={setEmail} placeholder="name@example.com" placeholderTextColor="#7186A1" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={styles.input} />
              <Text style={styles.fieldLabel}>{copy.password}</Text>
              <TextInput value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor="#7186A1" secureTextEntry style={styles.input} />
              <Text style={styles.fieldLabel}>{copy.confirm}</Text>
              <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="••••••••" placeholderTextColor="#7186A1" secureTextEntry style={styles.input} />
              <Pressable disabled={busy} onPress={() => void submitRegistration()} style={[styles.primaryButton, busy && styles.disabled]}>
                {busy ? <ActivityIndicator color={colors.midnightNavy} /> : <Text style={styles.primaryButtonText}>{copy.submit}</Text>}
              </Pressable>
              <Pressable disabled={busy} onPress={() => { setShowRegistration(false); setError(''); }} style={styles.cancelButton}>
                <Text style={styles.cancelText}>{copy.cancel}</Text>
              </Pressable>
            </View>
          )}
          {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        </View>

        <Text style={styles.section}>{t.languageSection}</Text>
        <Text style={styles.description}>{t.languageDescription}</Text>
        <View style={styles.options}>
          {languages.map((language) => {
            const selected = selectedLocale === language.code;
            return (
              <Pressable key={language.code ?? 'auto'} onPress={() => onChangeLocale(language.code)} style={[styles.option, selected && styles.optionSelected]}>
                <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{italian ? language.nativeLabel : language.label}</Text>
                <Text style={styles.radio}>{selected ? '●' : '○'}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.comingSoon}>
          <Text style={styles.section}>{t.audioSection}</Text>
          <Text style={styles.description}>{t.audioComingSoon}</Text>
        </View>
        <Text style={styles.footer}>KNOW THE GAME. OWN THE GAME.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.midnightNavy },
  container: { flexGrow: 1, padding: 22, paddingTop: (StatusBar.currentHeight ?? 0) + 12, paddingBottom: 56 },
  back: { alignSelf: 'flex-start', paddingVertical: 8, marginBottom: 24 },
  backText: { color: colors.iceBlue, fontSize: 14, fontWeight: '800' },
  eyebrow: { color: colors.iceBlue, fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  title: { color: colors.white, fontSize: 30, fontWeight: '900', marginTop: 6, marginBottom: 28 },
  section: { color: colors.gold, fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  description: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 7, marginBottom: 14 },
  accountCard: { marginTop: 12, marginBottom: 28, padding: 16, borderRadius: 14, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968' },
  accountStatus: { color: colors.white, fontSize: 15, fontWeight: '900' },
  primaryButton: { minHeight: 48, borderRadius: 12, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, marginTop: 8 },
  primaryButtonText: { color: colors.midnightNavy, fontSize: 11, fontWeight: '900', letterSpacing: 0.4, textAlign: 'center' },
  form: { gap: 8, marginTop: 12 },
  fieldLabel: { color: colors.gold, fontSize: 10, fontWeight: '900', letterSpacing: 1, marginTop: 4 },
  input: { minHeight: 47, borderRadius: 12, borderWidth: 1, borderColor: '#294968', backgroundColor: colors.surface, color: colors.white, paddingHorizontal: 14, fontSize: 14 },
  cancelButton: { alignItems: 'center', paddingVertical: 10 },
  cancelText: { color: colors.iceBlue, fontSize: 12, fontWeight: '700' },
  success: { color: '#91E3B0', fontSize: 12, lineHeight: 18, marginTop: 12 },
  error: { color: '#FF8D8D', backgroundColor: '#3A202A', borderRadius: 10, padding: 11, fontSize: 12, textAlign: 'center', marginTop: 12 },
  options: { gap: 8 },
  option: { minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: '#29415D', backgroundColor: colors.surface, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionSelected: { borderColor: colors.electricBlue, backgroundColor: '#142F4D' },
  optionLabel: { color: colors.white, fontSize: 13, fontWeight: '700' },
  optionLabelSelected: { color: colors.iceBlue },
  radio: { color: colors.iceBlue, fontSize: 18 },
  comingSoon: { marginTop: 30, padding: 16, borderRadius: 14, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968' },
  footer: { color: colors.iceBlue, fontSize: 9, fontWeight: '900', letterSpacing: 1.2, textAlign: 'center', marginTop: 30, paddingTop: 20 },
  disabled: { opacity: 0.6 },
});
