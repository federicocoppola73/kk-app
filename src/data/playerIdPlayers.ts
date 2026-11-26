export type PlayerDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type PlayerIdPlayer = {
  id: string;
  displayName: string;
  difficulty: PlayerDifficulty;
  points: number;
  // Test portraits are exposed only in development builds. Keep rights status pending until cleared.
  portraitStatus: 'pending';
  portraitUrl: string | null;
};

// Bundled starter snapshot of kk-data/players/player-id-starter-20.json.
// Keep editorial records in kk-data as the source of truth.
export const playerIdPlayers: PlayerIdPlayer[] = [
  {
    "id": "lionel-messi",
    "displayName": "Lionel Messi",
    "difficulty": "easy",
    "points": 100,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/lionel-messi.jpg" : null
  },
  {
    "id": "cristiano-ronaldo",
    "displayName": "Cristiano Ronaldo",
    "difficulty": "easy",
    "points": 100,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/cristiano-ronaldo.jpg" : null
  },
  {
    "id": "kylian-mbappe",
    "displayName": "Kylian Mbappé",
    "difficulty": "easy",
    "points": 100,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/kylian-mbappe.jpg" : null
  },
  {
    "id": "erling-haaland",
    "displayName": "Erling Haaland",
    "difficulty": "easy",
    "points": 100,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/erling-haaland.jpg" : null
  },
  {
    "id": "mohamed-salah",
    "displayName": "Mohamed Salah",
    "difficulty": "medium",
    "points": 150,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/mohamed-salah.jpg" : null
  },
  {
    "id": "kevin-de-bruyne",
    "displayName": "Kevin De Bruyne",
    "difficulty": "medium",
    "points": 150,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/kevin-de-bruyne.jpg" : null
  },
  {
    "id": "vinicius-junior",
    "displayName": "Vinícius Júnior",
    "difficulty": "medium",
    "points": 150,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/vinicius-junior.jpg" : null
  },
  {
    "id": "jude-bellingham",
    "displayName": "Jude Bellingham",
    "difficulty": "medium",
    "points": 150,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/jude-bellingham.jpg" : null
  },
  {
    "id": "harry-kane",
    "displayName": "Harry Kane",
    "difficulty": "medium",
    "points": 150,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/harry-kane.jpg" : null
  },
  {
    "id": "robert-lewandowski",
    "displayName": "Robert Lewandowski",
    "difficulty": "medium",
    "points": 150,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/robert-lewandowski.jpg" : null
  },
  {
    "id": "neymar-jr",
    "displayName": "Neymar Jr",
    "difficulty": "hard",
    "points": 200,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/neymar-jr.jpg" : null
  },
  {
    "id": "luka-modric",
    "displayName": "Luka Modrić",
    "difficulty": "hard",
    "points": 200,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/luka-modric.jpg" : null
  },
  {
    "id": "andres-iniesta",
    "displayName": "Andrés Iniesta",
    "difficulty": "hard",
    "points": 200,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/andres-iniesta.jpg" : null
  },
  {
    "id": "xavi-hernandez",
    "displayName": "Xavi Hernández",
    "difficulty": "hard",
    "points": 200,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/xavi-hernandez.jpg" : null
  },
  {
    "id": "zinedine-zidane",
    "displayName": "Zinedine Zidane",
    "difficulty": "hard",
    "points": 200,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/zinedine-zidane.jpg" : null
  },
  {
    "id": "ronaldinho",
    "displayName": "Ronaldinho",
    "difficulty": "hard",
    "points": 200,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/ronaldinho.jpg" : null
  },
  {
    "id": "thierry-henry",
    "displayName": "Thierry Henry",
    "difficulty": "expert",
    "points": 250,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/thierry-henry.jpg" : null
  },
  {
    "id": "gianluigi-buffon",
    "displayName": "Gianluigi Buffon",
    "difficulty": "expert",
    "points": 250,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/gianluigi-buffon.jpg" : null
  },
  {
    "id": "paolo-maldini",
    "displayName": "Paolo Maldini",
    "difficulty": "expert",
    "points": 250,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/paolo-maldini.jpg" : null
  },
  {
    "id": "diego-maradona",
    "displayName": "Diego Maradona",
    "difficulty": "expert",
    "points": 250,
    "portraitStatus": "pending",
    "portraitUrl": __DEV__ ? "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/diego-maradona.jpg" : null
  }
];
