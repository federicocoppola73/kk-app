export type ClubDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type ClubIdClub = {
  id: string;
  displayName: string;
  difficulty: ClubDifficulty;
  points: number;
  city: string;
  foundedYear: number;
  colors: string;
  stadium: string;
  nickname?: string;
};

// Starter facts are for internal gameplay testing and should be fact-checked
// against current official club sources before production publication.
export const clubIdClubs: ClubIdClub[] = [
  { id: 'real-madrid', displayName: 'Real Madrid', difficulty: 'easy', points: 100, city: 'Madrid', foundedYear: 1902, colors: 'White', stadium: 'Santiago Bernabéu', nickname: 'Los Blancos' },
  { id: 'barcelona', displayName: 'FC Barcelona', difficulty: 'easy', points: 100, city: 'Barcelona', foundedYear: 1899, colors: 'Blue and garnet', stadium: 'Spotify Camp Nou', nickname: 'Blaugrana' },
  { id: 'manchester-united', displayName: 'Manchester United', difficulty: 'easy', points: 100, city: 'Manchester', foundedYear: 1878, colors: 'Red, white and black', stadium: 'Old Trafford', nickname: 'The Red Devils' },
  { id: 'liverpool', displayName: 'Liverpool FC', difficulty: 'easy', points: 100, city: 'Liverpool', foundedYear: 1892, colors: 'Red', stadium: 'Anfield', nickname: 'The Reds' },
  { id: 'arsenal', displayName: 'Arsenal FC', difficulty: 'medium', points: 150, city: 'London', foundedYear: 1886, colors: 'Red and white', stadium: 'Emirates Stadium', nickname: 'The Gunners' },
  { id: 'chelsea', displayName: 'Chelsea FC', difficulty: 'medium', points: 150, city: 'London', foundedYear: 1905, colors: 'Blue and white', stadium: 'Stamford Bridge', nickname: 'The Blues' },
  { id: 'manchester-city', displayName: 'Manchester City', difficulty: 'medium', points: 150, city: 'Manchester', foundedYear: 1880, colors: 'Sky blue and white', stadium: 'Etihad Stadium', nickname: 'The Citizens' },
  { id: 'juventus', displayName: 'Juventus', difficulty: 'medium', points: 150, city: 'Turin', foundedYear: 1897, colors: 'Black and white', stadium: 'Allianz Stadium', nickname: 'La Vecchia Signora' },
  { id: 'inter', displayName: 'Inter', difficulty: 'hard', points: 200, city: 'Milan', foundedYear: 1908, colors: 'Black and blue', stadium: 'San Siro', nickname: 'I Nerazzurri' },
  { id: 'ac-milan', displayName: 'AC Milan', difficulty: 'hard', points: 200, city: 'Milan', foundedYear: 1899, colors: 'Red and black', stadium: 'San Siro', nickname: 'I Rossoneri' },
  { id: 'bayern-munich', displayName: 'Bayern Munich', difficulty: 'hard', points: 200, city: 'Munich', foundedYear: 1900, colors: 'Red and white', stadium: 'Allianz Arena', nickname: 'Die Roten' },
  { id: 'paris-saint-germain', displayName: 'Paris Saint-Germain', difficulty: 'expert', points: 250, city: 'Paris', foundedYear: 1970, colors: 'Blue, red and white', stadium: 'Parc des Princes', nickname: 'Les Rouge et Bleu' },
];
