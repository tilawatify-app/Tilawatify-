export type Surah = { number: number; name: string; arabic: string; verses: number; juz: number; meaning: string };
export type Reciter = { id: string; name: string; short: string; bio: string; initials: string; color: string };
export type Track = { id: string; surah: Surah; reciter: Reciter; audioUrl: string | null; duration: number | null; licensed: boolean };

const names = `Al-Fatihah|Al-Baqarah|Ali 'Imran|An-Nisa|Al-Ma'idah|Al-An'am|Al-A'raf|Al-Anfal|At-Tawbah|Yunus|Hud|Yusuf|Ar-Ra'd|Ibrahim|Al-Hijr|An-Nahl|Al-Isra|Al-Kahf|Maryam|Ta-Ha|Al-Anbiya|Al-Hajj|Al-Mu'minun|An-Nur|Al-Furqan|Ash-Shu'ara|An-Naml|Al-Qasas|Al-Ankabut|Ar-Rum|Luqman|As-Sajdah|Al-Ahzab|Saba|Fatir|Ya-Sin|As-Saffat|Sad|Az-Zumar|Ghafir|Fussilat|Ash-Shura|Az-Zukhruf|Ad-Dukhan|Al-Jathiyah|Al-Ahqaf|Muhammad|Al-Fath|Al-Hujurat|Qaf|Adh-Dhariyat|At-Tur|An-Najm|Al-Qamar|Ar-Rahman|Al-Waqi'ah|Al-Hadid|Al-Mujadilah|Al-Hashr|Al-Mumtahanah|As-Saff|Al-Jumu'ah|Al-Munafiqun|At-Taghabun|At-Talaq|At-Tahrim|Al-Mulk|Al-Qalam|Al-Haqqah|Al-Ma'arij|Nuh|Al-Jinn|Al-Muzzammil|Al-Muddaththir|Al-Qiyamah|Al-Insan|Al-Mursalat|An-Naba|An-Nazi'at|Abasa|At-Takwir|Al-Infitar|Al-Mutaffifin|Al-Inshiqaq|Al-Buruj|At-Tariq|Al-A'la|Al-Ghashiyah|Al-Fajr|Al-Balad|Ash-Shams|Al-Layl|Ad-Duha|Ash-Sharh|At-Tin|Al-Alaq|Al-Qadr|Al-Bayyinah|Az-Zalzalah|Al-Adiyat|Al-Qari'ah|At-Takathur|Al-Asr|Al-Humazah|Al-Fil|Quraysh|Al-Ma'un|Al-Kawthar|Al-Kafirun|An-Nasr|Al-Masad|Al-Ikhlas|Al-Falaq|An-Nas`.split('|');
const verses = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,5,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
const arabic = ['الفاتحة','البقرة','آل عمران','النساء','المائدة','الأنعام','الأعراف','الأنفال','التوبة','يونس','هود','يوسف'];
const meanings = ['The Opening','The Cow','The Family of Imran','The Women','The Table Spread','The Cattle','The Heights','The Spoils of War','The Repentance','Jonah','Hud','Joseph'];
// Surah containing the start of each Juz (a Surah may cross multiple Juz).
export const juzStartSurahs = [1,2,2,3,4,4,5,6,7,8,9,11,12,15,17,18,21,23,25,27,29,33,36,39,41,46,51,58,67,78];
// Starting Juz per Surah boundary; the first Juz of a Surah is shown on cards.
const surahJuzBoundaries = [[1,1],[3,3],[4,4],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[12,12],[13,13],[15,14],[17,15],[19,16],[21,17],[23,18],[26,19],[28,20],[30,21],[33,22],[36,23],[39,24],[41,25],[46,26],[51,27],[58,28],[67,29],[78,30]];
export const surahs: Surah[] = names.map((name, i) => ({ number: i + 1, name, arabic: arabic[i] || '', verses: verses[i] || 0, juz: surahJuzBoundaries.reduce((acc, [start, juz]) => start <= i + 1 ? juz : acc, 1), meaning: meanings[i] || '' }));
export const reciters: Reciter[] = [
  { id: 'alafasy', name: 'Mishary Rashid Alafasy', short: 'Mishary Alafasy', bio: 'Mishary Rashid Alafasy is a Kuwaiti Quran reciter and imam known for his measured, expressive style of recitation. His recordings will appear here once distribution rights are confirmed.', initials: 'MA', color: '#5489d4' },
  { id: 'sudais', name: 'Abdul Rahman Al-Sudais', short: 'Abdul Rahman Al-Sudais', bio: 'Abdul Rahman Al-Sudais is a Saudi imam and Quran reciter renowned for his recitations at the Grand Mosque in Makkah. Recordings are awaiting authorized distribution.', initials: 'AS', color: '#7c88b7' },
];
export const tracks: Track[] = reciters.flatMap(reciter => surahs.map(surah => ({ id: `${reciter.id}-${surah.number}`, reciter, surah, audioUrl: null, duration: null, licensed: false })));
export const getTrack = (id: string) => tracks.find(t => t.id === id);
