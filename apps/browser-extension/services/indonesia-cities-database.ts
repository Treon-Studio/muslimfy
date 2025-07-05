export interface IndonesianCity {
  id: string;
  name: string;
  province: string;
  latitude: number;
  longitude: number;
  timezone: string;
  population?: number;
  isCapital?: boolean;
  region: 'western' | 'central' | 'eastern';
  aliases?: string[]; // Add aliases for better search
  isImportant?: boolean; // Add important flag
}

// City name aliases for better search
const cityAliases: Record<string, string[]> = {
  'yogyakarta': ['jogja', 'jogjakarta', 'yogya', 'djogja', 'djokja'],
  'jakarta': ['jkt', 'dki'],
  'surabaya': ['sby'],
  'bandung': ['bdg'],
  'medan': ['mdn'],
  'semarang': ['smg'],
  'palembang': ['plg'],
  'makassar': ['ujung pandang'],
  'solo': ['surakarta'],
  'pontianak': ['ptk'],
  'banjarmasin': ['bjm'],
  'pekanbaru': ['pkb'],
  'padang': ['pdg'],
  'denpasar': ['bali'],
  'manado': ['mdo'],
  'jayapura': ['jpr'],
  'ambon': ['amb'],
  'kupang': ['kpg'],
  'mataram': ['lombok']
};

export const indonesianCities: IndonesianCity[] = [
  // DKI Jakarta
  {
    id: 'jakarta',
    name: 'Jakarta',
    province: 'DKI Jakarta',
    latitude: -6.2088,
    longitude: 106.8456,
    timezone: 'Asia/Jakarta',
    population: 10770487,
    isCapital: true,
    isImportant: true,
    region: 'western'
  },
  {
    id: 'jakarta-pusat',
    name: 'Jakarta Pusat',
    province: 'DKI Jakarta',
    latitude: -6.1745,
    longitude: 106.8227,
    timezone: 'Asia/Jakarta',
    region: 'western'
  },
  {
    id: 'jakarta-utara',
    name: 'Jakarta Utara',
    province: 'DKI Jakarta',
    latitude: -6.1344,
    longitude: 106.8794,
    timezone: 'Asia/Jakarta',
    region: 'western'
  },
  {
    id: 'jakarta-selatan',
    name: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    latitude: -6.2615,
    longitude: 106.8106,
    timezone: 'Asia/Jakarta',
    region: 'western'
  },
  {
    id: 'jakarta-timur',
    name: 'Jakarta Timur',
    province: 'DKI Jakarta',
    latitude: -6.2250,
    longitude: 106.9004,
    timezone: 'Asia/Jakarta',
    region: 'western'
  },
  {
    id: 'jakarta-barat',
    name: 'Jakarta Barat',
    province: 'DKI Jakarta',
    latitude: -6.1668,
    longitude: 106.7594,
    timezone: 'Asia/Jakarta',
    region: 'western'
  },

  // Jawa Barat
  {
    id: 'bandung',
    name: 'Bandung',
    province: 'Jawa Barat',
    latitude: -6.9175,
    longitude: 107.6191,
    timezone: 'Asia/Jakarta',
    population: 2444160,
    isImportant: true,
    region: 'western'
  },
  {
    id: 'bogor',
    name: 'Bogor',
    province: 'Jawa Barat',
    latitude: -6.5971,
    longitude: 106.8060,
    timezone: 'Asia/Jakarta',
    population: 1081009,
    region: 'western'
  },
  {
    id: 'depok',
    name: 'Depok',
    province: 'Jawa Barat',
    latitude: -6.4058,
    longitude: 106.8186,
    timezone: 'Asia/Jakarta',
    population: 2270135,
    region: 'western'
  },
  {
    id: 'bekasi',
    name: 'Bekasi',
    province: 'Jawa Barat',
    latitude: -6.2349,
    longitude: 106.9896,
    timezone: 'Asia/Jakarta',
    population: 2663450,
    region: 'western'
  },
  {
    id: 'tangerang',
    name: 'Tangerang',
    province: 'Banten',
    latitude: -6.1783,
    longitude: 106.6319,
    timezone: 'Asia/Jakarta',
    population: 2139891,
    region: 'western'
  },
  {
    id: 'tangerang-selatan',
    name: 'Tangerang Selatan',
    province: 'Banten',
    latitude: -6.2897,
    longitude: 106.7175,
    timezone: 'Asia/Jakarta',
    population: 1790137,
    region: 'western'
  },
  {
    id: 'cirebon',
    name: 'Cirebon',
    province: 'Jawa Barat',
    latitude: -6.7063,
    longitude: 108.5571,
    timezone: 'Asia/Jakarta',
    population: 333303,
    region: 'western'
  },
  {
    id: 'tasikmalaya',
    name: 'Tasikmalaya',
    province: 'Jawa Barat',
    latitude: -7.3506,
    longitude: 108.2158,
    timezone: 'Asia/Jakarta',
    population: 716155,
    region: 'western'
  },

  // Jawa Tengah
  {
    id: 'semarang',
    name: 'Semarang',
    province: 'Jawa Tengah',
    latitude: -6.9667,
    longitude: 110.4167,
    timezone: 'Asia/Jakarta',
    population: 1729428,
    isImportant: true,
    region: 'western'
  },
  {
    id: 'solo',
    name: 'Surakarta (Solo)',
    province: 'Jawa Tengah',
    latitude: -7.5755,
    longitude: 110.8243,
    timezone: 'Asia/Jakarta',
    population: 522364,
    isImportant: true,
    region: 'western'
  },
  {
    id: 'yogyakarta',
    name: 'Yogyakarta',
    province: 'DI Yogyakarta',
    latitude: -7.7956,
    longitude: 110.3695,
    timezone: 'Asia/Jakarta',
    population: 422732,
    isImportant: true, // Mark as important
    region: 'western'
  },
  {
    id: 'magelang',
    name: 'Magelang',
    province: 'Jawa Tengah',
    latitude: -7.4698,
    longitude: 110.2177,
    timezone: 'Asia/Jakarta',
    population: 121526,
    region: 'western'
  },
  {
    id: 'tegal',
    name: 'Tegal',
    province: 'Jawa Tengah',
    latitude: -6.8694,
    longitude: 109.1402,
    timezone: 'Asia/Jakarta',
    population: 273825,
    region: 'western'
  },

  // Jawa Timur
  {
    id: 'surabaya',
    name: 'Surabaya',
    province: 'Jawa Timur',
    latitude: -7.2459,
    longitude: 112.7378,
    timezone: 'Asia/Jakarta',
    population: 2874314,
    isImportant: true,
    region: 'western'
  },
  {
    id: 'malang',
    name: 'Malang',
    province: 'Jawa Timur',
    latitude: -7.9797,
    longitude: 112.6304,
    timezone: 'Asia/Jakarta',
    population: 887443,
    isImportant: true,
    region: 'western'
  },
  {
    id: 'kediri',
    name: 'Kediri',
    province: 'Jawa Timur',
    latitude: -7.8161,
    longitude: 112.0178,
    timezone: 'Asia/Jakarta',
    population: 286796,
    region: 'western'
  },
  {
    id: 'blitar',
    name: 'Blitar',
    province: 'Jawa Timur',
    latitude: -8.0956,
    longitude: 112.1608,
    timezone: 'Asia/Jakarta',
    population: 142685,
    region: 'western'
  },
  {
    id: 'pasuruan',
    name: 'Pasuruan',
    province: 'Jawa Timur',
    latitude: -7.6453,
    longitude: 112.9075,
    timezone: 'Asia/Jakarta',
    population: 208006,
    region: 'western'
  },
  {
    id: 'probolinggo',
    name: 'Probolinggo',
    province: 'Jawa Timur',
    latitude: -7.7543,
    longitude: 113.2159,
    timezone: 'Asia/Jakarta',
    population: 230679,
    region: 'western'
  },
  {
    id: 'mojokerto',
    name: 'Mojokerto',
    province: 'Jawa Timur',
    latitude: -7.4732,
    longitude: 112.4338,
    timezone: 'Asia/Jakarta',
    population: 132434,
    region: 'western'
  },
  {
    id: 'madiun',
    name: 'Madiun',
    province: 'Jawa Timur',
    latitude: -7.6298,
    longitude: 111.5239,
    timezone: 'Asia/Jakarta',
    population: 218056,
    region: 'western'
  },
  {
    id: 'jember',
    name: 'Jember',
    province: 'Jawa Timur',
    latitude: -8.1844,
    longitude: 113.7030,
    timezone: 'Asia/Jakarta',
    population: 365571,
    region: 'western'
  },
  {
    id: 'banyuwangi',
    name: 'Banyuwangi',
    province: 'Jawa Timur',
    latitude: -8.2191,
    longitude: 114.3691,
    timezone: 'Asia/Jakarta',
    population: 252898,
    region: 'western'
  },

  // Bali
  {
    id: 'denpasar',
    name: 'Denpasar',
    province: 'Bali',
    latitude: -8.6500,
    longitude: 115.2167,
    timezone: 'Asia/Makassar',
    population: 897300,
    isImportant: true,
    region: 'central'
  },
  {
    id: 'ubud',
    name: 'Ubud',
    province: 'Bali',
    latitude: -8.5069,
    longitude: 115.2625,
    timezone: 'Asia/Makassar',
    population: 74320,
    region: 'central'
  },
  {
    id: 'singaraja',
    name: 'Singaraja',
    province: 'Bali',
    latitude: -8.1123,
    longitude: 115.0881,
    timezone: 'Asia/Makassar',
    population: 150000,
    region: 'central'
  },

  // Nusa Tenggara Barat
  {
    id: 'mataram',
    name: 'Mataram',
    province: 'Nusa Tenggara Barat',
    latitude: -8.5833,
    longitude: 116.1167,
    timezone: 'Asia/Makassar',
    population: 441973,
    isImportant: true,
    region: 'central'
  },
  {
    id: 'bima',
    name: 'Bima',
    province: 'Nusa Tenggara Barat',
    latitude: -8.4603,
    longitude: 118.7168,
    timezone: 'Asia/Makassar',
    population: 155140,
    region: 'central'
  },

  // Nusa Tenggara Timur
  {
    id: 'kupang',
    name: 'Kupang',
    province: 'Nusa Tenggara Timur',
    latitude: -10.1718,
    longitude: 123.6075,
    timezone: 'Asia/Makassar',
    population: 442758,
    isImportant: true,
    region: 'central'
  },
  {
    id: 'ende',
    name: 'Ende',
    province: 'Nusa Tenggara Timur',
    latitude: -8.8432,
    longitude: 121.661,
    timezone: 'Asia/Makassar',
    population: 71819,
    region: 'central'
  },

  // Kalimantan Barat
  {
    id: 'pontianak',
    name: 'Pontianak',
    province: 'Kalimantan Barat',
    latitude: -0.0263,
    longitude: 109.3425,
    timezone: 'Asia/Jakarta',
    population: 658685,
    isImportant: true,
    region: 'western'
  },
  {
    id: 'singkawang',
    name: 'Singkawang',
    province: 'Kalimantan Barat',
    latitude: 0.9058,
    longitude: 108.9894,
    timezone: 'Asia/Jakarta',
    population: 235064,
    region: 'western'
  },

  // Kalimantan Tengah
  {
    id: 'palangkaraya',
    name: 'Palangka Raya',
    province: 'Kalimantan Tengah',
    latitude: -2.2088,
    longitude: 113.9213,
    timezone: 'Asia/Jakarta',
    population: 293500,
    region: 'western'
  },

  // Kalimantan Selatan
  {
    id: 'banjarmasin',
    name: 'Banjarmasin',
    province: 'Kalimantan Selatan',
    latitude: -3.3194,
    longitude: 114.5906,
    timezone: 'Asia/Jakarta',
    population: 696880,
    isImportant: true,
    region: 'western'
  },
  {
    id: 'banjarbaru',
    name: 'Banjarbaru',
    province: 'Kalimantan Selatan',
    latitude: -3.4442,
    longitude: 114.8405,
    timezone: 'Asia/Jakarta',
    population: 253442,
    region: 'western'
  },

  // Kalimantan Timur
  {
    id: 'samarinda',
    name: 'Samarinda',
    province: 'Kalimantan Timur',
    latitude: -0.5019,
    longitude: 117.1536,
    timezone: 'Asia/Makassar',
    population: 827994,
    isImportant: true,
    region: 'central'
  },
  {
    id: 'balikpapan',
    name: 'Balikpapan',
    province: 'Kalimantan Timur',
    latitude: -1.2675,
    longitude: 116.8289,
    timezone: 'Asia/Makassar',
    population: 688318,
    isImportant: true,
    region: 'central'
  },
  {
    id: 'bontang',
    name: 'Bontang',
    province: 'Kalimantan Timur',
    latitude: 0.1348,
    longitude: 117.4692,
    timezone: 'Asia/Makassar',
    population: 140787,
    region: 'central'
  },

  // Kalimantan Utara
  {
    id: 'tarakan',
    name: 'Tarakan',
    province: 'Kalimantan Utara',
    latitude: 3.3327,
    longitude: 117.6356,
    timezone: 'Asia/Makassar',
    population: 242786,
    region: 'central'
  },

  // Sulawesi Utara
  {
    id: 'manado',
    name: 'Manado',
    province: 'Sulawesi Utara',
    latitude: 1.4748,
    longitude: 124.8421,
    timezone: 'Asia/Makassar',
    population: 451893,
    isImportant: true,
    region: 'central'
  },
  {
    id: 'tomohon',
    name: 'Tomohon',
    province: 'Sulawesi Utara',
    latitude: 1.3357,
    longitude: 124.8405,
    timezone: 'Asia/Makassar',
    population: 100899,
    region: 'central'
  },
  {
    id: 'bitung',
    name: 'Bitung',
    province: 'Sulawesi Utara',
    latitude: 1.4404,
    longitude: 125.1824,
    timezone: 'Asia/Makassar',
    population: 225134,
    region: 'central'
  },

  // Sulawesi Tengah
  {
    id: 'palu',
    name: 'Palu',
    province: 'Sulawesi Tengah',
    latitude: -0.8917,
    longitude: 119.8707,
    timezone: 'Asia/Makassar',
    population: 373218,
    isImportant: true,
    region: 'central'
  },

  // Sulawesi Selatan
  {
    id: 'makassar',
    name: 'Makassar',
    province: 'Sulawesi Selatan',
    latitude: -5.1477,
    longitude: 119.4327,
    timezone: 'Asia/Makassar',
    population: 1423877,
    isImportant: true,
    region: 'central'
  },
  {
    id: 'pare-pare',
    name: 'Parepare',
    province: 'Sulawesi Selatan',
    latitude: -4.0167,
    longitude: 119.6167,
    timezone: 'Asia/Makassar',
    population: 151454,
    region: 'central'
  },
  {
    id: 'palopo',
    name: 'Palopo',
    province: 'Sulawesi Selatan',
    latitude: -2.9917,
    longitude: 120.1983,
    timezone: 'Asia/Makassar',
    population: 180173,
    region: 'central'
  },

  // Sulawesi Tenggara
  {
    id: 'kendari',
    name: 'Kendari',
    province: 'Sulawesi Tenggara',
    latitude: -3.9450,
    longitude: 122.4989,
    timezone: 'Asia/Makassar',
    population: 350962,
    isImportant: true,
    region: 'central'
  },
  {
    id: 'bau-bau',
    name: 'Baubau',
    province: 'Sulawesi Tenggara',
    latitude: -5.4669,
    longitude: 122.6333,
    timezone: 'Asia/Makassar',
    population: 159248,
    region: 'central'
  },

  // Gorontalo
  {
    id: 'gorontalo',
    name: 'Gorontalo',
    province: 'Gorontalo',
    latitude: 0.5435,
    longitude: 123.0596,
    timezone: 'Asia/Makassar',
    population: 218194,
    region: 'central'
  },

  // Sulawesi Barat
  {
    id: 'mamuju',
    name: 'Mamuju',
    province: 'Sulawesi Barat',
    latitude: -2.6747,
    longitude: 118.8936,
    timezone: 'Asia/Makassar',
    population: 85286,
    region: 'central'
  },

  // Maluku
  {
    id: 'ambon',
    name: 'Ambon',
    province: 'Maluku',
    latitude: -3.6954,
    longitude: 128.1814,
    timezone: 'Asia/Jayapura',
    population: 355596,
    isImportant: true,
    region: 'eastern'
  },
  {
    id: 'tual',
    name: 'Tual',
    province: 'Maluku',
    latitude: -5.6667,
    longitude: 132.7500,
    timezone: 'Asia/Jayapura',
    population: 65848,
    region: 'eastern'
  },

  // Maluku Utara
  {
    id: 'ternate',
    name: 'Ternate',
    province: 'Maluku Utara',
    latitude: 0.7880,
    longitude: 127.3784,
    timezone: 'Asia/Jayapura',
    population: 220143,
    region: 'eastern'
  },
  {
    id: 'tidore',
    name: 'Tidore Kepulauan',
    province: 'Maluku Utara',
    latitude: 0.6833,
    longitude: 127.4000,
    timezone: 'Asia/Jayapura',
    population: 114480,
    region: 'eastern'
  },

  // Papua Barat
  {
    id: 'manokwari',
    name: 'Manokwari',
    province: 'Papua Barat',
    latitude: -0.8614,
    longitude: 134.0758,
    timezone: 'Asia/Jayapura',
    population: 185523,
    region: 'eastern'
  },
  {
    id: 'sorong',
    name: 'Sorong',
    province: 'Papua Barat',
    latitude: -0.8833,
    longitude: 131.2667,
    timezone: 'Asia/Jayapura',
    population: 254906,
    region: 'eastern'
  },

  // Papua
  {
    id: 'jayapura',
    name: 'Jayapura',
    province: 'Papua',
    latitude: -2.5489,
    longitude: 140.7192,
    timezone: 'Asia/Jayapura',
    population: 398478,
    isImportant: true,
    region: 'eastern'
  },

  // Sumatera Utara
  {
    id: 'medan',
    name: 'Medan',
    province: 'Sumatera Utara',
    latitude: 3.5952,
    longitude: 98.6722,
    timezone: 'Asia/Jakarta',
    population: 2435252,
    isImportant: true,
    region: 'western'
  },
  {
    id: 'binjai',
    name: 'Binjai',
    province: 'Sumatera Utara',
    latitude: 3.6001,
    longitude: 98.4854,
    timezone: 'Asia/Jakarta',
    population: 291842,
    region: 'western'
  },
  {
    id: 'tebing-tinggi',
    name: 'Tebing Tinggi',
    province: 'Sumatera Utara',
    latitude: 3.3285,
    longitude: 99.1625,
    timezone: 'Asia/Jakarta',
    population: 172838,
    region: 'western'
  },
  {
    id: 'pematangsiantar',
    name: 'Pematangsiantar',
    province: 'Sumatera Utara',
    latitude: 2.9595,
    longitude: 99.0687,
    timezone: 'Asia/Jakarta',
    population: 268254,
    region: 'western'
  },
  {
    id: 'tanjungbalai',
    name: 'Tanjungbalai',
    province: 'Sumatera Utara',
    latitude: 2.9667,
    longitude: 99.8000,
    timezone: 'Asia/Jakarta',
    population: 186817,
    region: 'western'
  },
  {
    id: 'sibolga',
    name: 'Sibolga',
    province: 'Sumatera Utara',
    latitude: 1.7427,
    longitude: 98.7792,
    timezone: 'Asia/Jakarta',
    population: 89584,
    region: 'western'
  },
  {
    id: 'padangsidimpuan',
    name: 'Padangsidimpuan',
    province: 'Sumatera Utara',
    latitude: 1.3667,
    longitude: 99.2500,
    timezone: 'Asia/Jakarta',
    population: 225105,
    region: 'western'
  },
  {
    id: 'gunungsitoli',
    name: 'Gunungsitoli',
    province: 'Sumatera Utara',
    latitude: 1.2833,
    longitude: 97.6167,
    timezone: 'Asia/Jakarta',
    population: 136917,
    region: 'western'
  },

  // Sumatera Barat
  {
    id: 'padang',
    name: 'Padang',
    province: 'Sumatera Barat',
    latitude: -0.9471,
    longitude: 100.4172,
    timezone: 'Asia/Jakarta',
    population: 909040,
    isImportant: true,
    region: 'western'
  },
  {
    id: 'bukittinggi',
    name: 'Bukittinggi',
    province: 'Sumatera Barat',
    latitude: -0.3051,
    longitude: 100.3695,
    timezone: 'Asia/Jakarta',
    population: 124215,
    region: 'western'
  },
  {
    id: 'padangpanjang',
    name: 'Padangpanjang',
    province: 'Sumatera Barat',
    latitude: -0.4667,
    longitude: 100.4000,
    timezone: 'Asia/Jakarta',
    population: 56781,
    region: 'western'
  },
  {
    id: 'payakumbuh',
    name: 'Payakumbuh',
    province: 'Sumatera Barat',
    latitude: -0.2333,
    longitude: 100.6333,
    timezone: 'Asia/Jakarta',
    population: 139576,
    region: 'western'
  },
  {
    id: 'sawahlunto',
    name: 'Sawahlunto',
    province: 'Sumatera Barat',
    latitude: -0.6833,
    longitude: 100.7833,
    timezone: 'Asia/Jakarta',
    population: 61047,
    region: 'western'
  },
  {
    id: 'solok',
    name: 'Solok',
    province: 'Sumatera Barat',
    latitude: -0.8000,
    longitude: 100.6667,
    timezone: 'Asia/Jakarta',
    population: 68301,
    region: 'western'
  },
  {
    id: 'pariaman',
    name: 'Pariaman',
    province: 'Sumatera Barat',
    latitude: -0.6167,
    longitude: 100.1167,
    timezone: 'Asia/Jakarta',
    population: 94224,
    region: 'western'
  },

  // Riau
  {
    id: 'pekanbaru',
    name: 'Pekanbaru',
    province: 'Riau',
    latitude: 0.5333,
    longitude: 101.4500,
    timezone: 'Asia/Jakarta',
    population: 1093416,
    isImportant: true,
    region: 'western'
  },
  {
    id: 'dumai',
    name: 'Dumai',
    province: 'Riau',
    latitude: 1.6667,
    longitude: 101.4500,
    timezone: 'Asia/Jakarta',
    population: 316782,
    region: 'western'
  },

  // Kepulauan Riau
  {
    id: 'batam',
    name: 'Batam',
    province: 'Kepulauan Riau',
    latitude: 1.1300,
    longitude: 104.0533,
    timezone: 'Asia/Jakarta',
    population: 1196396,
    isImportant: true,
    region: 'western'
  },
  {
    id: 'tanjungpinang',
    name: 'Tanjungpinang',
    province: 'Kepulauan Riau',
    latitude: 0.9167,
    longitude: 104.4500,
    timezone: 'Asia/Jakarta',
    population: 227663,
    region: 'western'
  },

  // Jambi
  {
    id: 'jambi',
    name: 'Jambi',
    province: 'Jambi',
    latitude: -1.6101,
    longitude: 103.6131,
    timezone: 'Asia/Jakarta',
    population: 606200,
    isImportant: true,
    region: 'western'
  },
  {
    id: 'sungaipenuh',
    name: 'Sungai Penuh',
    province: 'Jambi',
    latitude: -2.0667,
    longitude: 101.3833,
    timezone: 'Asia/Jakarta',
    population: 96610,
    region: 'western'
  },

  // Sumatera Selatan
  {
    id: 'palembang',
    name: 'Palembang',
    province: 'Sumatera Selatan',
    latitude: -2.9761,
    longitude: 104.7754,
    timezone: 'Asia/Jakarta',
    population: 1668848,
    isImportant: true,
    region: 'western'
  },
  {
    id: 'prabumulih',
    name: 'Prabumulih',
    province: 'Sumatera Selatan',
    latitude: -3.4333,
    longitude: 104.2333,
    timezone: 'Asia/Jakarta',
    population: 189806,
    region: 'western'
  },
  {
    id: 'pagar-alam',
    name: 'Pagar Alam',
    province: 'Sumatera Selatan',
    latitude: -4.0000,
    longitude: 103.2500,
    timezone: 'Asia/Jakarta',
    population: 139807,
    region: 'western'
  },
  {
    id: 'lubuklinggau',
    name: 'Lubuklinggau',
    province: 'Sumatera Selatan',
    latitude: -3.3000,
    longitude: 102.8667,
    timezone: 'Asia/Jakarta',
    population: 234166,
    region: 'western'
  },

  // Bangka Belitung
  {
    id: 'pangkalpinang',
    name: 'Pangkalpinang',
    province: 'Bangka Belitung',
    latitude: -2.1333,
    longitude: 106.1167,
    timezone: 'Asia/Jakarta',
    population: 200105,
    region: 'western'
  },

  // Bengkulu
  {
    id: 'bengkulu',
    name: 'Bengkulu',
    province: 'Bengkulu',
    latitude: -3.8004,
    longitude: 102.2655,
    timezone: 'Asia/Jakarta',
    population: 373096,
    region: 'western'
  },

  // Lampung
  {
    id: 'bandar-lampung',
    name: 'Bandar Lampung',
    province: 'Lampung',
    latitude: -5.4292,
    longitude: 105.2610,
    timezone: 'Asia/Jakarta',
    population: 1166066,
    isImportant: true,
    region: 'western'
  },
  {
    id: 'metro',
    name: 'Metro',
    province: 'Lampung',
    latitude: -5.1133,
    longitude: 105.3067,
    timezone: 'Asia/Jakarta',
    population: 168676,
    region: 'western'
  },

  // Aceh
  {
    id: 'banda-aceh',
    name: 'Banda Aceh',
    province: 'Aceh',
    latitude: 5.5483,
    longitude: 95.3238,
    timezone: 'Asia/Jakarta',
    population: 267090,
    isImportant: true,
    region: 'western'
  },
  {
    id: 'sabang',
    name: 'Sabang',
    province: 'Aceh',
    latitude: 5.8944,
    longitude: 95.3222,
    timezone: 'Asia/Jakarta',
    population: 43117,
    region: 'western'
  },
  {
    id: 'langsa',
    name: 'Langsa',
    province: 'Aceh',
    latitude: 4.4683,
    longitude: 97.9683,
    timezone: 'Asia/Jakarta',
    population: 185971,
    region: 'western'
  },
  {
    id: 'lhokseumawe',
    name: 'Lhokseumawe',
    province: 'Aceh',
    latitude: 5.1833,
    longitude: 97.1500,
    timezone: 'Asia/Jakarta',
    population: 188713,
    region: 'western'
  },
  {
    id: 'subulussalam',
    name: 'Subulussalam',
    province: 'Aceh',
    latitude: 2.6833,
    longitude: 97.9333,
    timezone: 'Asia/Jakarta',
    population: 91247,
    region: 'western'
  }
];

export class IndonesianCitiesService {
  // Get all cities
  getAllCities(): IndonesianCity[] {
    return indonesianCities;
  }

  // Get cities by province
  getCitiesByProvince(province: string): IndonesianCity[] {
    return indonesianCities.filter(city => 
      city.province.toLowerCase().includes(province.toLowerCase())
    );
  }

  // Get cities by region
  getCitiesByRegion(region: 'western' | 'central' | 'eastern'): IndonesianCity[] {
    return indonesianCities.filter(city => city.region === region);
  }

  // Enhanced search cities by name with alias support
  searchCities(query: string): IndonesianCity[] {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return [];

    return indonesianCities.filter(city => {
      // Direct name match
      if (city.name.toLowerCase().includes(searchTerm)) {
        return true;
      }

      // Province match
      if (city.province.toLowerCase().includes(searchTerm)) {
        return true;
      }

      // Alias match
      const cityKey = city.id.toLowerCase();
      const aliases = cityAliases[cityKey];
      if (aliases) {
        return aliases.some(alias => 
          alias.toLowerCase().includes(searchTerm) || 
          searchTerm.includes(alias.toLowerCase())
        );
      }

      // Special case for common variations
      const cityName = city.name.toLowerCase();
      if (cityName === 'yogyakarta' && 
          (searchTerm.includes('jogja') || 
           searchTerm.includes('jogjakarta') || 
           searchTerm.includes('yogya') ||
           searchTerm.includes('djogja') ||
           searchTerm.includes('djokja'))) {
        return true;
      }

      return false;
    });
  }

  // Get city by ID
  getCityById(id: string): IndonesianCity | undefined {
    return indonesianCities.find(city => city.id === id);
  }

  // Enhanced major cities (capital, high population, or important) - FIXED BUG HERE
  getMajorCities(): IndonesianCity[] {
    return indonesianCities.filter(city => 
      city.isCapital || 
      city.isImportant ||
      (city.population && city.population > 500000)
    ).sort((a, b) => {
      // Prioritize capitals and important cities - FIXED: was using 'city' instead of 'a'
      if (a.isCapital && !b.isCapital) return -1;
      if (!a.isCapital && b.isCapital) return 1;
      if (a.isImportant && !b.isImportant) return -1;
      if (!a.isImportant && b.isImportant) return 1;
      
      // Then sort by population
      return (b.population || 0) - (a.population || 0);
    });
  }

  // Get provinces list
  getProvinces(): string[] {
    const provinces = new Set(indonesianCities.map(city => city.province));
    return Array.from(provinces).sort();
  }

  // Enhanced autocomplete suggestions with better scoring
  getAutocompleteSuggestions(query: string, limit: number = 10): IndonesianCity[] {
    if (!query || query.length < 2) {
      return this.getMajorCities().slice(0, limit);
    }

    const searchTerm = query.toLowerCase().trim();
    const searchResults = this.searchCities(query);
    
    // Enhanced scoring system
    return searchResults
      .map(city => {
        let score = 0;
        const cityName = city.name.toLowerCase();
        const provinceName = city.province.toLowerCase();
        
        // Exact name match gets highest score
        if (cityName === searchTerm) {
          score += 1000;
        }
        // Name starts with search term
        else if (cityName.startsWith(searchTerm)) {
          score += 500;
        }
        // Name contains search term
        else if (cityName.includes(searchTerm)) {
          score += 200;
        }
        
        // Check aliases for Yogyakarta special case
        if (cityName === 'yogyakarta') {
          const yogyaAliases = ['jogja', 'jogjakarta', 'yogya', 'djogja', 'djokja'];
          for (const alias of yogyaAliases) {
            if (alias === searchTerm) {
              score += 900; // Very high score for exact alias match
            } else if (alias.startsWith(searchTerm) || searchTerm.startsWith(alias)) {
              score += 400;
            }
          }
        }
        
        // Province match
        if (provinceName.includes(searchTerm)) {
          score += 100;
        }
        
        // Boost for important cities
        if (city.isCapital) score += 50;
        if (city.isImportant) score += 30;
        
        // Population boost (small)
        if (city.population) {
          score += Math.min(city.population / 100000, 20);
        }
        
        return { city, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.city);
  }

  // Get nearby cities based on coordinates
  getNearbyCities(latitude: number, longitude: number, radiusKm: number = 100): IndonesianCity[] {
    return indonesianCities.filter(city => {
      const distance = this.calculateDistance(latitude, longitude, city.latitude, city.longitude);
      return distance <= radiusKm;
    }).sort((a, b) => {
      const distanceA = this.calculateDistance(latitude, longitude, a.latitude, a.longitude);
      const distanceB = this.calculateDistance(latitude, longitude, b.latitude, b.longitude);
      return distanceA - distanceB;
    });
  }

  // Calculate distance between two coordinates (Haversine formula)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Get timezone for city
  getTimezoneForCity(cityId: string): string {
    const city = this.getCityById(cityId);
    return city?.timezone || 'Asia/Jakarta';
  }

  // Get coordinates for city
  getCoordinatesForCity(cityId: string): { latitude: number; longitude: number } | null {
    const city = this.getCityById(cityId);
    if (!city) return null;
    
    return {
      latitude: city.latitude,
      longitude: city.longitude
    };
  }

  // Format city display name
  formatCityName(city: IndonesianCity): string {
    return `${city.name}, ${city.province}`;
  }

  // Get city info with additional details
  getCityInfo(cityId: string): (IndonesianCity & { formatted: string; timezone: string }) | null {
    const city = this.getCityById(cityId);
    if (!city) return null;

    return {
      ...city,
      formatted: this.formatCityName(city),
      timezone: city.timezone
    };
  }

  // Get cities by importance level
  getImportantCities(): IndonesianCity[] {
    return indonesianCities.filter(city => city.isImportant || city.isCapital);
  }

  // Search cities with highlighting information
  searchCitiesWithHighlight(query: string): Array<IndonesianCity & { matchType: string; matchText: string }> {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return [];

    return this.searchCities(query).map(city => {
      let matchType = 'name';
      let matchText = city.name;

      if (city.province.toLowerCase().includes(searchTerm)) {
        matchType = 'province';
        matchText = city.province;
      }

      // Special handling for Yogyakarta aliases
      if (city.name.toLowerCase() === 'yogyakarta') {
        const yogyaAliases = ['jogja', 'jogjakarta', 'yogya', 'djogja', 'djokja'];
        for (const alias of yogyaAliases) {
          if (alias.includes(searchTerm) || searchTerm.includes(alias)) {
            matchType = 'alias';
            matchText = alias;
            break;
          }
        }
      }

      return {
        ...city,
        matchType,
        matchText
      };
    });
  }
}

// Create and export a singleton instance
export const indonesianCitiesService = new IndonesianCitiesService();