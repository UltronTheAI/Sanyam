import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { DisciplineModule, UsageModule, VpnModule, type DisciplineStatus } from '@/native/modules';
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type SanyamSettings } from '@/storage/settings';

const emptyStatus: DisciplineStatus = {
  activeUsageMs: 0,
  nextBreakInMs: DEFAULT_SETTINGS.screenLimitMinutes * 60_000,
  breakRemainingMs: 0,
  isBreakActive: false,
  usageAccessEnabled: false,
  accessibilityEnabled: false,
  notificationEnabled: false,
  batteryUnrestricted: false,
};

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<SanyamSettings>(DEFAULT_SETTINGS);
  const [status, setStatus] = useState<DisciplineStatus>(emptyStatus);
  const [todayUsageMs, setTodayUsageMs] = useState(0);
  const [vpnPrepared, setVpnPrepared] = useState(false);

  const guardrailScore = useMemo(() => {
    return [
      status.usageAccessEnabled,
      status.accessibilityEnabled,
      status.notificationEnabled,
      status.batteryUnrestricted,
      vpnPrepared && settings.vpnBlockerEnabled,
    ].filter(Boolean).length;
  }, [settings.vpnBlockerEnabled, status, vpnPrepared]);

  useEffect(() => {
    loadSettings().then(async (nextSettings) => {
      setSettings(nextSettings);
      await DisciplineModule.configure(nextSettings);
      await DisciplineModule.requestNotificationPermission();
      if (nextSettings.vpnBlockerEnabled) {
        const ready = await VpnModule.isPrepared().catch(() => false);
        setVpnPrepared(ready);
        if (ready) await VpnModule.start(nextSettings.blockedDomains);
      } else {
        VpnModule.isPrepared().then(setVpnPrepared).catch(() => setVpnPrepared(false));
      }
      await refreshStatus();
    });

    const timer = setInterval(refreshStatus, 1000);
    return () => clearInterval(timer);
  }, []);

  async function refreshStatus() {
    const [nextStatus, usageMinutes, prepared] = await Promise.all([
      DisciplineModule.getStatus().catch(() => emptyStatus),
      UsageModule.getTodayUsageMinutes().catch(() => 0),
      VpnModule.isPrepared().catch(() => false),
    ]);
    setStatus(nextStatus);
    setTodayUsageMs(usageMinutes * 60_000);
    setVpnPrepared(prepared);
  }

  async function configure(nextSettings: SanyamSettings) {
    setSettings(nextSettings);
    await saveSettings(nextSettings);
    await DisciplineModule.configure(nextSettings);
    await refreshStatus();
  }

  async function toggleEnabled(key: keyof Pick<SanyamSettings, 'waterReminderEnabled' | 'sleepModeEnabled' | 'strictModeEnabled' | 'vpnBlockerEnabled'>) {
    const nextSettings = { ...settings, [key]: !settings[key] };
    await configure(nextSettings);
    if (key === 'vpnBlockerEnabled') {
      if (nextSettings.vpnBlockerEnabled) {
        await startVpn();
      } else {
        await VpnModule.stop();
        setVpnPrepared(false);
      }
    }
  }

  async function startVpn() {
    const ready = await VpnModule.prepare();
    if (ready) {
      await VpnModule.start(settings.blockedDomains);
      setVpnPrepared(true);
    }
  }

  async function startBreak() {
    await DisciplineModule.startBreak(settings.breakDurationMinutes);
    await refreshStatus();
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.three, paddingBottom: insets.bottom + BottomTabInset },
        ]}>
        <ThemedView style={styles.hero}>
          <ThemedText type="smallBold" style={styles.badge}>
            🧘 SANYAM LIVE
          </ThemedText>
          <ThemedText type="title">Tiny rectangle goblin control room.</ThemedText>
          <ThemedText themeColor="textSecondary">
            Live screen timer, break bonker, sleep guard, water nag, and DNS goblin trap.
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={[styles.bigCard, status.isBreakActive && styles.breakCard]}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            {status.isBreakActive ? 'BREAK MODE ACTIVE' : 'NEXT BREAK IN'}
          </ThemedText>
          <ThemedText style={styles.timerText}>
            {status.isBreakActive ? formatDuration(status.breakRemainingMs) : formatDuration(status.nextBreakInMs)}
          </ThemedText>
          <ThemedText themeColor="textSecondary">
            {status.isBreakActive ? 'If you escape, Accessibility will bonk you back.' : 'Counts down from real foreground usage, not decorative UI confetti.'}
          </ThemedText>
        </ThemedView>

        <View style={styles.grid}>
          <Metric icon="📱" title="Today" value={formatDuration(todayUsageMs)} />
          <Metric icon="🔥" title="Current streak" value={formatDuration(status.activeUsageMs)} />
          <Metric icon="🛡️" title="Guardrails" value={`${guardrailScore}/5 on`} />
          <Metric icon="☁️" title="DNS" value={settings.vpnBlockerEnabled && vpnPrepared ? 'Cloudflare ON' : 'OFF'} />
        </View>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="subtitle">Permissions: the serious goblin food</ThemedText>
          <PermissionRow icon="📊" label="Usage Access" enabled={status.usageAccessEnabled} onPress={() => UsageModule.openUsageAccessSettings()} />
          <PermissionRow icon="🧱" label="Accessibility Blocker" enabled={status.accessibilityEnabled} onPress={() => DisciplineModule.openAccessibilitySettings()} />
          <PermissionRow icon="🔔" label="Notifications" enabled={status.notificationEnabled} onPress={() => DisciplineModule.requestNotificationPermission()} />
          <PermissionRow icon="🔋" label="Battery Unrestricted" enabled={status.batteryUnrestricted} onPress={() => DisciplineModule.openBatterySettings()} />
          <PermissionRow icon="☁️" label="Cloudflare DNS VPN" enabled={settings.vpnBlockerEnabled && vpnPrepared} onPress={startVpn} />
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="subtitle">Quick bonk buttons</ThemedText>
          <Action icon="⏳" label={`Start ${settings.breakDurationMinutes} min break`} onPress={startBreak} />
          <Action icon="☁️" label="Start DNS blocker" onPress={startVpn} />
          <Action icon="🔔" label="Test notification" onPress={() => DisciplineModule.showNotification('Sanyam says hi', 'Drink water, legend.')} />
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="subtitle">Modes</ThemedText>
          <ToggleRow icon="💧" label="Water reminder" value={settings.waterReminderEnabled} onPress={() => toggleEnabled('waterReminderEnabled')} />
          <ToggleRow icon="😴" label="Sleep blocker" value={settings.sleepModeEnabled} onPress={() => toggleEnabled('sleepModeEnabled')} />
          <ToggleRow icon="🚨" label="Strict breaks" value={settings.strictModeEnabled} onPress={() => toggleEnabled('strictModeEnabled')} />
          <ToggleRow icon="🚫" label="Porn/DNS blocker" value={settings.vpnBlockerEnabled} onPress={() => toggleEnabled('vpnBlockerEnabled')} />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

function Metric({ icon, title, value }: { icon: string; title: string; value: string }) {
  return (
    <ThemedView type="backgroundElement" style={styles.metric}>
      <ThemedText style={styles.icon}>{icon}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">{title}</ThemedText>
      <ThemedText type="subtitle">{value}</ThemedText>
    </ThemedView>
  );
}

function PermissionRow({ icon, label, enabled, onPress }: { icon: string; label: string; enabled: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.rowTitle}>
        <ThemedText style={styles.rowIcon}>{icon}</ThemedText>
        <ThemedText>{label}</ThemedText>
      </View>
      <ThemedText type="smallBold" style={[styles.pill, enabled ? styles.pillOn : styles.pillOff]}>
        {enabled ? 'READY' : 'FIX'}
      </ThemedText>
    </Pressable>
  );
}

function Action({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
      <ThemedText type="smallBold" style={styles.actionText}>{icon} {label}</ThemedText>
    </Pressable>
  );
}

function ToggleRow({ icon, label, value, onPress }: { icon: string; label: string; value: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.rowTitle}>
        <ThemedText style={styles.rowIcon}>{icon}</ThemedText>
        <ThemedText>{label}</ThemedText>
      </View>
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
  hero: {
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 999,
    color: '#FFFFFF',
    backgroundColor: '#1F8A70',
    overflow: 'hidden',
  },
  bigCard: {
    borderRadius: 32,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  breakCard: {
    backgroundColor: '#7C2D12',
  },
  timerText: {
    fontSize: 52,
    lineHeight: 58,
    fontWeight: '900',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  metric: {
    width: '48%',
    minHeight: 128,
    borderRadius: 24,
    padding: Spacing.three,
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 26,
  },
  card: {
    borderRadius: 28,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  row: {
    minHeight: 58,
    borderRadius: 18,
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(31,138,112,0.10)',
  },
  rowTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flex: 1,
  },
  rowIcon: {
    fontSize: 22,
  },
  action: {
    borderRadius: 18,
    padding: Spacing.three,
    backgroundColor: '#1F8A70',
  },
  actionText: {
    color: '#FFFFFF',
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
