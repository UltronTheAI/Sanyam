import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { UsageModule, type AppUsage } from '@/native/modules';

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const [apps, setApps] = useState<AppUsage[]>([]);

  useEffect(() => {
    UsageModule.getTodayAppUsage().then(setApps).catch(() => setApps([]));
  }, []);

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.three, paddingBottom: insets.bottom + BottomTabInset },
        ]}>
        <ThemedText type="title">Today’s stats</ThemedText>
        <ThemedText themeColor="textSecondary">
          Data comes from Android Usage Access. Open settings from Home if this list is empty.
        </ThemedText>
        <ThemedView type="backgroundElement" style={styles.card}>
          {apps.length === 0 ? (
            <ThemedText themeColor="textSecondary">No usage data yet.</ThemedText>
          ) : (
            apps.map((app) => <UsageRow app={app} key={app.packageName} />)
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

function UsageRow({ app }: { app: AppUsage }) {
  const minutes = Math.max(1, Math.round(app.totalTimeMs / 60000));
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <ThemedText type="smallBold">{app.appName || app.packageName}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">{app.packageName}</ThemedText>
      </View>
      <ThemedText type="smallBold">{minutes}m</ThemedText>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.three,
  },
  rowText: {
    flex: 1,
  },
});
