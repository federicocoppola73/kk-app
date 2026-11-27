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
  rank: number | null;
  nationalRank: number | null;
  pointsGlobalRank: number | null;
  pointsNationalRank: number | null;
  onOpenLeaderboard: (metric: 'xp' | 'points', scope: 'global' | 'national') => void;
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

const MODE_LABELS: Record<string, Record<SupportedLocale, string>> = {
  player:{it:'Player Quiz',en:'Player Quiz',es:'Quiz de jugadores',fr:'Quiz joueurs',de:'Spieler-Quiz'},
  club:{it:'Club Quiz',en:'Club Quiz',es:'Quiz de clubes',fr:'Quiz des clubs',de:'Vereins-Quiz'},
  career:{it:'Career Path',en:'Career Path',es:'Trayectoria',fr:'Parcours',de:'Karriereweg'},
  stadium:{it:'Stadium Quiz',en:'Stadium Quiz',es:'Quiz de estadios',fr:'Quiz des stades',de:'Stadion-Quiz'},
};

export default function ProfileScreen({ locale, authUser, userProfile, onBack, onSignOut, onViewAllHistory, onViewStatistics, rank, nationalRank, pointsGlobalRank, pointsNationalRank, onOpenLeaderboard }: Props) {
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

  const labels = ({
    it:{back:'INDIETRO',title:'IL MIO PROFILO',guest:'Account ospite',registered:'Account registrato',progression:'PROGRESSIONE',xp:'XP TOTALI',level:'LIVELLO',points:'PUNTI TOTALI',statistics:'STATISTICHE',matches:'PARTITE GIOCATE',correctAnswers:'RISPOSTE CORRETTE',accuracy:'PRECISIONE',history:'CRONOLOGIA PARTITE - ULTIME 5',viewAll:'VEDI TUTTE',loading:'Caricamento cronologia…',loadError:'Impossibile caricare la cronologia. Riprova più tardi.',empty:'Non hai ancora completato partite. Gioca una modalità per vedere qui i tuoi risultati.',unverified:'NON VERIFICATO',correct:'corrette',account:'ACCOUNT',signOut:'ESCI DALL’ACCOUNT',signOutConfirmTitle:'Conferma disconnessione',signOutConfirmMessage:'Vuoi davvero uscire dal tuo account?',guestSignOutConfirmMessage:'Stai usando un account ospite. Se esci, potresti non riuscire a recuperare questa identità e i relativi progressi. Vuoi continuare?',confirmSignOut:'ESCI',signOutHint:'Uscendo da un account ospite, non potrai recuperare questa identità automaticamente.',player:'Giocatore',createAccount:'CREA ACCOUNT E CONSERVA L’IDENTITÀ',guestInfo:'Collega un’email e una password alla tua identità ospite. Il collegamento mantiene lo stesso UID Firebase e i tuoi risultati.',nicknameLabel:'NICKNAME',nationalityLabel:'NAZIONALITÀ (FACOLTATIVA)',nationalitySaved:'NAZIONALITÀ',chooseCountry:'Aggiungi la nazionalità',countryError:'Impossibile salvare la nazionalità. Riprova.',emailLabel:'EMAIL',passwordLabel:'PASSWORD',confirmLabel:'CONFERMA PASSWORD',linkAccount:'COLLEGA ACCOUNT',cancel:'ANNULLA',required:'Compila tutti i campi.',mismatch:'Le password non coincidono.',linked:'Account creato e collegato. La tua identità Firebase è stata mantenuta.',generic:'Registrazione non riuscita. Controlla i dati e riprova.',details:'DETTAGLIO',global:'GLOBALE',national:'NAZIONALE',pointsUnit:'pt',footer:'CONOSCI IL GIOCO. DOMINA IL GIOCO.',nicknameTaken:'Questo nickname è già utilizzato. Scegline un altro.',nicknameLength:'Il nickname deve contenere da 3 a 24 caratteri.',emailTaken:'Questa email è già associata a un account.',invalidEmail:'Indirizzo email non valido.',weakPassword:'La password deve contenere almeno 6 caratteri.',network:'Connessione assente. Controlla Internet.',countryLocked:'La nazionalità è già stata impostata e non può essere modificata.'},
    en:{back:'BACK',title:'MY PROFILE',guest:'Guest account',registered:'Registered account',progression:'PROGRESSION',xp:'TOTAL XP',level:'LEVEL',points:'TOTAL POINTS',statistics:'STATISTICS',matches:'MATCHES PLAYED',correctAnswers:'CORRECT ANSWERS',accuracy:'ACCURACY',history:'MATCH HISTORY - LAST 5',viewAll:'VIEW ALL',loading:'Loading match history…',loadError:'Unable to load match history. Please try again later.',empty:'You have not completed any matches yet. Play a mode to see your results here.',unverified:'UNVERIFIED',correct:'correct',account:'ACCOUNT',signOut:'SIGN OUT',signOutConfirmTitle:'Confirm sign out',signOutConfirmMessage:'Are you sure you want to sign out of your account?',guestSignOutConfirmMessage:'You are using a guest account. If you sign out, you may not be able to recover this identity and its progress. Do you want to continue?',confirmSignOut:'SIGN OUT',signOutHint:'If you sign out from a guest account, you will not be able to restore this identity automatically.',player:'Player',createAccount:'CREATE ACCOUNT & KEEP IDENTITY',guestInfo:'Link an email and password to your guest identity. Linking preserves the same Firebase UID and your results.',nicknameLabel:'NICKNAME',nationalityLabel:'NATIONALITY (OPTIONAL)',nationalitySaved:'NATIONALITY',chooseCountry:'Add nationality',countryError:'Unable to save nationality. Please try again.',emailLabel:'EMAIL',passwordLabel:'PASSWORD',confirmLabel:'CONFIRM PASSWORD',linkAccount:'LINK ACCOUNT',cancel:'CANCEL',required:'Please complete all fields.',mismatch:'Passwords do not match.',linked:'Account created and linked. Your Firebase identity has been preserved.',generic:'Registration failed. Check your details and try again.',details:'DETAILS',global:'GLOBAL',national:'NATIONAL',pointsUnit:'pts',footer:'KNOW THE GAME. OWN THE GAME.',nicknameTaken:'This nickname is already taken. Choose another one.',nicknameLength:'Nickname must contain 3 to 24 characters.',emailTaken:'This email is already in use.',invalidEmail:'Invalid email address.',weakPassword:'Password must be at least 6 characters.',network:'Network error. Check your connection.',countryLocked:'Nationality has already been set and cannot be changed.'},
    es:{back:'VOLVER',title:'MI PERFIL',guest:'Cuenta de invitado',registered:'Cuenta registrada',progression:'PROGRESO',xp:'XP TOTALES',level:'NIVEL',points:'PUNTOS TOTALES',statistics:'ESTADÍSTICAS',matches:'PARTIDAS JUGADAS',correctAnswers:'RESPUESTAS CORRECTAS',accuracy:'PRECISIÓN',history:'HISTORIAL - ÚLTIMAS 5 PARTIDAS',viewAll:'VER TODAS',loading:'Cargando historial…',loadError:'No se pudo cargar el historial. Inténtalo más tarde.',empty:'Todavía no has completado partidas. Juega un modo para ver aquí tus resultados.',unverified:'NO VERIFICADO',correct:'correctas',account:'CUENTA',signOut:'CERRAR SESIÓN',signOutConfirmTitle:'Confirmar cierre de sesión',signOutConfirmMessage:'¿Seguro que quieres cerrar sesión en tu cuenta?',guestSignOutConfirmMessage:'Estás usando una cuenta de invitado. Si cierras sesión, es posible que no puedas recuperar esta identidad ni su progreso. ¿Quieres continuar?',confirmSignOut:'CERRAR SESIÓN',signOutHint:'Si cierras sesión en una cuenta de invitado, no podrás recuperar esta identidad automáticamente.',player:'Jugador',createAccount:'CREAR CUENTA Y CONSERVAR IDENTIDAD',guestInfo:'Vincula un correo y una contraseña a tu identidad de invitado. Se conservarán el mismo UID de Firebase y tus resultados.',nicknameLabel:'APODO',nationalityLabel:'NACIONALIDAD (OPCIONAL)',nationalitySaved:'NACIONALIDAD',chooseCountry:'Añadir nacionalidad',countryError:'No se pudo guardar la nacionalidad. Inténtalo de nuevo.',emailLabel:'CORREO ELECTRÓNICO',passwordLabel:'CONTRASEÑA',confirmLabel:'CONFIRMAR CONTRASEÑA',linkAccount:'VINCULAR CUENTA',cancel:'CANCELAR',required:'Completa todos los campos.',mismatch:'Las contraseñas no coinciden.',linked:'Cuenta creada y vinculada. Se ha conservado tu identidad de Firebase.',generic:'No se pudo completar el registro. Comprueba los datos e inténtalo de nuevo.',details:'DETALLES',global:'GLOBAL',national:'NACIONAL',pointsUnit:'pts',footer:'CONOCE EL JUEGO. DOMINA EL JUEGO.',nicknameTaken:'Este apodo ya está en uso. Elige otro.',nicknameLength:'El apodo debe tener entre 3 y 24 caracteres.',emailTaken:'Este correo ya está en uso.',invalidEmail:'Dirección de correo no válida.',weakPassword:'La contraseña debe tener al menos 6 caracteres.',network:'Sin conexión. Comprueba Internet.',countryLocked:'La nacionalidad ya está establecida y no se puede cambiar.'},
    fr:{back:'RETOUR',title:'MON PROFIL',guest:'Compte invité',registered:'Compte enregistré',progression:'PROGRESSION',xp:'XP TOTAUX',level:'NIVEAU',points:'TOTAL DES POINTS',statistics:'STATISTIQUES',matches:'MATCHS JOUÉS',correctAnswers:'BONNES RÉPONSES',accuracy:'PRÉCISION',history:'HISTORIQUE - 5 DERNIERS MATCHS',viewAll:'TOUT VOIR',loading:'Chargement de l’historique…',loadError:'Impossible de charger l’historique. Réessayez plus tard.',empty:'Vous n’avez pas encore terminé de match. Jouez pour voir vos résultats ici.',unverified:'NON VÉRIFIÉ',correct:'correctes',account:'COMPTE',signOut:'SE DÉCONNECTER',signOutConfirmTitle:'Confirmer la déconnexion',signOutConfirmMessage:'Voulez-vous vraiment vous déconnecter de votre compte ?',guestSignOutConfirmMessage:'Vous utilisez un compte invité. En vous déconnectant, vous risquez de ne pas pouvoir récupérer cette identité et sa progression. Voulez-vous continuer ?',confirmSignOut:'SE DÉCONNECTER',signOutHint:'En vous déconnectant d’un compte invité, vous ne pourrez pas récupérer automatiquement cette identité.',player:'Joueur',createAccount:'CRÉER UN COMPTE ET GARDER SON IDENTITÉ',guestInfo:'Associez un e-mail et un mot de passe à votre identité invitée. Le même UID Firebase et vos résultats seront conservés.',nicknameLabel:'PSEUDONYME',nationalityLabel:'NATIONALITÉ (FACULTATIVE)',nationalitySaved:'NATIONALITÉ',chooseCountry:'Ajouter une nationalité',countryError:'Impossible d’enregistrer la nationalité. Réessayez.',emailLabel:'E-MAIL',passwordLabel:'MOT DE PASSE',confirmLabel:'CONFIRMER LE MOT DE PASSE',linkAccount:'LIER LE COMPTE',cancel:'ANNULER',required:'Veuillez remplir tous les champs.',mismatch:'Les mots de passe ne correspondent pas.',linked:'Compte créé et associé. Votre identité Firebase a été conservée.',generic:'Échec de l’inscription. Vérifiez vos informations et réessayez.',details:'DÉTAILS',global:'MONDIAL',national:'NATIONAL',pointsUnit:'pts',footer:'CONNAISSEZ LE JEU. DOMINEZ LE JEU.',nicknameTaken:'Ce pseudonyme est déjà utilisé. Choisissez-en un autre.',nicknameLength:'Le pseudonyme doit contenir entre 3 et 24 caractères.',emailTaken:'Cette adresse e-mail est déjà utilisée.',invalidEmail:'Adresse e-mail invalide.',weakPassword:'Le mot de passe doit contenir au moins 6 caractères.',network:'Connexion indisponible. Vérifiez Internet.',countryLocked:'La nationalité a déjà été définie et ne peut pas être modifiée.'},
    de:{back:'ZURÜCK',title:'MEIN PROFIL',guest:'Gastkonto',registered:'Registriertes Konto',progression:'FORTSCHRITT',xp:'GESAMTE XP',level:'LEVEL',points:'GESAMTPUNKTE',statistics:'STATISTIKEN',matches:'GESPIELTE PARTIEN',correctAnswers:'RICHTIGE ANTWORTEN',accuracy:'TREFFERQUOTE',history:'SPIELVERLAUF - LETZTE 5',viewAll:'ALLE ANZEIGEN',loading:'Spielverlauf wird geladen…',loadError:'Spielverlauf konnte nicht geladen werden. Bitte später erneut versuchen.',empty:'Du hast noch keine Spiele abgeschlossen. Spiele einen Modus, um hier Ergebnisse zu sehen.',unverified:'NICHT VERIFIZIERT',correct:'richtig',account:'KONTO',signOut:'ABMELDEN',signOutConfirmTitle:'Abmeldung bestätigen',signOutConfirmMessage:'Möchtest du dich wirklich von deinem Konto abmelden?',guestSignOutConfirmMessage:'Du verwendest ein Gastkonto. Wenn du dich abmeldest, kannst du diese Identität und deinen Fortschritt möglicherweise nicht wiederherstellen. Möchtest du fortfahren?',confirmSignOut:'ABMELDEN',signOutHint:'Wenn du dich von einem Gastkonto abmeldest, kannst du diese Identität nicht automatisch wiederherstellen.',player:'Spieler',createAccount:'KONTO ERSTELLEN UND IDENTITÄT BEHALTEN',guestInfo:'Verknüpfe eine E-Mail-Adresse und ein Passwort mit deinem Gastkonto. Deine Firebase-UID und Ergebnisse bleiben erhalten.',nicknameLabel:'SPITZNAME',nationalityLabel:'NATIONALITÄT (OPTIONAL)',nationalitySaved:'NATIONALITÄT',chooseCountry:'Nationalität hinzufügen',countryError:'Nationalität konnte nicht gespeichert werden. Bitte erneut versuchen.',emailLabel:'E-MAIL',passwordLabel:'PASSWORT',confirmLabel:'PASSWORT BESTÄTIGEN',linkAccount:'KONTO VERKNÜPFEN',cancel:'ABBRECHEN',required:'Bitte fülle alle Felder aus.',mismatch:'Die Passwörter stimmen nicht überein.',linked:'Konto erstellt und verknüpft. Deine Firebase-Identität bleibt erhalten.',generic:'Registrierung fehlgeschlagen. Prüfe deine Angaben und versuche es erneut.',details:'DETAILS',global:'WELTWEIT',national:'NATIONAL',pointsUnit:'Pkt.',footer:'KENNE DAS SPIEL. BEHERRSCHE DAS SPIEL.',nicknameTaken:'Dieser Spitzname ist bereits vergeben. Wähle einen anderen.',nicknameLength:'Der Spitzname muss 3 bis 24 Zeichen lang sein.',emailTaken:'Diese E-Mail-Adresse wird bereits verwendet.',invalidEmail:'Ungültige E-Mail-Adresse.',weakPassword:'Das Passwort muss mindestens 6 Zeichen enthalten.',network:'Keine Verbindung. Überprüfe deine Internetverbindung.',countryLocked:'Die Nationalität wurde bereits festgelegt und kann nicht geändert werden.'}
  } as const)[locale];

  const nickname = userProfile?.nickname || authUser.displayName || labels.player;
  const email = authUser.email;
  const totalPoints = results.reduce((sum, result) => sum + result.points, 0);
  const totalCorrectAnswers = results.reduce((sum, result) => sum + result.correctAnswers, 0);
  const totalQuestions = results.reduce((sum, result) => sum + result.totalQuestions, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrectAnswers / totalQuestions) * 100) : 0;
  const modeName = (mode: string) => MODE_LABELS[mode]?.[locale] ?? mode;

  const saveCountry = async (code: string) => {
    setCountrySaving(true);
    setCountryError('');
    try {
      await setUserCountry(authUser.uid, code);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : '';
      setCountryError(message === 'country-already-set' ? labels.countryLocked : labels.countryError);
    } finally {
      setCountrySaving(false);
    }
  };

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
      if (message === 'nickname-already-taken') setRegistrationError(labels.nicknameTaken);
      else if (message === 'nickname-invalid-length') setRegistrationError(labels.nicknameLength);
      else if (code.includes('email-already-in-use') || code.includes('credential-already-in-use')) setRegistrationError(labels.emailTaken);
      else if (code.includes('invalid-email')) setRegistrationError(labels.invalidEmail);
      else if (code.includes('weak-password')) setRegistrationError(labels.weakPassword);
      else if (code.includes('network-request-failed')) setRegistrationError(labels.network);
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

        <Text style={styles.section}>{labels.nationalitySaved}</Text>
        <View style={styles.infoCard}>
          {userProfile?.countryCode ? (
            <Text style={styles.infoText}>{getCountryName(userProfile.countryCode, locale)}</Text>
          ) : (
            <>
              <Text style={styles.hint}>{labels.chooseCountry}</Text>
              <CountryPicker locale={locale} value={null} onChange={(code) => void saveCountry(code)} />
              {countrySaving && <ActivityIndicator color={colors.gold} style={{ marginTop: 10 }} />}
              {!!countryError && <Text style={styles.error}>{countryError}</Text>}
            </>
          )}
        </View>

        <Text style={styles.section}>{labels.progression}</Text>
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
            <Text style={styles.viewAllText}>{labels.details + '  ›'}</Text>
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
          <Pressable onPress={() => onOpenLeaderboard('xp', 'global')} style={styles.statCard} accessibilityRole="button">
            <Text style={styles.statValue}>{rank === null ? '—' : `#${rank}`}</Text>
            <Text style={styles.statLabel}>XP · {labels.global}  ›</Text>
          </Pressable>
          <Pressable onPress={() => onOpenLeaderboard('xp', 'national')} style={styles.statCard} accessibilityRole="button">
            <Text style={styles.statValue}>{nationalRank === null ? '—' : `#${nationalRank}`}</Text>
            <Text style={styles.statLabel}>XP · {labels.national}  ›</Text>
          </Pressable>
          <Pressable onPress={() => onOpenLeaderboard('points', 'global')} style={styles.statCard} accessibilityRole="button">
            <Text style={styles.statValue}>{pointsGlobalRank === null ? '—' : `#${pointsGlobalRank}`}</Text>
            <Text style={styles.statLabel}>{labels.points} · {labels.global}  ›</Text>
          </Pressable>
          <Pressable onPress={() => onOpenLeaderboard('points', 'national')} style={styles.statCard} accessibilityRole="button">
            <Text style={styles.statValue}>{pointsNationalRank === null ? '—' : `#${pointsNationalRank}`}</Text>
            <Text style={styles.statLabel}>{labels.points} · {labels.national}  ›</Text>
          </Pressable>
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
                <Text style={styles.matchPoints}>{result.points} {labels.pointsUnit}</Text>
              </View>
              <Text style={styles.matchMeta}>
                {result.correctAnswers}/{result.totalQuestions} {labels.correct}
                {result.completedAt ? `  ·  ${result.completedAt.toLocaleDateString(locale === 'en' ? 'en-GB' : locale)}` : ''}
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

        <Text style={styles.footer}>{labels.footer}</Text>
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
  error: { color: '#7A3212', backgroundColor: '#FFF0D6', borderWidth: 1, borderColor: '#E8B96A', borderRadius: 10, padding: 11, fontSize: 12, fontWeight: '700', textAlign: 'center', marginTop: 12 },
  disabled: { opacity: 0.6 },
  signOutButton: { minHeight: 46, borderRadius: 11, borderWidth: 1, borderColor: '#A84D5B', alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  signOutText: { color: '#FF9BA5', fontSize: 11, fontWeight: '900', letterSpacing: 0.6 },
  footer: { color: colors.iceBlue, fontSize: 9, fontWeight: '900', letterSpacing: 1.2, textAlign: 'center', marginTop: 8, paddingTop: 20 },
});
