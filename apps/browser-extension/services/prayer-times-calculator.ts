export interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Sunset: string;
    Maghrib: string;
    Isha: string;
    Imsak: string;
    Midnight: string;
    // Add index signature to allow any string key
    [key: string]: string;
  }
  
  export interface PrayerTimesData {
    timings: PrayerTimes;
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
  
  interface CalculationMethod {
    id: number;
    name: string;
    fajr: number;
    isha: number;
    maghrib: number;
    midnight: string;
  }
  
  class LocalPrayerTimesCalculator {
    private methods: CalculationMethod[] = [
      { id: 1, name: 'University of Islamic Sciences, Karachi', fajr: 18, isha: 18, maghrib: 0, midnight: 'Standard' },
      { id: 2, name: 'Islamic Society of North America (ISNA)', fajr: 15, isha: 15, maghrib: 0, midnight: 'Standard' },
      { id: 3, name: 'Muslim World League', fajr: 18, isha: 17, maghrib: 0, midnight: 'Standard' },
      { id: 4, name: 'Umm Al-Qura University, Makkah', fajr: 18.5, isha: 0, maghrib: 0, midnight: 'Standard' },
      { id: 5, name: 'Egyptian General Authority of Survey', fajr: 19.5, isha: 17.5, maghrib: 0, midnight: 'Standard' },
      { id: 7, name: 'Institute of Geophysics, University of Tehran', fajr: 17.7, isha: 14, maghrib: 0, midnight: 'Standard' },
      { id: 8, name: 'Gulf Region', fajr: 19.5, isha: 16.5, maghrib: 0, midnight: 'Standard' },
      { id: 9, name: 'Kuwait', fajr: 18, isha: 17.5, maghrib: 0, midnight: 'Standard' },
      { id: 10, name: 'Qatar', fajr: 18, isha: 18, maghrib: 0, midnight: 'Standard' },
      { id: 11, name: 'Majlis Ugama Islam Singapura, Singapore', fajr: 20, isha: 18, maghrib: 0, midnight: 'Standard' },
      { id: 12, name: 'Union Organization islamic de France', fajr: 12, isha: 12, maghrib: 0, midnight: 'Standard' },
      { id: 13, name: 'Diyanet İşleri Başkanlığı, Turkey', fajr: 18, isha: 17, maghrib: 0, midnight: 'Standard' },
      { id: 14, name: 'Spiritual Administration of Muslims of Russia', fajr: 16, isha: 15, maghrib: 0, midnight: 'Standard' },
      { id: 15, name: 'Indonesia - Kementerian Agama RI', fajr: 20, isha: 18, maghrib: 0, midnight: 'Standard' }
    ];
  
    async getCurrentLocation(): Promise<LocationCoords> {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          console.info('Geolocation is not supported, using Jakarta, Indonesia as default');
          resolve({ latitude: -6.2088, longitude: 106.8456 });
          return;
        }
  
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.info('Location obtained successfully');
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            console.info('Location access denied, using Jakarta, Indonesia as default');
            resolve({ latitude: -6.2088, longitude: 106.8456 });
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });
    }
  
    async getPrayerTimes(
      latitude: number, 
      longitude: number, 
      date?: string,
      methodId: number = 15,
      locationInfo?: { city?: string; province?: string; country: string }
    ): Promise<PrayerTimesData> {
      console.info('Calculating prayer times locally for coordinates:', { latitude, longitude });
      
      const targetDate = date ? new Date(date) : new Date();
      const method = this.methods.find(m => m.id === methodId) || this.methods[14]; // Default to Indonesia
      
      const prayerTimes = this.calculatePrayerTimes(latitude, longitude, targetDate, method);
      
      return {
        timings: prayerTimes,
        date: this.formatDate(targetDate),
        meta: {
          latitude,
          longitude,
          timezone: this.getTimezoneForCoordinates(latitude, longitude),
          method: {
            id: method.id,
            name: method.name,
            params: {
              fajr: method.fajr,
              isha: method.isha,
              maghrib: method.maghrib,
              midnight: method.midnight
            }
          },
          latitudeAdjustmentMethod: 'ANGLE_BASED',
          midnightMode: method.midnight.toUpperCase(),
          school: 'STANDARD',
          offset: {},
          location: locationInfo || { country: 'Indonesia', province: '', city: '' }
        }
      };
    }
  
    async getPrayerTimesByCity(
      city: string, 
      country: string, 
      date?: string,
      methodId: number = 15
    ): Promise<PrayerTimesData> {
      console.info('Calculating prayer times for city:', { city, country });
      
      // Import Indonesian cities service
      const { indonesianCitiesService } = await import('./indonesia-cities-database');
      
      // Search for Indonesian city first
      if (country.toLowerCase().includes('indonesia')) {
        const cityResults = indonesianCitiesService.searchCities(city);
        if (cityResults.length > 0) {
          const selectedCity = cityResults[0]; // Take the best match
          console.info('Found Indonesian city:', selectedCity);
          
          return this.getPrayerTimes(
            selectedCity.latitude, 
            selectedCity.longitude, 
            date, 
            methodId,
            {
              city: selectedCity.name,
              province: selectedCity.province,
              country: 'Indonesia'
            }
          );
        }
      }
      
      // Fallback to coordinate lookup for international cities
      const coords = this.getInternationalCityCoordinates(city, country);
      return this.getPrayerTimes(coords.latitude, coords.longitude, date, methodId, {
        city,
        country
      });
    }
  
    private calculatePrayerTimes(
      lat: number, 
      lng: number, 
      date: Date, 
      method: CalculationMethod
    ): PrayerTimes {
      console.info('Calculating prayer times for date:', date.toISOString());
      
      // Get the timezone offset for the given coordinates
      const timezone = this.getTimezoneForCoordinates(lat, lng);
      const targetDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
      
      // Calculate astronomical values
      const julianDay = this.getJulianDay(targetDate);
      const { equationOfTime, solarDeclination } = this.getSolarData(julianDay);
      
      // Calculate sunrise and sunset (UTC)
      const { sunrise, sunset } = this.getSunriseSunset(lat, solarDeclination, lng);
      
      // Calculate prayer times (UTC)
      const dhuhr = this.calculateDhuhr(lng, equationOfTime);
      const asr = this.calculateAsr(lat, solarDeclination, lng, equationOfTime);
      const maghrib = sunset; // Maghrib is at sunset
      const fajr = this.calculateFajr(lat, solarDeclination, lng, equationOfTime, method.fajr);
      const isha = this.calculateIsha(lat, solarDeclination, lng, equationOfTime, method.isha, sunset);
      const imsak = this.addMinutes(fajr, -10); // 10 minutes before Fajr
      const midnight = this.calculateMidnight(sunset, sunrise);
  
      // Convert to local time
      const timezoneOffset = this.getTimezoneOffsetHours(timezone);
      const prayers = {
        Fajr: this.utcToLocalTime(fajr, timezoneOffset),
        Sunrise: this.utcToLocalTime(sunrise, timezoneOffset),
        Dhuhr: this.utcToLocalTime(dhuhr, timezoneOffset),
        Asr: this.utcToLocalTime(asr, timezoneOffset),
        Sunset: this.utcToLocalTime(sunset, timezoneOffset),
        Maghrib: this.utcToLocalTime(maghrib, timezoneOffset),
        Isha: this.utcToLocalTime(isha, timezoneOffset),
        Imsak: this.utcToLocalTime(imsak, timezoneOffset),
        Midnight: this.utcToLocalTime(midnight, timezoneOffset)
      };
  
      console.info('Calculated prayer times for timezone', timezone, ':', prayers);
      return prayers;
    }
  
    private getJulianDay(date: Date): number {
      return Math.floor(date.getTime() / 86400000) + 2440587.5;
    }
  
    private getSolarData(julianDay: number): { equationOfTime: number; solarDeclination: number } {
      const n = julianDay - 2451545.0;
      const L = (280.460 + 0.9856474 * n) % 360;
      const g = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180;
      const lambda = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * Math.PI / 180;
      
      const equationOfTime = 4 * (L - 0.0057183 - Math.atan2(Math.tan(lambda), Math.cos(23.44 * Math.PI / 180)) * 180 / Math.PI);
      const solarDeclination = Math.asin(Math.sin(23.44 * Math.PI / 180) * Math.sin(lambda));
      
      return { equationOfTime, solarDeclination };
    }
  
    private getSunriseSunset(lat: number, solarDeclination: number, lng: number): { sunrise: number; sunset: number } {
      const latRad = lat * Math.PI / 180;
      const argument = -Math.tan(latRad) * Math.tan(solarDeclination);
      
      if (argument < -1 || argument > 1) {
        // Polar day or night - use approximate times
        return { sunrise: 6, sunset: 18 };
      }
      
      const hourAngle = Math.acos(argument);
      const timeCorrection = lng / 15; // longitude correction
      
      const sunrise = 12 - hourAngle * 12 / Math.PI - timeCorrection;
      const sunset = 12 + hourAngle * 12 / Math.PI - timeCorrection;
      
      return { sunrise, sunset };
    }
  
    private calculateDhuhr(lng: number, equationOfTime: number): number {
      const timeCorrection = lng / 15;
      return 12 - timeCorrection - equationOfTime / 60;
    }
  
    private calculateAsr(lat: number, solarDeclination: number, lng: number, equationOfTime: number): number {
      const latRad = lat * Math.PI / 180;
      const factor = 1; // Shafi school (factor = 1), Hanafi school (factor = 2)
      const argument = (Math.sin(Math.atan(1 / (factor + Math.tan(Math.abs(latRad - solarDeclination))))) - 
                       Math.sin(latRad) * Math.sin(solarDeclination)) / 
                       (Math.cos(latRad) * Math.cos(solarDeclination));
      
      if (argument < -1 || argument > 1) {
        return 15; // Default Asr time
      }
      
      const hourAngle = Math.acos(argument);
      const timeCorrection = lng / 15;
      
      return 12 + hourAngle * 12 / Math.PI - timeCorrection - equationOfTime / 60;
    }
  
    private calculateFajr(lat: number, solarDeclination: number, lng: number, equationOfTime: number, angle: number): number {
      const latRad = lat * Math.PI / 180;
      const angleRad = angle * Math.PI / 180;
      const argument = (Math.sin(-angleRad) - Math.sin(latRad) * Math.sin(solarDeclination)) / 
                       (Math.cos(latRad) * Math.cos(solarDeclination));
      
      if (argument < -1 || argument > 1) {
        return 5; // Default Fajr time
      }
      
      const hourAngle = Math.acos(argument);
      const timeCorrection = lng / 15;
      
      return 12 - hourAngle * 12 / Math.PI - timeCorrection - equationOfTime / 60;
    }
  
    private calculateIsha(lat: number, solarDeclination: number, lng: number, equationOfTime: number, angle: number, sunset: number): number {
      if (angle === 0) {
        // For methods that use fixed minutes after sunset (like Umm Al-Qura)
        return sunset + 1.5; // 90 minutes after sunset
      }
      
      const latRad = lat * Math.PI / 180;
      const angleRad = angle * Math.PI / 180;
      const argument = (Math.sin(-angleRad) - Math.sin(latRad) * Math.sin(solarDeclination)) / 
                       (Math.cos(latRad) * Math.cos(solarDeclination));
      
      if (argument < -1 || argument > 1) {
        // Fallback: 1.5 hours after sunset for Indonesia
        return sunset + 1.5;
      }
      
      const hourAngle = Math.acos(argument);
      const timeCorrection = lng / 15;
      
      return 12 + hourAngle * 12 / Math.PI - timeCorrection - equationOfTime / 60;
    }
  
    private calculateMidnight(sunset: number, sunrise: number): number {
      // Midnight is halfway between sunset and next sunrise
      let midnight = sunset + (24 + sunrise - sunset) / 2;
      if (midnight >= 24) midnight -= 24;
      return midnight;
    }
  
    private addMinutes(time: number, minutes: number): number {
      return time + minutes / 60;
    }
  
    // Convert UTC decimal hours to local time string
    private utcToLocalTime(utcHours: number, timezoneOffsetHours: number): string {
      let localHours = utcHours + timezoneOffsetHours;
      
      // Handle day boundary crossing
      if (localHours >= 24) localHours -= 24;
      if (localHours < 0) localHours += 24;
      
      const hours = Math.floor(localHours);
      const minutes = Math.floor((localHours % 1) * 60);
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  
    // Get timezone for coordinates (simplified)
    private getTimezoneForCoordinates(lat: number, lng: number): string {
      // Indonesia timezone mapping based on coordinates
      if (lat >= -11 && lat <= 6 && lng >= 95 && lng <= 141) {
        // Eastern Indonesia (WIT - UTC+9)
        if (lng >= 131) {
          return 'Asia/Jayapura';
        }
        // Central Indonesia (WITA - UTC+8)
        else if (lng >= 115) {
          return 'Asia/Makassar';
        }
        // Western Indonesia (WIB - UTC+7)
        else {
          return 'Asia/Jakarta';
        }
      }
      
      // Default to Jakarta timezone for other locations
      return 'Asia/Jakarta';
    }
  
    // Get timezone offset in hours
    private getTimezoneOffsetHours(timezone: string): number {
      const offsets: Record<string, number> = {
        'Asia/Jakarta': 7,   // WIB
        'Asia/Makassar': 8,  // WITA
        'Asia/Jayapura': 9   // WIT
      };
      
      return offsets[timezone] || 7; // Default to WIB
    }
  
    private formatDate(date: Date): any {
      const hijriMonths = [
        'Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani',
        'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban',
        'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
      ];
  
      const hijriMonthsAr = [
        'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
        'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
        'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
      ];
  
      // Approximate Hijri conversion (simplified)
      const hijriYear = Math.floor((date.getFullYear() - 622) * 1.030684) + 1;
      const hijriMonth = (date.getMonth() + Math.floor(hijriYear * 0.3)) % 12;
      const hijriDay = Math.floor(date.getDate() * 0.97) + 1;
  
      return {
        readable: date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        timestamp: date.getTime().toString(),
        gregorian: {
          date: date.toISOString().split('T')[0],
          format: 'DD-MM-YYYY',
          day: date.getDate().toString(),
          weekday: { en: date.toLocaleDateString('en-US', { weekday: 'long' }) },
          month: { 
            number: date.getMonth() + 1, 
            en: date.toLocaleDateString('en-US', { month: 'long' }) 
          },
          year: date.getFullYear().toString(),
          designation: { abbreviated: 'AD' }
        },
        hijri: {
          date: `${hijriDay}-${hijriMonth + 1}-${hijriYear}`,
          format: 'DD-MM-YYYY',
          day: hijriDay.toString(),
          weekday: { 
            en: date.toLocaleDateString('en-US', { weekday: 'long' }), 
            ar: this.getArabicWeekday(date.getDay()) 
          },
          month: { 
            number: hijriMonth + 1, 
            en: hijriMonths[hijriMonth], 
            ar: hijriMonthsAr[hijriMonth] 
          },
          year: hijriYear.toString(),
          designation: { abbreviated: 'AH' }
        }
      };
    }
  
    private getArabicWeekday(dayIndex: number): string {
      const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      return arabicDays[dayIndex];
    }
  
    // Fallback for international cities
    private getInternationalCityCoordinates(city: string, country: string): LocationCoords {
      const cities: Record<string, LocationCoords> = {
        'mecca_saudi arabia': { latitude: 21.4225, longitude: 39.8262 },
        'medina_saudi arabia': { latitude: 24.5247, longitude: 39.5692 },
        'istanbul_turkey': { latitude: 41.0082, longitude: 28.9784 },
        'cairo_egypt': { latitude: 30.0444, longitude: 31.2357 },
        'kuala lumpur_malaysia': { latitude: 3.1390, longitude: 101.6869 },
        'dubai_uae': { latitude: 25.2048, longitude: 55.2708 },
        'london_uk': { latitude: 51.5074, longitude: -0.1278 },
        'new york_usa': { latitude: 40.7128, longitude: -74.0060 },
        'paris_france': { latitude: 48.8566, longitude: 2.3522 },
        'berlin_germany': { latitude: 52.5200, longitude: 13.4050 },
        'tokyo_japan': { latitude: 35.6762, longitude: 139.6503 },
        'sydney_australia': { latitude: -33.8688, longitude: 151.2093 },
        'toronto_canada': { latitude: 43.6532, longitude: -79.3832 },
        'karachi_pakistan': { latitude: 24.8607, longitude: 67.0011 },
        'lahore_pakistan': { latitude: 31.5204, longitude: 74.3587 },
        'dhaka_bangladesh': { latitude: 23.8103, longitude: 90.4125 },
        'mumbai_india': { latitude: 19.0760, longitude: 72.8777 },
        'delhi_india': { latitude: 28.7041, longitude: 77.1025 }
      };
  
      const key = `${city.toLowerCase()}_${country.toLowerCase()}`;
      return cities[key] || { latitude: -6.2088, longitude: 106.8456 }; // Default to Jakarta
    }
  
    getCurrentPrayer(prayerTimes: PrayerTimes): {
      current: string;
      next: string;
      timeToNext: number;
      progress: number;
    } {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      console.info('=== CURRENT PRAYER CALCULATION ===');
      console.info('Current real time:', `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`, `(${currentTime} minutes)`);
      console.info('Prayer times received:', prayerTimes);
      
      // Convert prayer times to minutes with validation
      const prayers = [
        { name: 'Fajr', time: this.timeStringToMinutes(prayerTimes.Fajr), timeStr: prayerTimes.Fajr },
        { name: 'Dhuhr', time: this.timeStringToMinutes(prayerTimes.Dhuhr), timeStr: prayerTimes.Dhuhr },
        { name: 'Asr', time: this.timeStringToMinutes(prayerTimes.Asr), timeStr: prayerTimes.Asr },
        { name: 'Maghrib', time: this.timeStringToMinutes(prayerTimes.Maghrib), timeStr: prayerTimes.Maghrib },
        { name: 'Isha', time: this.timeStringToMinutes(prayerTimes.Isha), timeStr: prayerTimes.Isha }
      ].sort((a, b) => a.time - b.time);
  
      console.info('Sorted prayers with times in minutes:', prayers);
  
      let current = 'Isha'; // Default to last prayer
      let next = 'Fajr';    // Default to first prayer of next day
      let timeToNext = 0;
      let progress = 0;
  
      // Find current prayer period
      for (let i = 0; i < prayers.length; i++) {
        const currentPrayer = prayers[i];
        
        // Check if current time is before this prayer
        if (currentTime < currentPrayer.time) {
          next = currentPrayer.name;
          timeToNext = currentPrayer.time - currentTime;
          
          if (i === 0) {
            // Before Fajr - current is Isha from previous day
            current = 'Isha';
            const ishaTime = this.timeStringToMinutes(prayerTimes.Isha);
            
            // Calculate progress from Isha to Fajr (overnight)
            const totalMinutes = (24 * 60) - ishaTime + currentPrayer.time;
            const passedMinutes = currentTime >= ishaTime ? 
              currentTime - ishaTime : 
              (24 * 60) - ishaTime + currentTime;
            progress = Math.max(0, Math.min(100, (passedMinutes / totalMinutes) * 100));
          } else {
            // Between two prayers during the day
            const prevPrayer = prayers[i - 1];
            current = prevPrayer.name;
            
            const totalMinutes = currentPrayer.time - prevPrayer.time;
            const passedMinutes = currentTime - prevPrayer.time;
            progress = Math.max(0, Math.min(100, (passedMinutes / totalMinutes) * 100));
          }
          
          console.info(`Found: Current prayer period = ${current}, Next = ${next}`);
          console.info(`Time to next: ${timeToNext} minutes, Progress: ${progress.toFixed(1)}%`);
          break;
        }
      }
  
      // If no prayer found (after all prayers), we're after Isha
      if (timeToNext === 0) {
        current = 'Isha';
        next = 'Fajr';
        const ishaTime = this.timeStringToMinutes(prayerTimes.Isha);
        const fajrTime = this.timeStringToMinutes(prayerTimes.Fajr);
        
        // Time until next Fajr (next day)
        timeToNext = (24 * 60) - currentTime + fajrTime;
        
        // Progress since Isha
        const totalMinutes = (24 * 60) - ishaTime + fajrTime;
        const passedMinutes = currentTime - ishaTime;
        progress = Math.max(0, Math.min(100, (passedMinutes / totalMinutes) * 100));
        
        console.info(`After Isha: Current = ${current}, Next = ${next} (tomorrow)`);
        console.info(`Time to next: ${timeToNext} minutes, Progress: ${progress.toFixed(1)}%`);
      }
  
      console.info('=== FINAL RESULT ===');
      console.info(`Current Prayer: ${current}`);
      console.info(`Next Prayer: ${next}`);
      console.info(`Time to Next: ${timeToNext} minutes (${this.formatTimeToNext(timeToNext)})`);
      console.info(`Progress: ${progress.toFixed(1)}%`);
      console.info('========================');
  
      return {
        current,
        next,
        timeToNext,
        progress
      };
    }
  
    // Convert "HH:MM" string to minutes
    private timeStringToMinutes(timeString: string): number {
      if (!timeString || typeof timeString !== 'string') {
        console.warn('Invalid time string:', timeString);
        return 0;
      }
      
      const parts = timeString.split(':');
      if (parts.length !== 2) {
        console.warn('Invalid time format:', timeString);
        return 0;
      }
      
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      
      if (isNaN(hours) || isNaN(minutes)) {
        console.warn('Invalid time values:', timeString);
        return 0;
      }
      
      const totalMinutes = hours * 60 + minutes;
      console.info(`Converted ${timeString} to ${totalMinutes} minutes`);
      return totalMinutes;
    }
  
    formatTimeToNext(minutes: number): string {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      
      if (hours > 0) {
        return `${hours}j ${mins}m`; // Indonesian: jam (hours)
      }
      return `${mins}m`;
    }
  
    // This method now expects a string in "HH:MM" format
    formatTime(time: string): string {
      if (!time || typeof time !== 'string') {
        return '00:00';
      }
      
      const parts = time.split(':');
      if (parts.length !== 2) {
        return '00:00';
      }
      
      const hours = parseInt(parts[0], 10);
      const minutes = parts[1];
      
      if (isNaN(hours)) {
        return '00:00';
      }
      
      // Use 24-hour format for Indonesia
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
  
    getCalculationMethods() {
      return this.methods;
    }
  
    // Get Indonesian cities for autocomplete
    async getIndonesianCities() {
      const { indonesianCitiesService } = await import('./indonesia-cities-database');
      return indonesianCitiesService.getAllCities();
    }
  
    // Search Indonesian cities
    async searchIndonesianCities(query: string) {
      const { indonesianCitiesService } = await import('./indonesia-cities-database');
      return indonesianCitiesService.getAutocompleteSuggestions(query);
    }
  
    // Get major Indonesian cities
    async getMajorIndonesianCities() {
      const { indonesianCitiesService } = await import('./indonesia-cities-database');
      return indonesianCitiesService.getMajorCities();
    }
  }
  
  export const localPrayerTimesCalculator = new LocalPrayerTimesCalculator();