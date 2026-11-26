import { useCallback, useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';
import type { SupportedLocale } from '../i18n/locales';
import { translations } from '../i18n/translations';

export function useQuizExitConfirmation(
  locale: SupportedLocale,
  isComplete: boolean,
  onLeave: () => void,
): () => void {
  const t = translations[locale];

  const requestExit = useCallback(() => {
    if (isComplete) {
      onLeave();
      return;
    }

    Alert.alert(
      t.leaveMatchTitle,
      t.leaveMatchMessage,
      [
        { text: t.continuePlaying, style: 'cancel' },
        { text: t.leaveMatch, style: 'destructive', onPress: onLeave },
      ],
      { cancelable: true },
    );
  }, [isComplete, onLeave, t]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      requestExit();
      return true;
    });

    return () => subscription.remove();
  }, [requestExit]);

  return requestExit;
}
