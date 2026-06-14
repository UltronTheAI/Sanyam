import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { DisciplineModule } from '@/native/modules';
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from '@/storage/settings';

export default function BlockListScreen() {
  const insets = useSafeAreaInsets();
  const [apps, setApps] = useState(DEFAULT_SETTINGS.blockedApps);
  const [domains, setDomains] = useState(DEFAULT_SETTINGS.blockedDomains);
  const [draftApp, setDraftApp] = useState('');
  const [draftDomain, setDraftDomain] = useState('');

  useEffect(() => {
    loadSettings().then((settings) => {
      setApps(settings.blockedApps);
      setDomains(settings.blockedDomains);
    });
  }, []);

  async function persist(nextApps = apps, nextDomains = domains) {
    const settings = await loadSettings();
    const nextSettings = { ...settings, blockedApps: nextApps, blockedDomains: nextDomains };
    await saveSettings(nextSettings);
    await DisciplineModule.configure(nextSettings);
  }

  function addApp() {
    const normalized = draftApp.trim();
    if (!normalized || apps.includes(normalized)) return;
    const nextApps = [...apps, normalized];
    setApps(nextApps);
    setDraftApp('');
    persist(nextApps);
  }

  function addDomain() {
    const normalized = draftDomain.trim().toLowerCase();
    if (!normalized || domains.includes(normalized)) return;
    const nextDomains = [...domains, normalized];
    setDomains(nextDomains);
    setDraftDomain('');
    persist(apps, nextDomains);
  }

  function removeApp(packageName: string) {
    const nextApps = apps.filter((item) => item !== packageName);
    setApps(nextApps);
    persist(nextApps);
  }

  function removeDomain(domain: string) {
    const nextDomains = domains.filter((item) => item !== domain);
    setDomains(nextDomains);
    persist(apps, nextDomains);
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.three, paddingBottom: insets.bottom + BottomTabInset },
        ]}>
        <ThemedText type="title">Blocklist</ThemedText>
        <ThemedText themeColor="textSecondary">
          Accessibility blocks app package names. VPN blocks exact domains and subdomains.
        </ThemedText>

        <Section title="Blocked apps" value={draftApp} placeholder="com.android.chrome" onChangeText={setDraftApp} onAdd={addApp}>
          {apps.map((app) => <Chip label={app} key={app} onRemove={() => removeApp(app)} />)}
        </Section>

        <Section title="Adult domains" value={draftDomain} placeholder="example.com" onChangeText={setDraftDomain} onAdd={addDomain}>
          {domains.map((domain) => <Chip label={domain} key={domain} onRemove={() => removeDomain(domain)} />)}
        </Section>
      </ScrollView>
    </ThemedView>
  );
}

function Section({
  title,
  value,
  placeholder,
  onChangeText,
  onAdd,
  children,
}: {
  title: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="subtitle">{title}</ThemedText>
      <View style={styles.inputRow}>
        <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} autoCapitalize="none" style={styles.input} />
        <Pressable onPress={onAdd} style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
          <ThemedText type="smallBold" style={styles.addText}>Add</ThemedText>
        </Pressable>
      </View>
      <View style={styles.chips}>{children}</View>
    </ThemedView>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Pressable onPress={onRemove} style={({ pressed }) => [styles.chip, pressed && styles.pressed]}>
      <ThemedText type="small">{label}  ×</ThemedText>
    </Pressable>
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
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  input: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    backgroundColor: '#FFFFFF',
    minHeight: 48,
  },
  addButton: {
    justifyContent: 'center',
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    backgroundColor: '#1F8A70',
  },
  addText: {
    color: '#FFFFFF',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: 'rgba(31,138,112,0.18)',
  },
  pressed: {
    opacity: 0.7,
  },
});
