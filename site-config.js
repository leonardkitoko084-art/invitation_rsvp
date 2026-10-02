export const siteConfig = {
  brand: 'LEO DESIGN',
  siteTitle: 'Grace WAKEZO & Esther KHONDE — Invitation de mariage',
  timezone: 'Africa/Kinshasa',
  couple: {
    initials: 'G & E',
    names: 'Grace WAKEZO et Esther KHONDE',
    heroNames: 'M. Grace WAKEZO & Esther KHONDE',
    firstNames: ['Grace', 'Esther'],
    familyNames: ['WAKEZO', 'KHONDE'],
    tagline: 'Rouge & bleu',
    intro: 'Parce que l’amour nous a réunis, parce que le temps a confirmé notre choix, nous avons décidé de nous unir pour la vie.'
  },
  event: {
    dateIso: '2026-10-17T19:30:00+01:00',
    ceremonyDateIso: '2026-10-17T09:30:00+01:00',
    dateDisplay: '17 octobre 2026',
    dateLong: 'Samedi 17 octobre 2026',
    coverDate: '17. 10. 26',
    month: 'OCTOBRE',
    weekday: 'Sam.',
    day: '17',
    year: '2026',
    arrivalTime: '19h30',
    entryTime: '20h30',
    rsvpDeadline: '10 octobre 2026 à 17h00',
    maxAdditionalGuests: 3
  },
  story: {
    title: 'Vous êtes invité(s)',
    text: 'C’est avec beaucoup de joie et d’émotion que, avec les familles MFINGULU & NUMBI, nous avons l’honneur de vous convier à la célébration de notre mariage.'
  },
  schedule: [{
    time: '09h30',
    title: 'Mise en place',
    phase: 'ceremony',
    icon: 'users'
  }, {
    time: '10h00',
    title: 'Bénédiction nuptiale',
    phase: 'ceremony',
    icon: 'church'
  }, {
    time: '19h30',
    title: 'Mise en place',
    phase: 'reception',
    icon: 'users'
  }, {
    time: '20h30',
    title: 'Entrée des mariés',
    phase: 'reception',
    icon: 'music'
  }],
  dressCode: {
    title: 'Guide vestimentaire',
    description: 'Robe, Blouse, chemise, Boubou, veste, Etc.',
    colors: [{
      name: 'Rouge bordeaux',
      color: '#722f37'
    }, {
      name: 'Bleu de nuit',
      color: '#111d35'
    }, {
      name: 'Noir',
      color: '#20201e'
    }]
  },
  roomTheme: {
    title: 'Rouge et Bleu',
    colors: [{
      name: 'Rouge',
      color: '#a52b39'
    }, {
      name: 'Bleu',
      color: '#234b82'
    }]
  },
  venues: [{
    label: 'Bénédiction nuptiale',
    name: 'Église CEM Les Consacrés à l’Éternel',
    extension: 'Extension La Borne',
    address: '21, Route Kimwenza, Q/ Kimwenza Gare / Petit Panier, C/ Mont Ngafula',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('CEM Les Consacrés à l’Éternel, extension La Borne, 21 Route Kimwenza, Kimwenza Gare, Petit Panier, Mont Ngafula, Kinshasa'),
    image: ''
  }, {
    label: 'Soirée dansante',
    name: 'LA MERVEILLEUSE',
    address: '2666, Av. By pass Auto, C/ Selembao',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Salle La Merveilleuse, 2666 Avenue By pass Auto, Selembao, Kinshasa'),
    image: ''
  }],
  entourage: [{
    title: 'Familles',
    names: ['MFINGULU', 'NUMBI']
  }],
  theme: {
    background: '#fcfaf6',
    surface: '#ffffff',
    gold: '#bc8e28',
    goldSoft: '#76541a',
    text: '#242420',
    muted: '#66645c'
  },
  privacy: {
    operator: 'Les organisateurs du mariage de Grace WAKEZO et Esther KHONDE',
    contact: 'L’organisateur qui vous a transmis votre invitation nominative.',
    retention: 'Pendant la période nécessaire à l’organisation du mariage ; les organisateurs peuvent ensuite supprimer les réponses et les invités depuis leur espace.'
  }
};
