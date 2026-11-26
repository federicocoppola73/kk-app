export type Stadium = {
  id: string;
  name: string;
  city: string;
  cityIt: string;
  country: string;
  countryIt: string;
  openedYear: number;
  capacityEn: string;
  capacityIt: string;
  eventEn: string;
  eventIt: string;
  homeTeamsEn: string[];
  homeTeamsIt: string[];
};

// Starter records mirror kk-data/stadiums/stadium-id-starter-30.json.
// Facts are draft content for internal testing; verify before production.
export const stadiums: Stadium[] = [
  {
    "id": "wembley",
    "name": "Wembley Stadium",
    "city": "London",
    "cityIt": "Londra",
    "country": "England",
    "countryIt": "Inghilterra",
    "openedYear": 2007,
    "capacityEn": "around 90,000 seats",
    "capacityIt": "circa 90.000 posti",
    "eventEn": "2024 UEFA Champions League Final",
    "eventIt": "Finale UEFA Champions League 2024",
    "homeTeamsEn": [
      "England national football team",
      "National stadium"
    ],
    "homeTeamsIt": [
      "Nazionale inglese",
      "Stadio nazionale"
    ]
  },
  {
    "id": "old-trafford",
    "name": "Old Trafford",
    "city": "Manchester",
    "cityIt": "Manchester",
    "country": "England",
    "countryIt": "Inghilterra",
    "openedYear": 1910,
    "capacityEn": "around 74,310 seats",
    "capacityIt": "circa 74.310 posti",
    "eventEn": "2003 UEFA Champions League Final",
    "eventIt": "Finale UEFA Champions League 2003",
    "homeTeamsEn": [
      "Manchester United"
    ],
    "homeTeamsIt": [
      "Manchester United"
    ]
  },
  {
    "id": "anfield",
    "name": "Anfield",
    "city": "Liverpool",
    "cityIt": "Liverpool",
    "country": "England",
    "countryIt": "Inghilterra",
    "openedYear": 1884,
    "capacityEn": "around 61,276 seats",
    "capacityIt": "circa 61.276 posti",
    "eventEn": "2005 UEFA Champions League Final",
    "eventIt": "Finale UEFA Champions League 2005",
    "homeTeamsEn": [
      "Liverpool FC"
    ],
    "homeTeamsIt": [
      "Liverpool FC"
    ]
  },
  {
    "id": "emirates-stadium",
    "name": "Emirates Stadium",
    "city": "London",
    "cityIt": "Londra",
    "country": "England",
    "countryIt": "Inghilterra",
    "openedYear": 2006,
    "capacityEn": "around 60,704 seats",
    "capacityIt": "circa 60.704 posti",
    "eventEn": "First competitive match: Arsenal v Aston Villa, 2006",
    "eventIt": "Prima partita ufficiale: Arsenal–Aston Villa, 2006",
    "homeTeamsEn": [
      "Arsenal FC"
    ],
    "homeTeamsIt": [
      "Arsenal FC"
    ]
  },
  {
    "id": "tottenham-hotspur-stadium",
    "name": "Tottenham Hotspur Stadium",
    "city": "London",
    "cityIt": "Londra",
    "country": "England",
    "countryIt": "Inghilterra",
    "openedYear": 2019,
    "capacityEn": "around 62,850 seats",
    "capacityIt": "circa 62.850 posti",
    "eventEn": "First competitive match: Tottenham v Crystal Palace, 2019",
    "eventIt": "Prima partita ufficiale: Tottenham–Crystal Palace, 2019",
    "homeTeamsEn": [
      "Tottenham Hotspur"
    ],
    "homeTeamsIt": [
      "Tottenham Hotspur"
    ]
  },
  {
    "id": "santiago-bernabeu",
    "name": "Santiago Bernabéu",
    "city": "Madrid",
    "cityIt": "Madrid",
    "country": "Spain",
    "countryIt": "Spagna",
    "openedYear": 1947,
    "capacityEn": "around 83,186 seats (recheck after redevelopment)",
    "capacityIt": "circa 83.186 posti (dato pre-ristrutturazione finale da ricontrollare)",
    "eventEn": "1982 FIFA World Cup Final",
    "eventIt": "Finale della Coppa del Mondo FIFA 1982",
    "homeTeamsEn": [
      "Real Madrid"
    ],
    "homeTeamsIt": [
      "Real Madrid"
    ]
  },
  {
    "id": "metropolitano",
    "name": "Riyadh Air Metropolitano",
    "city": "Madrid",
    "cityIt": "Madrid",
    "country": "Spain",
    "countryIt": "Spagna",
    "openedYear": 2017,
    "capacityEn": "around 70,460 seats",
    "capacityIt": "circa 70.460 posti",
    "eventEn": "2019 UEFA Champions League Final",
    "eventIt": "Finale UEFA Champions League 2019",
    "homeTeamsEn": [
      "Atlético de Madrid"
    ],
    "homeTeamsIt": [
      "Atlético de Madrid"
    ]
  },
  {
    "id": "mestalla",
    "name": "Mestalla",
    "city": "Valencia",
    "cityIt": "Valencia",
    "country": "Spain",
    "countryIt": "Spagna",
    "openedYear": 1923,
    "capacityEn": "around 49,430 seats",
    "capacityIt": "circa 49.430 posti",
    "eventEn": "1982 FIFA World Cup matches",
    "eventIt": "Partite della Coppa del Mondo FIFA 1982",
    "homeTeamsEn": [
      "Valencia CF"
    ],
    "homeTeamsIt": [
      "Valencia CF"
    ]
  },
  {
    "id": "san-mames",
    "name": "San Mamés",
    "city": "Bilbao",
    "cityIt": "Bilbao",
    "country": "Spain",
    "countryIt": "Spagna",
    "openedYear": 2013,
    "capacityEn": "around 53,289 seats",
    "capacityIt": "circa 53.289 posti",
    "eventEn": "2025 UEFA Europa League Final",
    "eventIt": "Finale UEFA Europa League 2025",
    "homeTeamsEn": [
      "Athletic Club"
    ],
    "homeTeamsIt": [
      "Athletic Club"
    ]
  },
  {
    "id": "benito-villamarin",
    "name": "Estadio Benito Villamarín",
    "city": "Seville",
    "cityIt": "Siviglia",
    "country": "Spain",
    "countryIt": "Spagna",
    "openedYear": 1929,
    "capacityEn": "around 60,721 seats",
    "capacityIt": "circa 60.721 posti",
    "eventEn": "Venue for international matches and Spain national-team fixtures",
    "eventIt": "Sede di partite internazionali e della nazionale spagnola",
    "homeTeamsEn": [
      "Real Betis"
    ],
    "homeTeamsIt": [
      "Real Betis"
    ]
  },
  {
    "id": "san-siro",
    "name": "Stadio Giuseppe Meazza (San Siro)",
    "city": "Milan",
    "cityIt": "Milano",
    "country": "Italy",
    "countryIt": "Italia",
    "openedYear": 1926,
    "capacityEn": "around 75,817 seats (event-dependent capacity)",
    "capacityIt": "circa 75.817 posti (capienza variabile per evento)",
    "eventEn": "2016 UEFA Champions League Final",
    "eventIt": "Finale UEFA Champions League 2016",
    "homeTeamsEn": [
      "Inter",
      "AC Milan"
    ],
    "homeTeamsIt": [
      "Inter",
      "AC Milan"
    ]
  },
  {
    "id": "allianz-stadium",
    "name": "Allianz Stadium",
    "city": "Turin",
    "cityIt": "Torino",
    "country": "Italy",
    "countryIt": "Italia",
    "openedYear": 2011,
    "capacityEn": "around 41,507 seats",
    "capacityIt": "circa 41.507 posti",
    "eventEn": "2014 UEFA Europa League Final",
    "eventIt": "Finale UEFA Europa League 2014",
    "homeTeamsEn": [
      "Juventus"
    ],
    "homeTeamsIt": [
      "Juventus"
    ]
  },
  {
    "id": "stadio-olimpico-rome",
    "name": "Stadio Olimpico",
    "city": "Rome",
    "cityIt": "Roma",
    "country": "Italy",
    "countryIt": "Italia",
    "openedYear": 1953,
    "capacityEn": "around 70,634 seats",
    "capacityIt": "circa 70.634 posti",
    "eventEn": "1990 FIFA World Cup Final",
    "eventIt": "Finale della Coppa del Mondo FIFA 1990",
    "homeTeamsEn": [
      "AS Roma",
      "SS Lazio"
    ],
    "homeTeamsIt": [
      "AS Roma",
      "SS Lazio"
    ]
  },
  {
    "id": "diego-armando-maradona",
    "name": "Stadio Diego Armando Maradona",
    "city": "Naples",
    "cityIt": "Napoli",
    "country": "Italy",
    "countryIt": "Italia",
    "openedYear": 1959,
    "capacityEn": "around 54,726 seats",
    "capacityIt": "circa 54.726 posti",
    "eventEn": "1990 FIFA World Cup semi-final: Italy v Argentina",
    "eventIt": "Semifinale della Coppa del Mondo FIFA 1990: Italia–Argentina",
    "homeTeamsEn": [
      "SSC Napoli"
    ],
    "homeTeamsIt": [
      "SSC Napoli"
    ]
  },
  {
    "id": "gewiss-stadium",
    "name": "New Balance Arena (Gewiss Stadium)",
    "city": "Bergamo",
    "cityIt": "Bergamo",
    "country": "Italy",
    "countryIt": "Italia",
    "openedYear": 1928,
    "capacityEn": "around 24,950 seats (verify after redevelopment)",
    "capacityIt": "circa 24.950 posti (dato da verificare dopo i lavori)",
    "eventEn": "Reopened after major redevelopment, 2019",
    "eventIt": "Riapertura dopo la riqualificazione principale, 2019",
    "homeTeamsEn": [
      "Atalanta BC"
    ],
    "homeTeamsIt": [
      "Atalanta BC"
    ]
  },
  {
    "id": "allianz-arena",
    "name": "Allianz Arena",
    "city": "Munich",
    "cityIt": "Monaco di Baviera",
    "country": "Germany",
    "countryIt": "Germania",
    "openedYear": 2005,
    "capacityEn": "75,024 for domestic matches",
    "capacityIt": "75.024 posti per le partite nazionali",
    "eventEn": "2012 UEFA Champions League Final",
    "eventIt": "Finale UEFA Champions League 2012",
    "homeTeamsEn": [
      "FC Bayern München"
    ],
    "homeTeamsIt": [
      "FC Bayern München"
    ]
  },
  {
    "id": "signal-iduna-park",
    "name": "Signal Iduna Park (Westfalenstadion)",
    "city": "Dortmund",
    "cityIt": "Dortmund",
    "country": "Germany",
    "countryIt": "Germania",
    "openedYear": 1974,
    "capacityEn": "around 81,365 seats",
    "capacityIt": "circa 81.365 posti",
    "eventEn": "2001 UEFA Cup Final",
    "eventIt": "Finale Coppa UEFA 2001",
    "homeTeamsEn": [
      "Borussia Dortmund"
    ],
    "homeTeamsIt": [
      "Borussia Dortmund"
    ]
  },
  {
    "id": "olympiastadion-berlin",
    "name": "Olympiastadion Berlin",
    "city": "Berlin",
    "cityIt": "Berlino",
    "country": "Germany",
    "countryIt": "Germania",
    "openedYear": 1936,
    "capacityEn": "73,779 seats",
    "capacityIt": "73.779 posti",
    "eventEn": "2006 FIFA World Cup Final",
    "eventIt": "Finale della Coppa del Mondo FIFA 2006",
    "homeTeamsEn": [
      "Hertha BSC"
    ],
    "homeTeamsIt": [
      "Hertha BSC"
    ]
  },
  {
    "id": "deutsche-bank-park",
    "name": "Deutsche Bank Park",
    "city": "Frankfurt",
    "cityIt": "Francoforte",
    "country": "Germany",
    "countryIt": "Germania",
    "openedYear": 1925,
    "capacityEn": "around 58,000 seats",
    "capacityIt": "circa 58.000 posti",
    "eventEn": "2006 FIFA World Cup matches",
    "eventIt": "Partite della Coppa del Mondo FIFA 2006",
    "homeTeamsEn": [
      "Eintracht Frankfurt"
    ],
    "homeTeamsIt": [
      "Eintracht Frankfurt"
    ]
  },
  {
    "id": "mhparena",
    "name": "MHPArena",
    "city": "Stuttgart",
    "cityIt": "Stoccarda",
    "country": "Germany",
    "countryIt": "Germania",
    "openedYear": 1933,
    "capacityEn": "around 60,058 seats",
    "capacityIt": "circa 60.058 posti",
    "eventEn": "2006 FIFA World Cup matches",
    "eventIt": "Partite della Coppa del Mondo FIFA 2006",
    "homeTeamsEn": [
      "VfB Stuttgart"
    ],
    "homeTeamsIt": [
      "VfB Stuttgart"
    ]
  },
  {
    "id": "maracana",
    "name": "Estádio do Maracanã",
    "city": "Rio de Janeiro",
    "cityIt": "Rio de Janeiro",
    "country": "Brazil",
    "countryIt": "Brasile",
    "openedYear": 1950,
    "capacityEn": "around 78,838 seats (configuration varies)",
    "capacityIt": "circa 78.838 posti (configurazione variabile)",
    "eventEn": "2014 FIFA World Cup Final",
    "eventIt": "Finale della Coppa del Mondo FIFA 2014",
    "homeTeamsEn": [
      "Flamengo",
      "Fluminense"
    ],
    "homeTeamsIt": [
      "Flamengo",
      "Fluminense"
    ]
  },
  {
    "id": "morumbi",
    "name": "Estádio do Morumbi",
    "city": "São Paulo",
    "cityIt": "San Paolo",
    "country": "Brazil",
    "countryIt": "Brasile",
    "openedYear": 1960,
    "capacityEn": "around 66,795 seats",
    "capacityIt": "circa 66.795 posti",
    "eventEn": "2019 Copa América opening match",
    "eventIt": "Partita inaugurale della Copa América 2019",
    "homeTeamsEn": [
      "São Paulo FC"
    ],
    "homeTeamsIt": [
      "São Paulo FC"
    ]
  },
  {
    "id": "allianz-parque",
    "name": "Allianz Parque",
    "city": "São Paulo",
    "cityIt": "San Paolo",
    "country": "Brazil",
    "countryIt": "Brasile",
    "openedYear": 2014,
    "capacityEn": "around 43,713 seats",
    "capacityIt": "circa 43.713 posti",
    "eventEn": "2019 Copa América matches",
    "eventIt": "Partite della Copa América 2019",
    "homeTeamsEn": [
      "SE Palmeiras"
    ],
    "homeTeamsIt": [
      "SE Palmeiras"
    ]
  },
  {
    "id": "neo-quimica-arena",
    "name": "Neo Química Arena",
    "city": "São Paulo",
    "cityIt": "San Paolo",
    "country": "Brazil",
    "countryIt": "Brasile",
    "openedYear": 2014,
    "capacityEn": "around 49,205 seats",
    "capacityIt": "circa 49.205 posti",
    "eventEn": "2014 FIFA World Cup opening match",
    "eventIt": "Partita inaugurale della Coppa del Mondo FIFA 2014",
    "homeTeamsEn": [
      "SC Corinthians Paulista"
    ],
    "homeTeamsIt": [
      "SC Corinthians Paulista"
    ]
  },
  {
    "id": "arena-do-gremio",
    "name": "Arena do Grêmio",
    "city": "Porto Alegre",
    "cityIt": "Porto Alegre",
    "country": "Brazil",
    "countryIt": "Brasile",
    "openedYear": 2013,
    "capacityEn": "around 55,662 seats",
    "capacityIt": "circa 55.662 posti",
    "eventEn": "2019 Copa América matches",
    "eventIt": "Partite della Copa América 2019",
    "homeTeamsEn": [
      "Grêmio FBPA"
    ],
    "homeTeamsIt": [
      "Grêmio FBPA"
    ]
  },
  {
    "id": "estadio-azteca",
    "name": "Estadio Azteca (Estadio Banorte)",
    "city": "Mexico City",
    "cityIt": "Città del Messico",
    "country": "Mexico",
    "countryIt": "Messico",
    "openedYear": 1966,
    "capacityEn": "around 87,500 seats (historical figure; recheck after works)",
    "capacityIt": "circa 87.500 posti (dato storico, ricontrollare dopo i lavori)",
    "eventEn": "1970 and 1986 FIFA World Cup Finals",
    "eventIt": "Finali della Coppa del Mondo FIFA 1970 e 1986",
    "homeTeamsEn": [
      "Club América",
      "Cruz Azul (utilizzo recente; da verificare per stagione)",
      "Messico – nazionale"
    ],
    "homeTeamsIt": [
      "Club América",
      "Cruz Azul (utilizzo recente; da verificare per stagione)",
      "Nazionale messicana"
    ]
  },
  {
    "id": "olimpico-universitario",
    "name": "Estadio Olímpico Universitario",
    "city": "Mexico City",
    "cityIt": "Città del Messico",
    "country": "Mexico",
    "countryIt": "Messico",
    "openedYear": 1952,
    "capacityEn": "around 72,000 seats (verify)",
    "capacityIt": "circa 72.000 posti (da verificare)",
    "eventEn": "1968 Olympic football tournament matches (verify)",
    "eventIt": "Partite del torneo olimpico di calcio 1968 (da verificare)",
    "homeTeamsEn": [
      "Pumas UNAM"
    ],
    "homeTeamsIt": [
      "Pumas UNAM"
    ]
  },
  {
    "id": "estadio-jalisco",
    "name": "Estadio Jalisco",
    "city": "Guadalajara",
    "cityIt": "Guadalajara",
    "country": "Mexico",
    "countryIt": "Messico",
    "openedYear": 1960,
    "capacityEn": "around 55,020 seats",
    "capacityIt": "circa 55.020 posti",
    "eventEn": "1970 and 1986 FIFA World Cup matches",
    "eventIt": "Partite delle Coppe del Mondo FIFA 1970 e 1986",
    "homeTeamsEn": [
      "Atlas FC",
      "Leones Negros UdeG"
    ],
    "homeTeamsIt": [
      "Atlas FC",
      "Leones Negros UdeG"
    ]
  },
  {
    "id": "estadio-bbva",
    "name": "Estadio BBVA",
    "city": "Monterrey",
    "cityIt": "Monterrey",
    "country": "Mexico",
    "countryIt": "Messico",
    "openedYear": 2015,
    "capacityEn": "around 53,500 seats",
    "capacityIt": "circa 53.500 posti",
    "eventEn": "Venue for 2026 FIFA World Cup matches",
    "eventIt": "Sede di partite della Coppa del Mondo FIFA 2026",
    "homeTeamsEn": [
      "CF Monterrey"
    ],
    "homeTeamsIt": [
      "CF Monterrey"
    ]
  },
  {
    "id": "estadio-akron",
    "name": "Estadio Akron",
    "city": "Guadalajara",
    "cityIt": "Guadalajara",
    "country": "Mexico",
    "countryIt": "Messico",
    "openedYear": 2010,
    "capacityEn": "around 49,813 seats",
    "capacityIt": "circa 49.813 posti",
    "eventEn": "Venue for 2026 FIFA World Cup matches",
    "eventIt": "Sede di partite della Coppa del Mondo FIFA 2026",
    "homeTeamsEn": [
      "CD Guadalajara (Chivas)"
    ],
    "homeTeamsIt": [
      "CD Guadalajara (Chivas)"
    ]
  }
];
