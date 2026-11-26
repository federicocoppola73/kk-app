export type PlayerDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type PlayerIdPlayer = {
  id: string;
  displayName: string;
  difficulty: PlayerDifficulty;
  points: number;
  // Portraits will be connected only after image rights are approved.
  portraitStatus: 'pending';
};

// Bundled starter snapshot of kk-data/players/player-id-starter-20.json.
// Keep editorial records in kk-data as the source of truth.
export const playerIdPlayers: PlayerIdPlayer[] = [
  {
    "id": "lionel-messi",
    "displayName": "Lionel Messi",
    "difficulty": "easy",
    "points": 100,
    "portraitStatus": "pending"
  },
  {
    "id": "cristiano-ronaldo",
    "displayName": "Cristiano Ronaldo",
    "difficulty": "easy",
    "points": 100,
    "portraitStatus": "pending"
  },
  {
    "id": "kylian-mbappe",
    "displayName": "Kylian Mbappé",
    "difficulty": "easy",
    "points": 100,
    "portraitStatus": "pending"
  },
  {
    "id": "erling-haaland",
    "displayName": "Erling Haaland",
    "difficulty": "easy",
    "points": 100,
    "portraitStatus": "pending"
  },
  {
    "id": "mohamed-salah",
    "displayName": "Mohamed Salah",
    "difficulty": "medium",
    "points": 150,
    "portraitStatus": "pending"
  },
  {
    "id": "kevin-de-bruyne",
    "displayName": "Kevin De Bruyne",
    "difficulty": "medium",
    "points": 150,
    "portraitStatus": "pending"
  },
  {
    "id": "vinicius-junior",
    "displayName": "Vinícius Júnior",
    "difficulty": "medium",
    "points": 150,
    "portraitStatus": "pending"
  },
  {
    "id": "jude-bellingham",
    "displayName": "Jude Bellingham",
    "difficulty": "medium",
    "points": 150,
    "portraitStatus": "pending"
  },
  {
    "id": "harry-kane",
    "displayName": "Harry Kane",
    "difficulty": "medium",
    "points": 150,
    "portraitStatus": "pending"
  },
  {
    "id": "robert-lewandowski",
    "displayName": "Robert Lewandowski",
    "difficulty": "medium",
    "points": 150,
    "portraitStatus": "pending"
  },
  {
    "id": "neymar-jr",
    "displayName": "Neymar Jr",
    "difficulty": "hard",
    "points": 200,
    "portraitStatus": "pending"
  },
  {
    "id": "luka-modric",
    "displayName": "Luka Modrić",
    "difficulty": "hard",
    "points": 200,
    "portraitStatus": "pending"
  },
  {
    "id": "andres-iniesta",
    "displayName": "Andrés Iniesta",
    "difficulty": "hard",
    "points": 200,
    "portraitStatus": "pending"
  },
  {
    "id": "xavi-hernandez",
    "displayName": "Xavi Hernández",
    "difficulty": "hard",
    "points": 200,
    "portraitStatus": "pending"
  },
  {
    "id": "zinedine-zidane",
    "displayName": "Zinedine Zidane",
    "difficulty": "hard",
    "points": 200,
    "portraitStatus": "pending"
  },
  {
    "id": "ronaldinho",
    "displayName": "Ronaldinho",
    "difficulty": "hard",
    "points": 200,
    "portraitStatus": "pending"
  },
  {
    "id": "thierry-henry",
    "displayName": "Thierry Henry",
    "difficulty": "expert",
    "points": 250,
    "portraitStatus": "pending"
  },
  {
    "id": "gianluigi-buffon",
    "displayName": "Gianluigi Buffon",
    "difficulty": "expert",
    "points": 250,
    "portraitStatus": "pending"
  },
  {
    "id": "paolo-maldini",
    "displayName": "Paolo Maldini",
    "difficulty": "expert",
    "points": 250,
    "portraitStatus": "pending"
  },
  {
    "id": "diego-maradona",
    "displayName": "Diego Maradona",
    "difficulty": "expert",
    "points": 250,
    "portraitStatus": "pending"
  }
];
