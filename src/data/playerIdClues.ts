export type PlayerClueKey = 'nationality' | 'birthplace' | 'role' | 'era' | 'fact';

export type PlayerClue = { key: PlayerClueKey; en: string; it: string };

export type PlayerIdPlayer = {
  id: string;
  displayName: string;
  nationality: string;
  position: string;
  era: string;
  clues: PlayerClue[];
};

// Starter biographical quiz dataset. Editorial facts are draft and must be checked before production.
// Club names, transfers and club-year sequences are intentionally excluded: those belong to Career Path.
export const playerIdPlayers: PlayerIdPlayer[] = [
  {
    "id": "lionel-messi",
    "displayName": "Lionel Messi",
    "nationality": "Argentina",
    "position": "forward",
    "era": "2003–present",
    "clues": [
      {
        "key": "nationality",
        "en": "Argentina",
        "it": "Argentina"
      },
      {
        "key": "birthplace",
        "en": "Rosario, Argentina · 1987",
        "it": "Rosario, Argentina · 1987"
      },
      {
        "key": "role",
        "en": "Forward; primarily a creative attacker",
        "it": "Attaccante; soprattutto un attaccante creativo"
      },
      {
        "key": "era",
        "en": "Senior career began in 2003; still active",
        "it": "Carriera senior iniziata nel 2003; ancora in attività"
      },
      {
        "key": "fact",
        "en": "Eight-time Ballon d’Or winner",
        "it": "Otto volte vincitore del Pallone d’Oro"
      }
    ]
  },
  {
    "id": "cristiano-ronaldo",
    "displayName": "Cristiano Ronaldo",
    "nationality": "Portugal",
    "position": "forward",
    "era": "2002–present",
    "clues": [
      {
        "key": "nationality",
        "en": "Portugal",
        "it": "Portogallo"
      },
      {
        "key": "birthplace",
        "en": "Funchal, Madeira, Portugal · 1985",
        "it": "Funchal, isola di Madeira, Portogallo · 1985"
      },
      {
        "key": "role",
        "en": "Forward; known for finishing and aerial ability",
        "it": "Attaccante; noto per finalizzazione e gioco aereo"
      },
      {
        "key": "era",
        "en": "Senior career began in 2002; still active",
        "it": "Carriera senior iniziata nel 2002; ancora in attività"
      },
      {
        "key": "fact",
        "en": "One of the most prolific international goalscorers in men’s football",
        "it": "Uno dei marcatori più prolifici nella storia del calcio internazionale maschile"
      }
    ]
  },
  {
    "id": "kylian-mbappe",
    "displayName": "Kylian Mbappé",
    "nationality": "France",
    "position": "forward",
    "era": "2015–present",
    "clues": [
      {
        "key": "nationality",
        "en": "France",
        "it": "Francia"
      },
      {
        "key": "birthplace",
        "en": "Paris, France · 1998",
        "it": "Parigi, Francia · 1998"
      },
      {
        "key": "role",
        "en": "Forward; often plays as a left winger or striker",
        "it": "Attaccante; spesso impiegato come ala sinistra o centravanti"
      },
      {
        "key": "era",
        "en": "Senior career began in 2015; still active",
        "it": "Carriera senior iniziata nel 2015; ancora in attività"
      },
      {
        "key": "fact",
        "en": "Won the 2018 FIFA World Cup and scored a hat-trick in the 2022 final",
        "it": "Ha vinto il Mondiale 2018 e segnato una tripletta nella finale del 2022"
      }
    ]
  },
  {
    "id": "erling-haaland",
    "displayName": "Erling Haaland",
    "nationality": "Norway",
    "position": "forward",
    "era": "2015–present",
    "clues": [
      {
        "key": "nationality",
        "en": "Norway",
        "it": "Norvegia"
      },
      {
        "key": "birthplace",
        "en": "Leeds, England · 2000",
        "it": "Leeds, Inghilterra · 2000"
      },
      {
        "key": "role",
        "en": "Striker; known for pace, movement and finishing",
        "it": "Centravanti; noto per velocità, movimenti e finalizzazione"
      },
      {
        "key": "era",
        "en": "Senior career began in 2015; still active",
        "it": "Carriera senior iniziata nel 2015; ancora in attività"
      },
      {
        "key": "fact",
        "en": "Scored nine goals in a single match at the 2019 FIFA U-20 World Cup",
        "it": "Ha segnato nove gol in una singola partita al Mondiale Under-20 del 2019"
      }
    ]
  },
  {
    "id": "mohamed-salah",
    "displayName": "Mohamed Salah",
    "nationality": "Egypt",
    "position": "forward",
    "era": "2010–present",
    "clues": [
      {
        "key": "nationality",
        "en": "Egypt",
        "it": "Egitto"
      },
      {
        "key": "birthplace",
        "en": "Nagrig, Egypt · 1992",
        "it": "Nagrig, Egitto · 1992"
      },
      {
        "key": "role",
        "en": "Forward; usually plays as a right winger",
        "it": "Attaccante; gioca abitualmente come ala destra"
      },
      {
        "key": "era",
        "en": "Senior career began in 2010; still active",
        "it": "Carriera senior iniziata nel 2010; ancora in attività"
      },
      {
        "key": "fact",
        "en": "Named African Footballer of the Year in 2017 and 2018",
        "it": "Eletto calciatore africano dell’anno nel 2017 e nel 2018"
      }
    ]
  },
  {
    "id": "kevin-de-bruyne",
    "displayName": "Kevin De Bruyne",
    "nationality": "Belgium",
    "position": "midfielder",
    "era": "2008–present",
    "clues": [
      {
        "key": "nationality",
        "en": "Belgium",
        "it": "Belgio"
      },
      {
        "key": "birthplace",
        "en": "Drongen, Belgium · 1991",
        "it": "Drongen, Belgio · 1991"
      },
      {
        "key": "role",
        "en": "Midfielder; renowned for passing and chance creation",
        "it": "Centrocampista; celebre per passaggi e creazione di occasioni"
      },
      {
        "key": "era",
        "en": "Senior career began in 2008; still active",
        "it": "Carriera senior iniziata nel 2008; ancora in attività"
      },
      {
        "key": "fact",
        "en": "Has won the Premier League Playmaker of the Season award multiple times",
        "it": "Ha vinto più volte il premio Premier League Playmaker of the Season"
      }
    ]
  },
  {
    "id": "vinicius-junior",
    "displayName": "Vinícius Júnior",
    "nationality": "Brazil",
    "position": "forward",
    "era": "2017–present",
    "clues": [
      {
        "key": "nationality",
        "en": "Brazil",
        "it": "Brasile"
      },
      {
        "key": "birthplace",
        "en": "São Gonçalo, Brazil · 2000",
        "it": "São Gonçalo, Brasile · 2000"
      },
      {
        "key": "role",
        "en": "Forward; usually plays as a left winger",
        "it": "Attaccante; gioca abitualmente come ala sinistra"
      },
      {
        "key": "era",
        "en": "Senior career began in 2017; still active",
        "it": "Carriera senior iniziata nel 2017; ancora in attività"
      },
      {
        "key": "fact",
        "en": "Scored in the 2022 and 2024 UEFA Champions League finals",
        "it": "Ha segnato nelle finali di UEFA Champions League del 2022 e del 2024"
      }
    ]
  },
  {
    "id": "jude-bellingham",
    "displayName": "Jude Bellingham",
    "nationality": "England",
    "position": "midfielder",
    "era": "2019–present",
    "clues": [
      {
        "key": "nationality",
        "en": "England",
        "it": "Inghilterra"
      },
      {
        "key": "birthplace",
        "en": "Stourbridge, England · 2003",
        "it": "Stourbridge, Inghilterra · 2003"
      },
      {
        "key": "role",
        "en": "Midfielder; combines ball-carrying, pressing and late runs",
        "it": "Centrocampista; unisce conduzione, pressing e inserimenti"
      },
      {
        "key": "era",
        "en": "Senior career began in 2019; still active",
        "it": "Carriera senior iniziata nel 2019; ancora in attività"
      },
      {
        "key": "fact",
        "en": "Named Bundesliga Player of the Season for 2022–23",
        "it": "Eletto miglior giocatore della Bundesliga 2022–23"
      }
    ]
  },
  {
    "id": "harry-kane",
    "displayName": "Harry Kane",
    "nationality": "England",
    "position": "forward",
    "era": "2010–present",
    "clues": [
      {
        "key": "nationality",
        "en": "England",
        "it": "Inghilterra"
      },
      {
        "key": "birthplace",
        "en": "Walthamstow, London, England · 1993",
        "it": "Walthamstow, Londra, Inghilterra · 1993"
      },
      {
        "key": "role",
        "en": "Striker; known for finishing and dropping deep to create play",
        "it": "Centravanti; noto per finalizzazione e capacità di arretrare per creare gioco"
      },
      {
        "key": "era",
        "en": "Senior career began in 2010; still active",
        "it": "Carriera senior iniziata nel 2010; ancora in attività"
      },
      {
        "key": "fact",
        "en": "Captained England to the UEFA EURO 2024 final",
        "it": "Ha capitanato l’Inghilterra fino alla finale di UEFA EURO 2024"
      }
    ]
  },
  {
    "id": "robert-lewandowski",
    "displayName": "Robert Lewandowski",
    "nationality": "Poland",
    "position": "forward",
    "era": "2006–present",
    "clues": [
      {
        "key": "nationality",
        "en": "Poland",
        "it": "Polonia"
      },
      {
        "key": "birthplace",
        "en": "Warsaw, Poland · 1988",
        "it": "Varsavia, Polonia · 1988"
      },
      {
        "key": "role",
        "en": "Striker; known for movement and clinical finishing",
        "it": "Centravanti; noto per i movimenti e la precisione sotto porta"
      },
      {
        "key": "era",
        "en": "Senior career began in 2006; still active",
        "it": "Carriera senior iniziata nel 2006; ancora in attività"
      },
      {
        "key": "fact",
        "en": "Scored five goals in nine minutes in a Bundesliga match in 2015",
        "it": "Ha segnato cinque gol in nove minuti in una partita di Bundesliga nel 2015"
      }
    ]
  },
  {
    "id": "neymar-jr",
    "displayName": "Neymar Jr",
    "nationality": "Brazil",
    "position": "forward",
    "era": "2009–present",
    "clues": [
      {
        "key": "nationality",
        "en": "Brazil",
        "it": "Brasile"
      },
      {
        "key": "birthplace",
        "en": "Mogi das Cruzes, Brazil · 1992",
        "it": "Mogi das Cruzes, Brasile · 1992"
      },
      {
        "key": "role",
        "en": "Forward; known for dribbling and creativity",
        "it": "Attaccante; noto per dribbling e creatività"
      },
      {
        "key": "era",
        "en": "Senior career began in 2009; still active",
        "it": "Carriera senior iniziata nel 2009; ancora in attività"
      },
      {
        "key": "fact",
        "en": "Recognised by the CBF as Brazil’s all-time leading men’s international goalscorer",
        "it": "Riconosciuto dalla CBF come miglior marcatore di sempre della nazionale maschile brasiliana"
      }
    ]
  },
  {
    "id": "luka-modric",
    "displayName": "Luka Modrić",
    "nationality": "Croatia",
    "position": "midfielder",
    "era": "2003–present",
    "clues": [
      {
        "key": "nationality",
        "en": "Croatia",
        "it": "Croazia"
      },
      {
        "key": "birthplace",
        "en": "Zadar, Croatia · 1985",
        "it": "Zara, Croazia · 1985"
      },
      {
        "key": "role",
        "en": "Midfielder; known for vision, control and passing range",
        "it": "Centrocampista; noto per visione, controllo e qualità nei passaggi"
      },
      {
        "key": "era",
        "en": "Senior career began in 2003; still active",
        "it": "Carriera senior iniziata nel 2003; ancora in attività"
      },
      {
        "key": "fact",
        "en": "Won the Ballon d’Or in 2018",
        "it": "Ha vinto il Pallone d’Oro nel 2018"
      }
    ]
  },
  {
    "id": "andres-iniesta",
    "displayName": "Andrés Iniesta",
    "nationality": "Spain",
    "position": "midfielder",
    "era": "2001–2024",
    "clues": [
      {
        "key": "nationality",
        "en": "Spain",
        "it": "Spagna"
      },
      {
        "key": "birthplace",
        "en": "Fuentealbilla, Spain · 1984",
        "it": "Fuentealbilla, Spagna · 1984"
      },
      {
        "key": "role",
        "en": "Midfielder; known for close control and quick combinations",
        "it": "Centrocampista; noto per controllo palla e combinazioni rapide"
      },
      {
        "key": "era",
        "en": "Senior career ran from 2001 to 2024",
        "it": "Carriera senior dal 2001 al 2024"
      },
      {
        "key": "fact",
        "en": "Scored the winning goal in the 2010 FIFA World Cup final",
        "it": "Ha segnato il gol decisivo nella finale del Mondiale 2010"
      }
    ]
  },
  {
    "id": "xavi-hernandez",
    "displayName": "Xavi Hernández",
    "nationality": "Spain",
    "position": "midfielder",
    "era": "1998–2019",
    "clues": [
      {
        "key": "nationality",
        "en": "Spain",
        "it": "Spagna"
      },
      {
        "key": "birthplace",
        "en": "Terrassa, Spain · 1980",
        "it": "Terrassa, Spagna · 1980"
      },
      {
        "key": "role",
        "en": "Central midfielder; known for tempo control and short passing",
        "it": "Centrocampista centrale; noto per gestione del ritmo e passaggi corti"
      },
      {
        "key": "era",
        "en": "Senior career ran from 1998 to 2019",
        "it": "Carriera senior dal 1998 al 2019"
      },
      {
        "key": "fact",
        "en": "Won the FIFA World Cup and two UEFA European Championships with Spain",
        "it": "Ha vinto il Mondiale FIFA e due Europei con la Spagna"
      }
    ]
  },
  {
    "id": "zinedine-zidane",
    "displayName": "Zinedine Zidane",
    "nationality": "France",
    "position": "midfielder",
    "era": "1989–2006",
    "clues": [
      {
        "key": "nationality",
        "en": "France",
        "it": "Francia"
      },
      {
        "key": "birthplace",
        "en": "Marseille, France · 1972",
        "it": "Marsiglia, Francia · 1972"
      },
      {
        "key": "role",
        "en": "Attacking midfielder; known for technique and close control",
        "it": "Trequartista; noto per tecnica e controllo palla"
      },
      {
        "key": "era",
        "en": "Senior career ran from 1989 to 2006",
        "it": "Carriera senior dal 1989 al 2006"
      },
      {
        "key": "fact",
        "en": "Won the Ballon d’Or in 1998",
        "it": "Ha vinto il Pallone d’Oro nel 1998"
      }
    ]
  },
  {
    "id": "ronaldinho",
    "displayName": "Ronaldinho",
    "nationality": "Brazil",
    "position": "forward",
    "era": "1998–2015",
    "clues": [
      {
        "key": "nationality",
        "en": "Brazil",
        "it": "Brasile"
      },
      {
        "key": "birthplace",
        "en": "Porto Alegre, Brazil · 1980",
        "it": "Porto Alegre, Brasile · 1980"
      },
      {
        "key": "role",
        "en": "Attacking midfielder and forward; famous for flair and dribbling",
        "it": "Trequartista e attaccante; famoso per fantasia e dribbling"
      },
      {
        "key": "era",
        "en": "Senior career ran from 1998 to 2015",
        "it": "Carriera senior dal 1998 al 2015"
      },
      {
        "key": "fact",
        "en": "Won the Ballon d’Or in 2005",
        "it": "Ha vinto il Pallone d’Oro nel 2005"
      }
    ]
  },
  {
    "id": "thierry-henry",
    "displayName": "Thierry Henry",
    "nationality": "France",
    "position": "forward",
    "era": "1994–2014",
    "clues": [
      {
        "key": "nationality",
        "en": "France",
        "it": "Francia"
      },
      {
        "key": "birthplace",
        "en": "Les Ulis, France · 1977",
        "it": "Les Ulis, Francia · 1977"
      },
      {
        "key": "role",
        "en": "Forward; known for pace, movement and finishing",
        "it": "Attaccante; noto per velocità, movimenti e finalizzazione"
      },
      {
        "key": "era",
        "en": "Senior career ran from 1994 to 2014",
        "it": "Carriera senior dal 1994 al 2014"
      },
      {
        "key": "fact",
        "en": "Won the Golden Boot at the 2003 FIFA Confederations Cup",
        "it": "Ha vinto la Scarpa d’Oro alla Confederations Cup FIFA 2003"
      }
    ]
  },
  {
    "id": "gianluigi-buffon",
    "displayName": "Gianluigi Buffon",
    "nationality": "Italy",
    "position": "goalkeeper",
    "era": "1995–2023",
    "clues": [
      {
        "key": "nationality",
        "en": "Italy",
        "it": "Italia"
      },
      {
        "key": "birthplace",
        "en": "Carrara, Italy · 1978",
        "it": "Carrara, Italia · 1978"
      },
      {
        "key": "role",
        "en": "Goalkeeper; known for reflexes, positioning and leadership",
        "it": "Portiere; noto per riflessi, posizionamento e leadership"
      },
      {
        "key": "era",
        "en": "Senior career ran from 1995 to 2023",
        "it": "Carriera senior dal 1995 al 2023"
      },
      {
        "key": "fact",
        "en": "Won the 2006 FIFA World Cup with Italy",
        "it": "Ha vinto il Mondiale FIFA 2006 con l’Italia"
      }
    ]
  },
  {
    "id": "paolo-maldini",
    "displayName": "Paolo Maldini",
    "nationality": "Italy",
    "position": "defender",
    "era": "1985–2009",
    "clues": [
      {
        "key": "nationality",
        "en": "Italy",
        "it": "Italia"
      },
      {
        "key": "birthplace",
        "en": "Milan, Italy · 1968",
        "it": "Milano, Italia · 1968"
      },
      {
        "key": "role",
        "en": "Defender; played mainly as a left-back and centre-back",
        "it": "Difensore; ha giocato soprattutto da terzino sinistro e centrale"
      },
      {
        "key": "era",
        "en": "Senior career ran from 1985 to 2009",
        "it": "Carriera senior dal 1985 al 2009"
      },
      {
        "key": "fact",
        "en": "Won five European Cup/UEFA Champions League titles as a player",
        "it": "Ha vinto cinque Coppe dei Campioni/UEFA Champions League da giocatore"
      }
    ]
  },
  {
    "id": "diego-maradona",
    "displayName": "Diego Maradona",
    "nationality": "Argentina",
    "position": "attacking midfielder",
    "era": "1976–1997",
    "clues": [
      {
        "key": "nationality",
        "en": "Argentina",
        "it": "Argentina"
      },
      {
        "key": "birthplace",
        "en": "Lanús, Buenos Aires Province, Argentina · 1960",
        "it": "Lanús, provincia di Buenos Aires, Argentina · 1960"
      },
      {
        "key": "role",
        "en": "Attacking midfielder and forward; famous for dribbling and playmaking",
        "it": "Trequartista e attaccante; celebre per dribbling e capacità di creare gioco"
      },
      {
        "key": "era",
        "en": "Senior career ran from 1976 to 1997",
        "it": "Carriera senior dal 1976 al 1997"
      },
      {
        "key": "fact",
        "en": "Won the Golden Ball as best player at the 1986 FIFA World Cup",
        "it": "Ha vinto il Pallone d’Oro come miglior giocatore del Mondiale 1986"
      }
    ]
  }
];
