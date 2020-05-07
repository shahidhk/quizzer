export const brand = {
  title: "ALIF Kid's Exam",
  description: '',
  image_url: '/logo.png',
  navbar_logo_url: '/navbar_logo.png',
  rules: `<p>കൂട്ടുകാരേ, അലിഫ് കിഡ്സ് എക്സാമിലേക്ക് സ്വാഗതം.</p>
<p>ശ്രദ്ധിക്കേണ്ടത്:</p>
<ul>
<li>എക്സാമിലേക്ക് പ്രവേശിക്കും മുമ്പ് ആവശ്യപ്പെട്ടിട്ടുള്ള വിവരങ്ങൾ കൃത്യമായി പൂരിപ്പിക്കുക.</li>
<li>50 ചോദ്യങ്ങൾ ആണ് ഉള്ളത്. ഓരോ ചോദ്യത്തിനും 4 ഓപ്ഷനുകളിൽ നിന്ന് ഒരു ഉത്തരം തെരെഞ്ഞെടുക്കുക.</li>
<li>1 മണിക്കൂർ 15 മിനുട്ട് ആണ് എക്സാം സമയം. സമയം തീരും മുമ്പ് എക്സാം പൂർത്തിയാക്കുക.</li>
</ul>
<p>എല്ലാവർക്കും വിജയാശംസകൾ നേരുന്നു.</p>`,
  neutral_text: `നിങ്ങളുടെ "അലിഫ്" എക്സാം അവസാനിച്ചു. വിജയികളെ പിന്നീട് പ്രഖ്യാപിക്കുന്നതാണ്.<br />
എല്ലാവർക്കും വിജയാശംസകൾ...`,
  fail_text: 'Try later',
  win_text: `You won!`,
  sorry_text: `Sorry, there are no exams live right now. Check back later at 9am on May 10th 2020`,
};

export const api_url = 'https://alif-api.shahidh.in/v1/graphql';

export const districts = [
  {
    name: 'Trivandrum',
    areas: [
      'Thiruvananthapuram',
      'Thiruvananthapuram East',
      'Kaniyapuram',
      'Attingal',
      'venjaramood',
      'Nedumangad',
      'Kattakkada'
    ],
  },
  {
    name: 'Kollam',
    areas: [
      'Kollam',
      'Karunagappalli',
      'Pathanapuram',
    ]
  },
  {
    name: 'Alappuzha',
    areas: [
      'Alappuzha',
      'Naduvathu Nagar',
      'Kayamkulam',
      'Kuthiyathode'
    ]
  },
  {
    name: 'Kottayam',
    areas: ['Kottayam']
  },
  {
    name: 'Idukki',
    areas: [
      'Thodupuzha',
      'Adimaly'
    ]
  },
  {
    name: 'Ernakulam',
    areas: [
      'Aluva',
      'Perumbavoor',
      'Kothamangalam',
      'Paravoor',
      'Ernakulam',
      'Thripunithura',
      'Kochi',
      'Kakkanad',
      'Palluruthi']
  },
  {
    name: 'Thrissur',
    areas: [
      'Chavakkad',
      'Pavaratty',
      'Kunnamkulam',
      'Guruvayur',
      'Thrissur',
      'Kodungallur',
      'Kaipamangalam'
    ]
  },
  {
    name: 'Palakkad',
    areas: [
      'EDATHANATTUKARA',
      'ALANALLUR',
      'MANNARKKAD',
      'THACHAMPARA',
      'OLAVAKODE',
      'PALAKKAD',
      'ALATHUR',
      'OTTAPALAM',
      'PATTAMBI'
    ]
  },
  {
    name: 'MALAPPURAM WEST',
    areas: [
      'University',
      'Peruvallur',
      'AR Nager',
      'Vengara',
      'Tiroorangadi',
      'Parappanagadi',
      'Thanur',
      'Thanalur',
      'Thiroor',
      'Kottakkal',
      'Valavannur',
      'Randathani',
      'Alathiyoor',
      'Maaranjeri',
      'Ponnani',
      'Koottanad',
      'Valanjeri',
      'Changaramkulam',
      'Paravanna',
      'Kuttipuram',
    ]
  },
  {
    name: 'MALAPPURAM NORTH',
    areas: [
      'AREEKODE',
      'EDAVANNAPPARA',
      'PULIKKAL',
      'KONDOTY',
      'MONGAM',
      'MANJERI',
      'ANAKKAYAM',
      'MANKADA',
      'TRIKALANGOD',
      'MALAPPURAM',
      'KAVANUR',
      'CHERUKAV',
    ]
  },
  {
    name: 'MALAPPURAM EAST',
    areas: [
      'Perintalamnana',
      'Pandikkad',
      'Karuvarakund',
      'Kalikavu',
      'Wandoor',
      'Edavanna',
      'Othayi',
      'Mampad',
      'Nilamboor',
      'Edakkara',
      'Moothedam',
      'Angadipuram',
      'Aanamangad',
      'Amarambalam',
      'Chungathara',
    ]
  },
  {
    name: 'CALICUT SOUTH',
    areas: [
      'Farook',
      'Kallai',
      'Beypore',
      'City',
      'Mankav',
      'Karapparamb',
      'Karakkunnath',
      'Narikuni',
      'Atholi',
      'Kodiyathoor',
      'Thamarasseri',
      'Koduvalli',
      'Medical college',
    ]
  },
  {
    name: 'CALICUT NORTH',
    areas: [
      'Balusserry',
      'Poonur',
      'Koyilandy',
      'Vatakara',
      'Payyoli',
      'Nadapuram',
      'Perambra',
    ]
  },
  {
    name: 'WAYANAD',
    areas: [
      'Kalpetta',
      'Bathery',
      'Mananthavady',
    ]
  },
  {
    name: 'KANNUR',
    areas: [
      'Valapattanam',
      'Talipparamb',
      'Irikkoor',
      'Pazhayangadi',
      'Payyanur',
      'Kannur',
      'Koothuparamb',
      'Iritty',
      'Panoor',
      'Thalassery',
    ]
  },
  {
    name: 'KASARAGOD',
    areas: [
      'Manjeshwaram',
      'Kumbala',
      'Kasaragod',
      'Uduma',
      'Kanhangad',
      'Trikaripur',
    ]
  },
  {
    name: 'Other',
    areas: ['Other']
  }
]