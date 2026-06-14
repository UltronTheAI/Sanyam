import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type SanyamSettings } from '@/storage/settings';
import { DisciplineModule, UsageModule, VpnModule } from '@/native/modules';

const minutes = (value: number) => `${Math.floor(value / 60)}h ${value % 60}m`;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<SanyamSettings>(DEFAULT_SETTINGS);
  const [usageMinutes, setUsageMinutes] = useState(0);
  const [breakRemaining, setBreakRemaining] = useState(DEFAULT_SETTINGS.screenLimitMinutes);
  const [vpnPrepared, setVpnPrepared] = useState(false);

  useEffect(() => {
    loadSettings().then((nextSettings) => {
      setSettings(nextSettings);
      DisciplineModule.configure(nextSettings);
    });
    refreshUsage();
    const timer = setInterval(refreshUsage, 15000);
    VpnModule.isPrepared().then(setVpnPrepared).catch(() => setVpnPrepared(false));
    return () => clearInterval(timer);
  }, []);

  async function refreshUsage() {
    const todayUsage = await UsageModule.getTodayUsageMinutes().catch(() => 0);
    setUsageMinutes(todayUsage);
    setBreakRemaining(Math.max(DEFAULT_SETTINGS.screenLimitMinutes - (todayUsage % DEFAULT_SETTINGS.screenLimitMinutes), 0));
  }

  async function toggleEnabled(key: keyof Pick<SanyamSettings, 'waterReminderEnabled' | 'sleepModeEnabled' | 'strictModeEnabled' | 'vpnBlockerEnabled'>) {
    const nextSettings = { ...settings, [key]: !settings[key] };
    setSettings(nextSettings);
    await saveSettings(nextSettings);
    await DisciplineModule.configure(nextSettings);
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.three, paddingBottom: insets.bottom + BottomTabInset },
        ]}>
        <View style={styles.header}>
          <ThemedText type="smallBold" themeColor="textSecondary">SANYAM</ThemedText>
          <ThemedText type="title">Discipline, without drama.</ThemedText>
          <ThemedText themeColor="textSecondary">
            Personal Android guardrails for breaks, sleep, water, and cleaner browsing.
          </ThemedText>
        </View>

        <View style={styles.grid}>
          <Metric title="Today screen time" value={minutes(usageMinutes)} />
          <Metric title="Next break in" value={`${breakRemaining} min`} />
          <Metric title="Sleep mode" value={`${settings.sleepStart}–${settings.sleepEnd}`} />
          <Metric title="VPN blocker" value={settings.vpnBlockerEnabled && vpnPrepared ? 'Ready' : 'Setup'} />
        </View>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="subtitle">Quick actions</ThemedText>
          <Action label="Request usage access" onPress={() => UsageModule.openUsageAccessSettings()} />
          <Action label="Open accessibility setup" onPress={() => DisciplineModule.openAccessibilitySettings()} />
          <Action label="Prepare VPN blocker" onPress={() => VpnModule.prepare()} />
          <Action label="Start a 5 min break now" onPress={() => DisciplineModule.startBreak(settings.breakDurationMinutes)} />
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="subtitle">Modes</ThemedText>
          <ToggleRow label="Water reminder" value={settings.waterReminderEnabled} onPress={() => toggleEnabled('waterReminderEnabled')} />
          <ToggleRow label="Sleep blocker" value={settings.sleepModeEnabled} onPress={() => toggleEnabled('sleepModeEnabled')} />
          <ToggleRow label="Strict breaks" value={settings.strictModeEnabled} onPress={() => toggleEnabled('strictModeEnabled')} />
          <ToggleRow label="Porn/DNS blocker" value={settings.vpnBlockerEnabled} onPress={() => toggleEnabled('vpnBlockerEnabled')} />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <ThemedView type="backgroundElement" style={styles.metric}>
      <ThemedText type="small" themeColor="textSecondary">{title}</ThemedText>
      <ThemedText type="subtitle">{value}</ThemedText>
    </ThemedView>
  );
}

function Action({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
      <ThemedText type="smallBold">{label}</ThemedText>
    </Pressable>
  );
}

function ToggleRow({ label, value, onPress }: { label: string; value: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.toggleRow, pressed && styles.pressed]}>
      <ThemedText>{label}</ThemedText>
      <ThemedText type="smallBold" style={[styles.pill, value ? styles.pillOn : styles.pillOff]}>
        {value ? 'ON' : 'OFF'}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  metric: {
    width: '48%',
    minHeight: 104,
    borderRadius: 24,
    padding: Spacing.three,
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: 28,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  action: {
    borderRadius: 18,
    padding: Spacing.three,
    backgroundColor: '#1F8A70',
  },
  toggleRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pill: {
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    color: '#FFFFFF',
  },
  pillOn: {
    backgroundColor: '#1F8A70',
  },
  pillOff: {
    backgroundColor: '#7C2D12',
  },
  pressed: {
    opacity: 0.72,
  },
});
