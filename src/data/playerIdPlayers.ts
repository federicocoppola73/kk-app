export type PlayerDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type PlayerIdPlayer = {
  id: string;
  displayName: string;
  difficulty: PlayerDifficulty;
  points: number;
  // Portraits will be connected only after image rights are approved.
  portraitStatus: 'pending';
  portraitUrl: string;
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
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/lionel-messi.jpg"
  },
  {
    "id": "cristiano-ronaldo",
    "displayName": "Cristiano Ronaldo",
    "difficulty": "easy",
    "points": 100,
    "portraitStatus": "pending",
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/cristiano-ronaldo.jpg"
  },
  {
    "id": "kylian-mbappe",
    "displayName": "Kylian Mbappé",
    "difficulty": "easy",
    "points": 100,
    "portraitStatus": "pending",
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/kylian-mbappe.jpg"
  },
  {
    "id": "erling-haaland",
    "displayName": "Erling Haaland",
    "difficulty": "easy",
    "points": 100,
    "portraitStatus": "pending",
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/erling-haaland.jpg"
  },
  {
    "id": "mohamed-salah",
    "displayName": "Mohamed Salah",
    "difficulty": "medium",
    "points": 150,
    "portraitStatus": "pending",
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/mohamed-salah.jpg"
  },
  {
    "id": "kevin-de-bruyne",
    "displayName": "Kevin De Bruyne",
    "difficulty": "medium",
    "points": 150,
    "portraitStatus": "pending",
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/kevin-de-bruyne.jpg"
  },
  {
    "id": "vinicius-junior",
    "displayName": "Vinícius Júnior",
    "difficulty": "medium",
    "points": 150,
    "portraitStatus": "pending",
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/vinicius-junior.jpg"
  },
  {
    "id": "jude-bellingham",
    "displayName": "Jude Bellingham",
    "difficulty": "medium",
    "points": 150,
    "portraitStatus": "pending",
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/jude-bellingham.jpg"
  },
  {
    "id": "harry-kane",
    "displayName": "Harry Kane",
    "difficulty": "medium",
    "points": 150,
    "portraitStatus": "pending",
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/harry-kane.jpg"
  },
  {
    "id": "robert-lewandowski",
    "displayName": "Robert Lewandowski",
    "difficulty": "medium",
    "points": 150,
    "portraitStatus": "pending",
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/robert-lewandowski.jpg"
  },
  {
    "id": "neymar-jr",
    "displayName": "Neymar Jr",
    "difficulty": "hard",
    "points": 200,
    "portraitStatus": "pending",
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/neymar-jr.jpg"
  },
  {
    "id": "luka-modric",
    "displayName": "Luka Modrić",
    "difficulty": "hard",
    "points": 200,
    "portraitStatus": "pending",
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/luka-modric.jpg"
  },
  {
    "id": "andres-iniesta",
    "displayName": "Andrés Iniesta",
    "difficulty": "hard",
    "points": 200,
    "portraitStatus": "pending",
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/andres-iniesta.jpg"
  },
  {
    "id": "xavi-hernandez",
    "displayName": "Xavi Hernández",
    "difficulty": "hard",
    "points": 200,
    "portraitStatus": "pending",
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/xavi-hernandez.jpg"
  },
  {
    "id": "zinedine-zidane",
    "displayName": "Zinedine Zidane",
    "difficulty": "hard",
    "points": 200,
    "portraitStatus": "pending",
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/zinedine-zidane.jpg"
  },
  {
    "id": "ronaldinho",
    "displayName": "Ronaldinho",
    "difficulty": "hard",
    "points": 200,
    "portraitStatus": "pending",
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/ronaldinho.jpg"
  },
  {
    "id": "thierry-henry",
    "displayName": "Thierry Henry",
    "difficulty": "expert",
    "points": 250,
    "portraitStatus": "pending",
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/thierry-henry.jpg"
  },
  {
    "id": "gianluigi-buffon",
    "displayName": "Gianluigi Buffon",
    "difficulty": "expert",
    "points": 250,
    "portraitStatus": "pending",
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/gianluigi-buffon.jpg"
  },
  {
    "id": "paolo-maldini",
    "displayName": "Paolo Maldini",
    "difficulty": "expert",
    "points": 250,
    "portraitStatus": "pending",
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/paolo-maldini.jpg"
  },
  {
    "id": "diego-maradona",
    "displayName": "Diego Maradona",
    "difficulty": "expert",
    "points": 250,
    "portraitStatus": "pending",
    "portraitUrl": "https://raw.githubusercontent.com/federicocoppola73/kk-data/main/players/pending/diego-maradona.jpg"
  }
];
