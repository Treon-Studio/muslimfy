import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Sunrise, Sun, Star, Sunset, Moon, Bell, BellOff, MapPin, Settings, Loader2, RefreshCw, TestTube, Globe } from 'lucide-react';
import { localPrayerTimesCalculator, PrayerTimesData, LocationCoords } from '../services/prayer-times-calculator';
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

  // Load prayer times and initialize
  useEffect(() => {
    loadInitialCityOptions();
    loadPrayerTimes();
    initializeNotifications();
  }, [loadInitialCityOptions]);

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
      
      if (useIndonesianCity && selectedCity && !prayerData) {
        // Use selected Indonesian city
        const city = indonesianCitiesService.getCityById(selectedCity);
        if (city) {
          console.log('Loading prayer times for selected city:', city.name);
          const data = await localPrayerTimesCalculator.getPrayerTimes(
            city.latitude,
            city.longitude,
            undefined,
            calculationMethod,
            {
              city: city.name,
              province: city.province,
              country: 'Indonesia'
            }
          );
          setPrayerData(data);
          toast.success(`Waktu sholat berhasil dimuat untuk ${city.name}, ${city.province}`);
          return;
        }
      }
      
      if (!useIndonesianCity && manualCity && manualCountry) {
        // Use manual city input
        console.log('Loading prayer times for manual city:', manualCity, manualCountry);
        const data = await localPrayerTimesCalculator.getPrayerTimesByCity(
          manualCity, 
          manualCountry, 
          undefined, 
          calculationMethod
        );
        setPrayerData(data);
        toast.success(`Waktu sholat berhasil dimuat untuk ${manualCity}, ${manualCountry}`);
        return;
      }
      
      // Fallback to GPS location
      console.log('Using GPS location as fallback');
      const coords = await localPrayerTimesCalculator.getCurrentLocation();
      setLocation(coords);
      
      // Try to find nearby Indonesian city
      const nearbyCities = indonesianCitiesService.getNearbyCities(coords.latitude, coords.longitude, 50);
      const nearbyCity = nearbyCities[0];
      
      const data = await localPrayerTimesCalculator.getPrayerTimes(
        coords.latitude, 
        coords.longitude, 
        undefined, 
        calculationMethod,
        nearbyCity ? {
          city: nearbyCity.name,
          province: nearbyCity.province,
          country: 'Indonesia'
        } : { country: 'Indonesia' }
      );
      setPrayerData(data);
      
      if (nearbyCity) {
        toast.success(`Waktu sholat berhasil dimuat untuk ${nearbyCity.name}, ${nearbyCity.province}`);
      } else {
        toast.success('Waktu sholat berhasil dimuat berdasarkan lokasi GPS');
      }
      
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
      const info = localPrayerTimesCalculator.getCurrentPrayer(prayerData.timings);
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
            {/* Settings button */}
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <button className="w-10 h-10 bg-gray-800/60 hover:bg-gray-700/60 backdrop-blur-sm rounded-xl border border-gray-600/30 transition-all duration-200 hover:scale-105 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-gray-300" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl bg-gray-900/95 border-gray-700 max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">Pengaturan Waktu Sholat</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Atur lokasi, metode perhitungan, dan notifikasi untuk waktu sholat Anda.
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="location" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                    <TabsTrigger value="location" className="text-white">Lokasi</TabsTrigger>
                    <TabsTrigger value="method" className="text-white">Metode</TabsTrigger>
                    <TabsTrigger value="notifications" className="text-white">Notifikasi</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="location" className="space-y-6 mt-6">
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
                          <Combobox
                            value={selectedCity}
                            onValueChange={handleCitySelect}
                            onSearchChange={handleCitySearchChange}
                            placeholder="Cari kota Indonesia..."
                            searchPlaceholder="Ketik nama kota..."
                            emptyText="Kota tidak ditemukan"
                            options={cityOptions}
                            className="bg-gray-800 border-gray-600 text-white"
                          />
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
                              className="bg-gray-800 border-gray-600 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="manual-country" className="text-white">Negara</Label>
                            <Input
                              id="manual-country"
                              value={manualCountry}
                              onChange={(e) => setManualCountry(e.target.value)}
                              placeholder="Indonesia"
                              className="bg-gray-800 border-gray-600 text-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <Button onClick={handleLocationUpdate} className="flex-1">
                        Perbarui Lokasi
                      </Button>
                      <Button
                        variant="outline"
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
                  
                  <TabsContent value="method" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="method" className="text-white">Metode Perhitungan</Label>
                      <Select value={calculationMethod.toString()} onValueChange={(value) => setCalculationMethod(parseInt(value))}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {localPrayerTimesCalculator.getCalculationMethods().map((method) => (
                            <SelectItem key={method.id} value={method.id.toString()} className="text-white">
                              {method.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="space-y-4 mt-6">
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
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-yellow-400" />
                            <p className="text-yellow-400 text-sm">
                              Izin notifikasi diperlukan untuk mengaktifkan pengingat
                            </p>
                          </div>
                          <Button
                            onClick={handleNotificationPermission}
                            className="mt-2 w-full"
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
                        className="w-full"
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
                              <div key={prayer.id} className="space-y-3 bg-gray-800/50 rounded-lg p-4">
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
                    {localPrayerTimesCalculator.formatTime(prayer.time)}
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
                      <Bell className="w-1.5 h-1.5 text-white absolute top-0.5 left-0.5" />
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
              Sholat selanjutnya: {currentPrayerInfo?.next} dalam {currentPrayerInfo ? localPrayerTimesCalculator.formatTimeToNext(currentPrayerInfo.timeToNext) : 'Loading...'}
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
          
          {/* Location and notification status */}
          {prayerData && (
            <div className="text-xs text-gray-500 text-center space-y-1">
              <div>
                <MapPin className="w-3 h-3 inline mr-1" />
                {currentLocationText} • {prayerData.meta.method.name}
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="text-blue-400">
                  {new Date().toLocaleTimeString('id-ID', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    timeZone: prayerData.meta.timezone
                  })} {prayerData.meta.timezone.includes('Jakarta') ? 'WIB' : prayerData.meta.timezone.includes('Makassar') ? 'WITA' : 'WIT'}
                </div>
                {notificationSettings.globalEnabled && notificationPermission.granted && (
                  <div className="text-green-400 flex items-center gap-1">
                    <Bell className="w-3 h-3" />
                    Notifikasi aktif
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}