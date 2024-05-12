export const countryData = [
  { code: 'AD', name: 'Andorra', regex: /^AD\d{3}$/ },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AI', name: 'Anguilla' },
  { code: 'AL', name: 'Albania' },
  { code: 'AM', name: 'Armenia', regex: /^(37)?\d{4}$/ },
  { code: 'AO', name: 'Angola' },
  { code: 'AQ', name: 'Antarctica' },
  { code: 'AR', name: 'Argentina', regex: /^([A-HJ-NP-Z])?\d{4}([A-Z]{3})?$/ },
  { code: 'AS', name: 'American Samoa', regex: /^96799$/ },
  { code: 'AT', name: 'Austria', regex: /^(?!0)\d{4}$/ },
  { code: 'AU', name: 'Australia', regex: /^\d{4}$/ },
  { code: 'AW', name: 'Aruba' },
  { code: 'AX', name: 'Åland Islands', regex: /^22\d{3}$/ },
  { code: 'AZ', name: 'Azerbaijan', regex: /^\d{4}$/ },
  { code: 'BA', name: 'Bosnia and Herzegovina', regex: /^\d{5}$/ },
  { code: 'BB', name: 'Barbados', regex: /^(BB\d{5})?$/ },
  { code: 'BD', name: 'Bangladesh', regex: /^\d{4}$/ },
  { code: 'BE', name: 'Belgium', regex: /^\d{4}$/ },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BG', name: 'Bulgaria', regex: /^\d{4}$/ },
  { code: 'BH', name: 'Bahrain', regex: /^((1[0-2]|[2-9])\d{2})?$/ },
  { code: 'BI', name: 'Burundi' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BL', name: 'Saint Barthélemy' },
  { code: 'BM', name: 'Bermuda', regex: /^[A-Z]{2}[ ]?[A-Z0-9]{2}$/ },
  { code: 'BN', name: 'Brunei Darussalam', regex: /^[A-Z]{2}[ ]?\d{4}$/ },
  { code: 'BO', name: 'Bolivia, Plurinational State of' },
  { code: 'BQ', name: 'Bonaire, Sint Eustatius and Saba' },
  { code: 'BR', name: 'Brazil', regex: /^\d{5}[\-]?\d{3}$/ },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'BV', name: 'Bouvet Island' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BY', name: 'Belarus', regex: /^\d{6}$/ },
  { code: 'BZ', name: 'Belize' },
  {
    code: 'CA',
    name: 'Canada',
    regex:
      /^([ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ])\s*([0-9][ABCEGHJKLMNPRSTVWXYZ][0-9])$/i,
  },
  { code: 'CC', name: 'Cocos (Keeling) Islands', regex: /^6799$/ },
  { code: 'CD', name: 'Congo, Democratic Republic of the' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'CG', name: 'Congo' },
  { code: 'CH', name: 'Switzerland', regex: /^\d{4}$/ },
  { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'CK', name: 'Cook Islands', regex: /^\d{4}$/ },
  { code: 'CL', name: 'Chile', regex: /^\d{7}$/ },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CN', name: 'China', regex: /^\d{6}$/ },
  { code: 'CO', name: 'Colombia' },
  { code: 'CR', name: 'Costa Rica', regex: /^(\d{4,5}|\d{3}-\d{4})$/ },
  { code: 'CU', name: 'Cuba' },
  { code: 'CV', name: 'Cabo Verde', regex: /^\d{4}$/ },
  { code: 'CW', name: 'Curaçao' },
  { code: 'CX', name: 'Christmas Island', regex: /^6798$/ },
  { code: 'CY', name: 'Cyprus', regex: /^\d{4}$/ },
  { code: 'CZ', name: 'Czechia', regex: /^\d{3}[ ]?\d{2}$/ },
  { code: 'DE', name: 'Germany', regex: /^\d{5}$/ },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DK', name: 'Denmark', regex: /^\d{4}$/ },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic', regex: /^\d{5}$/ },
  { code: 'DZ', name: 'Algeria', regex: /^\d{5}$/ },
  {
    code: 'EC',
    name: 'Ecuador',
    regex: /^([A-Z]\d{4}[A-Z]|(?:[A-Z]{2})?\d{6})?$/,
  },
  { code: 'EE', name: 'Estonia', regex: /^\d{5}$/ },
  { code: 'EG', name: 'Egypt', regex: /^\d{5}$/ },
  { code: 'EH', name: 'Western Sahara' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'ES', name: 'Spain', regex: /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/ },
  { code: 'ET', name: 'Ethiopia', regex: /^\d{4}$/ },
  { code: 'FI', name: 'Finland', regex: /^(FI-|AX-)?\d{5}$/ },
  { code: 'FJ', name: 'Fiji' },
  { code: 'FK', name: 'Falkland Islands (Malvinas)', regex: /^FIQQ 1ZZ$/ },
  {
    code: 'FM',
    name: 'Micronesia, Federated States of',
    regex: /^(9694[1-4])([ \-]\d{4})?$/,
  },
  { code: 'FO', name: 'Faroe Islands', regex: /^\d{3}$/ },
  { code: 'FR', name: 'France', regex: /^\d{2}[ ]?\d{3}$/ },
  { code: 'GA', name: 'Gabon' },
  {
    code: 'GB',
    name: 'United Kingdom of Great Britain and Northern Ireland',
    regex:
      /^[A-Za-z]{1,2}[0-9Rr][0-9A-Za-z]? [0-9][ABD-HJLNP-UW-Zabd-hjlnp-uw-z]{2}$/,
  },
  { code: 'GD', name: 'Grenada' },
  { code: 'GE', name: 'Georgia', regex: /^\d{4}$/ },
  { code: 'GF', name: 'French Guiana', regex: /^9[78]3\d{2}$/ },
  {
    code: 'GG',
    name: 'Guernsey',
    regex: /^GY\d[\dA-Z]?[ ]?\d[ABD-HJLN-UW-Z]{2}$/,
  },
  { code: 'GH', name: 'Ghana' },
  { code: 'GI', name: 'Gibraltar' },
  { code: 'GL', name: 'Greenland', regex: /^39\d{2}$/ },
  { code: 'GM', name: 'Gambia' },
  { code: 'GN', name: 'Guinea', regex: /^\d{3}$/ },
  { code: 'GP', name: 'Guadeloupe', regex: /^9[78][01]\d{2}$/ },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'GR', name: 'Greece', regex: /^\d{3}[ ]?\d{2}$/ },
  {
    code: 'GS',
    name: 'South Georgia and the South Sandwich Islands',
    regex: /^SIQQ 1ZZ$/,
  },
  { code: 'GT', name: 'Guatemala', regex: /^\d{5}$/ },
  { code: 'GU', name: 'Guam', regex: /^969[123]\d([ \-]\d{4})?$/ },
  { code: 'GW', name: 'Guinea-Bissau', regex: /^\d{4}$/ },
  { code: 'GY', name: 'Guyana' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'HM', name: 'Heard Island and McDonald Islands', regex: /^\d{4}$/ },
  { code: 'HN', name: 'Honduras', regex: /^(?:\d{5})?$/ },
  { code: 'HR', name: 'Croatia', regex: /^(HR-)?\d{5}$/ },
  { code: 'HT', name: 'Haiti', regex: /^\d{4}$/ },
  { code: 'HU', name: 'Hungary', regex: /^\d{4}$/ },
  { code: 'ID', name: 'Indonesia', regex: /^\d{5}$/ },
  {
    code: 'IE',
    name: 'Ireland',
    regex: /^([AC-FHKNPRTV-Y][0-9]{2}|D6W)[ -]?[0-9AC-FHKNPRTV-Y]{4}$/,
  },
  { code: 'IL', name: 'Israel', regex: /^\d{5,7}$/ },
  {
    code: 'IM',
    name: 'Isle of Man',
    regex: /^IM\d[\dA-Z]?[ ]?\d[ABD-HJLN-UW-Z]{2}$/,
  },
  { code: 'IN', name: 'India', regex: /^\d{6}$/ },
  { code: 'IO', name: 'British Indian Ocean Territory', regex: /^BBND 1ZZ$/ },
  { code: 'IQ', name: 'Iraq', regex: /^\d{5}$/ },
  { code: 'IR', name: 'Iran, Islamic Republic of' },
  { code: 'IS', name: 'Iceland', regex: /^\d{3}$/ },
  { code: 'IT', name: 'Italy', regex: /^\d{5}$/ },
  {
    code: 'JE',
    name: 'Jersey',
    regex: /^JE\d[\dA-Z]?[ ]?\d[ABD-HJLN-UW-Z]{2}$/,
  },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JO', name: 'Jordan', regex: /^\d{5}$/ },
  { code: 'JP', name: 'Japan', regex: /^\d{3}-\d{4}$/ },
  { code: 'KE', name: 'Kenya', regex: /^\d{5}$/ },
  { code: 'KG', name: 'Kyrgyzstan', regex: /^\d{6}$/ },
  { code: 'KH', name: 'Cambodia', regex: /^\d{5}$/ },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KM', name: 'Comoros' },
  { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'KP', name: "Korea, Democratic People's Republic of" },
  { code: 'KR', name: 'Korea, Republic of', regex: /^\d{5}$/ },
  { code: 'KW', name: 'Kuwait', regex: /^\d{5}$/ },
  { code: 'KY', name: 'Cayman Islands', regex: /^KY[123]-\d{4}$/ },
  { code: 'KZ', name: 'Kazakhstan', regex: /^\d{6}$/ },
  { code: 'LA', name: "Lao People's Democratic Republic", regex: /^\d{5}$/ },
  { code: 'LB', name: 'Lebanon', regex: /^(\d{4}([ ]?\d{4})?)?$/ },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'LI', name: 'Liechtenstein', regex: /^(948[5-9])|(949[0-7])$/ },
  { code: 'LK', name: 'Sri Lanka', regex: /^\d{5}$/ },
  { code: 'LR', name: 'Liberia', regex: /^\d{4}$/ },
  { code: 'LS', name: 'Lesotho', regex: /^\d{3}$/ },
  { code: 'LT', name: 'Lithuania', regex: /^(LT-)?\d{5}$/ },
  { code: 'LU', name: 'Luxembourg', regex: /^(L-)?\d{4}$/ },
  { code: 'LV', name: 'Latvia', regex: /^(LV-)?\d{4}$/ },
  { code: 'LY', name: 'Libya' },
  { code: 'MA', name: 'Morocco', regex: /^\d{5}$/ },
  { code: 'MC', name: 'Monaco', regex: /^980\d{2}$/ },
  { code: 'MD', name: 'Moldova, Republic of', regex: /^\d{4}$/ },
  { code: 'ME', name: 'Montenegro', regex: /^8\d{4}$/ },
  { code: 'MF', name: 'Saint Martin (French part)' },
  { code: 'MG', name: 'Madagascar', regex: /^\d{3}$/ },
  { code: 'MH', name: 'Marshall Islands', regex: /^969[67]\d([ \-]\d{4})?$/ },
  { code: 'MK', name: 'North Macedonia', regex: /^\d{4}$/ },
  { code: 'ML', name: 'Mali' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'MN', name: 'Mongolia', regex: /^\d{6}$/ },
  { code: 'MO', name: 'Macao' },
  {
    code: 'MP',
    name: 'Northern Mariana Islands',
    regex: /^9695[012]([ \-]\d{4})?$/,
  },
  { code: 'MQ', name: 'Martinique', regex: /^9[78]2\d{2}$/ },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MS', name: 'Montserrat' },
  { code: 'MT', name: 'Malta', regex: /^[A-Z]{3}[ ]?\d{2,4}$/ },
  { code: 'MU', name: 'Mauritius', regex: /^((\d|[A-Z])\d{4})?$/ },
  { code: 'MV', name: 'Maldives', regex: /^\d{5}$/ },
  { code: 'MW', name: 'Malawi' },
  { code: 'MX', name: 'Mexico', regex: /^\d{5}$/ },
  { code: 'MY', name: 'Malaysia', regex: /^\d{5}$/ },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NC', name: 'New Caledonia', regex: /^988\d{2}$/ },
  { code: 'NE', name: 'Niger', regex: /^\d{4}$/ },
  { code: 'NF', name: 'Norfolk Island', regex: /^2899$/ },
  { code: 'NG', name: 'Nigeria', regex: /^(\d{6})?$/ },
  {
    code: 'NI',
    name: 'Nicaragua',
    regex: /^((\d{4}-)?\d{3}-\d{3}(-\d{1})?)?$/,
  },
  {
    code: 'NL',
    name: 'Netherlands, Kingdom of the',
    regex: /^\d{4}[ ]?[A-Z]{2}$/,
  },
  { code: 'NO', name: 'Norway', regex: /^\d{4}$/ },
  { code: 'NP', name: 'Nepal', regex: /^\d{5}$/ },
  { code: 'NR', name: 'Nauru' },
  { code: 'NU', name: 'Niue' },
  { code: 'NZ', name: 'New Zealand', regex: /^\d{4}$/ },
  { code: 'OM', name: 'Oman', regex: /^(PC )?\d{3}$/ },
  { code: 'PA', name: 'Panama', regex: /^\d{4}$/ },
  { code: 'PE', name: 'Peru', regex: /^\d{5}$/ },
  { code: 'PF', name: 'French Polynesia', regex: /^987\d{2}$/ },
  { code: 'PG', name: 'Papua New Guinea', regex: /^\d{3}$/ },
  { code: 'PH', name: 'Philippines', regex: /^\d{4}$/ },
  { code: 'PK', name: 'Pakistan', regex: /^\d{5}$/ },
  { code: 'PL', name: 'Poland', regex: /^\d{2}-\d{3}$/ },
  { code: 'PM', name: 'Saint Pierre and Miquelon', regex: /^9[78]5\d{2}$/ },
  { code: 'PN', name: 'Pitcairn', regex: /^PCRN 1ZZ$/ },
  { code: 'PR', name: 'Puerto Rico', regex: /^00[679]\d{2}([ \-]\d{4})?$/ },
  { code: 'PS', name: 'Palestine, State of' },
  { code: 'PT', name: 'Portugal', regex: /^\d{4}([\-]\d{3})?$/ },
  { code: 'PW', name: 'Palau', regex: /^96940$/ },
  { code: 'PY', name: 'Paraguay', regex: /^\d{4}$/ },
  { code: 'QA', name: 'Qatar' },
  { code: 'RE', name: 'Réunion', regex: /^9[78]4\d{2}$/ },
  { code: 'RO', name: 'Romania', regex: /^\d{6}$/ },
  { code: 'RS', name: 'Serbia', regex: /^\d{5,6}$/ },
  { code: 'RU', name: 'Russian Federation', regex: /^\d{6}$/ },
  { code: 'RW', name: 'Rwanda' },
  { code: 'SA', name: 'Saudi Arabia', regex: /^\d{5}$/ },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SE', name: 'Sweden', regex: /^(SE-)?\d{3}[ ]?\d{2}$/ },
  { code: 'SG', name: 'Singapore', regex: /^\d{6}$/ },
  {
    code: 'SH',
    name: 'Saint Helena, Ascension and Tristan da Cunha',
    regex: /^(ASCN|STHL) 1ZZ$/,
  },
  { code: 'SI', name: 'Slovenia', regex: /^(SI-)?\d{4}$/ },
  { code: 'SJ', name: 'Svalbard and Jan Mayen', regex: /^\d{4}$/ },
  { code: 'SK', name: 'Slovakia', regex: /^\d{3}[ ]?\d{2}$/ },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SM', name: 'San Marino', regex: /^4789\d$/ },
  { code: 'SN', name: 'Senegal', regex: /^\d{5}$/ },
  { code: 'SO', name: 'Somalia', regex: /^\d{5}$/ },
  { code: 'SR', name: 'Suriname' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'ST', name: 'Sao Tome and Principe' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'SX', name: 'Sint Maarten (Dutch part)' },
  { code: 'SY', name: 'Syrian Arab Republic' },
  { code: 'SZ', name: 'Eswatini', regex: /^[HLMS]\d{3}$/ },
  { code: 'TC', name: 'Turks and Caicos Islands', regex: /^TKCA 1ZZ$/ },
  { code: 'TD', name: 'Chad' },
  { code: 'TF', name: 'French Southern Territories' },
  { code: 'TG', name: 'Togo' },
  { code: 'TH', name: 'Thailand', regex: /^\d{5}$/ },
  { code: 'TJ', name: 'Tajikistan', regex: /^\d{6}$/ },
  { code: 'TK', name: 'Tokelau' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TM', name: 'Turkmenistan', regex: /^\d{6}$/ },
  { code: 'TN', name: 'Tunisia', regex: /^\d{4}$/ },
  { code: 'TO', name: 'Tonga' },
  { code: 'TR', name: 'Türkiye', regex: /^\d{5}$/ },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'TW', name: 'Taiwan, Province of China', regex: /^\d{3}(\d{2,3})?$/ },
  { code: 'TZ', name: 'Tanzania, United Republic of' },
  { code: 'UA', name: 'Ukraine', regex: /^\d{5}$/ },
  { code: 'UG', name: 'Uganda' },
  { code: 'UM', name: 'United States Minor Outlying Islands' },
  {
    code: 'US',
    name: 'United States of America',
    regex: /^([0-9]{5})(?:-([0-9]{4}))?$/,
  },
  { code: 'UY', name: 'Uruguay', regex: /^\d{5}$/ },
  { code: 'UZ', name: 'Uzbekistan', regex: /^\d{6}$/ },
  { code: 'VA', name: 'Holy See', regex: /^00120$/ },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: 'VE', name: 'Venezuela, Bolivarian Republic of', regex: /^\d{4}$/ },
  { code: 'VG', name: 'Virgin Islands (British)' },
  {
    code: 'VI',
    name: 'Virgin Islands (U.S.)',
    regex: /^008(([0-4]\d)|(5[01]))([ \-]\d{4})?$/,
  },
  { code: 'VN', name: 'Viet Nam', regex: /^\d{6}$/ },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'WF', name: 'Wallis and Futuna', regex: /^986\d{2}$/ },
  { code: 'WS', name: 'Samoa' },
  { code: 'YE', name: 'Yemen' },
  { code: 'YT', name: 'Mayotte', regex: /^976\d{2}$/ },
  { code: 'ZA', name: 'South Africa', regex: /^\d{4}$/ },
  { code: 'ZM', name: 'Zambia', regex: /^\d{5}$/ },
  { code: 'ZW', name: 'Zimbabwe' },
];
