export interface WeddingEvent {
  id: string;
  title: string;
  badge: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  description: string;
  mapUrl: string;
  featured?: boolean;
}

export interface WeddingContact {
  id: string;
  role: string;
  name: string;
  phone: string;
  tel: string;
  whatsapp: string;
  featured?: boolean;
}

export const weddingData = {
  groom: { firstName: 'Rizwan', lastName: 'Mohamed', fullName: 'Rizwan Mohamed' },
  bride: { firstName: 'Binsha', lastName: 'Azeez', fullName: 'Binsha Azeez' },
  displayNames: 'RIZWAN & BINSHA',
  tagline: 'A sacred union bound by faith, love, and togetherness',
  invitationText: 'Together with their families',
  rsvpPhone: '+91 75580 78317',
  rsvpWhatsapp: '917558078317',
  quranVerse: {
    arabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    translation:
      'And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts.',
    surah: 'SURAH AR-RUM 30:21',
  },
  date: {
    day: 27,
    month: 'December',
    year: 2026,
    weekday: 'Sunday',
    full: 'Sunday, 27 December 2026',
    targetIso: '2026-12-27T12:00:00+05:30',
  },
  calendarUrl:
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Rizwan+Mohamed+%26+Binsha+Azeez+Wedding&dates=20261227T063000Z/20261227T160000Z&details=Blessed+Nikkah+%26+Wedding+Reception+of+Rizwan+Mohamed+and+Binsha+Azeez.&location=Kollam,+Kerala',
  events: [
    {
      id: 'nikkah',
      title: 'NIKKAH',
      badge: 'CEREMONY',
      subtitle: 'Wedding Ceremony',
      date: 'Sunday, 27 December 2026',
      time: '12:00 PM IST',
      venue: 'Pournami Auditorium',
      address: 'Kuttichira, Kollam, Kerala',
      description: 'The sacred marriage ceremony and midday feast.',
      mapUrl: 'https://maps.google.com/?q=Pournami+Auditorium+Kuttichira+Kollam',
    },
    {
      id: 'reception',
      title: 'RECEPTION',
      badge: 'RECEPTION',
      subtitle: 'Evening Celebration',
      date: 'Sunday, 27 December 2026',
      time: '5:30 PM – 9:30 PM IST',
      venue: 'Anayadakkil Auditorium',
      address: 'Palamukku, Kollam, Kerala',
      description: 'Evening gathering, greetings, and celebration feast.',
      mapUrl: 'https://maps.google.com/?q=Anayadakkil+Auditorium+Palamukku+Kollam',
      featured: true,
    },
  ] as WeddingEvent[],
  venues: [
    {
      id: 'pournami',
      badge: 'NIKKAH CEREMONY VENUE',
      title: 'Pournami Auditorium',
      location: 'Kuttichira, Kollam District, Kerala',
      desc: 'Host venue for the Nikkah ceremony and midday feast. Convenient parking and accessible amenities.',
      mapUrl: 'https://maps.google.com/?q=Pournami+Auditorium+Kuttichira+Kollam',
    },
    {
      id: 'anayadakkil',
      badge: 'RECEPTION CELEBRATION VENUE',
      title: 'Anayadakkil Auditorium',
      location: 'Palamukku, Kollam District, Kerala',
      desc: 'Host venue for the evening wedding reception. Spacious hall situated close to main transit routes.',
      mapUrl: 'https://maps.google.com/?q=Anayadakkil+Auditorium+Palamukku+Kollam',
      featured: true,
    },
  ],
  contacts: [
    {
      id: 'sabjan',
      role: "Groom's Father",
      name: 'Muhammed Sabjan',
      phone: '+91 94468 35045',
      tel: '+919446835045',
      whatsapp:
        "https://wa.me/919446835045?text=Assalamu%20Alaikum%20Muhammed%20Sabjan%20uncle,%20regarding%20Rizwan%20and%20Binsha's%20wedding",
      featured: true,
    },
    {
      id: 'sufiyan',
      role: "Groom's Brother",
      name: 'Muhammed Sufiyan',
      phone: '+91 73063 88457',
      tel: '+917306388457',
      whatsapp:
        "https://wa.me/917306388457?text=Assalamu%20Alaikum%20Sufiyan,%20regarding%20Rizwan's%20wedding",
    },
    {
      id: 'azeez',
      role: "Groom's Father-in-law",
      name: 'Azeez',
      phone: '+91 97447 12033',
      tel: '+919744712033',
      whatsapp:
        "https://wa.me/919744712033?text=Assalamu%20Alaikum%20Azeez%20ikka,%20regarding%20Binsha's%20wedding",
    },
  ] as WeddingContact[],
  travelGuide: [
    {
      id: 'air',
      title: 'By Air',
      details: [
        'Nearest Airport: Trivandrum International Airport (TRV) — 60 km (~1.5 hours drive via NH66)',
        'Alternative: Cochin International Airport (COK) — 175 km',
      ],
    },
    {
      id: 'train',
      title: 'By Train',
      details: [
        'Nearest Main Station: Kollam Junction (QLN) — ~6 km from venues',
        'Taxis and auto-rickshaws are readily available 24/7 outside the station.',
      ],
    },
    {
      id: 'bus',
      title: 'By Bus',
      details: [
        'Nearest Bus Stand: Kollam KSRTC Bus Station — ~5.5 km',
        'Frequent town buses and local taxis operate toward Kuttichira & Palamukku routes.',
      ],
    },
  ],
  digitalCardUrl: '/assets/wedding-card.png',
  location: 'Kollam, Kerala',
};

