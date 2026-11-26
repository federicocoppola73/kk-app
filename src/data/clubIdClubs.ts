export type ClubDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type ClubIdClub = {
  id: string;
  displayName: string;
  difficulty: ClubDifficulty;
  points: number;
  city: string;
  cityIt: string;
  country: string;
  foundedYear: number;
  colors: string;
  colorsIt: string;
  stadium: string;
  nickname?: string;
};

// Starter facts are for internal gameplay testing and should be fact-checked
// against current official club sources before production publication.
export const clubIdClubs: ClubIdClub[] = [
  { id: 'real-madrid', displayName: 'Real Madrid', difficulty: 'easy', points: 100, city: 'Madrid', cityIt: 'Madrid', country: 'Spain', foundedYear: 1902, colors: 'White', colorsIt: 'Bianco', stadium: 'Santiago Bernabéu', nickname: 'Los Blancos' },
  { id: 'barcelona', displayName: 'FC Barcelona', difficulty: 'easy', points: 100, city: 'Barcelona', cityIt: 'Barcellona', country: 'Spain', foundedYear: 1899, colors: 'Blue and garnet', colorsIt: 'Blu e granata', stadium: 'Spotify Camp Nou', nickname: 'Blaugrana' },
  { id: 'manchester-united', displayName: 'Manchester United', difficulty: 'easy', points: 100, city: 'Manchester', cityIt: 'Manchester', country: 'England', foundedYear: 1878, colors: 'Red, white and black', colorsIt: 'Rosso, bianco e nero', stadium: 'Old Trafford', nickname: 'The Red Devils' },
  { id: 'liverpool', displayName: 'Liverpool FC', difficulty: 'easy', points: 100, city: 'Liverpool', cityIt: 'Liverpool', country: 'England', foundedYear: 1892, colors: 'Red', colorsIt: 'Rosso', stadium: 'Anfield', nickname: 'The Reds' },
  { id: 'arsenal', displayName: 'Arsenal FC', difficulty: 'medium', points: 150, city: 'London', cityIt: 'Londra', country: 'England', foundedYear: 1886, colors: 'Red and white', colorsIt: 'Rosso e bianco', stadium: 'Emirates Stadium', nickname: 'The Gunners' },
  { id: 'chelsea', displayName: 'Chelsea FC', difficulty: 'medium', points: 150, city: 'London', cityIt: 'Londra', country: 'England', foundedYear: 1905, colors: 'Blue and white', colorsIt: 'Blu e bianco', stadium: 'Stamford Bridge', nickname: 'The Blues' },
  { id: 'manchester-city', displayName: 'Manchester City', difficulty: 'medium', points: 150, city: 'Manchester', cityIt: 'Manchester', country: 'England', foundedYear: 1880, colors: 'Sky blue and white', colorsIt: 'Azzurro e bianco', stadium: 'Etihad Stadium', nickname: 'The Citizens' },
  { id: 'juventus', displayName: 'Juventus', difficulty: 'medium', points: 150, city: 'Turin', cityIt: 'Torino', country: 'Italy', foundedYear: 1897, colors: 'Black and white', colorsIt: 'Bianco e nero', stadium: 'Allianz Stadium', nickname: 'La Vecchia Signora' },
  { id: 'inter', displayName: 'Inter', difficulty: 'hard', points: 200, city: 'Milan', cityIt: 'Milano', country: 'Italy', foundedYear: 1908, colors: 'Black and blue', colorsIt: 'Nero e azzurro', stadium: 'San Siro', nickname: 'I Nerazzurri' },
  { id: 'ac-milan', displayName: 'AC Milan', difficulty: 'hard', points: 200, city: 'Milan', cityIt: 'Milano', country: 'Italy', foundedYear: 1899, colors: 'Red and black', colorsIt: 'Rosso e nero', stadium: 'San Siro', nickname: 'I Rossoneri' },
  { id: 'bayern-munich', displayName: 'Bayern Munich', difficulty: 'hard', points: 200, city: 'Munich', cityIt: 'Monaco di Baviera', country: 'Germany', foundedYear: 1900, colors: 'Red and white', colorsIt: 'Rosso e bianco', stadium: 'Allianz Arena', nickname: 'Die Roten' },
  { id: 'paris-saint-germain', displayName: 'Paris Saint-Germain', difficulty: 'expert', points: 250, city: 'Paris', cityIt: 'Parigi', country: 'France', foundedYear: 1970, colors: 'Blue, red and white', colorsIt: 'Blu, rosso e bianco', stadium: 'Parc des Princes', nickname: 'Les Parisiens' },
];
