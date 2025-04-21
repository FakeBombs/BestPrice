// Category interface for nested structure
export interface Category {
  id: number;              
  name: string;           
  slug: string;           
  parentId?: number;      
  image: string;          
}

// Main categories
export const mainCategories: Category[] = [
  { id: 1, name: 'Τεχνολογία', slug: 'technology', image: '//placehold.co/200x150?text=Technology' },
  { id: 2, name: 'Σπίτι & Κήπος', slug: 'home-garden', image: '//placehold.co/200x150?text=Home+Garden' },
  { id: 3, name: 'Μόδα', slug: 'fashion', image: '//placehold.co/200x150?text=Fashion' },
  { id: 4, name: 'Υγεία & Ομορφιά', slug: 'health-beauty', image: '//placehold.co/200x150?text=Health+Beauty' },
  { id: 5, name: 'Παιδικά - Βρεφικά', slug: 'children-baby', image: '//placehold.co/200x150?text=Children+Baby' },
  { id: 6, name: 'Hobby, Αθλητισμός', slug: 'hobby-sports', image: '//placehold.co/200x150?text=Hobby+Sports' },
  { id: 7, name: 'Μηχανοκίνηση', slug: 'auto-moto', image: '//placehold.co/200x150?text=Auto+Moto' }
];

// Subcategories and nested categories
export const categories: Category[] = [
  // Subcategories of Τεχνολογία
  { id: 10, name: 'Κινητή Τηλεφωνία', slug: 'mobile-phones', parentId: 1, image: 'https://abpcdn.pstatic.gr/P/bpimg128/805_SX400Y400/1473253454/mobile.webp' },
  { id: 11, name: 'Υπολογιστές', slug: 'computers', parentId: 1, image: 'https://www.bestprice.gr/cat/2544/ypologistes.html?bpref=root-category' },
  { id: 12, name: 'Laptops, Αξεσουάρ', slug: 'laptops-accessories', parentId: 1, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2590_SX400Y400/1475756993/laptops-accessories.webp' },
  { id: 13, name: 'Εικόνα', slug: 'image', parentId: 1, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6992_SX400Y400/1473176060/eikona.webp' },
  { id: 14, name: 'Smartwatches, Wearables', slug: 'smartwatches-wearables', parentId: 1, image: 'https://www.bestprice.gr/cat/6991/wearables.html?bpref=root-category' },
  { id: 15, name: 'Tablets, Αξεσουάρ', slug: 'tablets-accessories', parentId: 1, image: 'https://www.bestprice.gr/cat/6161/tablets-accessories.html?bpref=root-category' },
  { id: 16, name: 'Video Games', slug: 'video-games', parentId: 1, image: 'https://abpcdn.pstatic.gr/P/bpimg128/894_SX400Y400/1473260108/video-games.webp' },
  { id: 17, name: 'Ήχος', slug: 'audio', parentId: 1, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6993_SX400Y400/1473176050/hxos.webp' },
  { id: 18, name: 'Φωτογραφία, Video', slug: 'photography-video', parentId: 1, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3000_SX400Y400/1629455498/photo-video.webp' },
  { id: 19, name: 'Ηλεκτρονικά', slug: 'electronics', parentId: 1, image: 'https://abpcdn.pstatic.gr/P/bpimg128/680_SX400Y400/1473176128/consumer-electronics.webp' },
  { id: 20, name: 'Τηλεφωνία', slug: 'telephony', parentId: 1, image: 'https://abpcdn.pstatic.gr/P/bpimg128/797_SX400Y400/1473176102/telephony.webp' },
  { id: 21, name: 'Gadgets', slug: 'gadgets', parentId: 1, image: 'https://abpcdn.pstatic.gr/P/bpimg128/703_SX400Y400/1473176113/gadgets.webp' },

  // Subcategories of Σπίτι & Κήπος
  { id: 22, name: 'Οικιακές Συσκευές', slug: 'home-appliances', parentId: 2, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2483_SX400Y400/1473176668/home-appliances.webp' },
  { id: 23, name: 'Εργαλεία', slug: 'tools', parentId: 2, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3499_SX400Y400/1474901528/tools.webp' },
  { id: 24, name: 'Έπιπλα', slug: 'furniture', parentId: 2, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2186_SX400Y400/1629455494/epipla.webp' },
  { id: 25, name: 'Κήπος', slug: 'garden', parentId: 2, image: 'https://www.bestprice.gr/cat/2400/khpos.html?bpref=root-category' },
  { id: 26, name: 'Είδη Σπιτιού', slug: 'home-items', parentId: 2, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6990_SX400Y400/1473176080/eidh-spitiou.webp' },
  { id: 27, name: 'Λευκά Είδη', slug: 'home-linens', parentId: 2, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2268_SX400Y400/1629455494/leuka-eidh.webp' },
  { id: 28, name: 'Φωτισμός', slug: 'lighting', parentId: 2, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6092_SX400Y400/1477319884/fotistika.webp' },
  { id: 29, name: 'Είδη Κουζίνας', slug: 'kitchen-items', parentId: 2, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2288_SX400Y400/1629455495/eidh-kouzinas.webp' },
  { id: 30, name: 'Τρόφιμα & Ποτά', slug: 'food-beverages', parentId: 2, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2372_SX400Y400/1629455495/food-drinks.webp' },
  { id: 31, name: 'Ηλεκτρολογικά', slug: 'electrical-items', parentId: 2, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2461_SX400Y400/1629455496/hlektrologika.webp' },
  { id: 32, name: 'Είδη Καπνιστού', slug: 'smoking-items', parentId: 2, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3255_SX400Y400/1629455500/smoking-supplies.webp' },
  { id: 33, name: 'Είδη Γραφείου', slug: 'office-items', parentId: 2, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2728_SX400Y400/1474902358/office.webp' },
  { id: 34, name: 'Είδη Δώρων', slug: 'gift-items', parentId: 2, image: 'https://abpcdn.pstatic.gr/P/bpimg128/783_SX400Y400/1474901931/gifts.webp' },
  { id: 35, name: 'Συστήματα Ασφαλείας', slug: 'security-systems', parentId: 2, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3167_SX400Y400/1629455500/security-systems.webp' },
  { id: 36, name: 'Επαγγελματικός Εξοπλισμός', slug: 'professional-equipment', parentId: 2, image: 'https://abpcdn.pstatic.gr/P/bpimg128/5562_SX400Y400/1629455514/epaggelmatikos-exoplismos.webp' },
  { id: 37, name: 'Εποχιακά Είδη', slug: 'seasonal-items', parentId: 2, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6996_SX400Y400/1473692381/epoxiaka-eidh.webp' },
  { id: 38, name: 'Τσάντες για Ψώνια', slug: 'shopping-bags', parentId: 2, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6809_SX400Y400/1475230219/shopping-bags.webp' },
  { id: 39, name: 'Καρότσια Λαϊκής', slug: 'shopping-trolleys', parentId: 2, image: 'https://abpcdn.pstatic.gr/P/bpimg128/7317_SX400Y400/1629455533/karotsia-laikis.webp' },
  { id: 40, name: 'Εκκλησιαστικά Είδη', slug: 'church-items', parentId: 2, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6414_SX400Y400/1665760832/ekklisiastika-eidi.webp' },
  { id: 41, name: 'Είδη Κατοικιδίων', slug: 'pet-items', parentId: 2, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3474_SX400Y400/1475161223/eidh-katoikidion.webp' },

  // Subcategories of Μόδα
  { id: 42, name: 'Γυναικεία Μόδα', slug: 'womens-fashion', parentId: 3, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2069_SX400Y400/1503657549/woman.webp' },
  { id: 43, name: 'Ανδρική Μόδα', slug: 'mens-fashion', parentId: 3, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2108_SX400Y400/1701084742/man.webp' },
  { id: 44, name: 'Ρολόγια', slug: 'watches', parentId: 3, image: 'https://abpcdn.pstatic.gr/P/bpimg128/847_SX400Y400/1473068668/watches.webp' },
  { id: 45, name: 'Κοσμήματα', slug: 'jewelry', parentId: 3, image: 'https://abpcdn.pstatic.gr/P/bpimg128/826_SX400Y400/1473068668/jewelry.webp' },
  { id: 46, name: 'Οπτικά', slug: 'optics', parentId: 3, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3135_SX400Y400/1503996767/optika.webp' },
  { id: 47, name: 'Converse All Star', slug: 'converse-all-star', parentId: 3, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6305_SX400Y400/1629455522/converse-all-star.webp' },
  { id: 48, name: 'Ομπρέλες Βροχής', slug: 'rain-umbrellas', parentId: 3, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3488_SX400Y400/1629455502/ompreles-vroxis.webp' },
  { id: 49, name: 'Αξεσουάρ Παπουτσιών', slug: 'shoe-accessories', parentId: 3, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6241_SX400Y400/1629455522/aksesouar-papoutsiwn.webp' },
  { id: 50, name: 'Παιδική, Βρεφική Μόδα', slug: 'childrens-baby-fashion', parentId: 3, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2140_SX400Y400/1629455494/paidiki-vrefiki-moda.webp' },
  { id: 51, name: 'Sneakers', slug: 'sneakers', parentId: 3, image: 'https://bbpcdn.pstatic.gr/bpnr/hubs-image-1_SX400Y400/1710432442892/sneakers-ta-pio-trendy-papoytsia-gia-kathe-styl-kai-peristash.webp' },

  // Subcategories of Υγεία & Ομορφιά
  { id: 52, name: 'Περιποίηση', slug: 'grooming', parentId: 4, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6055_SX400Y400/1629455519/care.webp' },
  { id: 53, name: 'Είδη Φαρμακείου', slug: 'pharmacy-products', parentId: 4, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6366_SX400Y400/1629455522/eidh-farmakeiou.webp' },
  { id: 54, name: 'Αρώματα', slug: 'perfumes', parentId: 4, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3035_SX400Y400/1629455498/aromata.webp' },
  { id: 55, name: 'Συμπληρώματα Διατροφής', slug: 'dietary-supplements', parentId: 4, image: '//placehold.co/200x150?text=Supplements' },
  { id: 56, name: 'Συσκευές Περιποίησης', slug: 'grooming-devices', parentId: 4, image: '//placehold.co/200x150?text=Grooming+Devices' },
  { id: 57, name: 'Μακιγιάζ', slug: 'makeup', parentId: 4, image: '//placehold.co/200x150?text=Makeup' },
  { id: 58, name: 'Αντηλιακή Προστασία', slug: 'sun-protection', parentId: 4, image: '//placehold.co/200x150?text=Sun+Protection' },
  { id: 59, name: 'Ιατρικά Είδη', slug: 'medical-supplies', parentId: 4, image: '//placehold.co/200x150?text=Medical+Supplies' },
  { id: 60, name: 'Μανικιούρ - Πεντικιούρ', slug: 'manicure-pedicure', parentId: 4, image: '//placehold.co/200x150?text=Manicure+Pedicure' },
  { id: 61, name: 'Στοματική Υγιεινή', slug: 'oral-hygiene', parentId: 4, image: '//placehold.co/200x150?text=Oral+Hygiene' },
  { id: 62, name: 'Sex Toys', slug: 'sex-toys', parentId: 4, image: '//placehold.co/200x150?text=Sex+Toys' },
  { id: 63, name: 'Σύσφιξη', slug: 'tightening', parentId: 4, image: '//placehold.co/200x150?text=Tightening' },
  { id: 64, name: 'Προϊόντα Κάνναβης', slug: 'cannabis-products', parentId: 4, image: '//placehold.co/200x150?text=Cannabis+Products' },
  { id: 65, name: 'Ορθοπεδικά', slug: 'orthopedic', parentId: 4, image: '//placehold.co/200x150?text=Orthopedic' },
  { id: 66, name: 'Βοηθήματα Ασθενών', slug: 'patient-aids', parentId: 4, image: '//placehold.co/200x150?text=Patient+Aids' },
  { id: 67, name: 'Οπτικά', slug: 'opticals', parentId: 4, image: '//placehold.co/200x150?text=Opticals' },
  { id: 68, name: 'Κορεάτικα Καλλυντικά', slug: 'korean-cosmetics', parentId: 4, image: '//placehold.co/200x150?text=Korean+Cosmetics' },

  // Subcategories of Παιδικά - Βρεφικά
  { id: 69, name: 'Παιδική, Βρεφική Μόδα', slug: 'childrens-baby-fashion', parentId: 5, image: '//placehold.co/200x150?text=Childrens+Baby+Fashion' },
  { id: 70, name: 'Παιδικά Παιχνίδια', slug: 'childrens-toys', parentId: 5, image: '//placehold.co/200x150?text=Childrens+Toys' },
  { id: 71, name: 'Σχολικά Είδη', slug: 'school-supplies', parentId: 5, image: '//placehold.co/200x150?text=School+Supplies' },
  { id: 72, name: 'Βρεφικά Παιχνίδια', slug: 'baby-toys', parentId: 5, image: '//placehold.co/200x150?text=Baby+Toys' },
  { id: 73, name: 'Βρεφικά Είδη', slug: 'baby-products', parentId: 5, image: '//placehold.co/200x150?text=Baby+Products' },
  { id: 74, name: 'Παιδικά Λευκά Είδη', slug: 'childrens-linens', parentId: 5, image: '//placehold.co/200x150?text=Childrens+Linens' },
  { id: 75, name: 'Βαπτιστικά', slug: 'christening-items', parentId: 5, image: '//placehold.co/200x150?text=Christening+Items' },
  { id: 76, name: 'Παιδικά Ρολόγια', slug: 'childrens-watches', parentId: 5, image: '//placehold.co/200x150?text=Childrens+Watches' },

  // Subcategories of Hobby, Αθλητισμός
  { id: 77, name: 'Αθλήματα', slug: 'sports', parentId: 6, image: '//placehold.co/200x150?text=Sports' },
  { id: 78, name: 'Ποδηλασία', slug: 'cycling', parentId: 6, image: '//placehold.co/200x150?text=Cycling' },
  { id: 79, name: 'Ελεύθερος Χρόνος', slug: 'leisure-time', parentId: 6, image: '//placehold.co/200x150?text=Leisure+Time' },
  { id: 80, name: 'Ψάρεμα, Καταδύσεις', slug: 'fishing-diving', parentId: 6, image: '//placehold.co/200x150?text=Fishing+Diving' },
  { id: 81, name: 'Είδη Θαλάσσης', slug: 'sea-items', parentId: 6, image: '//placehold.co/200x150?text=Sea+Items' },
  { id: 82, name: 'Camping', slug: 'camping', parentId: 6, image: '//placehold.co/200x150?text=Camping' },
  { id: 83, name: 'Είδη Ταξιδίου, Τσάντες', slug: 'travel-items-bags', parentId: 6, image: '//placehold.co/200x150?text=Travel+Items+and+Bags' },
  { id: 84, name: 'Βιβλία', slug: 'books', parentId: 6, image: '//placehold.co/200x150?text=Books' },
  { id: 85, name: 'Κυνήγι', slug: 'hunting', parentId: 6, image: '//placehold.co/200x150?text=Hunting' },
  { id: 86, name: 'Είδη Γυμναστικής', slug: 'gym-equipment', parentId: 6, image: '//placehold.co/200x150?text=Gym+Equipment' },
  { id: 87, name: 'Είδη Κατοικιδίων', slug: 'pet-items', parentId: 6, image: '//placehold.co/200x150?text=Pet+Items' },
  { id: 88, name: 'Drones & Αξεσουάρ', slug: 'drones-accessories', parentId: 6, image: '//placehold.co/200x150?text=Drones+and+Accessories' },
  { id: 89, name: 'Ηλεκτρικά Πατίνια', slug: 'electric-scooters', parentId: 6, image: '//placehold.co/200x150?text=Electric+Scooters' },
  { id: 90, name: 'Hoverboards', slug: 'hoverboards', parentId: 6, image: '//placehold.co/200x150?text=Hoverboards' },
  { id: 91, name: 'Μουσικά Όργανα', slug: 'musical-instruments', parentId: 6, image: '//placehold.co/200x150?text=Musical+Instruments' },
  { id: 92, name: 'Αξεσουάρ Αθλημάτων', slug: 'sports-accessories', parentId: 6, image: '//placehold.co/200x150?text=Sports+Accessories' },
  { id: 93, name: 'Είδη Εξερεύνησης', slug: 'exploration-items', parentId: 6, image: '//placehold.co/200x150?text=Exploration+Items' },
  { id: 94, name: 'Γυναικεία Αθλητικά Ρούχα', slug: 'womens-sports-clothing', parentId: 6, image: '//placehold.co/200x150?text=Womens+Sports+Clothing' },
  { id: 95, name: 'Γυναικεία Αθλητικά Παπούτσια', slug: 'womens-sports-shoes', parentId: 6, image: '//placehold.co/200x150?text=Womens+Sports+Shoes' },
  { id: 96, name: 'Ανδρικά Αθλητικά Ρούχα', slug: 'mens-sports-clothing', parentId: 6, image: '//placehold.co/200x150?text=Mens+Sports+Clothing' },
  { id: 97, name: 'Ανδρικά Αθλητικά Παπούτσια', slug: 'mens-sports-shoes', parentId: 6, image: '//placehold.co/200x150?text=Mens+Sports+Shoes' },

  // Subcategories of Μηχανοκίνηση
  { id: 98, name: 'Αυτοκίνητο', slug: 'car', parentId: 7, image: '//placehold.co/200x150?text=Car' },
  { id: 99, name: 'Μοτοσυκλέτα', slug: 'motorcycle', parentId: 7, image: '//placehold.co/200x150?text=Motorcycle' },
  { id: 100, name: 'Σκάφος', slug: 'boat', parentId: 7, image: '//placehold.co/200x150?text=Boat' },
  { id: 101, name: 'Είδη Φορτηγού', slug: 'truck-items', parentId: 7, image: '//placehold.co/200x150?text=Truck+Items' },

  // Subcategories of Κινητή Τηλεφωνία of Main Category Τεχνολογία
  { id: 102, name: 'Κινητά', slug: 'mobiles', parentId: 10, image: '//placehold.co/200x150?text=Mobiles' },
  { id: 103, name: 'iPhone', slug: 'iphone', parentId: 10, image: '//placehold.co/200x150?text=iPhone' },
  { id: 104, name: 'Θήκες Κινητών', slug: 'mobile-cases', parentId: 10, image: '//placehold.co/200x150?text=Mobile+Cases' },
  { id: 105, name: 'Bluetooth Handsfree', slug: 'bluetooth-handsfree', parentId: 10, image: '//placehold.co/200x150?text=Bluetooth+Handsfree' },
  { id: 106, name: 'Handsfree', slug: 'handsfree', parentId: 10, image: '//placehold.co/200x150?text=Handsfree' },
  { id: 107, name: 'Φορτιστές Κινητών', slug: 'mobile-chargers', parentId: 10, image: '//placehold.co/200x150?text=Mobile+Chargers' },
  { id: 108, name: 'Tempered Glass', slug: 'tempered-glass', parentId: 10, image: '//placehold.co/200x150?text=Tempered+Glass' },
  { id: 109, name: 'Προστασία Οθόνης', slug: 'screen-protection', parentId: 10, image: '//placehold.co/200x150?text=Screen+Protection' },
  { id: 110, name: 'Power Banks', slug: 'power-banks', parentId: 10, image: '//placehold.co/200x150?text=Power+Banks' },
  { id: 111, name: 'Μπαταρίες Κινητών', slug: 'mobile-batteries', parentId: 10, image: '//placehold.co/200x150?text=Mobile+Batteries' },
  { id: 112, name: 'Selfie Stick', slug: 'selfie-stick', parentId: 10, image: '//placehold.co/200x150?text=Selfie+Stick' },
  { id: 113, name: 'Βάσεις Κινητού', slug: 'mobile-stands', parentId: 10, image: '//placehold.co/200x150?text=Mobile+Stands' },
  { id: 114, name: 'Καλώδια Φόρτισης', slug: 'charging-cables', parentId: 10, image: '//placehold.co/200x150?text=Charging+Cables' },
  { id: 115, name: 'Anti-Lost Tracker', slug: 'anti-lost-tracker', parentId: 10, image: '//placehold.co/200x150?text=Anti-Lost+Tracker' },
  { id: 116, name: 'Ανταλλακτικά Κινητών', slug: 'mobile-replacements', parentId: 10, image: '//placehold.co/200x150?text=Mobile+Replacements' },
  { id: 117, name: 'Gimbal Κινητών', slug: 'mobile-gimbal', parentId: 10, image: '//placehold.co/200x150?text=Mobile+Gimbal' },
  { id: 118, name: 'Γραφίδες Αφής', slug: 'touch-pens', parentId: 10, image: '//placehold.co/200x150?text=Touch+Pens' },
  { id: 119, name: 'Αξεσουάρ Γραφίδας', slug: 'pen-accessories', parentId: 10, image: '//placehold.co/200x150?text=Pen+Accessories' },
  { id: 120, name: 'Πλήκτρα Mobile Gaming', slug: 'mobile-gaming-buttons', parentId: 10, image: '//placehold.co/200x150?text=Mobile+Gaming+Buttons' },

  // Subcategories of Υπολογιστές of Main Category Τεχνολογία
  { id: 121, name: 'Περιφερειακά, Αναλώσιμα', slug: 'peripherals-consumables', parentId: 11, image: '//placehold.co/200x150?text=Peripherals' },
  { id: 122, name: 'Hardware', slug: 'hardware', parentId: 11, image: '//placehold.co/200x150?text=Hardware' },
  { id: 123, name: 'Δικτυακά', slug: 'networking', parentId: 11, image: '//placehold.co/200x150?text=Networking' },
  { id: 124, name: 'Desktops & Servers', slug: 'desktops-servers', parentId: 11, image: '//placehold.co/200x150?text=Desktops+Servers' },
  { id: 125, name: 'Οθόνες PC, Αξεσουάρ', slug: 'monitors-accessories', parentId: 11, image: '//placehold.co/200x150?text=Monitors' },
  { id: 126, name: 'Software', slug: 'software', parentId: 11, image: '//placehold.co/200x150?text=Software' },
  { id: 127, name: 'Επεκτάσεις Εγγύησης', slug: 'warranty-extensions', parentId: 11, image: '//placehold.co/200x150?text=Warranty+Extensions' },

  // Subcategories of Περιφερειακά, Αναλώσιμα of a Subcategory Υπολογιστές of Main Category Τεχνολογία
  { id: 128, name: 'Εκτυπωτές & Αξεσουάρ', slug: 'printers-accessories', parentId: 121, image: '//placehold.co/200x150?text=Printers+Accessories' },
  { id: 129, name: 'Συσκευές Εισόδου', slug: 'input-devices', parentId: 121, image: '//placehold.co/200x150?text=Input+Devices' },
  { id: 130, name: 'Multimedia', slug: 'multimedia', parentId: 121, image: '//placehold.co/200x150?text=Multimedia' },
  { id: 131, name: 'Scanner & Αξεσουάρ', slug: 'scanners-accessories', parentId: 121, image: '//placehold.co/200x150?text=Scanners+Accessories' },
  { id: 132, name: 'USB Sticks', slug: 'usb-sticks', parentId: 121, image: '//placehold.co/200x150?text=USB+Sticks' },
  { id: 133, name: 'USB Hubs', slug: 'usb-hubs', parentId: 121, image: '//placehold.co/200x150?text=USB+Hubs' },
  { id: 134, name: 'UPS, Αξεσουάρ', slug: 'ups-accessories', parentId: 121, image: '//placehold.co/200x150?text=UPS+Accessories' },
  { id: 135, name: 'Καλώδια, Adaptors', slug: 'cables-adapters', parentId: 121, image: '//placehold.co/200x150?text=Cables+and+Adapters' },
  { id: 136, name: 'Καλώδια Τροφοδοσίας', slug: 'power-cables', parentId: 121, image: '//placehold.co/200x150?text=Power+Cables' },
  { id: 137, name: 'Καλώδια USB', slug: 'usb-cables', parentId: 121, image: '//placehold.co/200x150?text=USB+Cables' },

  // Subcategories of Hardware of a Subcategory Υπολογιστές of Main Category Τεχνολογία
  { id: 138, name: 'Κάρτες Γραφικών', slug: 'graphics-cards', parentId: 122, image: '//placehold.co/200x150?text=Graphics+Cards' },
  { id: 139, name: 'Μητρικές Κάρτες', slug: 'motherboards', parentId: 122, image: '//placehold.co/200x150?text=Motherboards' },
  { id: 140, name: 'CPU', slug: 'cpu', parentId: 122, image: '//placehold.co/200x150?text=CPU' },
  { id: 141, name: 'Σκληροί Δίσκοι', slug: 'hard-disks', parentId: 122, image: '//placehold.co/200x150?text=Hard+Disks' },
  { id: 142, name: 'RAM', slug: 'ram', parentId: 122, image: '//placehold.co/200x150?text=RAM' },
  { id: 143, name: 'Κουτιά Υπολογιστών', slug: 'computer-cases', parentId: 122, image: '//placehold.co/200x150?text=Computer+Cases' },
  { id: 144, name: 'Τροφοδοτικά Υπολογιστών', slug: 'power-supplies', parentId: 122, image: '//placehold.co/200x150?text=Power+Supplies' },
  { id: 145, name: 'Cooling PC', slug: 'cooling-pc', parentId: 122, image: '//placehold.co/200x150?text=Cooling+PC' },
  { id: 146, name: 'Optical Drives', slug: 'optical-drives', parentId: 122, image: '//placehold.co/200x150?text=Optical+Drives' },
  { id: 147, name: 'Tuning Parts', slug: 'tuning-parts', parentId: 122, image: '//placehold.co/200x150?text=Tuning+Parts' },
  { id: 148, name: 'Κάρτες Τηλεόρασης, Video', slug: 'tv-cards', parentId: 122, image: '//placehold.co/200x150?text=TV+Cards' },

  // Subcategories of Δικτυακά of a Subcategory Υπολογιστές of Main Category Τεχνολογία
  { id: 149, name: 'WiFi Extenders', slug: 'wifi-extenders', parentId: 123, image: '//placehold.co/200x150?text=WiFi+Extenders' },
  { id: 150, name: 'Routers', slug: 'routers', parentId: 123, image: '//placehold.co/200x150?text=Routers' },
  { id: 151, name: 'Access Points', slug: 'access-points', parentId: 123, image: '//placehold.co/200x150?text=Access+Points' },
  { id: 152, name: 'USB Adapters Δικτύου', slug: 'usb-network-adapters', parentId: 123, image: '//placehold.co/200x150?text=USB+Network+Adapters' },
  { id: 153, name: 'Powerline', slug: 'powerline', parentId: 123, image: '//placehold.co/200x150?text=Powerline' },
  { id: 154, name: 'Καλώδια Δικτύου', slug: 'network-cables', parentId: 123, image: '//placehold.co/200x150?text=Network+Cables' },
  { id: 155, name: 'Κάρτες Δικτύου', slug: 'network-cards', parentId: 123, image: '//placehold.co/200x150?text=Network+Cards' },
  { id: 156, name: 'Κεραίες WiFi', slug: 'wifi-antennas', parentId: 123, image: '//placehold.co/200x150?text=WiFi+Antennas' },
  { id: 157, name: 'Bluetooth Adapter', slug: 'bluetooth-adapter', parentId: 123, image: '//placehold.co/200x150?text=Bluetooth+Adapter' }
];

// Vendors
export interface Vendor {
  id: number; 
  name: string;
  logo: string;
  rating: number;
  url: string;
  telephone: string[]; // Multiple telephone numbers
  location?: string[]; // Optional multiple locations
  paymentMethods: PaymentMethod[]; // List of payment methods offered
}

export const vendors: Vendor[] = [
  { 
    id: 1, 
    name: 'You', 
    logo: '//orig-bpcdn.pstatic.gr/bpmerchants/252.svg', 
    rating: 4.5, 
    url: 'https://www.you.gr', 
    telephone: ['211 9991900'], 
    location: ['Αργυρουπόλεως 2Α, Καλλιθέα'], 
    paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn] 
  },
  { 
    id: 2, 
    name: 'Plaisio', 
    logo: '//orig-bpcdn.pstatic.gr/bpmerchants/79.svg', 
    rating: 4.2, 
    url: 'https://www.plaisio.gr', 
    telephone: ['456123789'], 
    location: ['Location B'], 
    paymentMethods: [PaymentMethod.COD, PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.Courier, PaymentMethod.PickupVia, PaymentMethod.FreeReturn, PaymentMethod.GiftCards, PaymentMethod.ExtendedWarranty] 
  },
  { 
    id: 3, 
    name: 'Public', 
    logo: '//orig-bpcdn.pstatic.gr/bpmerchants/743.svg', 
    rating: 4.7, 
    url: 'https://www.public.gr', 
    telephone: ['210 8181333'], 
    location: ['Θηβαϊδος 22, Κηφισιά', 'Καραγεώργη Σερβίας 1, Πλατεία Συντάγματος, 10563, Αθήνα', 'The Mall Athens, Ανδρέα Παπανδρέου 35 (Θέση Ψαλίδι), 15122, Μαρούσι', 'Σ. Καράγιωργα 4 & Λαζαράκη, 16675, Γλυφάδα', 'Γρηγορίου Λαμπράκη 152-154, 18535, Πειραιάς'], 
    paymentMethods: [PaymentMethod.COD, PaymentMethod.CreditCard, PaymentMethod.PayPal, PaymentMethod.BankTransfer, PaymentMethod.Courier, PaymentMethod.PickupVia, PaymentMethod.FreeReturn, PaymentMethod.PointsCollection, PaymentMethod.GiftCards, PaymentMethod.ExtendedWarranty, PaymentMethod.DeviceRecycling] 
  },
  { 
    id: 4, 
    name: 'Κωτσόβολος', 
    logo: '//orig-bpcdn.pstatic.gr/bpmerchants/496.svg', 
    rating: 4.0, 
    url: 'https://example.com/vendor-b', 
    telephone: ['456123789'], 
    location: ['Location C'], 
    paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn] 
  },
  { 
    id: 5, 
    name: 'Funky Buddha', 
    logo: '//orig-bpcdn.pstatic.gr/bpmerchants/4351.svg', 
    rating: 4.3, 
    url: 'https://example.com/vendor-b', 
    telephone: ['456123789'], 
    location: ['Location C'], 
    paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn] 
  },
  { 
    id: 6, 
    name: 'Germanos', 
    logo: '//orig-bpcdn.pstatic.gr/bpmerchants/8697.svg', 
    rating: 4.1, 
    url: 'https://example.com/vendor-b', 
    telephone: ['456123789'], 
    location: ['Location C'], 
    paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn] 
  },
  { 
    id: 7, 
    name: 'e-shop.gr', 
    logo: '//orig-bpcdn.pstatic.gr/bpmerchants/16.svg', 
    rating: 3.2, 
    url: 'https://example.com/vendor-b', 
    telephone: ['456123789'], 
    location: ['Location C'], 
    paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn] 
  },
  { 
    id: 8, 
    name: 'Χαμόγελο του Παιδιού', 
    logo: '//orig-bpcdn.pstatic.gr/bpmerchants/874.svg', 
    rating: 4.7, 
    url: 'https://example.com/vendor-b', 
    telephone: ['456123789'], 
    location: ['Location C'], 
    paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn] 
  },
];

// Product price from vendor
export interface ProductPrice {
  vendorId: number; 
  price: number;
  shippingCost: number;
  inStock: boolean;
}

// Product
export interface Product {
  id: number; 
  title: string;
  brand: string;
  model: string;
  categoryIds: number[];
  description: string;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  specifications: Record<string, string>;
  prices: ProductPrice[];
}

// Sample products (20 random products)
export const products: Product[] = [
  {
    id: 1,
    title: 'Apple iPhone 14 Pro Max 256GB',
    brand: 'Apple',
    model: 'iPhone 14 Pro Max',
    categoryIds: [10, 30], // Now includes the smartphone subcategory
    description: 'The latest iPhone with stunning design and performance.',
    image: '//bbpcdn.pstatic.gr/bpimg0/78TKg/1SYzV1_SX660/1728492731/apple-iphone-14-pro-max-256gb.webp',
    images: [
      '//bbpcdn.pstatic.gr/bpimg0/78TKg/1SYzV1_SX660/1728492731/apple-iphone-14-pro-max-256gb.webp',
      '//bbpcdn.pstatic.gr/P/bpimg129/66117/apple-iphone-14-pro-max-256gb.webp'
    ],
    rating: 4.8,
    reviews: 245,
    specifications: {
      'Display': '6.7 inch Super Retina XDR',
      'Processor': 'A16 Bionic',
      'RAM': '6GB',
      'Storage': '256GB',
      'Camera': '48MP + 12MP + 12MP',
      'OS': 'iOS 16',
      'Battery': '4323 mAh',
      'Dimensions': '160.7 x 77.6 x 7.85 mm',
      'Weight': '240g'
    },
    prices: [
      { vendorId: 1, price: 1299.99, shippingCost: 0, inStock: true },
      { vendorId: 2, price: 1319.99, shippingCost: 5, inStock: true },
      { vendorId: 3, price: 1289.99, shippingCost: 7.99, inStock: true },
      { vendorId: 4, price: 1309.99, shippingCost: 0, inStock: false }
    ]
  },
  {
    id: 2,
    title: 'Samsung Galaxy S23 Ultra 512GB',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    categoryIds: [10, 30], // Now includes the smartphone subcategory
    description: 'The ultimate Samsung phone with exceptional camera capabilities.',
    image: '//placehold.co/400x400?text=Galaxy+S23',
    images: [
      '//placehold.co/400x400?text=Galaxy+S23',
      '//placehold.co/400x400?text=Galaxy+S23+Side',
      '//placehold.co/400x400?text=Galaxy+S23+Back'
    ],
    rating: 4.7,
    reviews: 189,
    specifications: {
      'Display': '6.8 inch Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 2',
      'RAM': '12GB',
      'Storage': '512GB',
      'Camera': '200MP + 12MP + 10MP + 10MP',
      'OS': 'Android 13',
      'Battery': '5000 mAh',
      'Dimensions': '163.4 x 78.1 x 8.9 mm',
      'Weight': '233g'
    },
    prices: [
      { vendorId: 1, price: 1199.99, shippingCost: 0, inStock: true },
      { vendorId: 3, price: 1179.99, shippingCost: 7.99, inStock: true },
      { vendorId: 5, price: 1189.99, shippingCost: 5, inStock: true }
    ]
  },
  {
    id: 3,
    title: 'MacBook Pro 16-inch',
    brand: 'Apple',
    model: 'MacBook Pro',
    categoryIds: [11],
    description: 'High-performance laptop for professionals.',
    image: '//placehold.co/400x400?text=MacBook+Pro',
    images: ['//placehold.co/400x400?text=MacBook+Pro'],
    rating: 4.6,
    reviews: 200,
    specifications: {
      'Processor': 'Apple M1 Pro',
      'RAM': '16GB',
      'Storage': '512GB SSD',
      'Dimensions': '3.5 x 13.5 x 9.8 inches',
      'Weight': '4.7 pounds'
    },
    prices: [
      { vendorId: 1, price: 2499.99, shippingCost: 0, inStock: true },
      { vendorId: 2, price: 2399.99, shippingCost: 10, inStock: true }
    ]
  },
  {
    id: 4,
    title: 'Sony 55 Inch 4K UHD TV',
    brand: 'Sony',
    model: 'Bravia',
    categoryIds: [14, 13, 12], // Updated categories
    description: 'Stunning visuals and vibrant colors.',
    image: '//placehold.co/400x400?text=Sony+TV',
    images: ['//placehold.co/400x400?text=Sony+TV'],
    rating: 4.8,
    reviews: 150,
    specifications: {
      'Resolution': '4K UHD',
      'Screen Type': 'LED',
      'Smart TV': 'Yes',
      'Weight': '37.5 pounds'
    },
    prices: [
      { vendorId: 3, price: 899.99, shippingCost: 0, inStock: true },
      { vendorId: 4, price: 849.99, shippingCost: 20, inStock: true }
    ]
  },
  {
    id: 5,
    title: 'Dell XPS 13 Laptop',
    brand: 'Dell',
    model: 'XPS 13',
    categoryIds: [11],
    description: 'Ultra-thin laptop with stunning 4K display.',
    image: '//placehold.co/400x400?text=Dell+XPS+13',
    images: ['//placehold.co/400x400?text=Dell+XPS+13'],
    rating: 4.5,
    reviews: 180,
    specifications: {
      'Processor': 'Intel i7',
      'RAM': '16GB',
      'Storage': '1TB SSD',
      'Dimensions': '0.58 x 11.6 x 7.8 inches',
      'Weight': '2.7 pounds'
    },
    prices: [
      { vendorId: 2, price: 1299.99, shippingCost: 0, inStock: true },
      { vendorId: 6, price: 1249.99, shippingCost: 5, inStock: true }
    ]
  },
  {
    id: 6,
    title: 'Fitness Tracker Watch',
    brand: 'Fitbit',
    model: 'Versa 3',
    categoryIds: [20],
    description: 'Monitor your health and fitness activities.',
    image: '//placehold.co/400x400?text=Fitness+Tracker',
    images: ['//placehold.co/400x400?text=Fitness+Tracker'],
    rating: 4.4,
    reviews: 300,
    specifications: {
      'Battery Life': '6+ days',
      'Water Resistant': 'Yes',
      'Syncs to': 'Mobile App'
    },
    prices: [
      { vendorId: 2, price: 229.99, shippingCost: 0, inStock: true },
      { vendorId: 3, price: 199.99, shippingCost: 5, inStock: true }
    ]
  },
  {
    id: 7,
    title: 'Nike Running Shoes',
    brand: 'Nike',
    model: 'Air Zoom Pegasus',
    categoryIds: [22],
    description: 'Comfortable running shoes for all-day wear.',
    image: '//placehold.co/400x400?text=Nike+Shoes',
    images: ['//placehold.co/400x400?text=Nike+Shoes'],
    rating: 4.7,
    reviews: 350,
    specifications: {
      'Material': 'Synthetic',
      'Weight': '10.6 ounces',
      'Style': 'Running'
    },
    prices: [
      { vendorId: 1, price: 119.99, shippingCost: 0, inStock: true },
      { vendorId: 6, price: 109.99, shippingCost: 5, inStock: true }
    ]
  },
  {
    id: 8,
    title: 'PlayStation 5 Console',
    brand: 'Sony',
    model: 'PS5',
    categoryIds: [19],
    description: 'Next-gen gaming console with stunning graphics.',
    image: '//placehold.co/400x400?text=PS5',
    images: ['//placehold.co/400x400?text=PS5'],
    rating: 4.9,
    reviews: 500,
    specifications: {
      'Storage': '825GB SSD',
      'Resolution': 'Up to 120fps',
      'Includes': 'Controller and Cable'
    },
    prices: [
      { vendorId: 1, price: 499.99, shippingCost: 0, inStock: true },
      { vendorId: 2, price: 489.99, shippingCost: 10, inStock: true }
    ]
  },
  {
    id: 9,
    title: 'Wireless Headphones',
    brand: 'Bose',
    model: 'QuietComfort 35',
    categoryIds: [13],
    description: 'Noise-cancelling headphones for immersive sound.',
    image: '//placehold.co/400x400?text=Bose+Headphones',
    images: ['//placehold.co/400x400?text=Bose+Headphones'],
    rating: 4.8,
    reviews: 275,
    specifications: {
      'Battery Life': '20 hours',
      'Features': 'Bluetooth, Voice Assistant'
    },
    prices: [
      { vendorId: 3, price: 299.99, shippingCost: 0, inStock: true }
    ]
  },
  {
    id: 10,
    title: 'Artificial Intelligence for Beginners',
    brand: 'TechBooks',
    model: 'AI Basics',
    categoryIds: [11],
    description: 'An introductory book on artificial intelligence concepts.',
    image: '//placehold.co/400x400?text=AI+Book',
    images: ['//placehold.co/400x400?text=AI+Book'],
    rating: 4.5,
    reviews: 50,
    specifications: {
      'Pages': '400',
      'ISBN': '978-3-16-148410-0'
    },
    prices: [
      { vendorId: 5, price: 29.99, shippingCost: 0, inStock: true }
    ]
  },
  {
    id: 11,
    title: 'Camping Tent',
    brand: 'NatureHike',
    model: 'Camping Tent X1',
    categoryIds: [31],
    description: 'Spacious camping tent for outdoor adventures.',
    image: '//placehold.co/400x400?text=Camping+Tent',
    images: ['//placehold.co/400x400?text=Camping+Tent'],
    rating: 4.6,
    reviews: 100,
    specifications: {
      'Capacity': '4 Persons',
      'Material': 'Waterproof'
    },
    prices: [
      { vendorId: 6, price: 149.99, shippingCost: 0, inStock: true },
      { vendorId: 2, price: 139.99, shippingCost: 10, inStock: true }
    ]
  },
  {
    id: 12,
    title: 'Vegetable Planter Box',
    brand: 'Gardener\'s Supply',
    model: 'Planter Box to go',
    categoryIds: [23],
    description: 'Perfect for urban gardening!',
    image: '//placehold.co/400x400?text=Vegetable+Planter',
    images: ['//placehold.co/400x400?text=Vegetable+Planter'],
    rating: 4.7,
    reviews: 60,
    specifications: {
      'Material': 'Wood',
      'Dimensions': '40 x 20 x 15 inches'
    },
    prices: [
      { vendorId: 1, price: 79.99, shippingCost: 0, inStock: true }
    ]
  },
  {
    id: 13,
    title: 'Nonstick Cookware Set',
    brand: 'T-fal',
    model: 'Cookware Basic Set',
    categoryIds: [17],
    description: 'Durable cookware set for everyday cooking.',
    image: '//placehold.co/400x400?text=Cookware+Set',
    images: ['//placehold.co/400x400?text=Cookware+Set'],
    rating: 4.4,
    reviews: 150,
    specifications: {
      'Material': 'Nonstick',
      'Gauge': '304 Stainless Steel'
    },
    prices: [
      { vendorId: 6, price: 99.99, shippingCost: 0, inStock: true }
    ]
  },
  {
    id: 14,
    title: 'Fashion Backpack',
    brand: 'SwissGear',
    model: 'Travel Backpack',
    categoryIds: [25],
    description: 'Stylish and functional backpack for travel.',
    image: '//placehold.co/400x400?text=Backpack',
    images: ['//placehold.co/400x400?text=Backpack'],
    rating: 4.7,
    reviews: 120,
    specifications: {
      'Material': 'Polyester',
      'Dimensions': '17.5 x 12.5 x 7 inches'
    },
    prices: [
      { vendorId: 5, price: 59.99, shippingCost: 0, inStock: true }
    ]
  },
  {
    id: 15,
    title: 'Electric Kettle',
    brand: 'Hamilton Beach',
    model: 'Electric Kettle 1.7L',
    categoryIds: [16],
    description: 'Quick boiling kettle for hot beverages.',
    image: '//placehold.co/400x400?text=Electric+Kettle',
    images: ['//placehold.co/400x400?text=Electric+Kettle'],
    rating: 4.5,
    reviews: 90,
    specifications: {
      'Material': 'Stainless Steel',
      'Capacity': '1.7 Liters'
    },
    prices: [
      { vendorId: 2, price: 39.99, shippingCost: 0, inStock: true },
      { vendorId: 3, price: 34.99, shippingCost: 5, inStock: true }
    ]
  },
  {
    id: 16,
    title: 'Yoga Mat',
    brand: 'Liforme',
    model: 'Eco-Friendly',
    categoryIds: [22],
    description: 'Durable and non-slip yoga mat.',
    image: '//placehold.co/400x400?text=Yoga+Mat',
    images: ['//placehold.co/400x400?text=Yoga+Mat'],
    rating: 4.8,
    reviews: 200,
    specifications: {
      'Material': 'Natural Rubber',
      'Thickness': '5mm'
    },
    prices: [
      { vendorId: 1, price: 49.99, shippingCost: 0, inStock: true }
    ]
  },
  {
    id: 17,
    title: 'Pet Cat Tree',
    brand: 'PawHut',
    model: 'Pet Kitty Tower',
    categoryIds: [29],
    description: 'Fun play area for your cat.',
    image: '//placehold.co/400x400?text=Cat+Tree',
    images: ['//placehold.co/400x400?text=Cat+Tree'],
    rating: 4.6,
    reviews: 80,
    specifications: {
      'Material': 'Wood and Fabric',
      'Height': '4 feet'
    },
    prices: [
      { vendorId: 4, price: 79.99, shippingCost: 0, inStock: true }
    ]
  },
  {
    id: 18,
    title: 'Children’s Educational Tablet',
    brand: 'Amazon',
    model: 'Fire HD 10',
    categoryIds: [10, 30], // Now includes the smartphone subcategory
    description: 'Kids-friendly tablet with educational content.',
    image: '//placehold.co/400x400?text=Kids+Tablet',
    images: ['//placehold.co/400x400?text=Kids+Tablet'],
    rating: 4.7,
    reviews: 300,
    specifications: {
      'Battery Life': '12 hours',
      'Size': '10.1 inch'
    },
    prices: [
      { vendorId: 1, price: 149.99, shippingCost: 0, inStock: true }
    ]
  },
  {
    id: 19,
    title: 'Smart TV Stick',
    brand: 'Amazon',
    model: 'Fire Stick 4K',
    categoryIds: [13],
    description: 'Stream all your favorites in 4K resolution.',
    image: '//placehold.co/400x400?text=Smart+TV+Stick',
    images: ['//placehold.co/400x400?text=Smart+TV+Stick'],
    rating: 4.9,
    reviews: 400,
    specifications: {
      'Supports': '4K Ultra HD, HDR',
      'Includes': 'Alexa Voice Remote'
    },
    prices: [
      { vendorId: 5, price: 49.99, shippingCost: 0, inStock: true }
    ]
  },
  {
    id: 20,
    title: 'Drone with Camera',
    brand: 'DJI',
    model: 'Mavic Air 2',
    categoryIds: [14],
    description: 'Capture stunning aerial footage.',
    image: '//placehold.co/400x400?text=Drone',
    images: ['//placehold.co/400x400?text=Drone'],
    rating: 4.8,
    reviews: 150,
    specifications: {
      'Camera': '48MP',
      'Flight Time': '34 minutes'
    },
    prices: [
      { vendorId: 2, price: 799.99, shippingCost: 0, inStock: true }
    ]
  }
];

// Brands
export interface Brand {
  id: number; 
  name: string;
  logo: string;
}

export const brands: Brand[] = [
  { id: 1, name: 'Apple', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/9.svg' },
  { id: 2, name: 'Samsung', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/26.svg' },
  { id: 3, name: 'Sony', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/5.svg' },
  { id: 4, name: 'LG', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/293.svg' },
  { id: 5, name: 'Canon', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/10.svg' },
  { id: 6, name: 'Nikon', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/281.svg' },
  { id: 7, name: 'Lenovo', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/728.svg' },
  { id: 8, name: 'Dell', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/292.svg' },
  { id: 9, name: 'HP', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/1.svg' },
  { id: 10, name: 'Asus', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/161.svg' },
  { id: 11, name: 'Acer', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/7.svg' },
  { id: 12, name: 'Microsoft', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/100.svg' },
  { id: 13, name: 'ΑΛΦΑ', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/30165.svg' },
  { id: 14, name: '3Guys', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/16764.svg' },
  { id: 15, name: '2K Games', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/18388.svg' },
  { id: 16, name: '7Days', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/39065.svg' },
  { id: 17, name: 'Βιοκαρπέτ', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/30055.svg' },
  { id: 18, name: 'Χαμόγελο του Παιδιού', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/33632.svg' },
  { id: 19, name: 'Χρωτέχ', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/36032.svg' },
  { id: 20, name: 'Γιώτης', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/21623.svg' }
];

// Helper functions to simulate API calls
export const fetchFeaturedProducts = () => {
  return products.slice(0, 5);
};

export const fetchDeals = () => {
  return products.slice(3, 8);
};

export const fetchNewArrivals = () => {
  return products.slice(5, 10);
};

export const searchProducts = (query: string) => {
  const searchText = query.toLowerCase();
  return products.filter(product => 
    product.title.toLowerCase().includes(searchText) ||
    product.brand.toLowerCase().includes(searchText)
  );
};

export const getCategoryById = (id: number) => {
  return categories.find(category => category.id === id);
};

export const getProductById = (id: number) => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (categoryId: number) => {
  return products.filter(product => product.categoryIds.includes(categoryId));
};

export const getSimilarProducts = (productId: number) => {
  const product = getProductById(productId);
  if (!product) return [];
  
  return products
    .filter(p => product.categoryIds.some(id => p.categoryIds.includes(id)) && p.id !== productId)
    .slice(0, 5);
};

export const getVendorById = (vendorId: number) => {
  return vendors.find(vendor => vendor.id === vendorId);
};

export const getBestPrice = (product: Product) => {
  if (!product.prices.length) return null;
  
  const inStockPrices = product.prices.filter(price => price.inStock);
  if (!inStockPrices.length) return product.prices[0];
  
  return inStockPrices.reduce((best, current) => 
    (current.price < best.price) ? current : best
  , inStockPrices[0]);
};

// Fetch categories and brands
export const getCategories = () => {
  return categories;
};

export const getBrands = () => {
  return brands;
};
