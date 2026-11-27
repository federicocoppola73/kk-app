import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { SupportedLocale } from '../i18n/locales';
import { COUNTRY_CODES, getCountryName } from '../data/countries';
import { colors } from '../theme/colors';

type Props = {
  locale: SupportedLocale;
  value: string | null;
  onChange: (code: string) => void;
  placeholder?: string;
};

export default function CountryPicker({ locale, value, onChange, placeholder }: Props) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const language = locale === 'auto' ? 'en' : locale;
  const countries = useMemo(() => COUNTRY_CODES
    .map((code) => ({ code, name: getCountryName(code, language) }))
    .sort((a, b) => a.name.localeCompare(b.name, language)), [language]);
  const filtered = countries.filter((country) =>
    country.name.toLowerCase().includes(search.trim().toLowerCase()) ||
    country.code.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const selectedName = value ? getCountryName(value, language) : '';

  return (
    <>
      <Pressable onPress={() => { setSearch(''); setVisible(true); }} style={styles.selector}>
        <Text style={[styles.selectorText, !value && styles.placeholder]}>
          {selectedName || placeholder || (locale === 'it' ? 'Seleziona nazionalità (facoltativa)' : 'Select nationality (optional)')}
        </Text>
        <Text style={styles.chevron}>⌄</Text>
      </Pressable>
      <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.title}>{locale === 'it' ? 'SELEZIONA NAZIONALITÀ' : 'SELECT NATIONALITY'}</Text>
              <Pressable onPress={() => setVisible(false)}><Text style={styles.close}>✕</Text></Pressable>
            </View>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={locale === 'it' ? 'Cerca un Paese…' : 'Search country…'}
              placeholderTextColor="#7186A1"
              autoCorrect={false}
              style={styles.search}
            />
            <ScrollView keyboardShouldPersistTaps="handled">
              {filtered.map((country) => (
                <Pressable
                  key={country.code}
                  onPress={() => { onChange(country.code); setVisible(false); }}
                  style={styles.countryRow}
                >
                  <Text style={styles.countryName}>{country.name}</Text>
                  <Text style={styles.countryCode}>{country.code}</Text>
                </Pressable>
              ))}
              {filtered.length === 0 && <Text style={styles.empty}>{locale === 'it' ? 'Nessun Paese trovato.' : 'No countries found.'}</Text>}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: { minHeight: 49, borderRadius: 12, borderWidth: 1, borderColor: '#294968', backgroundColor: colors.surface, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectorText: { color: colors.white, fontSize: 13, flex: 1 },
  placeholder: { color: '#7186A1' },
  chevron: { color: colors.iceBlue, fontSize: 20, marginLeft: 8 },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.65)' },
  sheet: { height: '82%', backgroundColor: colors.midnightNavy, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 18, borderWidth: 1, borderColor: '#294968' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  title: { color: colors.gold, fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  close: { color: colors.iceBlue, fontSize: 20, paddingHorizontal: 6 },
  search: { minHeight: 46, borderRadius: 11, borderWidth: 1, borderColor: '#294968', backgroundColor: colors.surface, color: colors.white, paddingHorizontal: 13, marginBottom: 10 },
  countryRow: { minHeight: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#1D3856', paddingHorizontal: 4 },
  countryName: { color: colors.white, fontSize: 13 },
  countryCode: { color: colors.iceBlue, fontSize: 11, fontWeight: '800' },
  empty: { color: colors.muted, textAlign: 'center', padding: 24 },
});
