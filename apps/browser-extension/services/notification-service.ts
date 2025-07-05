export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export interface PrayerNotificationSettings {
  enabled: boolean;
  sound: boolean;
  minutes: number; // minutes before prayer time
  message: string;
}

export interface NotificationSettings {
  fajr: PrayerNotificationSettings;
  dhuhr: PrayerNotificationSettings;
  asr: PrayerNotificationSettings;
  maghrib: PrayerNotificationSettings;
  isha: PrayerNotificationSettings;
  globalEnabled: boolean;
  soundEnabled: boolean;
}

class NotificationService {
  private defaultSettings: NotificationSettings = {
    fajr: { enabled: true, sound: true, minutes: 5, message: 'Waktu Sholat Fajr dalam 5 menit' },
    dhuhr: { enabled: true, sound: true, minutes: 5, message: 'Waktu Sholat Dzuhur dalam 5 menit' },
    asr: { enabled: false, sound: false, minutes: 5, message: 'Waktu Sholat Ashar dalam 5 menit' },
    maghrib: { enabled: true, sound: true, minutes: 5, message: 'Waktu Sholat Maghrib dalam 5 menit' },
    isha: { enabled: false, sound: false, minutes: 5, message: 'Waktu Sholat Isya dalam 5 menit' },
    globalEnabled: false, // Default to false until permission is granted
    soundEnabled: true
  };

  private scheduledNotifications: Map<string, ReturnType<typeof setTimeout>> = new Map();

  constructor() {
    this.loadSettings();
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  // Get current permission status
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) {
      return { granted: false, denied: true, default: false };
    }

    const permission = Notification.permission;
    return {
      granted: permission === 'granted',
      denied: permission === 'denied',
      default: permission === 'default'
    };
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Notifications not supported in this browser');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      console.info('Notification permission:', permission);
      
      // If permission is granted, enable global notifications
      if (permission === 'granted') {
        const settings = this.getSettings();
        if (!settings.globalEnabled) {
          this.updateSettings({ globalEnabled: true });
        }
      }
      
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Load settings from localStorage
  loadSettings(): NotificationSettings {
    try {
      const stored = localStorage.getItem('prayerNotificationSettings');
      if (stored) {
        const settings = JSON.parse(stored);
        return { ...this.defaultSettings, ...settings };
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
    return this.defaultSettings;
  }

  // Save settings to localStorage
  saveSettings(settings: NotificationSettings): void {
    try {
      localStorage.setItem('prayerNotificationSettings', JSON.stringify(settings));
      console.info('Notification settings saved');
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  // Get current settings
  getSettings(): NotificationSettings {
    return this.loadSettings();
  }

  // Update settings
  updateSettings(settings: Partial<NotificationSettings>): NotificationSettings {
    const currentSettings = this.loadSettings();
    const newSettings = { ...currentSettings, ...settings };
    
    // If enabling global notifications, check permission first
    if (settings.globalEnabled && !this.getPermissionStatus().granted) {
      console.warn('Cannot enable notifications without permission');
      newSettings.globalEnabled = false;
    }
    
    this.saveSettings(newSettings);
    return newSettings;
  }

  // Update specific prayer settings
  updatePrayerSettings(prayer: keyof Omit<NotificationSettings, 'globalEnabled' | 'soundEnabled'>, settings: Partial<PrayerNotificationSettings>): void {
    const currentSettings = this.loadSettings();
    currentSettings[prayer] = { ...currentSettings[prayer], ...settings };
    this.saveSettings(currentSettings);
  }

  // Show immediate notification
  async showNotification(title: string, options: NotificationOptions = {}): Promise<boolean> {
    const permission = this.getPermissionStatus();
    if (!permission.granted) {
      console.debug('Notification permission not available - skipping notification');
      return false;
    }

    if (!this.isSupported()) {
      console.debug('Notifications not supported - skipping notification');
      return false;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'prayer-time',
        requireInteraction: true,
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);

      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }

  // Show prayer time notification
  async showPrayerNotification(prayerName: string, timeString: string, customMessage?: string): Promise<boolean> {
    const settings = this.getSettings();
    const prayerKey = prayerName.toLowerCase() as keyof Omit<NotificationSettings, 'globalEnabled' | 'soundEnabled'>;
    const prayerSettings = settings[prayerKey];

    if (!settings.globalEnabled || !prayerSettings?.enabled) {
      return false;
    }

    const title = `🕌 Waktu Sholat ${prayerName}`;
    const body = customMessage || `Sekarang waktu sholat ${prayerName} (${timeString})`;

    return this.showNotification(title, {
      body,
      icon: this.getPrayerIcon(prayerName),
      tag: `prayer-${prayerName.toLowerCase()}`,
      data: { prayer: prayerName, time: timeString }
    });
  }

  // Show prayer reminder (before prayer time)
  async showPrayerReminder(prayerName: string, timeString: string, minutesBefore: number): Promise<boolean> {
    const settings = this.getSettings();
    const prayerKey = prayerName.toLowerCase() as keyof Omit<NotificationSettings, 'globalEnabled' | 'soundEnabled'>;
    const prayerSettings = settings[prayerKey];

    if (!settings.globalEnabled || !prayerSettings?.enabled) {
      return false;
    }

    const title = `⏰ Pengingat Sholat ${prayerName}`;
    const body = `Waktu sholat ${prayerName} dalam ${minutesBefore} menit (${timeString})`;

    return this.showNotification(title, {
      body,
      icon: this.getPrayerIcon(prayerName),
      tag: `reminder-${prayerName.toLowerCase()}`,
      data: { prayer: prayerName, time: timeString, reminder: true, minutes: minutesBefore }
    });
  }

  // Get appropriate icon for prayer
  private getPrayerIcon(prayerName: string): string {
    const icons = {
      fajr: '🌅',
      dhuhr: '☀️',
      asr: '🌤️',
      maghrib: '🌅',
      isha: '🌙'
    };
    return icons[prayerName.toLowerCase() as keyof typeof icons] || '🕌';
  }

  // Schedule notifications for prayer times
  scheduleNotifications(prayerTimes: Record<string, string> | any): void {
    // Clear existing notifications
    this.clearScheduledNotifications();

    const settings = this.getSettings();
    const permission = this.getPermissionStatus();
    
    if (!settings.globalEnabled || !permission.granted) {
      console.debug('Notifications disabled or permission not granted - skipping scheduling');
      return;
    }

    const now = new Date();

    Object.entries(prayerTimes).forEach(([prayer, timeString]) => {
      if (typeof prayer !== 'string' || typeof timeString !== 'string') {
        console.error('Invalid prayer or timeString:', { prayer, timeString });
        return;
      }
      const prayerKey = prayer.toLowerCase() as keyof Omit<NotificationSettings, 'globalEnabled' | 'soundEnabled'>;
      const prayerSettings = settings[prayerKey];

      if (!prayerSettings?.enabled || !timeString) {
        return;
      }

      try {
        // Parse prayer time
        const [hours, minutes] = timeString.split(':').map(Number);
        const prayerTime = new Date();
        prayerTime.setHours(hours, minutes, 0, 0);

        // If prayer time has passed today, schedule for tomorrow
        if (prayerTime <= now) {
          prayerTime.setDate(prayerTime.getDate() + 1);
        }

        // Schedule reminder notification
        const reminderTime = new Date(prayerTime.getTime() - (prayerSettings.minutes * 60 * 1000));
        if (reminderTime > now) {
          const reminderTimeout = reminderTime.getTime() - now.getTime();
          const reminderId = setTimeout(() => {
            this.showPrayerReminder(prayer, timeString, prayerSettings.minutes);
          }, reminderTimeout);
          
          this.scheduledNotifications.set(`reminder-${prayer}`, reminderId);
          console.debug(`Scheduled reminder for ${prayer} at ${reminderTime.toLocaleTimeString()}`);
        }

        // Schedule exact prayer time notification
        const prayerTimeout = prayerTime.getTime() - now.getTime();
        const prayerId = setTimeout(() => {
          this.showPrayerNotification(prayer, timeString);
        }, prayerTimeout);
        
        this.scheduledNotifications.set(`prayer-${prayer}`, prayerId);
        console.debug(`Scheduled notification for ${prayer} at ${prayerTime.toLocaleTimeString()}`);

      } catch (error) {
        console.error(`Error scheduling notification for ${prayer}:`, error);
      }
    });

    if (this.scheduledNotifications.size > 0) {
      console.info(`Scheduled ${this.scheduledNotifications.size} notifications`);
    }
  }

  // Clear all scheduled notifications
  clearScheduledNotifications(): void {
    this.scheduledNotifications.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.scheduledNotifications.clear();
    console.debug('Cleared all scheduled notifications');
  }

  // Test notification
  async testNotification(): Promise<boolean> {
    const permission = this.getPermissionStatus();
    if (!permission.granted) {
      console.warn('Cannot test notification - permission not granted');
      return false;
    }

    const title = '🔔 Test Notifikasi';
    const body = 'Notifikasi waktu sholat berfungsi dengan baik!';
    
    return this.showNotification(title, {
      body,
      icon: '🕌',
      tag: 'test-notification'
    });
  }

  // Get next scheduled notification info
  getNextNotification(): { prayer: string; type: 'reminder' | 'prayer'; time: Date } | null {
    const settings = this.getSettings();
    if (!settings.globalEnabled) {
      return null;
    }

    // This would require storing more detailed schedule info
    // For now, return null - could be enhanced later
    return null;
  }

  // Check if prayer has active reminder
  hasPrayerReminder(prayer: string): boolean {
    const settings = this.getSettings();
    const permission = this.getPermissionStatus();
    const prayerKey = prayer.toLowerCase() as keyof Omit<NotificationSettings, 'globalEnabled' | 'soundEnabled'>;
    const prayerSettings = settings[prayerKey];
    
    return settings.globalEnabled && permission.granted && prayerSettings?.enabled === true;
  }

  // Get reminder minutes for prayer
  getPrayerReminderMinutes(prayer: string): number {
    const settings = this.getSettings();
    const prayerKey = prayer.toLowerCase() as keyof Omit<NotificationSettings, 'globalEnabled' | 'soundEnabled'>;
    const prayerSettings = settings[prayerKey];
    
    return prayerSettings?.minutes || 5;
  }

  // Initialize service (call this when app starts)
  async initialize(): Promise<boolean> {
    if (!this.isSupported()) {
      console.info('Notifications not supported in this browser');
      return false;
    }

    const permission = this.getPermissionStatus();
    console.info('Notification service initialized. Permission status:', permission);
    
    // If we have permission but global notifications are disabled, enable them
    if (permission.granted) {
      const settings = this.getSettings();
      if (!settings.globalEnabled) {
        console.info('Permission granted - enabling notifications');
        this.updateSettings({ globalEnabled: true });
      }
    }
    
    return permission.granted;
  }

  // Check if can use notifications (both supported and permitted)
  canUseNotifications(): boolean {
    return this.isSupported() && this.getPermissionStatus().granted;
  }

  // Get user-friendly permission status message
  getPermissionStatusMessage(): string {
    const permission = this.getPermissionStatus();
    
    if (!this.isSupported()) {
      return 'Notifikasi tidak didukung di browser ini';
    }
    
    if (permission.granted) {
      return 'Notifikasi diizinkan';
    }
    
    if (permission.denied) {
      return 'Notifikasi ditolak. Anda dapat mengaktifkannya di pengaturan browser.';
    }
    
    return 'Belum memberikan izin notifikasi';
  }
}

export const notificationService = new NotificationService();

// Auto-initialize when module loads (but don't throw errors)
try {
  notificationService.initialize().catch(error => {
    console.debug('Notification service initialization completed with warnings:', error);
  });
} catch (error) {
  console.debug('Notification service initialization failed gracefully:', error);
}