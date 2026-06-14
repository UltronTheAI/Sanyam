import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'sanyam.settings.v1';

export type SanyamSettings = {
  screenLimitMinutes: number;
  breakDurationMinutes: number;
  waterIntervalMinutes: number;
  sleepStart: string;
  sleepEnd: string;
  emergencyCode: string;
  waterReminderEnabled: boolean;
  sleepModeEnabled: boolean;
  strictModeEnabled: boolean;
  vpnBlockerEnabled: boolean;
  blockedApps: string[];
  blockedDomains: string[];
};

export const DEFAULT_SETTINGS: SanyamSettings = {
  screenLimitMinutes: 20,
  breakDurationMinutes: 5,
  waterIntervalMinutes: 60,
  sleepStart: '00:00',
  sleepEnd: '08:00',
  emergencyCode: '1441',
  waterReminderEnabled: true,
  sleepModeEnabled: true,
  strictModeEnabled: true,
  vpnBlockerEnabled: false,
  blockedApps: [
    'com.android.chrome',
    'com.google.android.youtube',
    'com.instagram.android',
    'com.whatsapp',
    'org.mozilla.firefox',
    'com.opera.browser',
  ],
  blockedDomains: ['pornhub.com', 'xvideos.com', 'xnxx.com', 'redtube.com', 'xhamster.com', 'youporn.com'],
};

export async function loadSettings(): Promise<SanyamSettings> {
  const rawSettings = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!rawSettings) return DEFAULT_SETTINGS;

  try {
    const parsed = JSON.parse(rawSettings) as Partial<SanyamSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      blockedApps: Array.isArray(parsed.blockedApps) ? parsed.blockedApps : DEFAULT_SETTINGS.blockedApps,
      blockedDomains: Array.isArray(parsed.blockedDomains) ? parsed.blockedDomains : DEFAULT_SETTINGS.blockedDomains,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: SanyamSettings) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
