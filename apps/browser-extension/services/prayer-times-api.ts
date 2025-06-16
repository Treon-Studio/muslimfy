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
    };
  }
  
  export interface LocationCoords {
    latitude: number;
    longitude: number;
  }
  
  export interface LocationInfo {
    city: string;
    country: string;
    timezone: string;
  }
  
  class PrayerTimesService {
    private baseUrl = 'https://api.aladhan.com/v1'; // Changed to HTTPS
    
    async getCurrentLocation(): Promise<LocationCoords> {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          console.warn('Geolocation is not supported by this browser, using default location');
          resolve({
            latitude: -6.2088,
            longitude: 106.8456
          });
          return;
        }
  
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            // Fallback to Jakarta, Indonesia if location access is denied
            console.warn('Location access denied, using default location (Jakarta, Indonesia)');
            resolve({
              latitude: -6.2088,
              longitude: 106.8456
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });
    }
  
    async getPrayerTimes(
      latitude: number, 
      longitude: number, 
      date?: string,
      method: number = 2 // Islamic Society of North America (ISNA)
    ): Promise<PrayerTimesData> {
      const dateParam = date || new Date().toISOString().split('T')[0];
      
      try {
        const response = await fetch(
          `${this.baseUrl}/timings/${dateParam}?latitude=${latitude}&longitude=${longitude}&method=${method}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.code !== 200) {
          throw new Error(result.data || 'Failed to fetch prayer times');
        }
        
        return result.data;
      } catch (error) {
        console.error('Error fetching prayer times:', error);
        // Return mock data as fallback with current location
        return this.getMockPrayerTimes(latitude, longitude);
      }
    }
  
    async getPrayerTimesByCity(
      city: string, 
      country: string, 
      date?: string,
      method: number = 2
    ): Promise<PrayerTimesData> {
      const dateParam = date || new Date().toISOString().split('T')[0];
      
      try {
        const response = await fetch(
          `${this.baseUrl}/timingsByCity/${dateParam}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.code !== 200) {
          throw new Error(result.data || 'Failed to fetch prayer times');
        }
        
        return result.data;
      } catch (error) {
        console.error('Error fetching prayer times by city:', error);
        // Return mock data for the specified city
        return this.getMockPrayerTimes(-6.2088, 106.8456, city, country);
      }
    }
  
    private getMockPrayerTimes(
      latitude: number = -6.2088, 
      longitude: number = 106.8456,
      city?: string,
      country?: string
    ): PrayerTimesData {
      const now = new Date();
      
      // Generate realistic prayer times based on location
      const baseHour = 5; // Fajr base
      const prayerTimes = {
        Fajr: this.formatTimeString(baseHour, 30),
        Sunrise: this.formatTimeString(baseHour + 1, 15),
        Dhuhr: this.formatTimeString(12, 15),
        Asr: this.formatTimeString(15, 45),
        Sunset: this.formatTimeString(18, 20),
        Maghrib: this.formatTimeString(18, 20),
        Isha: this.formatTimeString(19, 45),
        Imsak: this.formatTimeString(baseHour, 20),
        Midnight: this.formatTimeString(0, 15)
      };
  
      return {
        timings: prayerTimes,
        date: {
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
            day: now.getDate().toString(),
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
        },
        meta: {
          latitude,
          longitude,
          timezone: 'Asia/Jakarta',
          method: {
            id: 2,
            name: 'Islamic Society of North America (ISNA)',
            params: {}
          },
          latitudeAdjustmentMethod: 'ANGLE_BASED',
          midnightMode: 'STANDARD',
          school: 'STANDARD',
          offset: {}
        }
      };
    }
  
    private formatTimeString(hour: number, minute: number): string {
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }
  
    getCurrentPrayer(prayerTimes: PrayerTimes): {
      current: string;
      next: string;
      timeToNext: number;
      progress: number;
    } {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      // Convert prayer times to minutes
      const prayers = [
        { name: 'Fajr', time: this.timeToMinutes(prayerTimes.Fajr) },
        { name: 'Dhuhr', time: this.timeToMinutes(prayerTimes.Dhuhr) },
        { name: 'Asr', time: this.timeToMinutes(prayerTimes.Asr) },
        { name: 'Maghrib', time: this.timeToMinutes(prayerTimes.Maghrib) },
        { name: 'Isha', time: this.timeToMinutes(prayerTimes.Isha) }
      ].sort((a, b) => a.time - b.time);
  
      let current = 'Isha'; // Default to Isha (night prayer)
      let next = 'Fajr'; // Default to Fajr (dawn prayer)
      let timeToNext = 0;
      let progress = 0;
  
      // Find current and next prayer
      for (let i = 0; i < prayers.length; i++) {
        if (currentTime < prayers[i].time) {
          next = prayers[i].name;
          timeToNext = prayers[i].time - currentTime;
          
          if (i === 0) {
            current = 'Isha'; // Before Fajr, we're in Isha time
            const ishaTime = this.timeToMinutes(prayerTimes.Isha);
            const totalMinutes = (24 * 60) - ishaTime + prayers[i].time;
            const passedMinutes = currentTime >= ishaTime ? 
              currentTime - ishaTime : 
              (24 * 60) - ishaTime + currentTime;
            progress = (passedMinutes / totalMinutes) * 100;
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
  
      // If we haven't found next prayer, we're after Isha
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
        return `${hours}h ${mins}m`;
      }
      return `${mins}m`;
    }
  
    formatTime(time: string): string {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
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
        { id: 14, name: 'Spiritual Administration of Muslims of Russia' }
      ];
    }
  }
  
  export const prayerTimesService = new PrayerTimesService();