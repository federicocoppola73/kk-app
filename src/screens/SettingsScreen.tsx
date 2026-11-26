import React from 'react';
import { Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import type { SupportedLocale } from '../i18n/locales';
import { translations } from '../i18n/translations';

type Props = {
  locale: SupportedLocale;
  selectedLocale: SupportedLocale | null;
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

export default function SettingsScreen({ locale, selectedLocale, onChangeLocale, onBack }: Props) {
  const t = translations[locale];
  const italian = locale === 'it';
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.midnightNavy} />
      <View style={styles.container}>
        <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>‹  {t.settingsBack}</Text></Pressable>
        <Text style={styles.eyebrow}>KIT & KICK</Text>
        <Text style={styles.title}>{t.settingsTitle}</Text>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.midnightNavy },
  container: { flex: 1, padding: 22, paddingTop: (StatusBar.currentHeight ?? 0) + 12 },
  back: { alignSelf: 'flex-start', paddingVertical: 8, marginBottom: 24 },
  backText: { color: colors.iceBlue, fontSize: 14, fontWeight: '800' },
  eyebrow: { color: colors.iceBlue, fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  title: { color: colors.white, fontSize: 30, fontWeight: '900', marginTop: 6, marginBottom: 28 },
  section: { color: colors.gold, fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  description: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 7, marginBottom: 14 },
  options: { gap: 8 },
  option: { minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: '#29415D', backgroundColor: colors.surface, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionSelected: { borderColor: colors.electricBlue, backgroundColor: '#142F4D' },
  optionLabel: { color: colors.white, fontSize: 13, fontWeight: '700' },
  optionLabelSelected: { color: colors.iceBlue },
  radio: { color: colors.iceBlue, fontSize: 18 },
  comingSoon: { marginTop: 30, padding: 16, borderRadius: 14, backgroundColor: '#102746', borderWidth: 1, borderColor: '#294968' },
  footer: { color: colors.iceBlue, fontSize: 9, fontWeight: '900', letterSpacing: 1.2, textAlign: 'center', marginTop: 'auto', paddingVertical: 20 },
});
