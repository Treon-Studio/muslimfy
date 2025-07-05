// My Quran API service for prayer times
export interface MyQuranPrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Sunset: string;
    Maghrib: string;
    Isha: string;
    Imsak: string;
    Midnight: string;
  }
  
  export interface MyQuranPrayerTimesData {
    timings: MyQuranPrayerTimes;
    date: {
      readable: string;
      timestamp: string;
      gregorian: {
        date: string;
        format: string;
        day: string;
        weekday: { en: string };
        month: { number: number; en: string };
        year: string;
        designation: { abbreviated: string };
      };
      hijri: {
        date: string;
        format: string;
        day: string;
        weekday: { en: string; ar: string };
        month: { number: number; en: string; ar: string };
        year: string;
        designation: { abbreviated: string };
      };
    };
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        id: number;
        name: string;
        params: Record<string, any>;
      };
      latitudeAdjustmentMethod: string;
      midnightMode: string;
      school: string;
      offset: Record<string, number>;
      location?: {
        city?: string;
        province?: string;
        country: string;
      };
    };
  }
  
  export interface LocationCoords {
    latitude: number;
    longitude: number;
  }
  
  export interface LocationPermissionStatus {
    supported: boolean;
    granted: boolean;
    denied: boolean;
    blocked: boolean;
    prompt: boolean;
    errorCode?: number;
    errorMessage?: string;
  }
  
  // Quick location presets for major Indonesian cities
  export const LOCATION_PRESETS = {
    yogyakarta: { latitude: -7.7956, longitude: 110.3695, city: 'Yogyakarta', province: 'DI Yogyakarta' },
    jakarta: { latitude: -6.2088, longitude: 106.8456, city: 'Jakarta', province: 'DKI Jakarta' },
    surabaya: { latitude: -7.2459, longitude: 112.7378, city: 'Surabaya', province: 'Jawa Timur' },
    bandung: { latitude: -6.9175, longitude: 107.6191, city: 'Bandung', province: 'Jawa Barat' },
    medan: { latitude: 3.5952, longitude: 98.6722, city: 'Medan', province: 'Sumatera Utara' },
    makassar: { latitude: -5.1477, longitude: 119.4327, city: 'Makassar', province: 'Sulawesi Selatan' }
  };
  
  class MyQuranPrayerTimesService {
    // Try multiple possible base URLs for My Quran API
    private possibleBaseUrls = [
      'https://api.myquran.com/v1',
      'https://api.myquran.com',
      'https://myquran.com/api/v1',
      'https://myquran.com/api'
    ];
    
    private fallbackService: any = null;
    private apiTimeout = 3000; // Aggressive 3 second timeout
    private useApiAsEnhancement = true; // Use API as enhancement, not primary
  
    // GPS Debug and Override functionality
    private lastKnownLocation: LocationCoords | null = null;
    private manualLocationOverride: LocationCoords | null = null;
    private gpsDebugMode: boolean = false;
    private permissionStatus: LocationPermissionStatus = {
      supported: false,
      granted: false,
      denied: false,
      blocked: false,
      prompt: false
    };
  
    // Zero GPS dependency mode - bypass GPS completely when blocked
    private zeroGpsDependency: boolean = false;
  
    constructor() {
      // Import fallback calculator immediately
      this.initializeFallback();
      
      // Enable GPS debug mode
      this.gpsDebugMode = true;
      
      // Try to load last known location from localStorage
      this.loadLastKnownLocation();
      
      // Check initial permission status
      this.checkPermissionStatus();
    }
  
    private async initializeFallback() {
      try {
        const { localPrayerTimesCalculator } = await import('./prayer-times-calculator');
        this.fallbackService = localPrayerTimesCalculator;
        console.info('✅ Local prayer calculator initialized (primary service)');
      } catch (error) {
        console.error('❌ Failed to initialize local calculator:', error);
      }
    }
  
    private loadLastKnownLocation(): void {
      try {
        const saved = localStorage.getItem('muslimfy_last_location');
        if (saved) {
          this.lastKnownLocation = JSON.parse(saved);
          console.info('📍 Loaded last known location:', this.lastKnownLocation);
        }
      } catch (error) {
        console.warn('⚠️ Failed to load last known location:', error);
      }
    }
  
    private saveLastKnownLocation(coords: LocationCoords): void {
      try {
        this.lastKnownLocation = coords;
        localStorage.setItem('muslimfy_last_location', JSON.stringify(coords));
        console.info('💾 Saved location to localStorage:', coords);
      } catch (error) {
        console.warn('⚠️ Failed to save location:', error);
      }
    }
  
    private async checkPermissionStatus(): Promise<void> {
      this.permissionStatus.supported = !!navigator.geolocation;
      
      if (!this.permissionStatus.supported) {
        console.warn('📍 Geolocation not supported by this browser');
        this.zeroGpsDependency = true;
        return;
      }
  
      try {
        // Check if we can get permission status
        if ('permissions' in navigator) {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          
          switch (result.state) {
            case 'granted':
              this.permissionStatus.granted = true;
              break;
            case 'denied':
              this.permissionStatus.denied = true;
              this.zeroGpsDependency = true; // Enable zero GPS mode
              break;
            case 'prompt':
              this.permissionStatus.prompt = true;
              break;
          }
          
          console.info('📍 Permission status:', result.state);
        }
      } catch (error) {
        console.warn('⚠️ Could not check permission status:', error);
      }
    }
  
    // Quick location preset methods
    setLocationPreset(presetKey: keyof typeof LOCATION_PRESETS): void {
      const preset = LOCATION_PRESETS[presetKey];
      if (preset) {
        this.manualLocationOverride = { latitude: preset.latitude, longitude: preset.longitude };
        this.saveLastKnownLocation(this.manualLocationOverride);
        this.zeroGpsDependency = true; // Enable zero GPS mode
        console.info(`🎯 Location preset set to ${preset.city}:`, this.manualLocationOverride);
      }
    }
  
    getLocationPresets() {
      return LOCATION_PRESETS;
    }
  
    // Manual location override methods
    setManualLocation(latitude: number, longitude: number): void {
      this.manualLocationOverride = { latitude, longitude };
      this.saveLastKnownLocation({ latitude, longitude });
      this.zeroGpsDependency = true; // Enable zero GPS mode
      console.info('🎯 Manual location override set:', { latitude, longitude });
    }
  
    clearManualLocation(): void {
      this.manualLocationOverride = null;
      this.zeroGpsDependency = false; // Re-enable GPS attempts
      console.info('🔄 Manual location override cleared');
    }
  
    getLocationStatus(): { 
      hasManualOverride: boolean; 
      lastKnown: LocationCoords | null; 
      gpsSupported: boolean;
      currentMethod: string;
      permissionStatus: LocationPermissionStatus;
    } {
      return {
        hasManualOverride: !!this.manualLocationOverride,
        lastKnown: this.lastKnownLocation,
        gpsSupported: !!navigator.geolocation,
        currentMethod: this.manualLocationOverride ? 'Manual Override' : 
                      this.zeroGpsDependency ? 'Zero GPS Mode' :
                      this.lastKnownLocation ? 'GPS (Cached)' : 'GPS (Live)',
        permissionStatus: this.permissionStatus
      };
    }
  
    async requestLocationPermission(): Promise<boolean> {
      if (!navigator.geolocation) {
        console.warn('📍 Geolocation not supported');
        return false;
      }
  
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.info('✅ Location permission granted');
            this.permissionStatus.granted = true;
            this.permissionStatus.denied = false;
            this.permissionStatus.blocked = false;
            this.zeroGpsDependency = false; // Re-enable GPS
            
            // Save the new location
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            this.saveLastKnownLocation(coords);
            
            resolve(true);
          },
          (error) => {
            console.error('❌ Location permission denied:', error);
            this.permissionStatus.granted = false;
            this.permissionStatus.errorCode = error.code;
            this.permissionStatus.errorMessage = error.message;
            
            switch (error.code) {
              case error.PERMISSION_DENIED:
                this.permissionStatus.denied = true;
                if (error.message.includes('permissions policy') || 
                    error.message.includes('disabled in this document')) {
                  this.permissionStatus.blocked = true;
                  console.error('🔒 GPS blocked by browser permissions policy');
                }
                this.zeroGpsDependency = true; // Enable zero GPS mode
                break;
              case error.POSITION_UNAVAILABLE:
              case error.TIMEOUT:
                // These are not permission issues
                break;
            }
            resolve(false);
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 0
          }
        );
      });
    }
  
    async getCurrentLocation(): Promise<LocationCoords> {
      // 1. Check for manual override first
      if (this.manualLocationOverride) {
        console.info('🎯 Using manual location override:', this.manualLocationOverride);
        return this.manualLocationOverride;
      }
  
      // 2. If in zero GPS dependency mode, use smart fallback immediately
      if (this.zeroGpsDependency) {
        console.info('⚡ Zero GPS dependency mode - using smart fallback');
        const fallback = this.getBestFallbackLocation();
        console.info('📍 Smart fallback location:', fallback);
        return fallback;
      }
  
      // 3. Try GPS only if not in zero GPS mode
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          console.warn('📍 Geolocation not supported by browser');
          const fallback = this.getBestFallbackLocation();
          console.info('📍 Using fallback location:', fallback);
          this.zeroGpsDependency = true; // Switch to zero GPS mode
          resolve(fallback);
          return;
        }
  
        console.info('📍 Attempting to get GPS location...');
  
        // Reduced timeout for faster fallback
        const gpsTimeout = setTimeout(() => {
          console.warn('📍 GPS timeout after 8 seconds');
          const fallback = this.getBestFallbackLocation();
          console.info('📍 Using fallback after timeout:', fallback);
          this.zeroGpsDependency = true; // Switch to zero GPS mode
          resolve(fallback);
        }, 8000); // Reduced from 15 to 8 seconds
  
        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(gpsTimeout);
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            
            console.info('✅ GPS location obtained successfully!');
            console.info('📍 Coordinates:', coords);
            console.info('📍 Accuracy:', position.coords.accuracy, 'meters');
            
            // Update permission status
            this.permissionStatus.granted = true;
            this.permissionStatus.denied = false;
            this.permissionStatus.blocked = false;
            
            // Save successful GPS location
            this.saveLastKnownLocation(coords);
            
            // Log detected city for debugging
            const detectedCity = this.getCityFromCoordinates(coords.latitude, coords.longitude);
            console.info('🏙️ Detected city:', detectedCity);
            
            resolve(coords);
          },
          (error) => {
            clearTimeout(gpsTimeout);
            console.error('❌ GPS location error:', error);
            console.error('📍 Error code:', error.code);
            console.error('📍 Error message:', error.message);
            
            // Update permission status with detailed error info
            this.permissionStatus.errorCode = error.code;
            this.permissionStatus.errorMessage = error.message;
            
            // Detailed error logging and status updates
            switch (error.code) {
              case error.PERMISSION_DENIED:
                console.error('🚫 User denied GPS permission');
                this.permissionStatus.denied = true;
                this.permissionStatus.granted = false;
                
                // Check if it's blocked by policy
                if (error.message.includes('permissions policy') || 
                    error.message.includes('disabled in this document')) {
                  console.error('🔒 GPS blocked by browser permissions policy');
                  this.permissionStatus.blocked = true;
                }
                this.zeroGpsDependency = true; // Enable zero GPS mode
                break;
              case error.POSITION_UNAVAILABLE:
                console.error('📍 GPS position unavailable');
                this.zeroGpsDependency = true; // Enable zero GPS mode
                break;
              case error.TIMEOUT:
                console.error('⏱️ GPS request timeout');
                break;
              default:
                console.error('❓ Unknown GPS error:', error.code);
                break;
            }
            
            const fallback = this.getBestFallbackLocation();
            console.info('📍 Using fallback after error:', fallback);
            resolve(fallback);
          },
          {
            enableHighAccuracy: false,    // Use less accurate but faster GPS
            timeout: 6000,                // Reduced timeout for faster fallback
            maximumAge: 600000             // Accept 10-minute old location
          }
        );
      });
    }
  
    private getBestFallbackLocation(): LocationCoords {
      // 1. Use last known good location if available
      if (this.lastKnownLocation) {
        console.info('📍 Using last known location as fallback');
        return this.lastKnownLocation;
      }
  
      // 2. Try to detect location based on timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.info('🌏 Detected timezone:', timezone);
      
      if (timezone.includes('Jakarta') || timezone.includes('Asia/Jakarta')) {
        // For WIB timezone, smart guess based on language/region
        const language = navigator.language;
        if (language.includes('jv') || language.includes('java')) {
          // Javanese language - likely Yogyakarta/Central Java
          console.info('📍 Javanese language detected - defaulting to Yogyakarta');
          return LOCATION_PRESETS.yogyakarta;
        }
        console.info('📍 Timezone indicates WIB region - defaulting to Jakarta');
        return LOCATION_PRESETS.jakarta;
      }
      
      // 3. Check browser language for regional hints
      const language = navigator.language;
      if (language.startsWith('id') || language.includes('ID') || language.includes('indonesia')) {
        // Indonesian language - use Jakarta as safe default
        console.info('📍 Indonesian language detected - using Jakarta as fallback');
        return LOCATION_PRESETS.jakarta;
      }
  
      // 4. Check for specific regional indicators
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('yogya') || userAgent.includes('jogja')) {
        console.info('📍 Yogyakarta indicators found - using Yogyakarta preset');
        return LOCATION_PRESETS.yogyakarta;
      }
  
      // 5. Ultimate fallback - Jakarta (most common)
      console.info('📍 Using Jakarta as ultimate fallback');
      return LOCATION_PRESETS.jakarta;
    }
  
    private async tryMyQuranAPI(
      latitude: number, 
      longitude: number, 
      date?: string,
      method: number = 15
    ): Promise<MyQuranPrayerTimesData | null> {
      const dateParam = date || new Date().toISOString().split('T')[0];
      
      // Don't even try API if fallback service is not ready
      if (!this.fallbackService) {
        console.debug('🔄 Fallback service not ready, skipping API attempt');
        return null;
      }
  
      try {
        console.debug('🌐 Attempting My Quran API (enhancement mode)...');
        
        // Try different base URLs and endpoints
        for (const baseUrl of this.possibleBaseUrls) {
          const endpoints = [
            `${baseUrl}/sholat/jadwal/${dateParam}/${latitude}/${longitude}`,
            `${baseUrl}/prayer-times/${dateParam}?lat=${latitude}&lng=${longitude}&method=${method}`,
            `${baseUrl}/timings/${dateParam}?latitude=${latitude}&longitude=${longitude}&method=${method}`,
            `${baseUrl}/sholat?latitude=${latitude}&longitude=${longitude}&date=${dateParam}`,
            `${baseUrl}/api/sholat/${dateParam}/${latitude}/${longitude}` // Additional common pattern
          ];
  
          for (const endpoint of endpoints) {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), this.apiTimeout);
  
              const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'User-Agent': 'Muslimfy-App/1.0',
                  'Origin': window.location.origin
                },
                signal: controller.signal,
                mode: 'cors' // Explicitly enable CORS
              });
              
              clearTimeout(timeoutId);
              
              if (!response.ok) {
                console.debug(`❌ HTTP ${response.status} from ${endpoint}`);
                continue;
              }
              
              const result = await response.json();
              console.debug('📡 My Quran API response received:', result);
              
              const prayerData = this.parseMyQuranResponse(result, latitude, longitude, method);
              if (prayerData) {
                console.info('✅ Successfully parsed My Quran API response');
                return prayerData;
              }
            } catch (error) {
              console.debug(`🔌 Failed endpoint ${endpoint}:`, error instanceof Error ? error.message : 'Unknown error');
              continue;
            }
          }
        }
  
        console.debug('🚫 All My Quran API endpoints failed');
        return null;
        
      } catch (error) {
        console.debug('🔌 My Quran API connection failed:', error instanceof Error ? error.message : 'Unknown error');
        return null;
      }
    }
  
    async getPrayerTimes(
      latitude: number, 
      longitude: number, 
      date?: string,
      method: number = 15
    ): Promise<MyQuranPrayerTimesData> {
      console.info('🕌 Loading prayer times...', { latitude, longitude, method });
      
      // Log location info for debugging
      const detectedCity = this.getCityFromCoordinates(latitude, longitude);
      const locationInfo = this.getEnhancedLocationInfo(latitude, longitude, detectedCity);
      console.info('🏙️ Location analysis:', { detectedCity, locationInfo });
      
      // Start with local calculator immediately (primary service)
      const localPromise = this.getLocalPrayerTimes(latitude, longitude, date, method);
      
      // Try API enhancement in parallel (but don't wait for it)
      if (this.useApiAsEnhancement) {
        this.tryMyQuranAPI(latitude, longitude, date, method)
          .then(apiResult => {
            if (apiResult) {
              console.info('💡 My Quran API enhancement available (not used this time)');
              // Could store for next time or merge specific data
            }
          })
          .catch(() => {
            // Silent fail for enhancement
          });
      }
      
      // Return local calculator result immediately
      return localPromise;
    }
  
    async getPrayerTimesByCity(
      city: string, 
      country: string, 
      date?: string,
      method: number = 15
    ): Promise<MyQuranPrayerTimesData> {
      console.info('🏙️ Loading prayer times for city:', { city, country, method });
      
      // Use local calculator directly for city-based requests
      if (this.fallbackService) {
        return this.convertToMyQuranFormat(
          await this.fallbackService.getPrayerTimesByCity(city, country, date, method)
        );
      }
      
      // If no fallback, try to get coordinates and use coordinate-based method
      const coords = await this.getCurrentLocation();
      return this.getPrayerTimes(coords.latitude, coords.longitude, date, method);
    }
  
    private async getLocalPrayerTimes(
      latitude: number, 
      longitude: number, 
      date?: string,
      method: number = 15
    ): Promise<MyQuranPrayerTimesData> {
      if (!this.fallbackService) {
        // Wait a bit for fallback to initialize
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!this.fallbackService) {
          throw new Error('Prayer times service not available');
        }
      }
  
      console.info('🏠 Using local prayer calculator (primary service)');
      const result = await this.fallbackService.getPrayerTimes(latitude, longitude, date, method);
      return this.convertToMyQuranFormat(result);
    }
  
    private parseMyQuranResponse(
      response: any, 
      latitude: number, 
      longitude: number, 
      method: number,
      locationInfo?: { city?: string; country?: string }
    ): MyQuranPrayerTimesData | null {
      try {
        console.debug('🔍 Parsing API response structure...');
        
        let timings: any = null;
        let dateInfo: any = null;
        let metaInfo: any = null;
  
        // Try different response structures
        if (response.data && response.data.timings) {
          // Aladhan-like structure
          timings = response.data.timings;
          dateInfo = response.data.date;
          metaInfo = response.data.meta;
        } else if (response.jadwal) {
          // Indonesian API structure
          const jadwal = response.jadwal;
          timings = {
            Fajr: jadwal.subuh || jadwal.fajr,
            Sunrise: jadwal.syuruq || jadwal.sunrise,
            Dhuhr: jadwal.dzuhur || jadwal.dhuhr,
            Asr: jadwal.ashar || jadwal.asr,
            Sunset: jadwal.maghrib_sunset || jadwal.sunset,
            Maghrib: jadwal.maghrib,
            Isha: jadwal.isya || jadwal.isha,
            Imsak: jadwal.imsak,
            Midnight: jadwal.tengah_malam || '00:00'
          };
        } else if (response.timings || response.times) {
          // Direct timings structure
          timings = response.timings || response.times;
        } else if (response.sholat) {
          // Another possible structure
          const sholat = response.sholat;
          timings = {
            Fajr: sholat.subuh,
            Sunrise: sholat.syuruq,
            Dhuhr: sholat.dzuhur,
            Asr: sholat.ashar,
            Sunset: sholat.sunset,
            Maghrib: sholat.maghrib,
            Isha: sholat.isya,
            Imsak: sholat.imsak,
            Midnight: sholat.tengah_malam || '00:00'
          };
        } else if (response.results) {
          // Results wrapper structure
          const results = response.results;
          if (results.datetime && results.datetime.times) {
            timings = results.datetime.times;
          }
        }
  
        if (!timings) {
          console.debug('⚠️ Could not extract timings from API response');
          return null;
        }
  
        // Normalize timing format
        const normalizedTimings: MyQuranPrayerTimes = {
          Fajr: this.normalizeTime(timings.Fajr || timings.subuh || timings.fajr),
          Sunrise: this.normalizeTime(timings.Sunrise || timings.syuruq || timings.sunrise),
          Dhuhr: this.normalizeTime(timings.Dhuhr || timings.dzuhur || timings.dhuhr),
          Asr: this.normalizeTime(timings.Asr || timings.ashar || timings.asr),
          Sunset: this.normalizeTime(timings.Sunset || timings.sunset),
          Maghrib: this.normalizeTime(timings.Maghrib || timings.maghrib),
          Isha: this.normalizeTime(timings.Isha || timings.isya || timings.isha),
          Imsak: this.normalizeTime(timings.Imsak || timings.imsak),
          Midnight: this.normalizeTime(timings.Midnight || '00:00')
        };
  
        // Validate that we have essential times
        if (!normalizedTimings.Fajr || !normalizedTimings.Dhuhr || !normalizedTimings.Maghrib) {
          console.debug('⚠️ Missing essential prayer times in API response');
          return null;
        }
  
        return this.buildPrayerTimesData(normalizedTimings, latitude, longitude, method, dateInfo, metaInfo, locationInfo);
  
      } catch (error) {
        console.debug('❌ Error parsing My Quran API response:', error);
        return null;
      }
    }
  
    private buildPrayerTimesData(
      timings: MyQuranPrayerTimes,
      latitude: number,
      longitude: number,
      method: number,
      dateInfo?: any,
      metaInfo?: any,
      locationInfo?: { city?: string; country?: string }
    ): MyQuranPrayerTimesData {
      const now = new Date();
      
      const generatedDateInfo = dateInfo || {
        readable: now.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        timestamp: now.getTime().toString(),
        gregorian: {
          date: now.toISOString().split('T')[0],
          format: 'DD-MM-YYYY',
          day: now.getDate().toString().padStart(2, '0'),
          weekday: { en: now.toLocaleDateString('en-US', { weekday: 'long' }) },
          month: { 
            number: now.getMonth() + 1, 
            en: now.toLocaleDateString('en-US', { month: 'long' }) 
          },
          year: now.getFullYear().toString(),
          designation: { abbreviated: 'AD' }
        },
        hijri: {
          date: '15-06-1446',
          format: 'DD-MM-YYYY',
          day: '15',
          weekday: { en: 'Saturday', ar: 'السبت' },
          month: { number: 6, en: 'Jumada al-akhirah', ar: 'جمادى الآخرة' },
          year: '1446',
          designation: { abbreviated: 'AH' }
        }
      };
  
      // Enhanced location detection for better province information
      const detectedCity = this.getCityFromCoordinates(latitude, longitude);
      const locationData = locationInfo || this.getEnhancedLocationInfo(latitude, longitude, detectedCity);
  
      const generatedMetaInfo = metaInfo || {
        latitude,
        longitude,
        timezone: this.getTimezoneForCoordinates(latitude, longitude),
        method: {
          id: method,
          name: 'Indonesia - Kementerian Agama RI (Local Calculator)',
          params: { fajr: 20, isha: 18 }
        },
        latitudeAdjustmentMethod: 'ANGLE_BASED',
        midnightMode: 'STANDARD',
        school: 'STANDARD',
        offset: {},
        location: locationData
      };
  
      return {
        timings,
        date: generatedDateInfo,
        meta: generatedMetaInfo
      };
    }
  
    private normalizeTime(timeString: string): string {
      if (!timeString) return '00:00';
      
      // Remove any extra characters and ensure HH:MM format
      const cleaned = timeString.toString().replace(/[^\d:]/g, '');
      const parts = cleaned.split(':');
      
      if (parts.length >= 2) {
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        
        if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }
      }
      
      return '00:00';
    }
  
    private convertToMyQuranFormat(fallbackData: any): MyQuranPrayerTimesData {
      console.debug('🔄 Converting local calculator data to My Quran format');
      
      return {
        timings: {
          Fajr: fallbackData.timings.Fajr,
          Sunrise: fallbackData.timings.Sunrise,
          Dhuhr: fallbackData.timings.Dhuhr,
          Asr: fallbackData.timings.Asr,
          Sunset: fallbackData.timings.Sunset || fallbackData.timings.Maghrib,
          Maghrib: fallbackData.timings.Maghrib,
          Isha: fallbackData.timings.Isha,
          Imsak: fallbackData.timings.Imsak,
          Midnight: fallbackData.timings.Midnight || '00:00'
        },
        date: fallbackData.date,
        meta: {
          ...fallbackData.meta,
          method: {
            id: 15,
            name: 'Indonesia - Kementerian Agama RI (Local Calculator)',
            params: fallbackData.meta.method?.params || { fajr: 20, isha: 18 }
          }
        }
      };
    }
  
    private getTimezoneForCoordinates(lat: number, lng: number): string {
      // Indonesia timezone mapping
      if (lat >= -11 && lat <= 6 && lng >= 95 && lng <= 141) {
        if (lng >= 131) return 'Asia/Jayapura';   // WIT
        if (lng >= 115) return 'Asia/Makassar';   // WITA
        return 'Asia/Jakarta';                    // WIB
      }
      return 'Asia/Jakarta';
    }
  
    private getCityFromCoordinates(lat: number, lng: number): string {
      const cityCoords = [
        { name: 'Jakarta', lat: -6.2088, lng: 106.8456 },
        { name: 'Yogyakarta', lat: -7.7956, lng: 110.3695 },
        { name: 'Surabaya', lat: -7.2459, lng: 112.7378 },
        { name: 'Bandung', lat: -6.9175, lng: 107.6191 },
        { name: 'Makassar', lat: -5.1477, lng: 119.4327 },
        { name: 'Medan', lat: 3.5952, lng: 98.6722 },
        { name: 'Semarang', lat: -6.9667, lng: 110.4167 }
      ];
  
      // Check for Yogyakarta region with wider tolerance (including Bantul area)
      if (Math.abs(lat - (-7.7956)) < 0.3 && Math.abs(lng - 110.3695) < 0.5) {
        return 'Yogyakarta';
      }
  
      for (const city of cityCoords) {
        if (Math.abs(lat - city.lat) < 0.2 && Math.abs(lng - city.lng) < 0.2) {
          return city.name;
        }
      }
      
      return 'Unknown';
    }
  
    private getEnhancedLocationInfo(lat: number, lng: number, detectedCity: string): { city?: string; province?: string; country: string } {
      // Enhanced location mapping with proper province information
      const locationMap: Record<string, { city: string; province: string; country: string }> = {
        'Jakarta': { city: 'Jakarta', province: 'DKI Jakarta', country: 'Indonesia' },
        'Yogyakarta': { city: 'Yogyakarta', province: 'DI Yogyakarta', country: 'Indonesia' },
        'Surabaya': { city: 'Surabaya', province: 'Jawa Timur', country: 'Indonesia' },
        'Bandung': { city: 'Bandung', province: 'Jawa Barat', country: 'Indonesia' },
        'Makassar': { city: 'Makassar', province: 'Sulawesi Selatan', country: 'Indonesia' },
        'Medan': { city: 'Medan', province: 'Sumatera Utara', country: 'Indonesia' },
        'Semarang': { city: 'Semarang', province: 'Jawa Tengah', country: 'Indonesia' }
      };
  
      // Check for Yogyakarta region specifically (including surrounding areas like Bantul)
      if (Math.abs(lat - (-7.7956)) < 0.4 && Math.abs(lng - 110.3695) < 0.6) {
        // This covers Bantul, Sleman, and other Yogyakarta metropolitan areas
        return {
          city: 'Yogyakarta',
          province: 'DI Yogyakarta', 
          country: 'Indonesia'
        };
      }
  
      if (locationMap[detectedCity]) {
        return locationMap[detectedCity];
      }
  
      // Regional fallback based on coordinates
      if (lat >= -8.5 && lat <= -6.5 && lng >= 109.5 && lng <= 111.5) {
        // Central Java region including Yogyakarta special region
        return {
          city: detectedCity !== 'Unknown' ? detectedCity : 'Yogyakarta',
          province: 'DI Yogyakarta',
          country: 'Indonesia'
        };
      }
  
      return {
        city: detectedCity !== 'Unknown' ? detectedCity : undefined,
        country: 'Indonesia'
      };
    }
  
    // Compatibility methods for existing code
    getCurrentPrayer(prayerTimes: MyQuranPrayerTimes): {
      current: string;
      next: string;
      timeToNext: number;
      progress: number;
    } {
      if (this.fallbackService && this.fallbackService.getCurrentPrayer) {
        return this.fallbackService.getCurrentPrayer(prayerTimes);
      }
  
      // Basic implementation if fallback not available
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      const prayers = [
        { name: 'Fajr', time: this.timeToMinutes(prayerTimes.Fajr) },
        { name: 'Dhuhr', time: this.timeToMinutes(prayerTimes.Dhuhr) },
        { name: 'Asr', time: this.timeToMinutes(prayerTimes.Asr) },
        { name: 'Maghrib', time: this.timeToMinutes(prayerTimes.Maghrib) },
        { name: 'Isha', time: this.timeToMinutes(prayerTimes.Isha) }
      ].sort((a, b) => a.time - b.time);
  
      let current = 'Isha';
      let next = 'Fajr';
      let timeToNext = 0;
      let progress = 0;
  
      for (let i = 0; i < prayers.length; i++) {
        if (currentTime < prayers[i].time) {
          next = prayers[i].name;
          timeToNext = prayers[i].time - currentTime;
          
          if (i === 0) {
            current = 'Isha';
          } else {
            current = prayers[i - 1].name;
            const prevTime = prayers[i - 1].time;
            const totalMinutes = prayers[i].time - prevTime;
            const passedMinutes = currentTime - prevTime;
            progress = (passedMinutes / totalMinutes) * 100;
          }
          break;
        }
      }
  
      if (timeToNext === 0) {
        current = 'Isha';
        next = 'Fajr';
        const ishaTime = this.timeToMinutes(prayerTimes.Isha);
        const fajrTime = this.timeToMinutes(prayerTimes.Fajr);
        timeToNext = (24 * 60) - currentTime + fajrTime;
        
        const totalMinutes = (24 * 60) - ishaTime + fajrTime;
        const passedMinutes = currentTime - ishaTime;
        progress = (passedMinutes / totalMinutes) * 100;
      }
  
      return {
        current,
        next,
        timeToNext,
        progress: Math.max(0, Math.min(100, progress))
      };
    }
  
    private timeToMinutes(timeString: string): number {
      const [hours, minutes] = timeString.split(':').map(Number);
      return hours * 60 + minutes;
    }
  
    formatTimeToNext(minutes: number): string {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      
      if (hours > 0) {
        return `${hours}j ${mins}m`;
      }
      return `${mins}m`;
    }
  
    formatTime(time: string): string {
      return time; // Already in HH:MM format
    }
  
    getCalculationMethods() {
      return [
        { id: 1, name: 'University of Islamic Sciences, Karachi' },
        { id: 2, name: 'Islamic Society of North America (ISNA)' },
        { id: 3, name: 'Muslim World League' },
        { id: 4, name: 'Umm Al-Qura University, Makkah' },
        { id: 5, name: 'Egyptian General Authority of Survey' },
        { id: 7, name: 'Institute of Geophysics, University of Tehran' },
        { id: 8, name: 'Gulf Region' },
        { id: 9, name: 'Kuwait' },
        { id: 10, name: 'Qatar' },
        { id: 11, name: 'Majlis Ugama Islam Singapura, Singapore' },
        { id: 12, name: 'Union Organization islamic de France' },
        { id: 13, name: 'Diyanet İşleri Başkanlığı, Turkey' },
        { id: 14, name: 'Spiritual Administration of Muslims of Russia' },
        { id: 15, name: 'Indonesia - Kementerian Agama RI' }
      ];
    }
  
    // Enable/disable API enhancement mode
    setApiEnhancementMode(enabled: boolean): void {
      this.useApiAsEnhancement = enabled;
      console.info(`🔧 API enhancement mode: ${enabled ? 'enabled' : 'disabled'}`);
    }
  
    // Get service status
    getServiceStatus(): { localReady: boolean; apiEnabled: boolean; mode: string } {
      return {
        localReady: !!this.fallbackService,
        apiEnabled: this.useApiAsEnhancement,
        mode: 'Local Calculator (Primary) + API Enhancement'
      };
    }
  }
  
  export const myQuranPrayerTimesService = new MyQuranPrayerTimesService();
  
  // Export compatible interface for existing code
  export type PrayerTimes = MyQuranPrayerTimes;
  export type PrayerTimesData = MyQuranPrayerTimesData;
  export const prayerTimesService = myQuranPrayerTimesService;
  
  // Initialize service
  console.info('🚀 My Quran Prayer Times Service initialized in hybrid mode');