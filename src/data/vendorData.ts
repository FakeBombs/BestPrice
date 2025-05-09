// Enhanced Vendor Interface
export interface Vendor {
  id: number;
  name: string;
  slug?: string;
  logo: string;
  rating?: number;
  url: string;
  certification?: 'Gold' | 'Silver' | 'Bronze' | '';
  telephone?: string[];
  location?: { lat: number; lng: number }[];
  address?: string[];
  paymentMethods?: PaymentMethod[];
  numberOfRatings?: number;
  shippingPolicySummary?: string;
  returnPolicySummary?: string;
  isMarketplace?: boolean;
  dateJoined?: string;
  socialLinks?: Record<string, string>;
  openingHours?: OpeningHours[];
  statusMessage?: string;
}

export const vendors: Vendor[] = [
  {
    id: 1, name: 'You', slug: 'you', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/252.svg', rating: 4.5, numberOfRatings: 1500, certification: 'Bronze', url: 'https://www.you.gr', telephone: ['211 9991900'], address: ['Αργυρουπόλεως 2Α, Καλλιθέα'], location: [{ lat: 37.9337, lng: 23.7004 }], paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn, PaymentMethod.Klarna, PaymentMethod.Installments, PaymentMethod.LoyaltyPoints], shippingPolicySummary: "Δωρεάν μεταφορικά άνω των 50€", dateJoined: "2018-05-20",
    socialLinks: { facebook: "https://www.facebook.com/You.gr" },
    openingHours: [ { dayOfWeek: 'Monday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Tuesday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Wednesday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Thursday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Friday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Saturday', opens: '09:00', closes: '18:00' } ]
  },
  {
    id: 2, name: 'Plaisio', slug: 'plaisio', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/79.svg', rating: 4.2, numberOfRatings: 2100, certification: 'Silver', url: 'https://www.plaisio.gr', telephone: ['210 2895000'], address: ['Στρατηγού Μακρυγιάννη 54, Μοσχάτο'], location: [{ lat: 37.9530, lng: 23.6845 }], paymentMethods: [PaymentMethod.COD, PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.Courier, PaymentMethod.PickupVia, PaymentMethod.FreeReturn, PaymentMethod.GiftCards, PaymentMethod.ExtendedWarranty, PaymentMethod.Installments], dateJoined: "2015-11-01",
    socialLinks: { facebook: "https://www.facebook.com/plaisio", instagram: "https://www.instagram.com/plaisioofficial/", twitter: "https://twitter.com/PlaisioOfficial" },
    openingHours: [ { dayOfWeek: 'Monday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Tuesday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Wednesday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Thursday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Friday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Saturday', opens: '09:00', closes: '20:00' } ]
  },
  {
    id: 3, name: 'Public', slug: 'public', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/743.svg', rating: 4.7, numberOfRatings: 5500, certification: 'Gold', url: 'https://www.public.gr', telephone: ['210 8181333'], address: ['Θηβαϊδος 22, Κηφισιά', 'Καραγεώργη Σερβίας 1, Πλατεία Συντάγματος, 10563, Αθήνα'], location: [{ lat: 38.0747, lng: 23.7582 }], paymentMethods: [PaymentMethod.COD, PaymentMethod.CreditCard, PaymentMethod.PayPal, PaymentMethod.BankTransfer, PaymentMethod.Courier, PaymentMethod.FreeReturn, PaymentMethod.PointsCollection, PaymentMethod.GiftCards, PaymentMethod.ExtendedWarranty, PaymentMethod.DeviceRecycling, PaymentMethod.Klarna], isMarketplace: true, returnPolicySummary: "Επιστροφές εντός 30 ημερών", dateJoined: "2010-03-10",
    socialLinks: { facebook: "https://facebook.com/public.gr", instagram: "https://instagram.com/public_stores", twitter: "https://twitter.com/publicstores", youtube: "https://www.youtube.com/user/publicstores" },
    openingHours: [ { dayOfWeek: 'Monday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Tuesday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Wednesday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Thursday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Friday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Saturday', opens: '09:00', closes: '20:00' }, { dayOfWeek: 'Sunday', opens: '11:00', closes: '19:00', notes: "Select stores only" } ]
  },
  {
    id: 4, name: 'Κωτσόβολος', slug: 'kotsovolos', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/496.svg', rating: 4.0, numberOfRatings: 3200, certification: 'Gold', url: 'https://www.kotsovolos.gr', telephone: ['210 2899999'], address: ['Λεωφόρος Συγγρού 257-259, Νέα Σμύρνη'], location: [{ lat: 37.9465, lng: 23.7140 }], paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn], dateJoined: "2012-08-01",
    openingHours: [ { dayOfWeek: 'Monday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Tuesday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Wednesday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Thursday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Friday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Saturday', opens: '09:00', closes: '20:00' } ]
  },
  {
    id: 5, name: 'Funky Buddha', slug: 'funky-buddha', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/4351.svg', rating: 4.3, numberOfRatings: 800, certification: '', url: 'https://www.funky-buddha.com', telephone: ['211 1030800'], address: ['Ερμού 23-25, Αθήνα'], location: [{ lat: 37.9768, lng: 23.7283 }], paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn, PaymentMethod.COD, PaymentMethod.PayPal], dateJoined: "2019-01-15", socialLinks: { instagram: "https://www.instagram.com/funkybuddha_" }
  },
  {
    id: 6, name: 'Germanos', slug: 'germanos', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/8697.svg', rating: 4.1, numberOfRatings: 1800, certification: '', url: 'https://www.germanos.gr', telephone: ['800 11 40000'], address: ['Λεωφόρος Κηφισίας 196, Νέο Ψυχικό'], location: [{ lat: 38.0076, lng: 23.7779 }], paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn, PaymentMethod.COD], dateJoined: "2011-06-30"
  },
  {
    id: 7, name: 'e-shop.gr', slug: 'e-shop-gr', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/16.svg', rating: 3.2, numberOfRatings: 4500, certification: 'Gold', url: 'http://www.e-shop.gr', telephone: ['211 5000500'], address: ['Πανεπιστημίου 44, Αθήνα'], location: [{ lat: 37.9800, lng: 23.7328 }], paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn, PaymentMethod.COD, PaymentMethod.PayPal], dateJoined: "2008-01-01",
    openingHours: [ { dayOfWeek: 'Monday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Tuesday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Wednesday', opens: '09:00', closes: '18:00' }, { dayOfWeek: 'Thursday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Friday', opens: '09:00', closes: '21:00' }, { dayOfWeek: 'Saturday', opens: '09:00', closes: '17:00' } ]
  },
  {
    id: 8, name: 'Χαμόγελο του Παιδιού', slug: 'hamogelo-toy-paidioy', logo: '//orig-bpcdn.pstatic.gr/bpmerchants/874.svg', rating: 4.7, numberOfRatings: 300, certification: 'Bronze', url: 'https://www.hamogelo.gr', telephone: ['11040'], address: ['Ομήρου 9, Αθήνα'], location: [{ lat: 37.9780, lng: 23.7355 }], paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.PayPal], dateJoined: "2014-02-10", socialLinks: { facebook: "https://www.facebook.com/HamogeloTouPaidiou" }
  },
];
