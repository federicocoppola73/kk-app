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
import { translations } from '../i18n/translations';
import CountryPicker from '../components/CountryPicker';
import { continueAsGuest, registerWithEmail, signInWithEmail } from '../services/auth';

type Mode = 'choice' | 'login' | 'register';

type Props = {
  locale: SupportedLocale;
  onAuthenticated: () => void;
};

export default function AuthScreen({ locale, onAuthenticated }: Props) {
  const t = translations[locale];
  const [mode, setMode] = useState<Mode>('choice');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const copyByLocale = {
    it: { eyebrow:'BENVENUTO NEL GIOCO', title:'ENTRA IN PARTITA.', subtitle:'Accedi per salvare i tuoi progressi e scalare la classifica.', guest:'CONTINUA COME OSPITE', login:'ACCEDI', register:'CREA ACCOUNT', email:'EMAIL', nickname:'NICKNAME', nationality:'NAZIONALITÀ (FACOLTATIVA)', password:'PASSWORD', confirm:'CONFERMA PASSWORD', submitLogin:'ACCEDI', submitRegister:'CREA ACCOUNT', back:'INDIETRO', switchLogin:'Hai già un account? Accedi', switchRegister:'Non hai un account? Registrati', guestNote:'Potrai creare un account in seguito e conservare i tuoi progressi.', footer:'CONOSCI IL GIOCO. DOMINA IL GIOCO.', passwordMismatch:'Le password non coincidono.', required:'Compila tutti i campi richiesti.', genericError:'Operazione non riuscita. Controlla i dati e riprova.' },
    en: { eyebrow:'WELCOME TO THE GAME', title:'GET IN THE GAME.', subtitle:'Sign in to save your progress and climb the leaderboard.', guest:'CONTINUE AS GUEST', login:'LOG IN', register:'CREATE ACCOUNT', email:'EMAIL', nickname:'NICKNAME', nationality:'NATIONALITY (OPTIONAL)', password:'PASSWORD', confirm:'CONFIRM PASSWORD', submitLogin:'LOG IN', submitRegister:'CREATE ACCOUNT', back:'BACK', switchLogin:'Already have an account? Log in', switchRegister:"Don't have an account? Sign up", guestNote:'You can create an account later and keep your progress.', footer:'KNOW THE GAME. OWN THE GAME.', passwordMismatch:'Passwords do not match.', required:'Please complete all required fields.', genericError:'Something went wrong. Check your details and try again.' },
    es: { eyebrow:'TE DAMOS LA BIENVENIDA', title:'ENTRA EN EL JUEGO.', subtitle:'Inicia sesión para guardar tu progreso y subir en la clasificación.', guest:'CONTINUAR COMO INVITADO', login:'INICIAR SESIÓN', register:'CREAR CUENTA', email:'CORREO ELECTRÓNICO', nickname:'APODO', nationality:'NACIONALIDAD (OPCIONAL)', password:'CONTRASEÑA', confirm:'CONFIRMAR CONTRASEÑA', submitLogin:'INICIAR SESIÓN', submitRegister:'CREAR CUENTA', back:'VOLVER', switchLogin:'¿Ya tienes una cuenta? Inicia sesión', switchRegister:'¿No tienes cuenta? Regístrate', guestNote:'Puedes crear una cuenta más adelante y conservar tu progreso.', footer:'CONOCE EL JUEGO. DOMINA EL JUEGO.', passwordMismatch:'Las contraseñas no coinciden.', required:'Completa todos los campos obligatorios.', genericError:'No se pudo completar la operación. Comprueba los datos e inténtalo de nuevo.' },
    fr: { eyebrow:'BIENVENUE DANS LE JEU', title:'ENTREZ DANS LE JEU.', subtitle:'Connectez-vous pour sauvegarder votre progression et grimper au classement.', guest:'CONTINUER EN INVITÉ', login:'SE CONNECTER', register:'CRÉER UN COMPTE', email:'E-MAIL', nickname:'PSEUDONYME', nationality:'NATIONALITÉ (FACULTATIVE)', password:'MOT DE PASSE', confirm:'CONFIRMER LE MOT DE PASSE', submitLogin:'SE CONNECTER', submitRegister:'CRÉER UN COMPTE', back:'RETOUR', switchLogin:'Vous avez déjà un compte ? Connectez-vous', switchRegister:'Pas encore de compte ? Inscrivez-vous', guestNote:'Vous pourrez créer un compte plus tard et conserver votre progression.', footer:'CONNAISSEZ LE JEU. DOMINEZ LE JEU.', passwordMismatch:'Les mots de passe ne correspondent pas.', required:'Veuillez remplir tous les champs obligatoires.', genericError:'Échec de l’opération. Vérifiez vos informations et réessayez.' },
    de: { eyebrow:'WILLKOMMEN IM SPIEL', title:'SEI DABEI.', subtitle:'Melde dich an, um deinen Fortschritt zu speichern und in der Rangliste aufzusteigen.', guest:'ALS GAST FORTFAHREN', login:'ANMELDEN', register:'KONTO ERSTELLEN', email:'E-MAIL', nickname:'SPITZNAME', nationality:'NATIONALITÄT (OPTIONAL)', password:'PASSWORT', confirm:'PASSWORT BESTÄTIGEN', submitLogin:'ANMELDEN', submitRegister:'KONTO ERSTELLEN', back:'ZURÜCK', switchLogin:'Du hast bereits ein Konto? Anmelden', switchRegister:'Noch kein Konto? Registrieren', guestNote:'Du kannst später ein Konto erstellen und deinen Fortschritt behalten.', footer:'KENNE DAS SPIEL. BEHERRSCHE DAS SPIEL.', passwordMismatch:'Die Passwörter stimmen nicht überein.', required:'Bitte fülle alle Pflichtfelder aus.', genericError:'Der Vorgang ist fehlgeschlagen. Prüfe deine Angaben und versuche es erneut.' }
  } as const;
  const copy = { ...copyByLocale[locale], footer: t.slogan };

  const friendlyError = (reason: unknown) => {
    const code = typeof reason === 'object' && reason !== null && 'code' in reason
      ? String((reason as { code: unknown }).code)
      : '';
    const message = reason instanceof Error ? reason.message : '';
    if (message === 'nickname-already-taken') return ({ it:'Questo nickname è già utilizzato. Scegline un altro.', en:'This nickname is already taken. Choose another one.', es:'Este apodo ya está en uso. Elige otro.', fr:'Ce pseudonyme est déjà utilisé. Choisissez-en un autre.', de:'Dieser Spitzname ist bereits vergeben. Wähle einen anderen.' } as const)[locale];
    if (message === 'nickname-invalid-length') return ({ it:'Il nickname deve contenere da 3 a 24 caratteri.', en:'Nickname must contain 3 to 24 characters.', es:'El apodo debe tener entre 3 y 24 caracteres.', fr:'Le pseudonyme doit contenir entre 3 et 24 caractères.', de:'Der Spitzname muss 3 bis 24 Zeichen lang sein.' } as const)[locale];
    if (code.includes('invalid-email')) return ({ it:'Indirizzo email non valido.', en:'Invalid email address.', es:'Dirección de correo no válida.', fr:'Adresse e-mail invalide.', de:'Ungültige E-Mail-Adresse.' } as const)[locale];
    if (code.includes('user-not-found') || code.includes('invalid-credential') || code.includes('wrong-password')) return ({ it:'Email o password non corretti.', en:'Incorrect email or password.', es:'Correo o contraseña incorrectos.', fr:'E-mail ou mot de passe incorrect.', de:'E-Mail-Adresse oder Passwort falsch.' } as const)[locale];
    if (code.includes('email-already-in-use') || code.includes('credential-already-in-use')) return ({ it:'Questa email è già associata a un account.', en:'This email is already in use.', es:'Este correo ya está asociado a una cuenta.', fr:'Cette adresse e-mail est déjà utilisée.', de:'Diese E-Mail-Adresse wird bereits verwendet.' } as const)[locale];
    if (code.includes('weak-password')) return ({ it:'La password deve contenere almeno 6 caratteri.', en:'Password must be at least 6 characters.', es:'La contraseña debe tener al menos 6 caracteres.', fr:'Le mot de passe doit contenir au moins 6 caractères.', de:'Das Passwort muss mindestens 6 Zeichen enthalten.' } as const)[locale];
    if (code.includes('network-request-failed')) return ({ it:'Connessione assente. Controlla Internet.', en:'Network error. Check your connection.', es:'Sin conexión. Comprueba tu conexión a Internet.', fr:'Connexion indisponible. Vérifiez votre accès à Internet.', de:'Keine Verbindung. Überprüfe deine Internetverbindung.' } as const)[locale];
    if (code.includes('operation-not-allowed')) return ({ it:'Questo metodo di accesso non è attivo in Firebase.', en:'This sign-in method is not enabled in Firebase.', es:'Este método de acceso no está habilitado en Firebase.', fr:'Cette méthode de connexion n’est pas activée dans Firebase.', de:'Diese Anmeldemethode ist in Firebase nicht aktiviert.' } as const)[locale];
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
      void run(() => registerWithEmail(email, nickname, password, countryCode));
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
            <Text style={styles.kicker}>{t.kicker}</Text>
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
              {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
              {mode === 'register' && (
                <>
                  <Text style={styles.fieldLabel}>{copy.nickname}</Text>
                  <TextInput value={nickname} onChangeText={setNickname} placeholder={copy.nickname} placeholderTextColor="#7186A1" autoCapitalize="words" maxLength={24} style={styles.input} />
                  <Text style={styles.fieldLabel}>{copy.nationality}</Text>
                  <CountryPicker locale={locale} value={countryCode} onChange={setCountryCode} />
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

          {mode === 'choice' && !!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
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
  hero: { alignItems: 'center', marginTop: 24, marginBottom: 20 },
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
  form: { gap: 7, marginTop: 2 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 3, marginBottom: 2 },
  backText: { color: colors.iceBlue, fontSize: 12, fontWeight: '800' },
  fieldLabel: { color: colors.gold, fontSize: 10, fontWeight: '900', letterSpacing: 1, marginTop: 4 },
  input: { minHeight: 45, borderRadius: 12, borderWidth: 1, borderColor: '#294968', backgroundColor: colors.surface, color: colors.white, paddingHorizontal: 14, fontSize: 14 },
  formSubmit: { marginTop: 8 },
  switchButton: { alignItems: 'center', paddingVertical: 10 },
  switchText: { color: colors.iceBlue, fontSize: 12, fontWeight: '700' },
  error: { color: '#7A3212', backgroundColor: '#FFF0D6', borderWidth: 1, borderColor: '#E8B96A', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, fontSize: 12, lineHeight: 16, fontWeight: '700', textAlign: 'center', marginTop: 2, marginBottom: 3 },
  footer: { color: colors.iceBlue, fontSize: 9, fontWeight: '900', letterSpacing: 1.4, textAlign: 'center', marginTop: 30 },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.6 },
});
