import { NativeModules, Platform } from 'react-native';

import type { SanyamSettings } from '@/storage/settings';

export type AppUsage = {
  packageName: string;
  appName: string;
  totalTimeMs: number;
};

export type DisciplineStatus = {
  activeUsageMs: number;
  nextBreakInMs: number;
  breakRemainingMs: number;
  isBreakActive: boolean;
  usageAccessEnabled: boolean;
  accessibilityEnabled: boolean;
  notificationEnabled: boolean;
  batteryUnrestricted: boolean;
};

type UsageModuleShape = {
  getTodayUsageMinutes(): Promise<number>;
  getTodayAppUsage(): Promise<AppUsage[]>;
  getForegroundApp(): Promise<string>;
  openUsageAccessSettings(): Promise<void>;
};

type DisciplineModuleShape = {
  configure(settings: SanyamSettings): Promise<void>;
  startBreak(minutes: number): Promise<void>;
  openAccessibilitySettings(): Promise<void>;
  openBatterySettings(): Promise<void>;
  requestNotificationPermission(): Promise<boolean>;
  getStatus(): Promise<DisciplineStatus>;
  showNotification(title: string, message: string): Promise<void>;
};

type VpnModuleShape = {
  prepare(): Promise<boolean>;
  start(blockedDomains: string[]): Promise<void>;
  stop(): Promise<void>;
  isPrepared(): Promise<boolean>;
};

const unavailable = (name: string) => () => Promise.reject(new Error(`${name} is available on Android builds only.`));

export const UsageModule: UsageModuleShape =
  Platform.OS === 'android' && NativeModules.UsageStatsModule
    ? NativeModules.UsageStatsModule
    : {
        getTodayUsageMinutes: async () => 0,
        getTodayAppUsage: async () => [],
        getForegroundApp: async () => '',
        openUsageAccessSettings: unavailable('UsageStatsModule'),
      };

export const DisciplineModule: DisciplineModuleShape =
  Platform.OS === 'android' && NativeModules.DisciplineModule
    ? NativeModules.DisciplineModule
    : {
        configure: async () => undefined,
        startBreak: unavailable('DisciplineModule'),
        openAccessibilitySettings: unavailable('DisciplineModule'),
        openBatterySettings: unavailable('DisciplineModule'),
        requestNotificationPermission: async () => false,
        getStatus: async () => ({
          activeUsageMs: 0,
          nextBreakInMs: 0,
          breakRemainingMs: 0,
          isBreakActive: false,
          usageAccessEnabled: false,
          accessibilityEnabled: false,
          notificationEnabled: false,
          batteryUnrestricted: false,
        }),
        showNotification: unavailable('DisciplineModule'),
      };

export const VpnModule: VpnModuleShape =
  Platform.OS === 'android' && NativeModules.SanyamVpnModule
    ? NativeModules.SanyamVpnModule
    : {
        prepare: async () => false,
        start: unavailable('SanyamVpnModule'),
        stop: unavailable('SanyamVpnModule'),
        isPrepared: async () => false,
      };
