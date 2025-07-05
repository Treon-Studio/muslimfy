import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Sunrise, Sun, Star, Sunset, Moon, Bell, BellOff, MapPin, Settings, Loader2, RefreshCw, TestTube, Globe, Navigation, AlertCircle, CheckCircle, XCircle, Target, Shield, ExternalLink, Map, Info, Zap } from 'lucide-react';
import { myQuranPrayerTimesService, MyQuranPrayerTimesData as PrayerTimesData, LocationCoords, LOCATION_PRESETS } from '../services/my-quran-api';
import { localPrayerTimesCalculator } from '../services/prayer-times-calculator';
import { notificationService, NotificationSettings } from '../services/notification-service';
import { indonesianCitiesService, IndonesianCity } from '../services/indonesia-cities-database';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Combobox } from './ui/combobox';
import { toast } from 'sonner';
import { Alert, AlertDescription } from './ui/alert';

export function PrayerTimes() {
  const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [currentPrayerInfo, setCurrentPrayerInfo] = useState<{
    current: string;
    next: string;
    timeToNext: number;
    progress: number;
  } | null>(null);
  
  // Enhanced location settings
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [citySearch, setCitySearch] = useState<string>('');
  const [cityOptions, setCityOptions] = useState<{ value: string; label: string; subtitle: string }[]>([]);
  const [calculationMethod, setCalculationMethod] = useState(15); // Indonesia method
  const [useIndonesianCity, setUseIndonesianCity] = useState(true);
  const [manualCity, setManualCity] = useState('');
  const [manualCountry, setManualCountry] = useState('');
  
  // GPS Debug states
  const [gpsStatus, setGpsStatus] = useState<{
    hasManualOverride: boolean;
    lastKnown: LocationCoords | null;
    gpsSupported: boolean;
    currentMethod: string;
    permissionStatus: any;
  } | null>(null);
  const [showGpsDebug, setShowGpsDebug] = useState(false);
  const [showLocationHelper, setShowLocationHelper] = useState(false);
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(
    notificationService.getSettings()
  );
  const [notificationPermission, setNotificationPermission] = useState(
    notificationService.getPermissionStatus()
  );

  // Load initial city options
  const loadInitialCityOptions = useCallback(() => {
    try {
      const majorCities = indonesianCitiesService.getMajorCities();
      const options = majorCities.slice(0, 15).map(city => ({
        value: city.id,
        label: city.name,
        subtitle: `${city.province} • ${city.region.toUpperCase()}`
      }));
      setCityOptions(options);
      console.log('Loaded initial city options:', options.length);
    } catch (error) {
      console.error('Error loading initial city options:', error);
      setCityOptions([]);
    }
  }, []);

  // Update GPS status
  const updateGpsStatus = useCallback(() => {
    const status = myQuranPrayerTimesService.getLocationStatus();
    setGpsStatus(status);
    
    // Show location helper if GPS is blocked
    if (status.permissionStatus?.blocked) {
      setShowLocationHelper(true);
    }
  }, []);

  // Load prayer times and initialize
  useEffect(() => {
    loadInitialCityOptions();
    updateGpsStatus();
    loadPrayerTimes();
    initializeNotifications();
  }, [loadInitialCityOptions, updateGpsStatus]);

  // Handle city search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (citySearch.length >= 2) {
        try {
          const cities = indonesianCitiesService.getAutocompleteSuggestions(citySearch, 20);
          const options = cities.map(city => ({
            value: city.id,
            label: city.name,
            subtitle: `${city.province} • ${city.region.toUpperCase()}`
          }));
          setCityOptions(options);
          console.log('Search results for:', citySearch, '- Found:', options.length, 'cities');
        } catch (error) {
          console.error('Error searching cities:', error);
          setCityOptions([]);
        }
      } else if (citySearch.length === 0) {
        loadInitialCityOptions();
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [citySearch, loadInitialCityOptions]);

  // Update current prayer info every 30 seconds
  useEffect(() => {
    if (prayerData) {
      updateCurrentPrayerInfo();
      const interval = setInterval(updateCurrentPrayerInfo, 30000);
      return () => clearInterval(interval);
    }
  }, [prayerData]);

  // Schedule notifications when prayer data changes
  useEffect(() => {
    if (prayerData && notificationSettings.globalEnabled) {
      notificationService.scheduleNotifications(prayerData.timings);
    }
  }, [prayerData, notificationSettings]);

  const initializeNotifications = async () => {
    const permission = await notificationService.initialize();
    setNotificationPermission(notificationService.getPermissionStatus());
    
    if (permission) {
      toast.success('Notifikasi waktu sholat siap!');
    }
  };

  const loadPrayerTimes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (useIndonesianCity && selectedCity) {
        // Use selected Indonesian city
        const city = indonesianCitiesService.getCityById(selectedCity);
        if (city) {
          console.log('Loading prayer times for selected city:', city.name);
          const data = await myQuranPrayerTimesService.getPrayerTimes(
            city.latitude,
            city.longitude,
            undefined,
            calculationMethod
          );
          setPrayerData(data);
          updateGpsStatus();
          return;
        }
      }
      
      if (!useIndonesianCity && manualCity && manualCountry) {
        // Use manual city input
        console.log('Loading prayer times for manual city:', manualCity, manualCountry);
        const data = await myQuranPrayerTimesService.getPrayerTimesByCity(
          manualCity, 
          manualCountry, 
          undefined, 
          calculationMethod
        );
        setPrayerData(data);
        updateGpsStatus();
        return;
      }
      
      // Fallback to GPS location (will use fallback if GPS blocked)
      console.log('Using GPS location as fallback');
      const coords = await myQuranPrayerTimesService.getCurrentLocation();
      setLocation(coords);
      
      // Try to find nearby Indonesian city
      const nearbyCities = indonesianCitiesService.getNearbyCities(coords.latitude, coords.longitude, 50);
      const nearbyCity = nearbyCities[0];
      
      const data = await myQuranPrayerTimesService.getPrayerTimes(
        coords.latitude, 
        coords.longitude, 
        undefined, 
        calculationMethod
      );
      setPrayerData(data);
      updateGpsStatus();

      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate prayer times';
      setError(errorMessage);
      toast.error(`Gagal memuat waktu sholat: ${errorMessage}`);
      console.error('Error calculating prayer times:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentPrayerInfo = () => {
    if (prayerData) {
      const info = myQuranPrayerTimesService.getCurrentPrayer(prayerData.timings);
      setCurrentPrayerInfo(info);
    }
  };

  const handleNotificationPermission = async () => {
    const granted = await notificationService.requestPermission();
    setNotificationPermission(notificationService.getPermissionStatus());
    
    if (granted) {
      toast.success('Izin notifikasi diberikan!');
      const newSettings = notificationService.updateSettings({ globalEnabled: true });
      setNotificationSettings(newSettings);
    } else {
      toast.error('Izin notifikasi ditolak. Anda dapat mengaktifkannya di pengaturan browser.');
    }
  };

  const toggleGlobalNotifications = async (enabled: boolean) => {
    if (enabled && !notificationPermission.granted) {
      await handleNotificationPermission();
      return;
    }

    const newSettings = notificationService.updateSettings({ globalEnabled: enabled });
    setNotificationSettings(newSettings);
    
    if (enabled && prayerData) {
      notificationService.scheduleNotifications(prayerData.timings);
      toast.success('Notifikasi waktu sholat diaktifkan!');
    } else {
      notificationService.clearScheduledNotifications();
      toast.info('Notifikasi waktu sholat dinonaktifkan');
    }
  };

  const togglePrayerNotification = (prayer: string, enabled: boolean) => {
    const prayerKey = prayer.toLowerCase() as keyof Omit<NotificationSettings, 'globalEnabled' | 'soundEnabled'>;
    notificationService.updatePrayerSettings(prayerKey, { enabled });
    
    const newSettings = notificationService.getSettings();
    setNotificationSettings(newSettings);
    
    if (prayerData) {
      notificationService.scheduleNotifications(prayerData.timings);
    }
    
    toast.success(`Notifikasi ${prayer} ${enabled ? 'diaktifkan' : 'dinonaktifkan'}`);
  };

  const updatePrayerReminderMinutes = (prayer: string, minutes: number[]) => {
    const prayerKey = prayer.toLowerCase() as keyof Omit<NotificationSettings, 'globalEnabled' | 'soundEnabled'>;
    notificationService.updatePrayerSettings(prayerKey, { minutes: minutes[0] });
    
    const newSettings = notificationService.getSettings();
    setNotificationSettings(newSettings);
    
    if (prayerData) {
      notificationService.scheduleNotifications(prayerData.timings);
    }
  };

  const testNotification = async () => {
    const success = await notificationService.testNotification();
    if (success) {
      toast.success('Notifikasi test berhasil!');
    } else {
      toast.error('Gagal mengirim notifikasi test');
    }
  };

  const handleLocationUpdate = async () => {
    setShowSettings(false);
    await loadPrayerTimes();
  };

  const handleCitySelect = (cityId: string) => {
    console.log('City selected:', cityId);
    setSelectedCity(cityId);
    const city = indonesianCitiesService.getCityById(cityId);
    if (city) {
      toast.success(`Kota dipilih: ${city.name}, ${city.province}`);
    }
  };

  const handleCitySearchChange = (search: string) => {
    console.log('City search changed:', search);
    setCitySearch(search);
  };

  // Location preset handlers
  const handleLocationPreset = (presetKey: keyof typeof LOCATION_PRESETS) => {
    myQuranPrayerTimesService.setLocationPreset(presetKey);
    const preset = LOCATION_PRESETS[presetKey];
    toast.success(`Lokasi diatur ke ${preset.city}! Memuat ulang waktu sholat...`);
    setShowLocationHelper(false); // Hide helper after successful preset
    setTimeout(() => loadPrayerTimes(), 1000);
  };

  // Manual GPS location override
  const handleManualLocationOverride = () => {
    if (!prayerData?.meta?.latitude || !prayerData?.meta?.longitude) return;
    
    // Prompt user for manual coordinates
    const latInput = prompt('Enter latitude (e.g., -7.7956 for Yogyakarta):', prayerData.meta.latitude.toString());
    const lngInput = prompt('Enter longitude (e.g., 110.3695 for Yogyakarta):', prayerData.meta.longitude.toString());
    
    if (latInput && lngInput) {
      const lat = parseFloat(latInput);
      const lng = parseFloat(lngInput);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        myQuranPrayerTimesService.setManualLocation(lat, lng);
        toast.success('Manual location override set! Reloading prayer times...');
        setTimeout(() => loadPrayerTimes(), 1000);
      } else {
        toast.error('Invalid coordinates');
      }
    }
  };

  const clearManualLocationOverride = () => {
    myQuranPrayerTimesService.clearManualLocation();
    toast.success('Manual location override cleared! Reloading prayer times...');
    setTimeout(() => loadPrayerTimes(), 1000);
  };

  const handleRequestPermission = async () => {
    const success = await myQuranPrayerTimesService.requestLocationPermission();
    updateGpsStatus();
    if (success) {
      toast.success('GPS permission granted! Reloading prayer times...');
      setTimeout(() => loadPrayerTimes(), 1000);
    } else {
      toast.error('GPS permission denied or blocked.');
    }
  };

  const prayers = [
    { 
      name: 'Fajr', 
      time: prayerData?.timings.Fajr || '04:35', 
      icon: Sunrise, 
      id: 'fajr',
      gradient: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-200',
      bgActive: 'bg-purple-500/30'
    },
    { 
      name: 'Dhuhr', 
      time: prayerData?.timings.Dhuhr || '12:05', 
      icon: Sun, 
      id: 'dhuhr',
      gradient: 'from-yellow-500/20 to-orange-500/20',
      iconColor: 'text-yellow-200',
      bgActive: 'bg-yellow-500/30'
    },
    { 
      name: 'Asr', 
      time: prayerData?.timings.Asr || '15:20', 
      icon: Star, 
      id: 'asr',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-200',
      bgActive: 'bg-blue-500/30'
    },
    { 
      name: 'Maghrib', 
      time: prayerData?.timings.Maghrib || '18:15', 
      icon: Sunset, 
      id: 'maghrib',
      gradient: 'from-orange-500/20 to-red-500/20',
      iconColor: 'text-orange-200',
      bgActive: 'bg-orange-500/30'
    },
    { 
      name: 'Isha', 
      time: prayerData?.timings.Isha || '19:30', 
      icon: Moon, 
      id: 'isha',
      gradient: 'from-indigo-500/20 to-purple-500/20',
      iconColor: 'text-indigo-200',
      bgActive: 'bg-indigo-500/30'
    }
  ];

  const enabledNotifications = prayers.filter(prayer => 
    notificationService.hasPrayerReminder(prayer.name)
  ).length;

  if (loading) {
    return (
      <div className="relative rounded-3xl overflow-hidden h-full bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
        <div className="relative p-6 h-full flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-4" />
          <p className="text-white/70">Menghitung waktu sholat...</p>
          {gpsStatus && (
            <p className="text-white/50 text-sm mt-2">Method: {gpsStatus.currentMethod}</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative rounded-3xl overflow-hidden h-full bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-red-900/20"></div>
        <div className="relative p-6 h-full flex flex-col items-center justify-center">
          <Clock className="w-8 h-8 text-red-400 mb-4" />
          <p className="text-white/70 text-center mb-4">{error}</p>
          <Button 
            onClick={loadPrayerTimes}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  const selectedCityInfo = selectedCity ? indonesianCitiesService.getCityById(selectedCity) : null;
  const currentLocationText = prayerData?.meta.location ? 
    `${prayerData.meta.location.city || 'Unknown'}, ${prayerData.meta.location.province || prayerData.meta.location.country}` :
    'Location Unknown';

  // Enhanced method display text based on current location and coordinates
  const getMethodDisplayText = () => {
    if (!prayerData?.meta.method.name) return 'Kemenag Indonesia';
    
    const methodName = prayerData.meta.method.name;
    const locationCity = prayerData.meta.location?.city;
    const locationProvince = prayerData.meta.location?.province;
    const coordinates = {
      lat: prayerData.meta.latitude,
      lng: prayerData.meta.longitude
    };
    
    // If using Indonesia method, show location-specific reference
    if (methodName.includes('Indonesia') || methodName.includes('Kementerian Agama')) {
      // Find nearest city based on coordinates for more accurate reference
      let referenceCity = locationCity;
      
      // Use coordinate-based city detection for better accuracy
      if (coordinates.lat && coordinates.lng) {
        // Check for major Indonesian cities with specific coordinate ranges
        if (Math.abs(coordinates.lat - (-7.7956)) < 0.3 && Math.abs(coordinates.lng - 110.3695) < 0.5) {
          referenceCity = 'Yogyakarta';
        } else if (Math.abs(coordinates.lat - (-6.2088)) < 0.3 && Math.abs(coordinates.lng - 106.8456) < 0.5) {
          referenceCity = 'Jakarta';
        } else if (Math.abs(coordinates.lat - (-7.2459)) < 0.3 && Math.abs(coordinates.lng - 112.7378) < 0.5) {
          referenceCity = 'Surabaya';
        } else if (Math.abs(coordinates.lat - (-6.9175)) < 0.3 && Math.abs(coordinates.lng - 107.6191) < 0.5) {
          referenceCity = 'Bandung';
        } else if (Math.abs(coordinates.lat - (-6.9667)) < 0.3 && Math.abs(coordinates.lng - 110.4167) < 0.5) {
          referenceCity = 'Semarang';
        }
      }
      
      // Special handling for Yogyakarta region (including surrounding areas like Bantul)
      if (locationProvince && locationProvince.toLowerCase().includes('yogyakarta')) {
        referenceCity = 'Yogyakarta';
      }
      
      // If we have a specific city, use it
      if (referenceCity && referenceCity !== 'Unknown') {
        return `Kemenag ${referenceCity}`;
      }
      
      // Fallback to province if available
      if (locationProvince && locationProvince !== 'Unknown') {
        return `Kemenag ${locationProvince}`;
      }
    }
    
    return methodName;
  };

  const getGpsStatusIcon = () => {
    if (!gpsStatus) return Navigation;
    
    if (gpsStatus.hasManualOverride) return Target;
    if (gpsStatus.permissionStatus?.blocked) return Shield;
    if (gpsStatus.permissionStatus?.denied) return XCircle;
    if (gpsStatus.permissionStatus?.granted) return CheckCircle;
    return AlertCircle;
  };

  const getGpsStatusColor = () => {
    if (!gpsStatus) return 'text-gray-300';
    
    if (gpsStatus.hasManualOverride) return 'text-orange-300';
    if (gpsStatus.permissionStatus?.blocked) return 'text-red-300';
    if (gpsStatus.permissionStatus?.denied) return 'text-red-300';
    if (gpsStatus.permissionStatus?.granted) return 'text-green-300';
    return 'text-yellow-300';
  };

  const StatusIcon = getGpsStatusIcon();

  return (
    <div className="relative rounded-3xl overflow-hidden h-full bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 shadow-lg">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
      
      <div className="relative p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-400/20">
              <Clock className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Waktu Sholat</h2>
              <p className="text-gray-300 text-sm">
                {prayerData?.date.gregorian.weekday.en}, {prayerData?.date.gregorian.day} {prayerData?.date.gregorian.month.en}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* GPS Status Toggle */}
            <button
              onClick={() => setShowGpsDebug(!showGpsDebug)}
              className={`w-10 h-10 backdrop-blur-sm rounded-xl border transition-all duration-200 hover:scale-105 flex items-center justify-center ${
                gpsStatus?.hasManualOverride 
                  ? 'bg-orange-500/20 border-orange-400/30'
                  : gpsStatus?.permissionStatus?.granted
                  ? 'bg-green-500/20 border-green-400/30'
                  : gpsStatus?.permissionStatus?.denied || gpsStatus?.permissionStatus?.blocked
                  ? 'bg-red-500/20 border-red-400/30'
                  : 'bg-gray-800/60 border-gray-600/30'
              }`}
            >
              <StatusIcon className={`w-4 h-4 ${getGpsStatusColor()}`} />
            </button>
            
            {/* Settings button */}
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <button className="w-10 h-10 bg-gray-800/60 hover:bg-gray-700/60 backdrop-blur-sm rounded-xl border border-gray-600/30 transition-all duration-200 hover:scale-105 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-gray-300" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl bg-gray-900/95 border-gray-700 max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader className="flex-shrink-0">
                  <DialogTitle className="text-white">Pengaturan Waktu Sholat</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Atur lokasi, metode perhitungan, dan notifikasi untuk waktu sholat Anda.
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="location" className="w-full flex flex-col min-h-0 flex-1">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-800/80 backdrop-blur-sm border border-gray-600/30 p-1 flex-shrink-0">
                    <TabsTrigger 
                      value="location" 
                      className="text-gray-300 hover:text-white hover:bg-gray-700/50 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:border-white/30 data-[state=active]:shadow-lg transition-all duration-200 font-medium"
                    >
                      Lokasi
                    </TabsTrigger>
                    <TabsTrigger 
                      value="gps" 
                      className="text-gray-300 hover:text-white hover:bg-gray-700/50 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:border-white/30 data-[state=active]:shadow-lg transition-all duration-200 font-medium"
                    >
                      GPS Fix
                    </TabsTrigger>
                    <TabsTrigger 
                      value="method" 
                      className="text-gray-300 hover:text-white hover:bg-gray-700/50 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:border-white/30 data-[state=active]:shadow-lg transition-all duration-200 font-medium"
                    >
                      Metode
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications" 
                      className="text-gray-300 hover:text-white hover:bg-gray-700/50 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:border-white/30 data-[state=active]:shadow-lg transition-all duration-200 font-medium"
                    >
                      Notifikasi
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="location" className="space-y-6 mt-8 overflow-y-auto mobile-scroll scrollbar-thin flex-1 min-h-0">
                    {/* Current location display */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm font-medium">Lokasi Saat Ini</span>
                      </div>
                      <p className="text-white">{currentLocationText}</p>
                      {prayerData?.meta.timezone && (
                        <p className="text-gray-400 text-sm">Zona Waktu: {prayerData.meta.timezone}</p>
                      )}
                      {prayerData?.meta.latitude && prayerData?.meta.longitude && (
                        <p className="text-gray-500 text-xs mt-1">
                          {prayerData.meta.latitude.toFixed(4)}, {prayerData.meta.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>

                    {/* Quick Location Presets */}
                    <div className="space-y-3">
                      <Label className="text-white">Quick Location Presets</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(LOCATION_PRESETS).map(([key, preset]) => (
                          <Button
                            key={key}
                            onClick={() => handleLocationPreset(key as keyof typeof LOCATION_PRESETS)}
                            variant="outline"
                            size="sm"
                            className="bg-gray-800/40 border-gray-600/50 text-white hover:bg-gray-700/60 hover:border-gray-500/60 justify-start"
                          >
                            <MapPin className="w-3 h-3 mr-2" />
                            {preset.city}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Location type selector */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="location-type"
                          checked={useIndonesianCity}
                          onCheckedChange={setUseIndonesianCity}
                        />
                        <Label htmlFor="location-type" className="text-white">
                          Gunakan kota Indonesia
                        </Label>
                      </div>

                      {useIndonesianCity ? (
                        // Indonesian city selector
                        <div className="space-y-3">
                          <Label className="text-white">Pilih Kota Indonesia</Label>
                          <div className="text-sm text-gray-400 mb-2">
                            {cityOptions.length > 0 ? 
                              `${cityOptions.length} kota tersedia` : 
                              'Memuat daftar kota...'
                            }
                          </div>
                          <div className="relative">
                            <Combobox
                              value={selectedCity}
                              onValueChange={handleCitySelect}
                              onSearchChange={handleCitySearchChange}
                              placeholder="Cari kota Indonesia..."
                              searchPlaceholder="Ketik nama kota..."
                              emptyText="Kota tidak ditemukan"
                              options={cityOptions}
                              className="bg-gray-800/80 backdrop-blur-sm border-gray-600/50 text-white hover:border-gray-500/60 focus:border-blue-400/60 transition-colors"
                            />
                          </div>
                          {selectedCityInfo && (
                            <div className="text-sm text-gray-400 mt-2 p-3 bg-gray-800/50 rounded-lg">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="text-gray-500">Provinsi:</span> {selectedCityInfo.province}
                                </div>
                                <div>
                                  <span className="text-gray-500">Wilayah:</span> {selectedCityInfo.region.toUpperCase()}
                                </div>
                                <div>
                                  <span className="text-gray-500">Timezone:</span> {selectedCityInfo.timezone}
                                </div>
                                {selectedCityInfo.population && (
                                  <div>
                                    <span className="text-gray-500">Populasi:</span> {selectedCityInfo.population.toLocaleString()} jiwa
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Manual city input
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="manual-city" className="text-white">Kota</Label>
                            <Input
                              id="manual-city"
                              value={manualCity}
                              onChange={(e) => setManualCity(e.target.value)}
                              placeholder="Jakarta"
                              className="bg-gray-800/80 backdrop-blur-sm border-gray-600/50 text-white placeholder:text-gray-400 hover:border-gray-500/60 focus:border-blue-400/60 transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="manual-country" className="text-white">Negara</Label>
                            <Input
                              id="manual-country"
                              value={manualCountry}
                              onChange={(e) => setManualCountry(e.target.value)}
                              placeholder="Indonesia"
                              className="bg-gray-800/80 backdrop-blur-sm border-gray-600/50 text-white placeholder:text-gray-400 hover:border-gray-500/60 focus:border-blue-400/60 transition-colors"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleLocationUpdate} 
                        className="flex-1 bg-blue-600/80 hover:bg-blue-600/90 text-white"
                      >
                        Perbarui Lokasi
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-gray-800/40 border-gray-600/50 text-white hover:bg-gray-700/60 hover:border-gray-500/60"
                        onClick={() => {
                          setSelectedCity('');
                          setManualCity('');
                          setManualCountry('');
                          setUseIndonesianCity(true);
                          setShowSettings(false);
                          loadPrayerTimes();
                        }}
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Auto GPS
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="gps" className="space-y-4 mt-8 overflow-y-auto mobile-scroll scrollbar-thin flex-1 min-h-0">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-white font-medium mb-3">GPS Troubleshooting & Solutions</h3>
                        
                        {gpsStatus && (
                          <div className="space-y-3">
                            <Alert className="bg-gray-800/60 border-gray-600/50">
                              <StatusIcon className="h-4 w-4" />
                              <AlertDescription className="text-gray-300">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    {gpsStatus.gpsSupported ? (
                                      <CheckCircle className="w-4 h-4 text-green-400" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-red-400" />
                                    )}
                                    <span>GPS Support: {gpsStatus.gpsSupported ? 'Available' : 'Not Available'}</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    {gpsStatus.permissionStatus?.granted ? (
                                      <CheckCircle className="w-4 h-4 text-green-400" />
                                    ) : gpsStatus.permissionStatus?.blocked ? (
                                      <Shield className="w-4 h-4 text-red-400" />
                                    ) : gpsStatus.permissionStatus?.denied ? (
                                      <XCircle className="w-4 h-4 text-red-400" />
                                    ) : (
                                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                                    )}
                                    <span>
                                      Permission: {
                                        gpsStatus.permissionStatus?.granted ? 'Granted' :
                                        gpsStatus.permissionStatus?.blocked ? 'Blocked by Policy' :
                                        gpsStatus.permissionStatus?.denied ? 'Denied' :
                                        'Not Requested'
                                      }
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    {gpsStatus.hasManualOverride ? (
                                      <Target className="w-4 h-4 text-orange-400" />
                                    ) : gpsStatus.lastKnown ? (
                                      <CheckCircle className="w-4 h-4 text-green-400" />
                                    ) : (
                                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                                    )}
                                    <span>Method: {gpsStatus.currentMethod}</span>
                                  </div>
                                  
                                  {gpsStatus.lastKnown && (
                                    <div className="text-sm text-gray-400 mt-2">
                                      Last Known: {gpsStatus.lastKnown.latitude.toFixed(4)}, {gpsStatus.lastKnown.longitude.toFixed(4)}
                                    </div>
                                  )}
                                  
                                  {gpsStatus.permissionStatus?.errorMessage && (
                                    <div className="text-sm text-red-400 mt-2">
                                      Error: {gpsStatus.permissionStatus.errorMessage}
                                    </div>
                                  )}
                                </div>
                              </AlertDescription>
                            </Alert>

                            {/* Comprehensive GPS Permission Guide */}
                            {(gpsStatus.permissionStatus?.blocked || gpsStatus.permissionStatus?.denied) && (
                              <Alert className="bg-blue-500/10 border-blue-500/20">
                                <Info className="h-4 w-4" />
                                <AlertDescription className="text-blue-300">
                                  <div className="space-y-3">
                                    <p className="font-medium">How to Enable Location Access:</p>
                                    
                                    <div className="text-sm space-y-2">
                                      <div>
                                        <p className="font-medium text-blue-200">Chrome/Edge:</p>
                                        <ul className="list-disc list-inside space-y-1 text-blue-300/80 ml-2">
                                          <li>Click the 🔒 lock icon in address bar</li>
                                          <li>Set Location to "Allow"</li>
                                          <li>Refresh the page</li>
                                        </ul>
                                      </div>
                                      
                                      <div>
                                        <p className="font-medium text-blue-200">Firefox:</p>
                                        <ul className="list-disc list-inside space-y-1 text-blue-300/80 ml-2">
                                          <li>Click the shield icon in address bar</li>
                                          <li>Select "Allow Location Access"</li>
                                          <li>Reload the page</li>
                                        </ul>
                                      </div>
                                      
                                      <div>
                                        <p className="font-medium text-blue-200">Safari:</p>
                                        <ul className="list-disc list-inside space-y-1 text-blue-300/80 ml-2">
                                          <li>Go to Safari → Settings → Websites → Location</li>
                                          <li>Set this website to "Allow"</li>
                                          <li>Refresh the page</li>
                                        </ul>
                                      </div>
                                      
                                      <div>
                                        <p className="font-medium text-blue-200">Alternative Solution:</p>
                                        <p className="text-blue-300/80">Use the location presets above - no GPS required!</p>
                                      </div>
                                    </div>
                                  </div>
                                </AlertDescription>
                              </Alert>
                            )}

                            {/* Action buttons */}
                            <div className="space-y-2">
                              {!gpsStatus.permissionStatus?.granted && (
                                <Button
                                  onClick={handleRequestPermission}
                                  className="w-full bg-blue-600/80 hover:bg-blue-600/90 text-white"
                                >
                                  <Shield className="w-4 h-4 mr-2" />
                                  Request GPS Permission
                                </Button>
                              )}
                              
                              {gpsStatus.hasManualOverride ? (
                                <Button
                                  onClick={clearManualLocationOverride}
                                  variant="outline"
                                  className="w-full bg-orange-600/20 border-orange-500/40 text-orange-300 hover:bg-orange-600/30"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Clear Manual Override
                                </Button>
                              ) : (
                                <Button
                                  onClick={handleManualLocationOverride}
                                  variant="outline"
                                  className="w-full bg-gray-800/40 border-gray-600/50 text-white hover:bg-gray-700/60"
                                >
                                  <Target className="w-4 h-4 mr-2" />
                                  Set Manual Coordinates
                                </Button>
                              )}
                              
                              <Button
                                onClick={() => {
                                  myQuranPrayerTimesService.clearManualLocation();
                                  loadPrayerTimes();
                                }}
                                variant="outline"
                                className="w-full bg-gray-800/40 border-gray-600/50 text-white hover:bg-gray-700/60"
                              >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Force GPS Refresh
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="method" className="space-y-4 mt-8 overflow-y-auto mobile-scroll scrollbar-thin flex-1 min-h-0">
                    <div className="space-y-2">
                      <Label htmlFor="method" className="text-white">Metode Perhitungan</Label>
                      <Select value={calculationMethod.toString()} onValueChange={(value) => setCalculationMethod(parseInt(value))}>
                        <SelectTrigger className="bg-gray-800/80 backdrop-blur-sm border-gray-600/50 text-white hover:border-gray-500/60 focus:border-blue-400/60 transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800/95 backdrop-blur-md border-gray-600/50 shadow-xl">
                          {myQuranPrayerTimesService.getCalculationMethods().map((method) => (
                            <SelectItem 
                              key={method.id} 
                              value={method.id.toString()} 
                              className="text-white hover:bg-gray-700/50 focus:bg-gray-700/50 cursor-pointer"
                            >
                              {method.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="space-y-4 mt-8 overflow-y-auto mobile-scroll scrollbar-thin flex-1 min-h-0">
                    {/* Global notification settings */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-white">Notifikasi Waktu Sholat</Label>
                          <p className="text-sm text-gray-400">
                            Aktifkan pengingat untuk waktu sholat
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.globalEnabled}
                          onCheckedChange={toggleGlobalNotifications}
                        />
                      </div>
                      
                      {!notificationPermission.granted && (
                        <div className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-yellow-400" />
                            <p className="text-yellow-400 text-sm">
                              Izin notifikasi diperlukan untuk mengaktifkan pengingat
                            </p>
                          </div>
                          <Button
                            onClick={handleNotificationPermission}
                            className="mt-2 w-full bg-yellow-600/80 hover:bg-yellow-600/90 text-white border-yellow-500/30"
                            size="sm"
                          >
                            Minta Izin Notifikasi
                          </Button>
                        </div>
                      )}
                      
                      {/* Test notification */}
                      <Button
                        onClick={testNotification}
                        variant="outline"
                        className="w-full bg-gray-800/40 border-gray-600/50 text-white hover:bg-gray-700/60 hover:border-gray-500/60 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!notificationPermission.granted}
                      >
                        <TestTube className="w-4 h-4 mr-2" />
                        Test Notifikasi
                      </Button>
                      
                      {/* Individual prayer notifications */}
                      {notificationSettings.globalEnabled && (
                        <div className="space-y-4 border-t border-gray-700 pt-4">
                          <Label className="text-white">Pengaturan Per Sholat</Label>
                          {prayers.map((prayer) => {
                            const prayerKey = prayer.id as keyof Omit<NotificationSettings, 'globalEnabled' | 'soundEnabled'>;
                            const prayerSettings = notificationSettings[prayerKey];
                            
                            return (
                              <div key={prayer.id} className="space-y-3 bg-gray-800/60 backdrop-blur-sm border border-gray-700/30 rounded-lg p-4 hover:bg-gray-800/70 transition-colors">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <prayer.icon className="w-4 h-4 text-gray-300" />
                                    <span className="text-white">{prayer.name}</span>
                                  </div>
                                  <Switch
                                    checked={prayerSettings?.enabled || false}
                                    onCheckedChange={(enabled) => togglePrayerNotification(prayer.name, enabled)}
                                  />
                                </div>
                                
                                {prayerSettings?.enabled && (
                                  <div className="space-y-2">
                                    <Label className="text-sm text-gray-400">
                                      Pengingat {prayerSettings.minutes} menit sebelumnya
                                    </Label>
                                    <Slider
                                      value={[prayerSettings.minutes]}
                                      onValueChange={(value) => updatePrayerReminderMinutes(prayer.name, value)}
                                      max={30}
                                      min={1}
                                      step={1}
                                      className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500">
                                      <span>1 menit</span>
                                      <span>30 menit</span>
                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            {/* Notification status button */}
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800/60 hover:bg-gray-700/60 backdrop-blur-sm rounded-xl border border-gray-600/30 transition-all duration-200 hover:scale-105"
            >
              {notificationSettings.globalEnabled && notificationPermission.granted ? (
                <Bell className="w-4 h-4 text-green-300" />
              ) : (
                <BellOff className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-xs text-gray-300 font-medium">
                {enabledNotifications}/5
              </span>
            </button>
          </div>
        </div>
        
        {/* Location Helper Banner */}
        {showLocationHelper && gpsStatus?.permissionStatus?.blocked && (
          <div className="mb-4 p-4 bg-orange-500/10 backdrop-blur-sm border border-orange-500/20 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-orange-400 mt-0.5" />
                <div>
                  <h3 className="text-orange-300 font-medium text-sm">GPS Blocked - Quick Solution</h3>
                  <p className="text-orange-400/80 text-xs mt-1">
                    Click the <strong>"Jogja"</strong> button above for instant Yogyakarta prayer times, or use Settings → GPS Fix for detailed help.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowLocationHelper(false)}
                className="text-orange-400 hover:text-orange-300"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* GPS Debug Panel */}
        {showGpsDebug && gpsStatus && (
          <div className="mb-4 p-3 bg-gray-800/60 backdrop-blur-sm border border-gray-600/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium text-sm">GPS Debug Info</span>
              <button 
                onClick={() => setShowGpsDebug(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <div>Support: {gpsStatus.gpsSupported ? '✅' : '❌'}</div>
              <div>Permission: {
                gpsStatus.permissionStatus?.granted ? '✅ Granted' :
                gpsStatus.permissionStatus?.blocked ? '🚫 Blocked' :
                gpsStatus.permissionStatus?.denied ? '❌ Denied' :
                '⏳ Unknown'
              }</div>
              <div>Method: {gpsStatus.currentMethod}</div>
              <div>Override: {gpsStatus.hasManualOverride ? '🎯' : '❌'}</div>
              {gpsStatus.lastKnown && (
                <div>Last: {gpsStatus.lastKnown.latitude.toFixed(4)}, {gpsStatus.lastKnown.longitude.toFixed(4)}</div>
              )}
              {gpsStatus.permissionStatus?.errorMessage && (
                <div className="text-red-400">Error: {gpsStatus.permissionStatus.errorMessage}</div>
              )}
            </div>
            <div className="mt-2 flex gap-2">
              {gpsStatus.permissionStatus?.blocked && (
                <Button
                  onClick={handleRequestPermission}
                  size="sm"
                  className="bg-blue-600/80 hover:bg-blue-600/90 text-white text-xs"
                >
                  Fix Permission
                </Button>
              )}
              <Button
                onClick={() => handleLocationPreset('yogyakarta')}
                size="sm"
                variant="outline"
                className="bg-orange-600/20 border-orange-500/40 text-orange-300 hover:bg-orange-600/30 text-xs"
              >
                Use Jogja
              </Button>
            </div>
          </div>
        )}
        
        {/* Prayer times grid */}
        <div className="flex-1 flex items-center">
          <div className="grid grid-cols-5 gap-3 w-full">
            {prayers.map((prayer) => {
              const IconComponent = prayer.icon;
              const hasNotification = notificationService.hasPrayerReminder(prayer.name);
              const isNext = currentPrayerInfo?.next.toLowerCase() === prayer.id.toLowerCase();
              
              return (
                <button
                  key={prayer.id}
                  onClick={() => togglePrayerNotification(prayer.name, !hasNotification)}
                  className={`group relative rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105 border ${
                    isNext
                      ? 'bg-gradient-to-br from-blue-600/40 to-blue-700/40 border-blue-400/30 shadow-lg shadow-blue-500/10'
                      : 'bg-gray-800/40 hover:bg-gray-700/50 backdrop-blur-sm border-gray-600/20 hover:border-gray-500/30'
                  }`}
                >
                  {/* Gradient overlay for non-next prayers */}
                  {!isNext && (
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl bg-gradient-to-br ${prayer.gradient}`}></div>
                  )}
                  
                  {/* Icon container */}
                  <div className={`relative mb-3 mx-auto w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isNext
                      ? 'bg-white/15 backdrop-blur-sm' 
                      : 'bg-gray-700/30 group-hover:bg-gray-600/40'
                  }`}>
                    <IconComponent 
                      className={`w-4 h-4 transition-colors duration-300 ${
                        isNext
                          ? 'text-white' 
                          : `${prayer.iconColor} group-hover:text-white`
                      }`} 
                    />
                  </div>
                  
                  {/* Time */}
                  <div className={`text-sm font-semibold mb-1 transition-colors duration-300 ${
                    isNext ? 'text-white' : 'text-gray-200 group-hover:text-white'
                  }`}>
                    {myQuranPrayerTimesService.formatTime(prayer.time)}
                  </div>
                  
                  {/* Prayer name */}
                  <div className={`text-xs font-medium transition-colors duration-300 ${
                    isNext ? 'text-blue-100' : 'text-gray-400 group-hover:text-gray-300'
                  }`}>
                    {prayer.name}
                  </div>
                  

                  
                  {/* Notification indicator */}
                  {hasNotification && (
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900">
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Progress section */}
        <div className="mt-6 space-y-3 pb-6">
          {/* Next prayer info */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              Sholat selanjutnya: {currentPrayerInfo?.next} dalam {currentPrayerInfo ? myQuranPrayerTimesService.formatTimeToNext(currentPrayerInfo.timeToNext) : 'Loading...'}
            </span>
            <span>{Math.round(currentPrayerInfo?.progress || 0)}% selesai</span>
          </div>
          
          {/* Progress bar */}
          <div className="relative">
            <div className="w-full bg-gray-800/60 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500 relative"
                style={{ width: `${currentPrayerInfo?.progress || 0}%` }}
              >
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Footer - Based on information */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <span>Based on: {getMethodDisplayText()}</span>
              <span className="text-blue-400">•</span>
              <button 
                onClick={() => setShowSettings(true)}
                className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-dotted"
              >
                Change
              </button>
            </div>
            <span>Times may vary</span>
          </div>
          <div className="flex items-center justify-center text-xs text-gray-500 mt-1">
            <span>GMT+07:00 
              {gpsStatus?.hasManualOverride && <span className="text-orange-400 ml-1">• Manual Override</span>}
              {gpsStatus?.permissionStatus?.blocked && <span className="text-red-400 ml-1">• GPS Blocked</span>}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}