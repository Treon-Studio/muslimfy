// API service for Quran API Santrikoding - CORRECTED STRUCTURE
export interface SantriAyah {
    id: number;
    surah: number;
    nomor: number;
    ar: string;
    tr: string;
    idn: string;
  }
  
  export interface SantriSurah {
    nomor: number;
    nama: string;
    nama_latin: string;
    jumlah_ayat: number;
    tempat_turun: string;
    arti: string;
    deskripsi: string;
    audio: string;
  }
  
  export interface SantriSurahDetail {
    status: boolean;
    nomor: number;
    nama: string;
    jumlah_ayat: number;
    nama_latin: string;
    arti: string;
    tempat_turun: string;
    deskripsi: string;
    audio: string;
    ayat: SantriAyah[];
    surat_selanjutnya: SantriSurah | null;
    surat_sebelumnya: SantriSurah | false;
  }
  
  // Enhanced mock data dengan lebih banyak surah
  const mockSurahList: SantriSurah[] = [
    {
      nomor: 1,
      nama: "الفاتحة",
      nama_latin: "Al-Fatihah",
      jumlah_ayat: 7,
      tempat_turun: "mekah",
      arti: "Pembukaan",
      deskripsi: "Surat Al Faatihah (Pembukaan) yang diturunkan di Mekah dan terdiri dari 7 ayat adalah surat yang pertama-tama diturunkan dengan lengkap diantara surat-surat yang ada dalam Al Quran dan termasuk golongan surat Makkiyyah.",
      audio: "https://santrikoding.com/storage/audio/001.mp3"
    },
    {
      nomor: 2,
      nama: "البقرة",
      nama_latin: "Al-Baqarah",
      jumlah_ayat: 286,
      tempat_turun: "madinah",
      arti: "Sapi",
      deskripsi: "Surat Al Baqarah yang 286 ayat itu turun di Madinah yang sebahagian besar diturunkan pada permulaan tahun Hijrah, kecuali ayat 281 diturunkan di Mina pada Hajji wadaa'.",
      audio: "https://santrikoding.com/storage/audio/002.mp3"
    },
    {
      nomor: 3,
      nama: "آل عمران",
      nama_latin: "Ali 'Imran",
      jumlah_ayat: 200,
      tempat_turun: "madinah",
      arti: "Keluarga Imran",
      deskripsi: "Surat Ali 'Imran yang terdiri dari 200 ayat ini adalah surat Madaniyyah.",
      audio: "https://santrikoding.com/storage/audio/003.mp3"
    },
    {
      nomor: 4,
      nama: "النساء",
      nama_latin: "An-Nisa",
      jumlah_ayat: 176,
      tempat_turun: "madinah",
      arti: "Wanita",
      deskripsi: "Surat An Nisa yang terdiri dari 176 ayat ini adalah surat Madaniyyah yang terpanjang sesudah surat Al Baqarah.",
      audio: "https://santrikoding.com/storage/audio/004.mp3"
    },
    {
      nomor: 112,
      nama: "الإخلاص",
      nama_latin: "Al-Ikhlas",
      jumlah_ayat: 4,
      tempat_turun: "mekah",
      arti: "Memurnikan Keesaan Allah",
      deskripsi: "Surat Al Ikhlas terdiri dari 4 ayat, termasuk golongan surat-surat Makkiyyah, diturunkan sesudah surat An Naas.",
      audio: "https://santrikoding.com/storage/audio/112.mp3"
    },
    {
      nomor: 113,
      nama: "الفلق",
      nama_latin: "Al-Falaq",
      jumlah_ayat: 5,
      tempat_turun: "mekah",
      arti: "Waktu Subuh",
      deskripsi: "Surat Al Falaq terdiri dari 5 ayat, termasuk golongan surat-surat Makkiyyah, diturunkan sesudah surat Al Fiil.",
      audio: "https://santrikoding.com/storage/audio/113.mp3"
    },
    {
      nomor: 114,
      nama: "الناس",
      nama_latin: "An-Nas",
      jumlah_ayat: 6,
      tempat_turun: "mekah",
      arti: "Manusia",
      deskripsi: "Surat An Naas terdiri dari 6 ayat, termasuk golongan surat-surat Makkiyyah, diturunkan sesudah surat Al Falaq.",
      audio: "https://santrikoding.com/storage/audio/114.mp3"
    }
  ];
  
  // Enhanced mock surah details dengan lebih banyak content
  const mockSurahDetails: Record<number, SantriSurahDetail> = {
    1: {
      status: true,
      nomor: 1,
      nama: "الفاتحة",
      jumlah_ayat: 7,
      nama_latin: "Al-Fatihah",
      arti: "Pembukaan",
      tempat_turun: "mekah",
      deskripsi: "Surat Al Faatihah (Pembukaan) yang diturunkan di Mekah dan terdiri dari 7 ayat adalah surat yang pertama-tama diturunkan dengan lengkap diantara surat-surat yang ada dalam Al Quran dan termasuk golongan surat Makkiyyah.",
      audio: "https://santrikoding.com/storage/audio/001.mp3",
      ayat: [
        {
          id: 1,
          surah: 1,
          nomor: 1,
          ar: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
          tr: "bismi <strong>al</strong>l<u>aa</u>hi <strong>al</strong>rra<u>h</u>m<u>aa</u>ni <strong>al</strong>rra<u>h</u>iim<strong>i</strong>",
          idn: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."
        },
        {
          id: 2,
          surah: 1,
          nomor: 2,
          ar: "اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَۙ",
          tr: "al<u>h</u>amdu lill<u>aa</u>hi rabbi <strong>a</strong>l'<u>aa</u>lamiin<strong>a</strong>",
          idn: "Segala puji bagi Allah, Tuhan seluruh alam,"
        },
        {
          id: 3,
          surah: 1,
          nomor: 3,
          ar: "الرَّحْمٰنِ الرَّحِيْمِۙ",
          tr: "a<strong>l</strong>rra<u>h</u>m<u>aa</u>ni <strong>al</strong>rra<u>h</u>iim<strong>i</strong>",
          idn: "Yang Maha Pengasih, Maha Penyayang,"
        },
        {
          id: 4,
          surah: 1,
          nomor: 4,
          ar: "مٰلِكِ يَوْمِ الدِّيْنِۗ",
          tr: "m<u>aa</u>liki yawmi <strong>al</strong>ddiin<strong>i</strong>",
          idn: "Pemilik hari pembalasan."
        },
        {
          id: 5,
          surah: 1,
          nomor: 5,
          ar: "اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِيْنُۗ",
          tr: "iyy<u>aa</u>ka na'budu wa-iyy<u>aa</u>ka nasta'iin<strong>u</strong>",
          idn: "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan."
        },
        {
          id: 6,
          surah: 1,
          nomor: 6,
          ar: "اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيْمَ ۙ",
          tr: "ihdin<u>aa</u> <strong>al</strong><u>shsh</u>ir<u>aath</u>a <strong>a</strong>lmustaqiim<strong>a</strong>",
          idn: "Tunjukilah kami jalan yang lurus,"
        },
        {
          id: 7,
          surah: 1,
          nomor: 7,
          ar: "صِرَاطَ الَّذِيْنَ اَنْعَمْتَ عَلَيْهِمْ ەۙ غَيْرِ الْمَغْضُوْبِ عَلَيْهِمْ وَلَا الضَّاۤلِّيْنَ ࣖ",
          tr: "<u>sh</u>ir<u>aath</u>a <strong>al</strong>la<u>dz</u>iina an'amta 'alayhim ghayri <strong>a</strong>lmagh<u>dh</u>uubi 'alayhim wal<u>aa</u> <strong>al</strong><u>dhdhaa</u>lliin<strong>a</strong>",
          idn: "(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat."
        }
      ],
      surat_selanjutnya: {
        nomor: 2,
        nama: "البقرة",
        nama_latin: "Al-Baqarah",
        jumlah_ayat: 286,
        tempat_turun: "madinah",
        arti: "Sapi",
        deskripsi: "Surat Al Baqarah yang 286 ayat itu turun di Madinah...",
        audio: "https://santrikoding.com/storage/audio/002.mp3"
      },
      surat_sebelumnya: false
    },
    112: {
      status: true,
      nomor: 112,
      nama: "الإخلاص",
      jumlah_ayat: 4,
      nama_latin: "Al-Ikhlas",
      arti: "Memurnikan Keesaan Allah",
      tempat_turun: "mekah",
      deskripsi: "Surat Al Ikhlas terdiri dari 4 ayat, termasuk golongan surat-surat Makkiyyah, diturunkan sesudah surat An Naas.",
      audio: "https://santrikoding.com/storage/audio/112.mp3",
      ayat: [
        {
          id: 1,
          surah: 112,
          nomor: 1,
          ar: "قُلْ هُوَ اللّٰهُ اَحَدٌۚ",
          tr: "qul huwa <strong>al</strong>l<u>aa</u>hu a<u>h</u>ad<strong>un</strong>",
          idn: "Katakanlah: \"Dia-lah Allah, Yang Maha Esa."
        },
        {
          id: 2,
          surah: 112,
          nomor: 2,
          ar: "اَللّٰهُ الصَّمَدُۚ",
          tr: "<strong>al</strong>l<u>aa</u>hu <strong>al</strong><u>shsh</u>amad<strong>u</strong>",
          idn: "Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu."
        },
        {
          id: 3,
          surah: 112,
          nomor: 3,
          ar: "لَمْ يَلِدْ وَلَمْ يُوْلَدْۙ",
          tr: "lam yalid wa lam yuulad<strong>u</strong>",
          idn: "Dia tiada beranak dan tidak pula diperanakkan,"
        },
        {
          id: 4,
          surah: 112,
          nomor: 4,
          ar: "وَلَمْ يَكُنْ لَّهٗ كُفُوًا اَحَدٌ ࣖ",
          tr: "wa lam yakun lahu kufuwan a<u>h</u>ad<strong>un</strong>",
          idn: "dan tidak ada seorangpun yang setara dengan Dia\"."
        }
      ],
      surat_selanjutnya: {
        nomor: 113,
        nama: "الفلق",
        nama_latin: "Al-Falaq",
        jumlah_ayat: 5,
        tempat_turun: "mekah",
        arti: "Waktu Subuh",
        deskripsi: "Surat Al Falaq terdiri dari 5 ayat...",
        audio: "https://santrikoding.com/storage/audio/113.mp3"
      },
      surat_sebelumnya: {
        nomor: 111,
        nama: "المسد",
        nama_latin: "Al-Masad",
        jumlah_ayat: 5,
        tempat_turun: "mekah",
        arti: "Garis Keturunan",
        deskripsi: "Surat Al Masad terdiri dari 5 ayat...",
        audio: "https://santrikoding.com/storage/audio/111.mp3"
      }
    },
    113: {
      status: true,
      nomor: 113,
      nama: "الفلق",
      jumlah_ayat: 5,
      nama_latin: "Al-Falaq",
      arti: "Waktu Subuh",
      tempat_turun: "mekah",
      deskripsi: "Surat Al Falaq terdiri dari 5 ayat, termasuk golongan surat-surat Makkiyyah, diturunkan sesudah surat Al Fiil.",
      audio: "https://santrikoding.com/storage/audio/113.mp3",
      ayat: [
        {
          id: 1,
          surah: 113,
          nomor: 1,
          ar: "قُلْ اَعُوْذُ بِرَبِّ الْفَلَقِۙ",
          tr: "qul a'uu<u>dz</u>u birabbi <strong>a</strong>lfalaq<strong>i</strong>",
          idn: "Katakanlah: \"Aku berlindung kepada Tuhan yang menguasai subuh,"
        },
        {
          id: 2,
          surah: 113,
          nomor: 2,
          ar: "مِنْ شَرِّ مَا خَلَقَۙ",
          tr: "min <u>sh</u>arri m<u>aa</u> <u>kh</u>alaq<strong>a</strong>",
          idn: "dari kejahatan makhluk-Nya,"
        },
        {
          id: 3,
          surah: 113,
          nomor: 3,
          ar: "وَمِنْ شَرِّ غَاسِقٍ اِذَا وَقَبَۙ",
          tr: "wa min <u>sh</u>arri gh<u>aa</u>siqin i<u>dz</u><u>aa</u> waqab<strong>a</strong>",
          idn: "dan dari kejahatan malam apabila telah gelap gulita,"
        },
        {
          id: 4,
          surah: 113,
          nomor: 4,
          ar: "وَمِنْ شَرِّ النَّفّٰثٰتِ فِى الْعُقَدِۙ",
          tr: "wa min <u>sh</u>arri <strong>al</strong>naff<u>aa</u><u>ts</u><u>aa</u>ti fii <strong>a</strong>l'uqad<strong>i</strong>",
          idn: "dan dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul,"
        },
        {
          id: 5,
          surah: 113,
          nomor: 5,
          ar: "وَمِنْ شَرِّ حَاسِدٍ اِذَا حَسَدَ ࣖ",
          tr: "wa min <u>sh</u>arri <u>h</u><u>aa</u>sidin i<u>dz</u><u>aa</u> <u>h</u>asad<strong>a</strong>",
          idn: "dan dari kejahatan pendengki bila ia dengki\"."
        }
      ],
      surat_selanjutnya: {
        nomor: 114,
        nama: "الناس",
        nama_latin: "An-Nas",
        jumlah_ayat: 6,
        tempat_turun: "mekah",
        arti: "Manusia",
        deskripsi: "Surat An Naas terdiri dari 6 ayat...",
        audio: "https://santrikoding.com/storage/audio/114.mp3"
      },
      surat_sebelumnya: {
        nomor: 112,
        nama: "الإخلاص",
        nama_latin: "Al-Ikhlas",
        jumlah_ayat: 4,
        tempat_turun: "mekah",
        arti: "Memurnikan Keesaan Allah",
        deskripsi: "Surat Al Ikhlas terdiri dari 4 ayat...",
        audio: "https://santrikoding.com/storage/audio/112.mp3"
      }
    },
    114: {
      status: true,
      nomor: 114,
      nama: "الناس",
      jumlah_ayat: 6,
      nama_latin: "An-Nas",
      arti: "Manusia",
      tempat_turun: "mekah",
      deskripsi: "Surat An Naas terdiri dari 6 ayat, termasuk golongan surat-surat Makkiyyah, diturunkan sesudah surat Al Falaq.",
      audio: "https://santrikoding.com/storage/audio/114.mp3",
      ayat: [
        {
          id: 1,
          surah: 114,
          nomor: 1,
          ar: "قُلْ اَعُوْذُ بِرَبِّ النَّاسِۙ",
          tr: "qul a'uu<u>dz</u>u birabbi <strong>al</strong>n<u>aa</u>s<strong>i</strong>",
          idn: "Katakanlah: \"Aku berlindung kepada Tuhan manusia."
        },
        {
          id: 2,
          surah: 114,
          nomor: 2,
          ar: "مَلِكِ النَّاسِۙ",
          tr: "maliki <strong>al</strong>n<u>aa</u>s<strong>i</strong>",
          idn: "Raja manusia."
        },
        {
          id: 3,
          surah: 114,
          nomor: 3,
          ar: "اِلٰهِ النَّاسِۙ",
          tr: "il<u>aa</u>hi <strong>al</strong>n<u>aa</u>s<strong>i</strong>",
          idn: "Sembahan manusia."
        },
        {
          id: 4,
          surah: 114,
          nomor: 4,
          ar: "مِنْ شَرِّ الْوَسْوَاسِ ەۙ الْخَنَّاسِۖ",
          tr: "min <u>sh</u>arri <strong>a</strong>lwaswasi <strong>a</strong>l<u>kh</u>ann<u>aa</u>s<strong>i</strong>",
          idn: "dari kejahatan (bisikan) syaitan yang biasa bersembunyi,"
        },
        {
          id: 5,
          surah: 114,
          nomor: 5,
          ar: "الَّذِيْ يُوَسْوِسُ فِيْ صُدُوْرِ النَّاسِۙ",
          tr: "<strong>al</strong>la<u>dz</u>ii yuwaswisu fii <u>sh</u>uduuri <strong>al</strong>n<u>aa</u>s<strong>i</strong>",
          idn: "yang membisikkan (kejahatan) ke dalam dada manusia,"
        },
        {
          id: 6,
          surah: 114,
          nomor: 6,
          ar: "مِنَ الْجِنَّةِ وَالنَّاسِ ࣖ",
          tr: "mina <strong>a</strong>ljinnati wa<strong>al</strong>n<u>aa</u>s<strong>i</strong>",
          idn: "dari golongan jin dan manusia\"."
        }
      ],
      surat_selanjutnya: null,
      surat_sebelumnya: {
        nomor: 113,
        nama: "الفلق",
        nama_latin: "Al-Falaq",
        jumlah_ayat: 5,
        tempat_turun: "mekah",
        arti: "Waktu Subuh",
        deskripsi: "Surat Al Falaq terdiri dari 5 ayat...",
        audio: "https://santrikoding.com/storage/audio/113.mp3"
      }
    }
  };
  
  class QuranApiService {
    private baseUrl = 'https://quran-api.santrikoding.com/api';
    private cache = new Map<string, any>();
    private cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
    private isApiAvailable = true;
  
    private async fetchWithCache<T>(url: string): Promise<T> {
      const cacheKey = url;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }
  
      try {
        // Test if we can reach the API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  
        const response = await fetch(url, {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        });
  
        clearTimeout(timeoutId);
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
        this.isApiAvailable = true;
        return data;
      } catch (error) {
        console.warn('API fetch failed, using fallback data:', error);
        this.isApiAvailable = false;
        throw error;
      }
    }
  
    async getAllSurahs(): Promise<SantriSurah[]> {
      try {
        return await this.fetchWithCache<SantriSurah[]>(`${this.baseUrl}/surah`);
      } catch (error) {
        console.warn('API unavailable, using mock data');
        return mockSurahList;
      }
    }
  
    async getSurahDetail(surahNumber: number): Promise<SantriSurahDetail> {
      const mockDetail = mockSurahDetails[surahNumber];
      const fallbackResponse: SantriSurahDetail = mockDetail || {
        status: true,
        nomor: surahNumber,
        nama: "غير متوفر",
        jumlah_ayat: 0,
        nama_latin: "Not Available",
        arti: "Not Available",
        tempat_turun: "mekah",
        deskripsi: "Content not available in offline mode",
        audio: "",
        ayat: [],
        surat_selanjutnya: null,
        surat_sebelumnya: false
      };
  
      try {
        return await this.fetchWithCache<SantriSurahDetail>(`${this.baseUrl}/surah/${surahNumber}`);
      } catch (error) {
        console.warn(`API unavailable for surah ${surahNumber}, using mock data`);
        return fallbackResponse;
      }
    }
  
    async getSurahsList(): Promise<SantriSurah[]> {
      try {
        const response = await this.getAllSurahs();
        if (Array.isArray(response) && response.length > 0) {
          return response;
        }
        throw new Error('Invalid response format');
      } catch (error) {
        console.warn('Error fetching surahs list, using fallback:', error);
        return mockSurahList;
      }
    }
  
    async getSurahWithContent(surahNumber: number): Promise<{ surah: SantriSurah; ayahs: SantriAyah[]; hasContent: boolean } | null> {
      try {
        const response = await this.getSurahDetail(surahNumber);
        if (response.status && response.ayat) {
          return {
            surah: {
              nomor: response.nomor,
              nama: response.nama,
              nama_latin: response.nama_latin,
              jumlah_ayat: response.jumlah_ayat,
              tempat_turun: response.tempat_turun,
              arti: response.arti,
              deskripsi: response.deskripsi,
              audio: response.audio
            },
            ayahs: response.ayat,
            hasContent: response.ayat.length > 0
          };
        }
        return null;
      } catch (error) {
        console.warn(`Error fetching surah ${surahNumber}, using fallback:`, error);
        
        // Return mock data if available
        const mockDetail = mockSurahDetails[surahNumber];
        if (mockDetail) {
          return {
            surah: {
              nomor: mockDetail.nomor,
              nama: mockDetail.nama,
              nama_latin: mockDetail.nama_latin,
              jumlah_ayat: mockDetail.jumlah_ayat,
              tempat_turun: mockDetail.tempat_turun,
              arti: mockDetail.arti,
              deskripsi: mockDetail.deskripsi,
              audio: mockDetail.audio
            },
            ayahs: mockDetail.ayat,
            hasContent: true
          };
        }
        
        // Return basic surah info with empty ayahs but indicate it's available
        const basicSurah = mockSurahList.find(s => s.nomor === surahNumber);
        if (basicSurah) {
          return {
            surah: basicSurah,
            ayahs: [],
            hasContent: false
          };
        }
        
        return null;
      }
    }
  
    // Helper method to get specific ayah
    async getAyah(surahNumber: number, ayahNumber: number): Promise<SantriAyah | null> {
      try {
        const surahData = await this.getSurahWithContent(surahNumber);
        if (surahData && surahData.ayahs) {
          const ayah = surahData.ayahs.find(a => a.nomor === ayahNumber);
          return ayah || null;
        }
        return null;
      } catch (error) {
        console.warn(`Error fetching ayah ${surahNumber}:${ayahNumber}:`, error);
        return null;
      }
    }
  
    // Get random ayah for verse of the day
    async getRandomAyah(): Promise<SantriAyah | null> {
      try {
        // Use available mock data for random selection
        const availableSurahs = Object.keys(mockSurahDetails).map(Number);
        const randomSurahNumber = availableSurahs[Math.floor(Math.random() * availableSurahs.length)];
        
        const surahData = await this.getSurahWithContent(randomSurahNumber);
        
        if (surahData && surahData.ayahs && surahData.ayahs.length > 0) {
          // Get a random ayah from the surah
          const randomAyahIndex = Math.floor(Math.random() * surahData.ayahs.length);
          return surahData.ayahs[randomAyahIndex];
        }
        
        // Fallback to first ayah of Al-Fatihah
        const fatihahData = mockSurahDetails[1];
        if (fatihahData && fatihahData.ayat.length > 0) {
          return fatihahData.ayat[0];
        }
        
        return null;
      } catch (error) {
        console.warn('Error fetching random ayah, using fallback:', error);
        
        // Return first ayah of Al-Fatihah as ultimate fallback
        const fatihahData = mockSurahDetails[1];
        if (fatihahData && fatihahData.ayat.length > 0) {
          return fatihahData.ayat[0];
        }
        
        return null;
      }
    }
  
    // Check if surah has content available
    hasSurahContent(surahNumber: number): boolean {
      return surahNumber in mockSurahDetails;
    }
  
    // Get available surahs with content
    getAvailableSurahsWithContent(): number[] {
      return Object.keys(mockSurahDetails).map(Number);
    }
  
    // Check if API is available
    isApiOnline(): boolean {
      return this.isApiAvailable;
    }
  
    // Test API connectivity
    async testConnection(): Promise<boolean> {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
  
        const response = await fetch(`${this.baseUrl}/surah`, {
          signal: controller.signal,
          method: 'HEAD', // Use HEAD to minimize data transfer
          mode: 'cors'
        });
  
        clearTimeout(timeoutId);
        this.isApiAvailable = response.ok;
        return response.ok;
      } catch (error) {
        this.isApiAvailable = false;
        return false;
      }
    }
  }
  
  export const quranApiService = new QuranApiService();