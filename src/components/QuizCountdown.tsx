import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { SupportedLocale } from '../i18n/locales';
import { colors } from '../theme/colors';

type Props = { locale: SupportedLocale; onComplete: () => void };

const copy: Record<SupportedLocale, { ready: string; go: string }> = {
  it: { ready: 'PREPARATI', go: 'PARTENZA!' },
  en: { ready: 'GET READY', go: 'GO!' },
  es: { ready: 'PREPÁRATE', go: '¡YA!' },
  fr: { ready: 'PRÉPARE-TOI', go: 'PARTEZ !' },
  de: { ready: 'MACH DICH BEREIT', go: 'LOS!' },
};

export default function QuizCountdown({ locale, onComplete }: Props) {
  const [count, setCount] = useState<number | 'go' | null>(3);

  useEffect(() => {
    if (count === null) return undefined;
    const timeout = setTimeout(() => {
      if (count === 'go') {
        setCount(null);
        onComplete();
      } else if (count === 1) {
        setCount('go');
      } else {
        setCount(count - 1);
      }
    }, count === 'go' ? 750 : 1000);

    return () => clearTimeout(timeout);
  }, [count, onComplete]);

  if (count === null) return null;

  return (
    <View style={styles.overlay}>
      <Text style={styles.ready}>{copy[locale].ready}</Text>
      <Text style={styles.count}>{count === 'go' ? copy[locale].go : count}</Text>
      <Text style={styles.caption}>KIT & KICK</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    elevation: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(5, 17, 34, 0.96)',
  },
  ready: {
    color: colors.iceBlue,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 3,
    marginBottom: 22,
  },
  count: {
    color: colors.gold,
    fontSize: 88,
    lineHeight: 104,
    fontWeight: '900',
    textAlign: 'center',
  },
  caption: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 4,
    marginTop: 24,
  },
});
