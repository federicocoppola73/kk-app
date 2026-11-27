import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import type { User } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { colors } from '../theme/colors';
import type { SupportedLocale } from '../i18n/locales';
import { db } from '../services/firebase';
import type { UserProfile } from '../services/userProfile';
import { registerWithEmail } from '../services/auth';
import CountryPicker from '../components/CountryPicker';
import { getCountryName } from '../data/countries';
import { setUserCountry } from '../services/userProfile';

type Props = {
  locale: SupportedLocale;
  authUser: User;
  userProfile: UserProfile | null;
  onBack: () => void;
  onSignOut: () => void;
  onViewAllHistory: () => void;
  onViewStatistics: () => void;
};

type MatchResult = {
  id: string;
  mode: string;
  points: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: Date | null;
  verification: string;
};

const MODE_LABELS: Record<string, { it: string; en: string }> = {
  player: { it: 'Player Quiz', en: 'Player Quiz' },
  club: { it: 'Club Quiz', en: 'Club Quiz' },
  career: { it: 'Career Path', en: 'Career Path' },
  stadium: { it: 'Stadium Quiz', en: 'Stadium Quiz' },
};

export default function ProfileScreen({ locale, authUser, userProfile, onBack, onSignOut, onViewAllHistory, onViewStatistics }: Props) {
  const italian = locale === 'it';
  const [results, setResults] = useState<MatchResult[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationNickname, setRegistrationNickname] = useState(authUser.displayName?.startsWith('Guest_') ? '' : authUser.displayName ?? '');
  const [registrationCountryCode, setRegistrationCountryCode] = useState<string | null>(null);
  const [countrySaving, setCountrySaving] = useState(false);
  const [countryError, setCountryError] = useState('');
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [registrationBusy, setRegistrationBusy] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    setHistoryLoading(true);
    setHistoryError(false);

    const resultsQuery = query(
      collection(db, 'users', authUser.uid, 'results'),
      orderBy('completedAt', 'desc'),
    );

    const unsubscribe = onSnapshot(resultsQuery, (snapshot) => {
      const nextResults = snapshot.docs.map((item) => {
        const data = item.data();
        return {
          id: item.id,
          mode: typeof data.mode === 'string' ? data.mode : 'unknown',
          points: typeof data.points === 'number' ? data.points : 0,
          correctAnswers: typeof data.correctAnswers === 'number' ? data.correctAnswers : 0,
          totalQuestions: typeof data.totalQuestions === 'number' ? data.totalQuestions : 10,
          completedAt: data.completedAt instanceof Timestamp ? data.completedAt.toDate() : null,
          verification: typeof data.verification === 'string' ? data.verification : 'unverified',
        };
      });
      setResults(nextResults);
      setHistoryLoading(false);
      setHistoryError(false);
    }, (error) => {
      console.warn('Unable to load quiz history from Firestore:', error);
      setHistoryLoading(false);
      setHistoryError(true);
    });

    return unsubscribe;
  }, [authUser.uid]);

  const labels = {
    back: italian ? 'INDIETRO' : 'BACK',
    title: italian ? 'IL MIO PROFILO' : 'MY PROFILE',
    guest: italian ? 'Account ospite' : 'Guest account',
    registered: italian ? 'Account registrato' : 'Registered account',
    progression: italian ? 'PROGRESSIONE' : 'PROGRESSION',
    xp: italian ? 'XP TOTALI' : 'TOTAL XP',
    level: italian ? 'LIVELLO' : 'LEVEL',
    points: italian ? 'PUNTI TOTALI' : 'TOTAL POINTS',
    statistics: italian ? 'STATISTICHE' : 'STATISTICS',
    matches: italian ? 'PARTITE GIOCATE' : 'MATCHES PLAYED',
    correctAnswers: italian ? 'RISPOSTE CORRETTE' : 'CORRECT ANSWERS',
    accuracy: italian ? 'PRECISIONE' : 'ACCURACY',
    rank: italian ? 'POSIZIONE IN CLASSIFICA' : 'LEADERBOARD RANK',
    history: italian ? 'CRONOLOGIA PARTITE - ULTIME 5' : 'MATCH HISTORY - LAST 5',
    viewAll: italian ? 'VEDI TUTTE' : 'VIEW ALL',
    loading: italian ? 'Caricamento cronologia…' : 'Loading match history…',
    loadError: italian ? 'Impossibile caricare la cronologia. Riprova più tardi.' : 'Unable to load match history. Please try again later.',
    empty: italian ? 'Non hai ancora completato partite. Gioca una modalità per vedere qui i tuoi risultati.' : 'You have not completed any matches yet. Play a mode to see your results here.',
    unverified: italian ? 'NON VERIFICATO' : 'UNVERIFIED',
    correct: italian ? 'corrette' : 'correct',
    account: italian ? 'ACCOUNT' : 'ACCOUNT',
    signOut: ({ it: 'ESCI DALL’ACCOUNT', en: 'SIGN OUT', es: 'CERRAR SESIÓN', fr: 'SE DÉCONNECTER', de: 'ABMELDEN' } as const)[locale],
    signOutConfirmTitle: ({ it: 'Conferma disconnessione', en: 'Confirm sign out', es: 'Confirmar cierre de sesión', fr: 'Confirmer la déconnexion', de: 'Abmelden bestätigen' } as const)[locale],
    signOutConfirmMessage: ({ it: 'Vuoi davvero uscire dal tuo account?', en: 'Are you sure you want to sign out of your account?', es: '¿Seguro que quieres cerrar sesión en tu cuenta?', fr: 'Voulez-vous vraiment vous déconnecter de votre compte ?', de: 'Möchtest du dich wirklich von deinem Konto abmelden?' } as const)[locale],
    guestSignOutConfirmMessage: ({ it: 'Stai usando un account ospite. Se esci, potresti non riuscire a recuperare questa identità e i relativi progressi. Vuoi continuare?', en: 'You are using a guest account. If you sign out, you may not be able to recover this identity and its progress. Do you want to continue?', es: 'Estás usando una cuenta de invitado. Si cierras sesión, es posible que no puedas recuperar esta identidad ni su progreso. ¿Quieres continuar?', fr: 'Vous utilisez un compte invité. Si vous vous déconnectez, vous risquez de ne pas pouvoir récupérer cette identité et sa progression. Voulez-vous continuer ?', de: 'Du verwendest ein Gastkonto. Wenn du dich abmeldest, kannst du diese Identität und deinen Fortschritt möglicherweise nicht wiederherstellen. Möchtest du fortfahren?' } as const)[locale],
    confirmSignOut: ({ it: 'ESCI', en: 'SIGN OUT', es: 'CERRAR SESIÓN', fr: 'SE DÉCONNECTER', de: 'ABMELDEN' } as const)[locale],
    signOutHint: ({ it: 'Uscendo da un account ospite, non potrai recuperare questa identità automaticamente.', en: 'If you sign out from a guest account, you will not be able to restore this identity automatically.', es: 'Si cierras sesión en una cuenta de invitado, no podrás recuperar esta identidad automáticamente.', fr: 'Si vous vous déconnectez d’un compte invité, vous ne pourrez pas récupérer automatiquement cette identité.', de: 'Wenn du dich von einem Gastkonto abmeldest, kannst du diese Identität nicht automatisch wiederherstellen.' } as const)[locale],
    player: italian ? 'Giocatore' : 'Player',
    createAccount: italian ? 'CREA ACCOUNT E CONSERVA L’IDENTITÀ' : 'CREATE ACCOUNT & KEEP IDENTITY',
    guestInfo: italian ? 'Collega un’email e una password alla tua identità ospite. Il collegamento mantiene lo stesso UID Firebase e i tuoi risultati.' : 'Link an email and password to your guest identity. Linking preserves the same Firebase UID and your results.',
    nicknameLabel: 'NICKNAME',
    nationalityLabel: italian ? 'NAZIONALITÀ (FACOLTATIVA)' : 'NATIONALITY (OPTIONAL)',
    nationalitySaved: italian ? 'NAZIONALITÀ' : 'NATIONALITY',
    chooseCountry: italian ? 'Aggiungi la nazionalità' : 'Add nationality',
    countryError: italian ? 'Impossibile salvare la nazionalità. Riprova.' : 'Unable to save nationality. Please try again.',
    emailLabel: 'EMAIL',
    passwordLabel: 'PASSWORD',
    confirmLabel: italian ? 'CONFERMA PASSWORD' : 'CONFIRM PASSWORD',
    linkAccount: italian ? 'COLLEGA ACCOUNT' : 'LINK ACCOUNT',
    cancel: ({ it: 'ANNULLA', en: 'CANCEL', es: 'CANCELAR', fr: 'ANNULER', de: 'ABBRECHEN' } as const)[locale],
    required: italian ? 'Compila tutti i campi.' : 'Please complete all fields.',
    mismatch: italian ? 'Le password non coincidono.' : 'Passwords do not match.',
    linked: italian ? 'Account creato e collegato. La tua identità Firebase è stata mantenuta.' : 'Account created and linked. Your Firebase identity has been preserved.',
    generic: italian ? 'Registrazione non riuscita. Controlla i dati e riprova.' : 'Registration failed. Check your details and try again.',
  };

  const nickname = userProfile?.nickname || authUser.displayName || labels.player;
  const email = authUser.email;
  const totalPoints = results.reduce((sum, result) => sum + result.points, 0);
  const totalCorrectAnswers = results.reduce((sum, result) => sum + result.correctAnswers, 0);
  const totalQuestions = results.reduce((sum, result) => sum + result.totalQuestions, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrectAnswers / totalQuestions) * 100) : 0;
  const modeName = (mode: string) => MODE_LABELS[mode]?.[italian ? 'it' : 'en'] ?? mode;\n\n  const saveCountry = async (code: string) => {\n    setCountrySaving(true);\n    setCountryError('');\n    try {\n      await setUserCountry(authUser.uid, code);\n    } catch (reason) {\n      const message = reason instanceof Error ? reason.message : '';\n      setCountryError(message === 'country-already-set'\n        ? (italian ? 'La nazionalità è già stata impostata e non può essere modificata.' : 'Nationality has already been set and cannot be changed.')\n        : labels.countryError);\n    } finally {\n      setCountrySaving(false);\n    }\n  };

  const submitRegistration = async () => {
    setRegistrationError('');
    if (!registrationNickname.trim() || !registrationEmail.trim() || !password || !confirmPassword) {
      setRegistrationError(labels.required);
      return;
    }
    if (password !== confirmPassword) {
      setRegistrationError(labels.mismatch);
      return;
    }
    setRegistrationBusy(true);
    try {
      await registerWithEmail(registrationEmail, registrationNickname, password, registrationCountryCode ?? userProfile?.countryCode ?? null);
      setRegistrationSuccess(true);
      setShowRegistration(false);
      setPassword('');
      setConfirmPassword('');
    } catch (reason) {
      const code = typeof reason === 'object' && reason !== null && 'code' in reason
        ? String((reason as { code: unknown }).code)
        : '';
      const message = reason instanceof Error ? reason.message : '';
      if (message === 'nickname-already-taken') setRegistrationError(italian ? 'Questo nickname è già utilizzato. Scegline un altro.' : 'This nickname is already taken. Choose another one.');\n      else if (message === 'nickname-invalid-length') setRegistrationError(italian ? 'Il nickname deve contenere da 3 a 24 caratteri.' : 'Nickname must contain 3 to 24 characters.');\n      else if (code.includes('email-already-in-use')) setRegistrationError(italian ? 'Questa email è già associata a un account.' : 'This email is already in use.');
      else if (code.includes('invalid-email')) setRegistrationError(italian ? 'Indirizzo email non valido.' : 'Invalid email address.');
      else if (code.includes('weak-password')) setRegistrationError(italian ? 'La password deve contenere almeno 6 caratteri.' : 'Password must contain at least 6 characters.');
      else if (code.includes('network-request-failed')) setRegistrationError(italian ? 'Connessione assente. Controlla Internet.' : 'Network error. Check your connection.');
      else setRegistrationError(labels.generic);
    } finally {
      setRegistrationBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Pressable onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>‹  {labels.back}</Text>
        </Pressable>

        <Text style={styles.eyebrow}>KIT & KICK</Text>
        <Text style={styles.title}>{labels.title}</Text>

        <View style={styles.identityCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{nickname.slice(0, 1).toUpperCase()}</Text>
          </View>
          <View style={styles.identityCopy}>
            <Text style={styles.nickname}>{nickname}</Text>
            <Text style={styles.accountType}>{authUser.isAnonymous ? labels.guest : labels.registered}</Text>
            {!!email && <Text style={styles.email}>{email}</Text>}
          </View>
        </View>

        <Text style={styles.section}>{labels.nationalitySaved}</Text>\n        <View style={styles.infoCard}>\n          {userProfile?.countryCode ? (\n            <Text style={styles.infoText}>{getCountryName(userProfile.countryCode, locale)}</Text>\n          ) : (\n            <>\n              <Text style={styles.hint}>{labels.chooseCountry}</Text>\n              <CountryPicker locale={locale} value={null} onChange={(code) => void saveCountry(code)} />\n              {countrySaving && <ActivityIndicator color={colors.gold} style={{ marginTop: 10 }} />}\n              {!!countryError && <Text style={styles.error}>{countryError}</Text>}\n            </>\n          )}\n        </View>\n\n        <Text style={styles.section}>{labels.progression}</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userProfile?.xp.toLocaleString() ?? '—'}</Text>
            <Text style={styles.statLabel}>{labels.xp}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userProfile?.level ?? '—'}</Text>
            <Text style={styles.statLabel}>{labels.level}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalPoints.toLocaleString()}</Text>
            <Text style={styles.statLabel}>{labels.points}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.section}>{labels.statistics}</Text>
          <Pressable onPress={onViewStatistics} style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>{italian ? 'DETTAGLIO  ›' : 'DETAILS  ›'}</Text>
          </Pressable>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{results.length}</Text>
            <Text style={styles.statLabel}>{labels.matches}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalCorrectAnswers.toLocaleString()}</Text>
            <Text style={styles.statLabel}>{labels.correctAnswers}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{accuracy}%</Text>
            <Text style={styles.statLabel}>{labels.accuracy}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>—</Text>
            <Text style={styles.statLabel}>{labels.rank}</Text>
          </View>
        </View>

        <Text style={styles.section}>{labels.history}</Text>
        {historyLoading ? (
          <View style={styles.infoCard}><Text style={styles.infoText}>{labels.loading}</Text></View>
        ) : historyError ? (
          <View style={styles.infoCard}><Text style={styles.infoText}>{labels.loadError}</Text></View>
        ) : results.length === 0 ? (
          <View style={styles.infoCard}><Text style={styles.infoText}>{labels.empty}</Text></View>
        ) : (
          results.slice(0, 5).map((result) => (
            <View key={result.id} style={styles.matchCard}>
              <View style={styles.matchTop}>
                <Text style={styles.matchMode}>{modeName(result.mode)}</Text>
                <Text style={styles.matchPoints}>{result.points} {italian ? 'pt' : 'pts'}</Text>
              </View>
              <Text style={styles.matchMeta}>
                {result.correctAnswers}/{result.totalQuestions} {labels.correct}
                {result.completedAt ? `  ·  ${result.completedAt.toLocaleDateString(italian ? 'it-IT' : 'en-GB')}` : ''}
              </Text>
              <Text style={styles.verification}>{labels.unverified}</Text>
            </View>
          ))
        )}
        {!historyLoading && !historyError && results.length > 5 && (
          <Pressable onPress={onViewAllHistory} style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>{labels.viewAll}  ›</Text>
          </Pressable>
        )}

        <Text style={styles.section}>{labels.account}</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>{authUser.isAnonymous ? labels.guest : labels.registered}</Text>
          {!!email && <Text style={styles.email}>{email}</Text>}
          {authUser.isAnonymous && (
            <>
              <Text style={styles.hint}>{labels.guestInfo}</Text>
              {registrationSuccess ? (
                <Text style={styles.success}>{labels.linked}</Text>
              ) : !showRegistration ? (
                <Pressable onPress={() => { setRegistrationError(''); setShowRegistration(true); }} style={styles.createAccountButton}>
                  <Text style={styles.createAccountText}>{labels.createAccount}</Text>
                </Pressable>
              ) : (
                <View style={styles.registrationForm}>
                  <Text style={styles.fieldLabel}>{labels.nicknameLabel}</Text>
                  <TextInput value={registrationNickname} onChangeText={setRegistrationNickname} placeholder={labels.nicknameLabel} placeholderTextColor="#7186A1" autoCapitalize="words" maxLength={24} style={styles.input} />
                  {!userProfile?.countryCode && (
                    <>
                      <Text style={styles.fieldLabel}>{labels.nationalityLabel}</Text>
                      <CountryPicker locale={locale} value={registrationCountryCode} onChange={setRegistrationCountryCode} />
                    </>
                  )}
                  <Text style={styles.fieldLabel}>{labels.emailLabel}</Text>
                  <TextInput value={registrationEmail} onChangeText={setRegistrationEmail} placeholder="name@example.com" placeholderTextColor="#7186A1" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={styles.input} />
                  <Text style={styles.fieldLabel}>{labels.passwordLabel}</Text>
                  <TextInput value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor="#7186A1" secureTextEntry style={styles.input} />
                  <Text style={styles.fieldLabel}>{labels.confirmLabel}</Text>
                  <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="••••••••" placeholderTextColor="#7186A1" secureTextEntry style={styles.input} />
                  <Pressable disabled={registrationBusy} onPress={() => void submitRegistration()} style={[styles.createAccountButton, registrationBusy && styles.disabled]}>
                    {registrationBusy ? <ActivityIndicator color={colors.midnightNavy} /> : <Text style={styles.createAccountText}>{labels.linkAccount}</Text>}
                  </Pressable>
                  <Pressable disabled={registrationBusy} onPress={() => { setShowRegistration(false); setRegistrationError(''); }} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>{labels.cancel}</Text>
                  </Pressable>
                </View>
              )}
              {!!registrationError && <Text accessibilityRole="alert" style={styles.error}>{registrationError}</Text>}
              <Text style={styles.hint}>{labels.signOutHint}</Text>
            </>
          )}
          <Pressable
            onPress={() => Alert.alert(
              labels.signOutConfirmTitle,
              authUser.isAnonymous ? labels.guestSignOutConfirmMessage : labels.signOutConfirmMessage,
              [
                { text: labels.cancel, style: 'cancel' },
                { text: labels.confirmSignOut, style: 'destructive', onPress: onSignOut },
              ],
              { cancelable: true },
            )}
            style={styles.signOutButton}
          >
            <Text style={styles.signOutText}>{labels.signOut}</Text>
          </Pressable>
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
  title: { color: colors.white, fontSize: 30, fontWeight: '900', marginTop: 6, marginBottom: 22 },
  identityCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968', marginBottom: 26 },
  avatar: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.electricBlue, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontSize: 25, fontWeight: '900' },
  identityCopy: { flex: 1 },
  nickname: { color: colors.white, fontSize: 18, fontWeight: '900' },
  accountType: { color: colors.iceBlue, fontSize: 11, fontWeight: '800', marginTop: 4 },
  email: { color: colors.muted, fontSize: 11, marginTop: 5 },
  section: { color: colors.gold, fontSize: 12, fontWeight: '900', letterSpacing: 1, marginBottom: 10, marginTop: 4 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginBottom: 24 },
  statCard: { flexGrow: 1, flexBasis: '30%', minHeight: 82, borderRadius: 13, padding: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: '#294968', justifyContent: 'center' },
  statValue: { color: colors.white, fontSize: 23, fontWeight: '900' },
  statLabel: { color: colors.muted, fontSize: 9, fontWeight: '800', letterSpacing: 0.6, marginTop: 6 },
  infoCard: { padding: 15, borderRadius: 14, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968', marginBottom: 12 },
  viewAllButton: { alignSelf: 'flex-end', paddingVertical: 10, paddingHorizontal: 4, marginBottom: 22 },
  viewAllText: { color: colors.iceBlue, fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },
  matchCard: { padding: 14, borderRadius: 14, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968', marginBottom: 9 },
  matchTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  matchMode: { color: colors.white, fontSize: 13, fontWeight: '900' },
  matchPoints: { color: colors.gold, fontSize: 14, fontWeight: '900' },
  matchMeta: { color: colors.muted, fontSize: 11, marginTop: 7 },
  verification: { color: colors.iceBlue, fontSize: 9, fontWeight: '900', letterSpacing: 0.8, marginTop: 8 },
  infoText: { color: colors.white, fontSize: 12, lineHeight: 18 },
  hint: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 10 },
  createAccountButton: { minHeight: 48, borderRadius: 12, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, marginTop: 12 },
  createAccountText: { color: colors.midnightNavy, fontSize: 11, fontWeight: '900', letterSpacing: 0.4, textAlign: 'center' },
  registrationForm: { gap: 8, marginTop: 12 },
  fieldLabel: { color: colors.gold, fontSize: 10, fontWeight: '900', letterSpacing: 1, marginTop: 4 },
  input: { minHeight: 47, borderRadius: 12, borderWidth: 1, borderColor: '#294968', backgroundColor: colors.surface, color: colors.white, paddingHorizontal: 14, fontSize: 14 },
  cancelButton: { alignItems: 'center', paddingVertical: 10 },
  cancelText: { color: colors.iceBlue, fontSize: 12, fontWeight: '700' },
  success: { color: '#91E3B0', fontSize: 12, lineHeight: 18, marginTop: 12 },
  error: { color: '#FF8D8D', backgroundColor: '#3A202A', borderRadius: 10, padding: 11, fontSize: 12, textAlign: 'center', marginTop: 12 },
  disabled: { opacity: 0.6 },
  signOutButton: { minHeight: 46, borderRadius: 11, borderWidth: 1, borderColor: '#A84D5B', alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  signOutText: { color: '#FF9BA5', fontSize: 11, fontWeight: '900', letterSpacing: 0.6 },
  footer: { color: colors.iceBlue, fontSize: 9, fontWeight: '900', letterSpacing: 1.2, textAlign: 'center', marginTop: 8, paddingTop: 20 },
});
