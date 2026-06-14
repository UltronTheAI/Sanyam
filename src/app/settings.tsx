import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { DisciplineModule } from '@/native/modules';
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type SanyamSettings } from '@/storage/settings';

type NumericKey = 'screenLimitMinutes' | 'breakDurationMinutes' | 'waterIntervalMinutes';
type TimeKey = 'sleepStart' | 'sleepEnd';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<SanyamSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  async function updateSettings(nextSettings: SanyamSettings) {
    setSettings(nextSettings);
    await saveSettings(nextSettings);
    await DisciplineModule.configure(nextSettings);
  }

  function setNumber(key: NumericKey, value: string) {
    const parsed = Number(value.replace(/[^0-9]/g, ''));
    updateSettings({ ...settings, [key]: Number.isFinite(parsed) && parsed > 0 ? parsed : 1 });
  }

  function setTime(key: TimeKey, value: string) {
    updateSettings({ ...settings, [key]: value });
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.three, paddingBottom: insets.bottom + BottomTabInset },
        ]}>
        <ThemedText type="title">Settings</ThemedText>
        <ThemedText themeColor="textSecondary">Tune the guardrails. Keep emergency unlock enabled, future-you will thank you.</ThemedText>

        <ThemedView type="backgroundElement" style={styles.card}>
          <NumberField label="Screen limit" suffix="min" value={settings.screenLimitMinutes} onChangeText={(value) => setNumber('screenLimitMinutes', value)} />
          <NumberField label="Break duration" suffix="min" value={settings.breakDurationMinutes} onChangeText={(value) => setNumber('breakDurationMinutes', value)} />
          <NumberField label="Water interval" suffix="min" value={settings.waterIntervalMinutes} onChangeText={(value) => setNumber('waterIntervalMinutes', value)} />
          <TextField label="Sleep start" value={settings.sleepStart} onChangeText={(value) => setTime('sleepStart', value)} />
          <TextField label="Sleep end" value={settings.sleepEnd} onChangeText={(value) => setTime('sleepEnd', value)} />
          <TextField label="Emergency code" value={settings.emergencyCode} onChangeText={(value) => updateSettings({ ...settings, emergencyCode: value })} />
        </ThemedView>

        <Pressable
          onPress={() => updateSettings(DEFAULT_SETTINGS)}
          style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}>
          <ThemedText type="smallBold" style={styles.resetText}>Reset to sensible defaults</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

function NumberField({ label, suffix, value, onChangeText }: { label: string; suffix: string; value: number; onChangeText: (value: string) => void }) {
  return <TextField label={label} value={`${value}`} suffix={suffix} keyboardType="number-pad" onChangeText={onChangeText} />;
}

function TextField({
  label,
  value,
  suffix,
  keyboardType,
  onChangeText,
}: {
  label: string;
  value: string;
  suffix?: string;
  keyboardType?: 'default' | 'number-pad';
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.field}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <View style={styles.inputWrap}>
        <TextInput value={value} onChangeText={onChangeText} keyboardType={keyboardType} autoCapitalize="none" style={styles.input} />
        {suffix ? <ThemedText type="small" themeColor="textSecondary">{suffix}</ThemedText> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  card: {
    borderRadius: 28,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  field: {
    gap: Spacing.one,
  },
  inputWrap: {
    minHeight: 48,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
  },
  resetButton: {
    minHeight: 52,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C2D12',
  },
  resetText: {
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.72,
  },
});
