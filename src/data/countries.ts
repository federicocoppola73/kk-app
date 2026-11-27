export const COUNTRY_CODES = `
AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ
BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ
CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ
DE DJ DK DM DO DZ
EC EE EG EH ER ES ET
FI FJ FK FM FO FR
GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY
HK HM HN HR HT HU
ID IE IL IM IN IO IQ IR IS IT
JE JM JO JP
KE KG KH KI KM KN KP KR KW KY KZ
LA LB LC LI LK LR LS LT LU LV LY
MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ
NA NC NE NF NG NI NL NO NP NR NU NZ
OM
PA PE PF PG PH PK PL PM PN PR PS PT PW PY
QA
RE RO RS RU RW
SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ
TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ
UA UG UM US UY UZ
VA VC VE VG VI VN VU
WF WS
YE YT
ZA ZM ZW
`.trim().split(/\s+/);

const FALLBACK_NAMES: Record<string, string> = {
  US: 'United States', GB: 'United Kingdom', IT: 'Italy', FR: 'France',
  DE: 'Germany', ES: 'Spain', PT: 'Portugal', NL: 'Netherlands',
  BE: 'Belgium', CH: 'Switzerland', AT: 'Austria', IE: 'Ireland',
  BR: 'Brazil', AR: 'Argentina', MX: 'Mexico', CA: 'Canada',
  AU: 'Australia', NZ: 'New Zealand', JP: 'Japan', KR: 'South Korea',
  CN: 'China', IN: 'India', TR: 'Türkiye', GR: 'Greece',
  SE: 'Sweden', NO: 'Norway', DK: 'Denmark', FI: 'Finland',
  PL: 'Poland', UA: 'Ukraine', HR: 'Croatia', RS: 'Serbia',
  RO: 'Romania', CZ: 'Czechia', SK: 'Slovakia', HU: 'Hungary',
  SI: 'Slovenia', BG: 'Bulgaria', AL: 'Albania', IS: 'Iceland',
  MA: 'Morocco', EG: 'Egypt', ZA: 'South Africa', NG: 'Nigeria',
  GH: 'Ghana', SN: 'Senegal', CI: 'Côte d’Ivoire', CM: 'Cameroon',
  SA: 'Saudi Arabia', AE: 'United Arab Emirates', QA: 'Qatar',
  IL: 'Israel', TH: 'Thailand', ID: 'Indonesia', MY: 'Malaysia',
  SG: 'Singapore', PH: 'Philippines', PK: 'Pakistan', BD: 'Bangladesh',
};

export function getCountryName(code: string, locale: string): string {
  try {
    const DisplayNames = (Intl as unknown as {
      DisplayNames?: new (locales: string[], options: { type: 'region' }) => { of: (code: string) => string | undefined };
    }).DisplayNames;
    if (DisplayNames) {
      const name = new DisplayNames([locale], { type: 'region' }).of(code);
      if (name && name !== code) return name;
    }
  } catch {
    // Use the built-in fallback when the runtime lacks Intl.DisplayNames.
  }
  return FALLBACK_NAMES[code] ?? code;
}
