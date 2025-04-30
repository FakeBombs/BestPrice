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
  { id: 10, name: 'Κινητή Τηλεφωνία', slug: 'mobile-phones', parentId: 1, image: '/dist/images/cat/mobile-phones.webp' },
  { id: 11, name: 'Υπολογιστές', slug: 'computers', parentId: 1, image: '/dist/images/cat/computers.webp' },
  { id: 12, name: 'Laptops, Αξεσουάρ', slug: 'laptops-accessories', parentId: 1, image: '/dist/images/cat/laptops-accessories.webp' },
  { id: 13, name: 'Εικόνα', slug: 'image', parentId: 1, image: '/dist/images/cat/image.webp' },
  { id: 14, name: 'Smartwatches, Wearables', slug: 'smartwatches-wearables', parentId: 1, image: '/dist/images/cat/smartwatches-wearables.webp' },
  { id: 15, name: 'Tablets, Αξεσουάρ', slug: 'tablets-accessories', parentId: 1, image: '/dist/images/cat/tablets-accessories.webp' },
  { id: 16, name: 'Video Games', slug: 'video-games', parentId: 1, image: '/dist/images/cat/video-games.webp' },
  { id: 17, name: 'Ήχος', slug: 'audio', parentId: 1, image: '/dist/images/cat/audio.webp' },
  { id: 18, name: 'Φωτογραφία, Video', slug: 'photo-video', parentId: 1, image: '/dist/images/cat/photo-video.webp' },
  { id: 19, name: 'Ηλεκτρονικά', slug: 'consumer-electronics', parentId: 1, image: '/dist/images/cat/consumer-electronics.webp' },
  { id: 20, name: 'Τηλεφωνία', slug: 'telephony', parentId: 1, image: '/dist/images/cat/telephony.webp' },
  { id: 21, name: 'Gadgets', slug: 'gadgets', parentId: 1, image: '/dist/images/cat/gadgets.webp' },

  // Subcategories of Σπίτι & Κήπος
  { id: 22, name: 'Οικιακές Συσκευές', slug: 'home-appliances', parentId: 2, image: '/dist/images/cat/home-appliances.webp' },
  { id: 23, name: 'Εργαλεία', slug: 'tools', parentId: 2, image: '/dist/images/cat/tools.webp' },
  { id: 24, name: 'Έπιπλα', slug: 'furniture', parentId: 2, image: '/dist/images/cat/furniture.webp' },
  { id: 25, name: 'Κήπος', slug: 'garden', parentId: 2, image: '/dist/images/cat/garden.webp' },
  { id: 26, name: 'Είδη Σπιτιού', slug: 'home-items', parentId: 2, image: '/dist/images/cat/home-items.webp' },
  { id: 27, name: 'Λευκά Είδη', slug: 'home-linens', parentId: 2, image: '/dist/images/cat/home-linens.webp' },
  { id: 28, name: 'Φωτισμός', slug: 'lighting', parentId: 2, image: '/dist/images/cat/lighting.webp' },
  { id: 29, name: 'Είδη Κουζίνας', slug: 'kitchen-items', parentId: 2, image: '/dist/images/cat/kitchen-items.webp' },
  { id: 30, name: 'Τρόφιμα & Ποτά', slug: 'food-beverages', parentId: 2, image: '/dist/images/cat/food-beverages.webp' },
  { id: 31, name: 'Ηλεκτρολογικά', slug: 'electrical-items', parentId: 2, image: '/dist/images/cat/electrical-items.webp' },
  { id: 32, name: 'Είδη Καπνιστού', slug: 'smoking-supplies', parentId: 2, image: '/dist/images/cat/smoking-supplies.webp' },
  { id: 33, name: 'Είδη Γραφείου', slug: 'office-items', parentId: 2, image: '/dist/images/cat/office-items.webp' },
  { id: 34, name: 'Είδη Δώρων', slug: 'gift-items', parentId: 2, image: '/dist/images/cat/gift-items.webp' },
  { id: 35, name: 'Συστήματα Ασφαλείας', slug: 'security-systems', parentId: 2, image: '/dist/images/cat/security-systems.webp' },
  { id: 36, name: 'Επαγγελματικός Εξοπλισμός', slug: 'professional-equipment', parentId: 2, image: '/dist/images/cat/professional-equipment.webp' },
  { id: 37, name: 'Εποχιακά Είδη', slug: 'seasonal-items', parentId: 2, image: '/dist/images/cat/seasonal-items.webp' },
  { id: 38, name: 'Τσάντες για Ψώνια', slug: 'shopping-bags', parentId: 2, image: '/dist/images/cat/shopping-bags.webp' },
  { id: 39, name: 'Καρότσια Λαϊκής', slug: 'shopping-trolleys', parentId: 2, image: '/dist/images/cat/shopping-trolleys.webp' },
  { id: 40, name: 'Εκκλησιαστικά Είδη', slug: 'church-items', parentId: 2, image: '/dist/images/cat/church-items.webp' },
  { id: 41, name: 'Είδη Κατοικιδίων', slug: 'pet-items', parentId: 2, image: '/dist/images/cat/pet-items.webp' },

  // Subcategories of Μόδα
  { id: 42, name: 'Γυναικεία Μόδα', slug: 'womens-fashion', parentId: 3, image: '/dist/images/cat/womens-fashion.webp' },
  { id: 43, name: 'Ανδρική Μόδα', slug: 'mens-fashion', parentId: 3, image: '/dist/images/cat/mens-fashion.webp' },
  { id: 44, name: 'Ρολόγια', slug: 'watches', parentId: 3, image: '/dist/images/cat/watches.webp' },
  { id: 45, name: 'Κοσμήματα', slug: 'jewelry', parentId: 3, image: '/dist/images/cat/jewelry.webp' },
  { id: 46, name: 'Οπτικά', slug: 'opticals', parentId: 3, image: '/dist/images/cat/opticals.webp' },
  { id: 47, name: 'Converse All Star', slug: 'converse-all-star', parentId: 3, image: '/dist/images/cat/converse-all-star.webp' },
  { id: 48, name: 'Ομπρέλες Βροχής', slug: 'rain-umbrellas', parentId: 3, image: '/dist/images/cat/rain-umbrellas.webp' },
  { id: 49, name: 'Αξεσουάρ Παπουτσιών', slug: 'shoe-accessories', parentId: 3, image: '/dist/images/cat/shoe-accessories.webp' },
  { id: 50, name: 'Παιδική, Βρεφική Μόδα', slug: 'childrens-baby-fashion', parentId: 3, image: '/dist/images/cat/childrens-baby-fashion.webp' },
  { id: 51, name: 'Sneakers', slug: 'sneakers', parentId: 3, image: '/dist/images/cat/sneakers.webp' },

  // Subcategories of Υγεία & Ομορφιά
  { id: 52, name: 'Περιποίηση', slug: 'grooming', parentId: 4, image: '/dist/images/cat/grooming.webp' },
  { id: 53, name: 'Είδη Φαρμακείου', slug: 'pharmacy-products', parentId: 4, image: '/dist/images/cat/pharmacy-products.webp' },
  { id: 54, name: 'Αρώματα', slug: 'perfumes', parentId: 4, image: '/dist/images/cat/perfumes.webp' },
  { id: 55, name: 'Συμπληρώματα Διατροφής', slug: 'dietary-supplements', parentId: 4, image: '/dist/images/cat/dietary-supplements.webp' },
  { id: 56, name: 'Συσκευές Περιποίησης', slug: 'grooming-devices', parentId: 4, image: '/dist/images/cat/grooming-devices.webp' },
  { id: 57, name: 'Μακιγιάζ', slug: 'makeup', parentId: 4, image: '/dist/images/cat/makeup.webp' },
  { id: 58, name: 'Αντηλιακή Προστασία, Μαύρισμα', slug: 'sun-protection', parentId: 4, image: '/dist/images/cat/sun-protection.webp' },
  { id: 59, name: 'Ιατρικά Είδη', slug: 'medical-supplies', parentId: 4, image: '/dist/images/cat/medical-supplies.webp' },
  { id: 60, name: 'Μανικιούρ - Πεντικιούρ', slug: 'manicure-pedicure', parentId: 4, image: '/dist/images/cat/manicure-pedicure.webp' },
  { id: 61, name: 'Στοματική Υγιεινή', slug: 'oral-hygiene', parentId: 4, image: '/dist/images/cat/oral-hygiene.webp' },
  { id: 62, name: 'Sex Toys', slug: 'sex-toys', parentId: 4, image: '/dist/images/cat/sex-toys.webp' },
  { id: 63, name: 'Σύσφιξη, Αδυνάτισμα', slug: 'tightening', parentId: 4, image: '/dist/images/cat/tightening.webp' },
  { id: 64, name: 'Προϊόντα Κάνναβης', slug: 'cannabis-products', parentId: 4, image: '/dist/images/cat/cannabis-products.webp' },
  { id: 65, name: 'Ορθοπεδικά', slug: 'orthopedic', parentId: 4, image: '/dist/images/cat/orthopedic.webp' },
  { id: 66, name: 'Βοηθήματα Ασθενών', slug: 'patient-aids', parentId: 4, image: '/dist/images/cat/patient-aids.webp' },
  { id: 46, name: 'Οπτικά', slug: 'opticals', parentId: 4, image: '/dist/images/cat/opticals.webp' },
  { id: 67, name: 'Κορεάτικα Καλλυντικά', slug: 'korean-cosmetics', parentId: 4, image: '/dist/images/cat/korean-cosmetics.webp' },

  // Subcategories of Παιδικά - Βρεφικά
  { id: 50, name: 'Παιδική, Βρεφική Μόδα', slug: 'childrens-baby-fashion', parentId: 5, image: '/dist/images/cat/childrens-baby-fashion.webp' },
  { id: 68, name: 'Παιδικά Παιχνίδια', slug: 'childrens-toys', parentId: 5, image: '/dist/images/cat/childrens-toys.webp' },
  { id: 69, name: 'Σχολικά Είδη', slug: 'school-supplies', parentId: 5, image: '/dist/images/cat/school-supplies.webp' },
  { id: 70, name: 'Βρεφικά Παιχνίδια', slug: 'baby-toys', parentId: 5, image: '/dist/images/cat/baby-toys.webp' },
  { id: 71, name: 'Βρεφικά Είδη', slug: 'baby-products', parentId: 5, image: '/dist/images/cat/baby-products.webp' },
  { id: 72, name: 'Παιδικά Λευκά Είδη', slug: 'childrens-linens', parentId: 5, image: '/dist/images/cat/childrens-linens.webp' },
  { id: 73, name: 'Βαπτιστικά', slug: 'christening-items', parentId: 5, image: '/dist/images/cat/christening-items.webp' },
  { id: 74, name: 'Παιδικά Ρολόγια', slug: 'childrens-watches', parentId: 5, image: '/dist/images/cat/childrens-watches.webp' },

  // Subcategories of Hobby, Αθλητισμός
  { id: 75, name: 'Αθλήματα', slug: 'sports', parentId: 6, image: '/dist/images/cat/sports.webp' },
  { id: 76, name: 'Ποδηλασία', slug: 'cycling', parentId: 6, image: '/dist/images/cat/cycling.webp' },
  { id: 77, name: 'Ελεύθερος Χρόνος', slug: 'leisure-time', parentId: 6, image: '/dist/images/cat/leisure-time.webp' },
  { id: 78, name: 'Ψάρεμα, Καταδύσεις', slug: 'fishing-diving', parentId: 6, image: '/dist/images/cat/fishing-diving.webp' },
  { id: 79, name: 'Είδη Θαλάσσης', slug: 'sea-items', parentId: 6, image: '/dist/images/cat/sea-items.webp' },
  { id: 80, name: 'Camping', slug: 'camping', parentId: 6, image: '/dist/images/cat/camping.webp' },
  { id: 81, name: 'Είδη Ταξιδίου, Τσάντες', slug: 'travel-items-bags', parentId: 6, image: '/dist/images/cat/travel-items-bags.webp' },
  { id: 82, name: 'Βιβλία', slug: 'books', parentId: 6, image: '/dist/images/cat/books.webp' },
  { id: 83, name: 'Κυνήγι', slug: 'hunting', parentId: 6, image: '/dist/images/cat/hunting.webp' },
  { id: 84, name: 'Είδη Γυμναστικής', slug: 'gym-equipment', parentId: 6, image: '/dist/images/cat/gym-equipment.webp' },
  { id: 41, name: 'Είδη Κατοικιδίων', slug: 'pet-items', parentId: 6, image: '/dist/images/cat/pet-items.webp' },
  { id: 85, name: 'Drones & Αξεσουάρ', slug: 'drones-accessories', parentId: 6, image: '/dist/images/cat/drones-accessories.webp' },
  { id: 86, name: 'Ηλεκτρικά Πατίνια', slug: 'electric-scooters', parentId: 6, image: '/dist/images/cat/electric-scooters.webp' },
  { id: 87, name: 'Hoverboards', slug: 'hoverboards', parentId: 6, image: '/dist/images/cat/hoverboards.webp' },
  { id: 88, name: 'Μουσικά Όργανα', slug: 'musical-instruments', parentId: 6, image: '/dist/images/cat/musical-instruments.webp' },
  { id: 89, name: 'Αξεσουάρ Αθλημάτων', slug: 'sports-accessories', parentId: 6, image: '/dist/images/cat/sports-accessories.webp' },
  { id: 90, name: 'Είδη Εξερεύνησης', slug: 'exploration-items', parentId: 6, image: '/dist/images/cat/exploration-items.webp' },
  { id: 91, name: 'Γυναικεία Αθλητικά Ρούχα', slug: 'womens-sports-clothing', parentId: 6, image: '/dist/images/cat/womens-sports-clothing.webp' },
  { id: 92, name: 'Γυναικεία Αθλητικά Παπούτσια', slug: 'womens-sports-shoes', parentId: 6, image: '/dist/images/cat/womens-sports-shoes.webp' },
  { id: 93, name: 'Ανδρικά Αθλητικά Ρούχα', slug: 'mens-sports-clothing', parentId: 6, image: '/dist/images/cat/mens-sports-clothing.webp' },
  { id: 94, name: 'Ανδρικά Αθλητικά Παπούτσια', slug: 'mens-sports-shoes', parentId: 6, image: '/dist/images/cat/mens-sports-shoes.webp' },

  // Subcategories of Μηχανοκίνηση
  { id: 95, name: 'Αυτοκίνητο', slug: 'auto-products', parentId: 7, image: '/dist/images/cat/auto-products.webp' },
  { id: 96, name: 'Μοτοσυκλέτα', slug: 'moto-products', parentId: 7, image: '/dist/images/cat/moto-products.webp' },
  { id: 97, name: 'Σκάφος', slug: 'boat-equipment', parentId: 7, image: '/dist/images/cat/boat-equipment.webp' },
  { id: 98, name: 'Είδη Φορτηγού', slug: 'truck-accessories', parentId: 7, image: '/dist/images/cat/truck-accessories.webp' },

  // Subcategories of Κινητή Τηλεφωνία of Main Category Τεχνολογία
  { id: 99, name: 'Κινητά', slug: 'mobiles', parentId: 10, image: '/dist/images/cat/mobiles.webp' },
  { id: 100, name: 'iPhone', slug: 'iphone', parentId: 10, image: '/dist/images/cat/iphone.webp' },
  { id: 101, name: 'Θήκες Κινητών', slug: 'mobile-cases', parentId: 10, image: '/dist/images/cat/mobile-cases.webp' },
  { id: 102, name: 'Bluetooth Handsfree', slug: 'bluetooth-handsfree', parentId: 10, image: '/dist/images/cat/bluetooth-handsfree.webp' },
  { id: 103, name: 'Handsfree', slug: 'handsfree', parentId: 10, image: '/dist/images/cat/handsfree.webp' },
  { id: 104, name: 'Φορτιστές Κινητών', slug: 'mobile-chargers', parentId: 10, image: '/dist/images/cat/mobile-chargers.webp' },
  { id: 105, name: 'Tempered Glass', slug: 'tempered-glass', parentId: 10, image: '/dist/images/cat/tempered-glass.webp' },
  { id: 106, name: 'Προστασία Οθόνης', slug: 'screen-protection', parentId: 10, image: '/dist/images/cat/screen-protection.webp' },
  { id: 107, name: 'Power Banks', slug: 'power-banks', parentId: 10, image: '/dist/images/cat/power-banks.webp' },
  { id: 108, name: 'Μπαταρίες Κινητών', slug: 'mobile-batteries', parentId: 10, image: '/dist/images/cat/mobile-batteries.webp' },
  { id: 109, name: 'Selfie Stick', slug: 'selfie-stick', parentId: 10, image: '/dist/images/cat/selfie-stick.webp' },
  { id: 110, name: 'Βάσεις Κινητού', slug: 'mobile-stands', parentId: 10, image: '/dist/images/cat/mobile-stands.webp' },
  { id: 111, name: 'Καλώδια Φόρτισης, Μεταφοράς Δεδομένων', slug: 'charging-cables', parentId: 10, image: '/dist/images/cat/charging-cables.webp' },
  { id: 112, name: 'Anti-Lost Tracker', slug: 'anti-lost-tracker', parentId: 10, image: '/dist/images/cat/anti-lost-tracker.webp' },
  { id: 113, name: 'Ανταλλακτικά Κινητών', slug: 'mobile-replacements', parentId: 10, image: '/dist/images/cat/mobile-replacements.webp' },
  { id: 114, name: 'Gimbal Κινητών', slug: 'mobile-gimbal', parentId: 10, image: '/dist/images/cat/mobile-gimbal.webp' },
  { id: 115, name: 'Γραφίδες Αφής', slug: 'touch-pens', parentId: 10, image: '/dist/images/cat/touch-pens.webp' },
  { id: 116, name: 'Αξεσουάρ Γραφίδας', slug: 'pen-accessories', parentId: 10, image: '/dist/images/cat/pen-accessories.webp' },
  { id: 117, name: 'Αξεσουάρ Ακουστικών Bluetooth', slug: 'bluetooth-headphone-accessories', parentId: 10, image: '/dist/images/cat/bluetooth-headphone-accessories.webp' },
  { id: 118, name: 'Αξεσουάρ Anti-Lost Tracker', slug: 'anti-lost-tracker-accessories', parentId: 10, image: '/dist/images/cat/anti-lost-tracker-accessories.webp' },
  { id: 119, name: 'Pop Sockets', slug: 'pop-sockets', parentId: 10, image: '/dist/images/cat/pop-sockets.webp' },
  { id: 120, name: 'Τρίποδα Κινητών', slug: 'mobile-tripods', parentId: 10, image: '/dist/images/cat/mobile-tripods.webp' },
  { id: 121, name: 'Εργαλεία για Service Κινητών', slug: 'mobile-service-tools', parentId: 10, image: '/dist/images/cat/mobile-service-tools.webp' },
  { id: 122, name: 'Διακοσμητικά Κινητών', slug: 'mobile-decorations', parentId: 10, image: '/dist/images/cat/mobile-decorations.webp' },
  { id: 123, name: 'Αξεσουάρ Κινητών', slug: 'mobile-accessories', parentId: 10, image: '/dist/images/cat/mobile-accessories.webp' },
  { id: 124, name: 'Προστασία Κάμερας Κινητών', slug: 'mobile-camera-protection', parentId: 10, image: '/dist/images/cat/mobile-camera-protection.webp' },
  { id: 125, name: 'Φακοί Κάμερας Κινητών', slug: 'mobile-camera-lenses', parentId: 10, image: '/dist/images/cat/mobile-camera-lenses.webp' },
  { id: 126, name: 'Ενισχυτές Σήματος Κινητής Τηλεφωνίας', slug: 'mobile-signal-amplifiers', parentId: 10, image: '/dist/images/cat/mobile-signal-amplifiers.webp' },
  { id: 127, name: 'Πλήκτρα Mobile Gaming', slug: 'mobile-gaming-buttons', parentId: 10, image: '/dist/images/cat/mobile-gaming-buttons.webp' },
  { id: 128, name: 'Πακέτα Σύνδεσης', slug: 'connection-packages', parentId: 10, image: '/dist/images/cat/connection-packages.webp' },
  { id: 129, name: 'Φορητά Ηχεία Bluetooth', slug: 'portable-bluetooth-speakers', parentId: 10, image: '/dist/images/cat/portable-bluetooth-speakers.webp' },

  // Subcategories of Θήκες Κινητών (Mobile Cases)
  { id: 130, name: 'Θήκες Κινητών Samsung', slug: 'samsung-mobile-cases', parentId: 101, image: '/dist/images/cat/samsung-mobile-cases.webp' },
  { id: 131, name: 'Θήκες Κινητών Xiaomi', slug: 'xiaomi-mobile-cases', parentId: 101, image: '/dist/images/cat/xiaomi-mobile-cases.webp' },
  { id: 132, name: 'Θήκες iPhone', slug: 'iphone-cases', parentId: 101, image: '/dist/images/cat/iphone-cases.webp' },
  { id: 133, name: 'Θήκες Κινητών Huawei', slug: 'huawei-mobile-cases', parentId: 101, image: '/dist/images/cat/huawei-mobile-cases.webp' },
  { id: 134, name: 'Θήκες Κινητών Nokia', slug: 'nokia-mobile-cases', parentId: 101, image: '/dist/images/cat/nokia-mobile-cases.webp' },
  { id: 135, name: 'Θήκες Κινητών Honor', slug: 'honor-mobile-cases', parentId: 101, image: '/dist/images/cat/honor-mobile-cases.webp' },
  { id: 136, name: 'Θήκες Κινητών LG', slug: 'lg-mobile-cases', parentId: 101, image: '/dist/images/cat/lg-mobile-cases.webp' },
  { id: 137, name: 'Θήκες Κινητών Sony', slug: 'sony-mobile-cases', parentId: 101, image: '/dist/images/cat/sony-mobile-cases.webp' },
  { id: 138, name: 'Θήκες Κινητών MLS', slug: 'mls-mobile-cases', parentId: 101, image: '/dist/images/cat/mls-mobile-cases.webp' },
  { id: 139, name: 'Θήκες Άλλων Κινητών', slug: 'other-mobile-cases', parentId: 101, image: '/dist/images/cat/other-mobile-cases.webp' },
  { id: 140, name: 'Θήκες Universal', slug: 'universal-cases', parentId: 101, image: '/dist/images/cat/universal-cases.webp' },
  { id: 141, name: 'Θήκες Κινητών Πουγκί (Pouch)', slug: 'pouch-mobile-cases', parentId: 101, image: '/dist/images/cat/pouch-mobile-cases.webp' },
  { id: 142, name: 'Θήκες Κινητών για Τρέξιμο', slug: 'running-mobile-cases', parentId: 101, image: '/dist/images/cat/running-mobile-cases.webp' },
  { id: 143, name: 'Θήκες Κινητών με Σχέδια', slug: 'designed-mobile-cases', parentId: 101, image: '/dist/images/cat/designed-mobile-cases.webp' },
  { id: 144, name: 'Αδιάβροχες Θήκες Κινητών', slug: 'waterproof-mobile-cases', parentId: 101, image: '/dist/images/cat/waterproof-mobile-cases.webp' },
  
  //Subcategories of Καλώδια Φόρτισης, Μεταφοράς Δεδομένων (Charging and Data Transfer Cables)
  { id: 145, name: 'Καλώδια USB Type-C', slug: 'usb-type-c-cables', parentId: 111, image: '/dist/images/cat/usb-type-c-cables.webp' },
  { id: 146, name: 'Καλώδια Lightning', slug: 'lightning-cables', parentId: 111, image: '/dist/images/cat/lightning-cables.webp' },
  { id: 147, name: 'Καλώδια micro USB', slug: 'micro-usb-cables', parentId: 111, image: '/dist/images/cat/micro-usb-cables.webp' },
  { id: 148, name: 'Καλώδια Multi Port', slug: 'multi-port-cables', parentId: 111, image: '/dist/images/cat/multi-port-cables.webp' },
  { id: 149, name: 'Καλώδια 30-Pin', slug: '30-pin-cables', parentId: 111, image: '/dist/images/cat/30-pin-cables.webp' },
  { id: 150, name: 'Αντάπτορες, Προεκτάσεις Κινητών', slug: 'mobile-adapters-extensions', parentId: 111, image: '/dist/images/cat/mobile-adapters-extensions.webp' },
  
  //Subcategories of Ανταλλακτικά Κινητών (Mobile Spare Parts)
  { id: 151, name: 'Οθόνες Κινητών', slug: 'mobile-screens', parentId: 113, image: '/dist/images/cat/mobile-screens.webp' },
  { id: 152, name: 'Μηχανισμοί Δόνησης Κινητών', slug: 'mobile-vibration-mechanisms', parentId: 113, image: '/dist/images/cat/mobile-vibration-mechanisms.webp' },
  { id: 153, name: 'Μηχανισμοί Αφής Κινητών', slug: 'mobile-touch-mechanisms', parentId: 113, image: '/dist/images/cat/mobile-touch-mechanisms.webp' },
  { id: 154, name: 'Καπάκια Κινητών', slug: 'mobile-covers', parentId: 113, image: '/dist/images/cat/mobile-covers.webp' },
  { id: 155, name: 'Πλήκτρα, Διακόπτες, Καλύμματα', slug: 'buttons-switches-covers', parentId: 113, image: '/dist/images/cat/buttons-switches-covers.webp' },
  { id: 156, name: 'Ανταλλακτικά Ηχεία Κινητών', slug: 'mobile-speaker-parts', parentId: 113, image: '/dist/images/cat/mobile-speaker-parts.webp' },
  { id: 157, name: 'Charging Ports (Επαφές Φόρτισης)', slug: 'mobile-charging-ports', parentId: 113, image: '/dist/images/cat/mobile-charging-ports.webp' },
  { id: 158, name: 'Κάμερες Κινητών', slug: 'mobile-cameras', parentId: 113, image: '/dist/images/cat/mobile-cameras.webp' },
  { id: 159, name: 'Ανταλλακτικά για Ακουστικά Κινητών', slug: 'mobile-headphone-parts', parentId: 113, image: '/dist/images/cat/mobile-headphone-parts.webp' },
  { id: 160, name: 'Μικρόφωνα για Κινητά', slug: 'mobile-microphones', parentId: 113, image: '/dist/images/cat/mobile-microphones.webp' },
  { id: 161, name: 'Προσόψεις Κινητών', slug: 'mobile-front-plates', parentId: 113, image: '/dist/images/cat/mobile-front-plates.webp' },
  { id: 162, name: 'Πλαίσια Κινητών', slug: 'mobile-frames', parentId: 113, image: '/dist/images/cat/mobile-frames.webp' },
  { id: 163, name: 'Κεραίες για Κινητά', slug: 'mobile-antennas', parentId: 113, image: '/dist/images/cat/mobile-antennas.webp' },
  { id: 164, name: 'Βίδες για Κινητά', slug: 'mobile-screws', parentId: 113, image: '/dist/images/cat/mobile-screws.webp' },
  { id: 165, name: 'Καλωδιοταινίες', slug: 'flex-cables', parentId: 113, image: '/dist/images/cat/flex-cables.webp' },
  { id: 166, name: 'SD/SIM Trays', slug: 'sd-sim-trays', parentId: 113, image: '/dist/images/cat/sd-sim-trays.webp' },
  { id: 167, name: 'Πλακέτες Πληκτρολογίου, Πληκτρολόγια', slug: 'keyboard-boards-keyboards', parentId: 113, image: '/dist/images/cat/keyboard-boards-keyboards.webp' },
  { id: 168, name: 'Διάφορα Ανταλλακτικά Κινητών', slug: 'various-mobile-parts', parentId: 113, image: '/dist/images/cat/various-mobile-parts.webp' },

  // Subcategories of Υπολογιστές of Main Category Τεχνολογία
  { id: 169, name: 'Περιφερειακά, Αναλώσιμα', slug: 'accessories-supplies', parentId: 11, image: '/dist/images/cat/accessories-supplies.webp' },
  { id: 170, name: 'Hardware', slug: 'hardware', parentId: 11, image: '/dist/images/cat/hardware.webp' },
  { id: 171, name: 'Δικτυακά', slug: 'networking', parentId: 11, image: '/dist/images/cat/networking.webp' },
  { id: 172, name: 'Desktops & Servers', slug: 'desktops-servers', parentId: 11, image: '/dist/images/cat/desktops-servers.webp' },
  { id: 173, name: 'Οθόνες PC, Αξεσουάρ', slug: 'monitors-accessories', parentId: 11, image: '/dist/images/cat/monitors-accessories.webp' },
  { id: 174, name: 'Software', slug: 'software', parentId: 11, image: '/dist/images/cat/software.webp' },
  { id: 175, name: 'Επεκτάσεις Εγγύησης', slug: 'warranty-extensions', parentId: 11, image: '/dist/images/cat/warranty-extensions.webp' },

  // Subcategories of Περιφερειακά, Αναλώσιμα of a Subcategory Υπολογιστές of Main Category Τεχνολογία
  { id: 176, name: 'Εκτυπωτές & Αξεσουάρ', slug: 'printers-accessories', parentId: 169, image: '/dist/images/cat/printers-accessories.webp' },
  { id: 177, name: 'Συσκευές Εισόδου', slug: 'input-devices', parentId: 169, image: '/dist/images/cat/input-devices.webp' },
  { id: 178, name: 'Multimedia', slug: 'multimedia', parentId: 169, image: '/dist/images/cat/multimedia.webp' },
  { id: 179, name: 'Scanner & Αξεσουάρ', slug: 'scanners-accessories', parentId: 169, image: '/dist/images/cat/scanner-accessories.webp' },
  { id: 180, name: 'USB Sticks', slug: 'usb-sticks', parentId: 169, image: '/dist/images/cat/usb-sticks.webp' },
  { id: 181, name: 'USB Hubs', slug: 'usb-hubs', parentId: 169, image: '/dist/images/cat/usb-hubs.webp' },
  { id: 182, name: 'UPS, Αξεσουάρ', slug: 'ups-accessories', parentId: 169, image: '/dist/images/cat/ups-accessories.webp' },
  { id: 183, name: 'Καλώδια, Adaptors', slug: 'cables-adaptors', parentId: 169, image: '/dist/images/cat/cables-adaptors.webp' },
  { id: 184, name: 'Καλώδια Τροφοδοσίας', slug: 'power-cables', parentId: 169, image: '/dist/images/cat/power-cables.webp' },
  { id: 185, name: 'Καλώδια USB', slug: 'usb-cables', parentId: 169, image: '/dist/images/cat/usb-cables.webp' },

  // Subcategories of Hardware of a Subcategory Υπολογιστές of Main Category Τεχνολογία
  { id: 186, name: 'Κάρτες Γραφικών', slug: 'graphics-cards', parentId: 170, image: '/dist/images/cat/graphics-cards.webp' },
  { id: 187, name: 'Μητρικές Κάρτες', slug: 'motherboards', parentId: 170, image: '/dist/images/cat/motherboards.webp' },
  { id: 188, name: 'CPU', slug: 'cpu', parentId: 170, image: '/dist/images/cat/cpu.webp' },
  { id: 189, name: 'Σκληροί Δίσκοι', slug: 'hard-disks', parentId: 170, image: '/dist/images/cat/hard-disks.webp' },
  { id: 190, name: 'RAM', slug: 'ram', parentId: 170, image: '/dist/images/cat/ram.webp' },
  { id: 191, name: 'Κουτιά Υπολογιστών', slug: 'computer-cases', parentId: 170, image: '/dist/images/cat/computer-cases.webp' },
  { id: 192, name: 'Τροφοδοτικά Υπολογιστών', slug: 'power-supplies', parentId: 170, image: '/dist/images/cat/power-supplies.webp' },
  { id: 193, name: 'Cooling PC', slug: 'cooling-pc', parentId: 170, image: '/dist/images/cat/cooling-pc.webp' },
  { id: 194, name: 'Optical Drives', slug: 'optical-drives', parentId: 170, image: '/dist/images/cat/optical-drives.webp' },
  { id: 195, name: 'Tuning Parts', slug: 'tuning-parts', parentId: 170, image: '/dist/images/cat/tuning-parts.webp' },
  { id: 196, name: 'Κάρτες Τηλεόρασης, Video', slug: 'tv-cards', parentId: 170, image: '/dist/images/cat/tv-cards.webp' },

  // Subcategories of Δικτυακά of a Subcategory Υπολογιστές of Main Category Τεχνολογία
  { id: 197, name: 'WiFi Extenders', slug: 'wifi-extenders', parentId: 171, image: '/dist/images/cat/wifi-extenders.webp' },
  { id: 198, name: 'Routers', slug: 'routers', parentId: 171, image: '/dist/images/cat/routers.webp' },
  { id: 199, name: 'Access Points', slug: 'access-points', parentId: 171, image: '/dist/images/cat/access-points.webp' },
  { id: 200, name: 'USB Adapters Δικτύου', slug: 'usb-network-adapters', parentId: 171, image: '/dist/images/cat/usb-network-adapters.webp' },
  { id: 201, name: 'Powerline', slug: 'powerline', parentId: 171, image: '/dist/images/cat/powerline.webp' },
  { id: 202, name: 'Καλώδια Δικτύου', slug: 'network-cables', parentId: 171, image: '/dist/images/cat/network-cables.webp' },
  { id: 203, name: 'Κάρτες Δικτύου', slug: 'network-cards', parentId: 171, image: '/dist/images/cat/network-cards.webp' },
  { id: 204, name: 'Κεραίες WiFi', slug: 'wifi-antennas', parentId: 171, image: '/dist/images/cat/wifi-antennas.webp' },
  { id: 205, name: 'Bluetooth Adapter', slug: 'bluetooth-adapter', parentId: 171, image: '/dist/images/cat/bluetooth-adapter.webp' },

  // Subcategories of Desktops & Servers of a Subcategory Υπολογιστές of Main Category Τεχνολογία
  { id: 206, name: 'Desktop PC', slug: 'desktop-pc', parentId: 172, image: '/dist/images/cat/desktop-pc.webp' },
  { id: 207, name: 'All in One PC', slug: 'all-in-one-pc', parentId: 172, image: '/dist/images/cat/all-in-one-pc.webp' },
  { id: 208, name: 'Mini PC', slug: 'mini-pc', parentId: 172, image: '/dist/images/cat/mini-pc.webp' },
  { id: 209, name: 'Servers', slug: 'servers', parentId: 172, image: '/dist/images/cat/servers.webp' },
  { id: 210, name: 'Αξεσουάρ Server', slug: 'server-accessories', parentId: 172, image: '/dist/images/cat/server-accessories.webp' },
  { id: 211, name: 'Βάσεις Desktop', slug: 'desktop-stands', parentId: 172, image: '/dist/images/cat/desktop-stands.webp' },
  { id: 212, name: 'Barebones', slug: 'barebones', parentId: 172, image: '/dist/images/cat/barebones.webp' },

  // Subcategories of Οθόνες PC, Αξεσουάρ of a Subcategory Υπολογιστές of Main Category Τεχνολογία
  { id: 213, name: 'Οθόνες Υπολογιστών', slug: 'computer-monitors', parentId: 173, image: '/dist/images/cat/computer-monitors.webp' },
  { id: 214, name: 'Αξεσουάρ Οθονών', slug: 'monitor-accessories', parentId: 173, image: '/dist/images/cat/monitor-accessories.webp' },
  { id: 215, name: 'Public Displays', slug: 'public-displays', parentId: 173, image: '/dist/images/cat/public-displays.webp' },

  // Subcategories of Software of a Subcategory Υπολογιστές of Main Category Τεχνολογία
  { id: 216, name: 'Antivirus, Security', slug: 'antivirus-security', parentId: 174, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2639_SX400Y400/1500371799/antivirus-security.webp' },
  { id: 217, name: 'Εφαρμογές Γραφείου', slug: 'office-applications', parentId: 174, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2642_SX400Y400/1500371799/office-software.webp' },
  { id: 218, name: 'Λειτουργικά Συστήματα', slug: 'operating-systems', parentId: 174, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2638_SX400Y400/1500371799/leitoyrgika-systhmata.webp' },
  { id: 219, name: 'Εφαρμογές Software', slug: 'software-applications', parentId: 174, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2645_SX400Y400/1500371799/software-center.webp' },
  { id: 220, name: 'Επεξεργασία Εικόνας - Ήχου', slug: 'image-sound-editing', parentId: 174, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2643_SX400Y400/1500371799/multimedia-software.webp' },
  { id: 221, name: 'Εμπορική Διαχείριση', slug: 'commercial-management', parentId: 174, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3412_SX400Y400/1500371799/software-emporikis-diaxeirisis.webp' },

  // Subcategories of Laptops, Αξεσουάρ of Main Category Τεχνολογία
  { id: 222, name: 'Laptops', slug: 'laptops', parentId: 12, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2591_SX400Y400/1629455496/laptops.webp' },
  { id: 223, name: 'MacBook', slug: 'macbook', parentId: 12, image: 'https://bbpcdn.pstatic.gr/bpimg25/2mcWYF/1TPQrK_SX400Y400/1741187648/apple-macbook-air-13-2025.webp' },
  { id: 224, name: 'Τσάντες Laptop', slug: 'laptop-bags', parentId: 12, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2600_SX400Y400/1629455497/tsantes-laptop.webp' },
  { id: 225, name: 'Καλύμματα Laptop', slug: 'laptop-skins', parentId: 12, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8500_SX400Y400/1645720206/kalymmata-laptop.webp' },
  { id: 226, name: 'Φορτιστές Laptop', slug: 'laptop-chargers', parentId: 12, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2597_SX400Y400/1629455497/fortistes-laptop.webp' },
  { id: 227, name: 'Μπαταρίες Laptop', slug: 'laptop-batteries', parentId: 12, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2596_SX400Y400/1629455497/mpataries-laptop.webp' },
  { id: 228, name: 'Βάσεις Laptop', slug: 'laptop-stands', parentId: 12, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2599_SX400Y400/1629455497/vaseis-cooler-laptop.webp' },
  { id: 229, name: 'Docking Stations Laptop', slug: 'laptop-docking-stations', parentId: 12, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8074_SX400Y400/1629455538/docking-stations-laptop.webp' },
  { id: 230, name: 'Αυτοκόλλητα Laptop', slug: 'laptop-stickers', parentId: 12, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2601_SX400Y400/1629455497/skin-laptop.webp' },
  { id: 231, name: 'Ανταλλακτικά Laptop', slug: 'laptop-parts', parentId: 12, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3548_SX400Y400/1741768397/antallaktika-laptop.webp' },
  { id: 232, name: 'Κάρτες PCMCIA', slug: 'pcmcia-cards', parentId: 12, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3482_SX400Y400/1629455502/pcmcia-cards.webp' },
  { id: 233, name: 'Διάφορα Είδη Laptop', slug: 'misc-laptop-items', parentId: 12, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2604_SX400Y400/1629455497/diafora-laptop.webp' },

  // Subcategories of Ανταλλακτικά Laptop of a Subcategory Laptops, Αξεσουάρ of Main Category Τεχνολογία
  { id: 230, name: 'Οθόνες Laptop', slug: 'laptop-screens', parentId: 231, image: 'https://abpcdn.pstatic.gr/P/bpimg128/9052_SX400Y400/1741768318/othones-laptop.webp' },
  { id: 231, name: 'Πληκτρολόγια Laptop', slug: 'laptop-keyboards', parentId: 231, image: 'https://abpcdn.pstatic.gr/P/bpimg128/9053_SX400Y400/1741706878/pliktrologia-laptop.webp' },
  { id: 232, name: 'Καλωδιοταινίες Laptop', slug: 'laptop-cables', parentId: 231, image: 'https://abpcdn.pstatic.gr/P/bpimg128/9054_SX400Y400/1741706916/kalodiotainies-laptop.webp' },
  { id: 233, name: 'Ανεμιστηράκια Laptop', slug: 'laptop-fans', parentId: 231, image: 'https://abpcdn.pstatic.gr/P/bpimg128/9055_SX400Y400/1741706848/anemistirakia-laptop.webp' },
  { id: 234, name: 'Βύσματα Τροφοδοσίας Laptop', slug: 'laptop-power-connectors', parentId: 231, image: 'https://abpcdn.pstatic.gr/P/bpimg128/9056_SX400Y400/1741706826/vusmata-trofodosias-laptop.webp' },
  { id: 235, name: 'Πλαίσια Laptop', slug: 'laptop-frames', parentId: 231, image: 'https://abpcdn.pstatic.gr/P/bpimg128/9057_SX400Y400/1741768278/plaisia-laptop.webp' },
  { id: 236, name: 'Μεντεσέδες Laptop', slug: 'laptop-hinges', parentId: 231, image: 'https://abpcdn.pstatic.gr/P/bpimg128/9058_SX400Y400/1741706864/mentesedes-laptop.webp' },
  { id: 237, name: 'LCD Inverters Laptop', slug: 'laptop-lcd-inverters', parentId: 231, image: 'https://abpcdn.pstatic.gr/P/bpimg128/9059_SX400Y400/1741707023/lcd-inverters-laptop.webp' },
  { id: 238, name: 'Διάφορα Ανταλλακτικά Laptop', slug: 'misc-laptop-parts', parentId: 231, image: 'https://abpcdn.pstatic.gr/P/bpimg128/9060_SX400Y400/1741768360/diafora-antallaktika-laptop.webp' },

  // Subcategories of Εικόνα of Main Category Τεχνολογία
  { id: 239, name: 'Τηλεοράσεις, Αξεσουάρ', slug: 'televisions-accessories', parentId: 13, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2999_SX400Y400/1629455498/tv.webp' },
  { id: 240, name: 'Καλώδια HDMI', slug: 'hdmi-cables', parentId: 13, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8570_SX400Y400/1658920132/kalodia-hdmi.webp' },
  { id: 241, name: 'Δορυφορική, Cable & DVB-T', slug: 'satellite-cable-dvb-t', parentId: 13, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3266_SX400Y400/1629455500/dvb.webp' },
  { id: 242, name: 'Projectors, Αξεσουάρ', slug: 'projectors-accessories', parentId: 13, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3470_SX400Y400/1629455502/projectors-aksesouar.webp' },
  { id: 243, name: 'TV Box', slug: 'tv-boxes', parentId: 13, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3043_SX400Y400/1472046462/tv-box.webp' },
  { id: 244, name: 'Smart TV Stick', slug: 'smart-tv-sticks', parentId: 13, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8257_SX400Y400/1629455540/smart-tv-stick.webp' },
  { id: 245, name: 'Φορητές Τηλεοράσεις', slug: 'portable-tvs', parentId: 13, image: 'https://abpcdn.pstatic.gr/P/bpimg128/7033_SX400Y400/1476269663/forhtes-thleoraseis.webp' },
  { id: 246, name: 'Φορητά DVD Player', slug: 'portable-dvd-players', parentId: 13, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3489_SX400Y400/1472545123/portable-dvd.webp' },
  { id: 247, name: 'DVD, Blu-Ray Players & Recorders', slug: 'dvd-blu-ray-players-recorders', parentId: 13, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3439_SX400Y400/1472046462/dvd-blu-ray-players-recorders.webp' },
  { id: 248, name: 'Καλώδια DisplayPort', slug: 'displayport-cables', parentId: 13, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8825_SX400Y400/1694781436/kalodia-displayport.webp' },

  // Subcategories of Τηλεοράσεις, Αξεσουάρ of a Subcategory Εικόνα of Main Category Τεχνολογία
  { id: 249, name: 'Τηλεοράσεις', slug: 'televisions', parentId: 239, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3048_SX400Y400/1629455499/thleoraseis.webp' },
  { id: 250, name: 'Βάσεις Τηλεοράσεων', slug: 'tv-stands', parentId: 239, image: 'https://abpcdn.pstatic.gr/P/bpimg128/732_SX400Y400/1472030248/vaseis-tileoraseon.webp' },
  { id: 251, name: 'Τηλεχειριστήρια Τηλεόρασης', slug: 'tv-remote-controls', parentId: 239, image: 'https://abpcdn.pstatic.gr/P/bpimg128/733_SX400Y400/1475743187/tilexeiristiria-tileorasis.webp' },
  { id: 252, name: 'Καλώδια Κεραίας', slug: 'aerial-cables', parentId: 239, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8607_SX400Y400/1675953190/kalodia-keraias.webp' },
  { id: 253, name: 'Καλώδια, Αντάπτορες', slug: 'cables-adapters', parentId: 239, image: 'https://abpcdn.pstatic.gr/P/bpimg128/734_SX400Y400/1472030248/cables.webp' },
  { id: 254, name: 'Γυαλιά 3D', slug: '3d-glasses', parentId: 239, image: 'https://abpcdn.pstatic.gr/P/bpimg128/5755_SX400Y400/1472030248/3d-glasses.webp' },
  { id: 255, name: 'Διάφορα Είδη Τηλεοράσεως', slug: 'various-tv-items', parentId: 239, image: 'https://abpcdn.pstatic.gr/P/bpimg128/735_SX400Y400/1472030248/diafora-eidh-tv.webp' },
  { id: 243, name: 'TV Box', slug: 'tv-boxes', parentId: 239, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3043_SX400Y400/1472046462/tv-box.webp' },
  { id: 244, name: 'Smart TV Stick', slug: 'smart-tv-sticks', parentId: 239, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8257_SX400Y400/1629455540/smart-tv-stick.webp' },

  // Subcategories of Δορυφορική, Cable & DVB-T of a Subcategory Εικόνα of Main Category Τεχνολογία
  { id: 256, name: 'Ψηφιακοί Δέκτες Mpeg-4', slug: 'digital-receivers-mpeg4', parentId: 241, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3267_SX400Y400/1476270386/psifiakoi-dektes-mpeg4.webp' },
  { id: 257, name: 'Δορυφορικοί Αποκωδικοποιητές', slug: 'satellite-decoders', parentId: 241, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8949_SX400Y400/1722611560/doriforikoi-apokodikopoiites.webp' },
  { id: 258, name: 'Επίγειες Κεραίες', slug: 'terrestrial-antennas', parentId: 241, image: 'https://abpcdn.pstatic.gr/P/bpimg128/731_SX400Y400/1476270386/epigeies-keraies.webp' },
  { id: 259, name: 'Ενισχυτές Κεραιών Τηλεοράσεων', slug: 'tv-antenna-amplifiers', parentId: 241, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6361_SX400Y400/1476270386/enisxytes-keraiwn-thleorasewn.webp' },
  { id: 260, name: 'Δορυφορικά Πιάτα, Αξεσουάρ', slug: 'satellite-dishes-accessories', parentId: 241, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3268_SX400Y400/1476270386/doryforika-piata.webp' },
  { id: 261, name: 'LNBs', slug: 'lnbs', parentId: 241, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3274_SX400Y400/1476270386/lnbs.webp' },
  { id: 262, name: 'Καλώδια, Βύσματα', slug: 'cables-connectors', parentId: 241, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3273_SX400Y400/1476270386/cables.webp' },
  { id: 263, name: 'Diseqc', slug: 'diseqc', parentId: 241, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3275_SX400Y400/1476270386/diseqc.webp' },
  { id: 264, name: 'Μίκτες, Πολυδιακόπτες, Διακλαδωτές', slug: 'mixers-multiswitches-splitters', parentId: 241, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3277_SX400Y400/1476270386/miktes-polydiakoptes-diakladotes.webp' },
  { id: 265, name: 'Αξεσουάρ Συστημάτων Λήψης', slug: 'reception-system-accessories', parentId: 241, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3279_SX400Y400/1476270387/aksesouar-systhmatwn-lipsis.webp' },

  // Subcategories of Smartwatches, Wearables of Main Category Τεχνολογία
  { id: 266, name: 'Smartwatches', slug: 'smartwatches', parentId: 14, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6280_SX400Y400/1629455522/smartwatches.webp' },
  { id: 267, name: 'Λουράκια Smartwatch', slug: 'smartwatch-straps', parentId: 14, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8542_SX400Y400/1651758591/loyrakia-smartwatch.webp' },
  { id: 268, name: 'Φορτιστές Smartwatch', slug: 'smartwatch-chargers', parentId: 14, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8544_SX400Y400/1651758568/fortistes-smartwatch.webp' },
  { id: 269, name: 'Προστασία Οθόνης Smartwatch', slug: 'smartwatch-screen-protection', parentId: 14, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8545_SX400Y400/1652786347/prostasia-othonis-smartwatch.webp' },
  { id: 270, name: 'Θήκες Smartwatch', slug: 'smartwatch-cases', parentId: 14, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8546_SX400Y400/1652789665/thikes-smartwatch.webp' },
  { id: 271, name: 'Ζώνες Καρδιακών Παλμών', slug: 'heart-rate-straps', parentId: 14, image: 'https://abpcdn.pstatic.gr/P/bpimg128/7168_SX400Y400/1505746144/zones-kardiakon-palmon.webp' },
  { id: 272, name: 'Αξεσουάρ Wearables', slug: 'wearables-accessories', parentId: 14, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6470_SX400Y400/1629455523/aksesouar-wearables.webp' },

  // Subcategories of Tablets, Αξεσουάρ of Main Category Τεχνολογία
  { id: 273, name: 'Tablets', slug: 'tablets', parentId: 15, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3446_SX400Y400/1629455501/tablets.webp' },
  { id: 274, name: 'iPad', slug: 'ipad', parentId: 15, image: 'https://bbpcdn.pstatic.gr/bpimg11/2mcVPd/1TPIUd_SX400Y400/1741158661/apple-ipad-11-2025-wifi-128gb.webp' },
  { id: 275, name: 'Θήκες Tablet', slug: 'tablet-cases', parentId: 15, image: 'https://abpcdn.pstatic.gr/P/bpimg128/5943_SX400Y400/1629455518/thikes-tablet.webp' },
  { id: 276, name: 'Βάσεις Tablet', slug: 'tablet-stands', parentId: 15, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6246_SX400Y400/1629455521/vaseis-tablet.webp' },
  { id: 277, name: 'Προστασία Οθόνης Tablet', slug: 'tablet-screen-protection', parentId: 15, image: 'https://abpcdn.pstatic.gr/P/bpimg128/5951_SX400Y400/1629455518/screen-protectors-tablets.webp' },
  { id: 278, name: 'E-Book Readers', slug: 'e-book-readers', parentId: 15, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3203_SX400Y400/1629455500/ebook-readers.webp' },
  { id: 279, name: 'Ανταλλακτικά Tablet', slug: 'tablet-accessories', parentId: 15, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6332_SX400Y400/1629455522/antallaktika-tablet.webp' },
  { id: 280, name: 'Διάφορα Αξεσουάρ Tablet', slug: 'various-tablet-accessories', parentId: 15, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6333_SX400Y400/1629455522/aksesouar-tablet.webp' },
  { id: 118, name: 'Γραφίδες Αφής', slug: 'touch-pens', parentId: 15, image: 'https://abpcdn.pstatic.gr/P/bpimg128/815_SX400Y400/1629455539/grafides-afis.webp' },

  // Subcategories of Video Games of Main Category Τεχνολογία
  { id: 281, name: 'Κονσόλες', slug: 'consoles', parentId: 16, image: 'https://abpcdn.pstatic.gr/P/bpimg128/876_SX400Y400/1472718489/video-game-consoles.webp' },
  { id: 282, name: 'Ηλεκτρονικά Παιχνίδια', slug: 'electronic-games', parentId: 16, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6488_SX400Y400/1472718489/ilektronika-paixnidia.webp' },
  { id: 283, name: 'Gaming Controllers', slug: 'gaming-controllers', parentId: 16, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3440_SX400Y400/1472718489/xeiristiria-gamepads.webp' },
  { id: 284, name: 'Τιμονιέρες', slug: 'steering-wheels', parentId: 16, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8247_SX400Y400/1629455540/timonieres.webp' },
  { id: 285, name: 'Joysticks', slug: 'joysticks', parentId: 16, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8248_SX400Y400/1629455540/joysticks.webp' },
  { id: 286, name: 'Διάφορα Gaming', slug: 'various-gaming', parentId: 16, image: 'https://abpcdn.pstatic.gr/P/bpimg128/5940_SX400Y400/1472718489/diafora-gaming.webp' },
  { id: 287, name: 'Ανταλλακτικά Κονσολών', slug: 'console-parts', parentId: 16, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6360_SX400Y400/1472718489/antallaktika-konsolwn.webp' },
  { id: 288, name: 'VR Headsets', slug: 'vr-headsets', parentId: 16, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6665_SX400Y400/1629455525/vr-headsets.webp' },
  { id: 289, name: 'Φιγούρες Χαρακτήρων', slug: 'character-figures', parentId: 16, image: 'https://abpcdn.pstatic.gr/P/bpimg128/7068_SX400Y400/1484062068/character-figures.webp' },
  { id: 290, name: 'Game TimeCards', slug: 'game-timecards', parentId: 16, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3558_SX400Y400/1472718489/timecards.webp' },
  { id: 291, name: 'Gaming Headsets', slug: 'gaming-headsets', parentId: 16, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8066_SX400Y400/1629455538/gaming-headsets.webp' },
  { id: 292, name: 'Καρέκλες Gaming', slug: 'gaming-chairs', parentId: 16, image: 'https://abpcdn.pstatic.gr/P/bpimg128/7869_SX400Y400/1629455537/karekles-gaming.webp' },
  { id: 189, name: 'Κάρτες Γραφικών', slug: 'graphics-cards', parentId: 16, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2613_SX400Y400/1629455497/kartes-grafikwn.webp' },
  { id: 293, name: 'Gaming Ποντίκια', slug: 'gaming-mice', parentId: 16, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8493_SX400Y400/1640098609/gaming-pontikia.webp' },
  { id: 294, name: 'Gaming Πληκτρολόγια', slug: 'gaming-keyboards', parentId: 16, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8501_SX400Y400/1646043267/gaming-pliktrologia.webp' },

  // Subcategories of Ηλεκτρονικά Παιχνίδια of a Subcategory Video Games of Main Category Τεχνολογία
  { id: 295, name: 'PS5 Games', slug: 'ps5-games', parentId: 282, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8273_SX400Y400/1629455541/ps5-games.webp' },
  { id: 296, name: 'PS4 Games', slug: 'ps4-games', parentId: 282, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6041_SX400Y400/1629455519/playstation-4-games.webp' },
  { id: 297, name: 'Xbox Series Games', slug: 'xbox-series-games', parentId: 282, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8274_SX400Y400/1629455541/xbox-series-games.webp' },
  { id: 298, name: 'PC Games', slug: 'pc-games', parentId: 282, image: 'https://abpcdn.pstatic.gr/P/bpimg128/889_SX400Y400/1629455541/pc-games.webp' },
  { id: 299, name: 'Xbox One Games', slug: 'xbox-one-games', parentId: 282, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6143_SX400Y400/1629455520/xbox-one-games.webp' },
  { id: 300, name: 'Nintendo Switch Games', slug: 'nintendo-switch-games', parentId: 282, image: 'https://abpcdn.pstatic.gr/P/bpimg128/7070_SX400Y400/1484917102/nintendo-switch-games.webp' },
  { id: 301, name: 'PS3 Games', slug: 'ps3-games', parentId: 282, image: 'https://abpcdn.pstatic.gr/P/bpimg128/891_SX400Y400/1629455542/playstation-3-games.webp' },
  { id: 302, name: 'Playstation 2 Games', slug: 'playstation-2-games', parentId: 282, image: 'https://abpcdn.pstatic.gr/P/bpimg128/890_SX400Y400/1629455541/playstation-2-games.webp' },
  { id: 303, name: 'Μεταχειρισμένα Παιχνίδια', slug: 'used-games', parentId: 282, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6471_SX400Y400/1629455523/metaxeirismena-paixnidia.webp' },
  { id: 304, name: 'Xbox 360 Games', slug: 'xbox-360-games', parentId: 282, image: 'https://abpcdn.pstatic.gr/P/bpimg128/886_SX400Y400/1629455541/xbox-360-games.webp' },
  { id: 305, name: 'Nintendo Wii Games', slug: 'nintendo-wii-games', parentId: 282, image: 'https://abpcdn.pstatic.gr/P/bpimg128/888_SX400Y400/1629455541/nintendo-wii-games.webp' },
  { id: 306, name: 'Nintendo Wii U Games', slug: 'nintendo-wii-u-games', parentId: 282, image: 'https://abpcdn.pstatic.gr/P/bpimg128/5942_SX400Y400/1629455518/nintendo-wii-u-games.webp' },
  { id: 307, name: 'Nintendo 3DS Games', slug: 'nintendo-3ds-games', parentId: 282, image: 'https://abpcdn.pstatic.gr/P/bpimg128/5501_SX400Y400/1629455514/3ds-games.webp' },
  { id: 308, name: 'Nintendo DS Series Games', slug: 'nintendo-ds-series-games', parentId: 282, image: 'https://abpcdn.pstatic.gr/P/bpimg128/887_SX400Y400/1629455541/nintendo-ds-series-games.webp' },
  { id: 309, name: 'PSP Games', slug: 'psp-games', parentId: 282, image: 'https://abpcdn.pstatic.gr/P/bpimg128/892_SX400Y400/1629455541/psp-games.webp' },
  { id: 310, name: 'PS Vita Games', slug: 'ps-vita-games', parentId: 282, image: 'https://abpcdn.pstatic.gr/P/bpimg128/5871_SX400Y400/1629455516/ps-vita-games.webp' },
  { id: 311, name: 'GameCube Games', slug: 'gamecube-games', parentId: 282, image: 'https://abpcdn.pstatic.gr/P/bpimg128/896_SX400Y400/1629455541/gamecube-games.webp' },
  { id: 312, name: 'GameBoy Games', slug: 'gameboy-games', parentId: 282, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2996_SX400Y400/1629455498/gameboy-games.webp' },
  { id: 313, name: 'Συλλεκτικά Video Games', slug: 'collectible-video-games', parentId: 282, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2998_SX400Y400/1629455498/syllektika-video-games.webp' },

  // Subcategories of Ήχος of Main Category Τεχνολογία
  { id: 314, name: 'Home Audio', slug: 'home-audio', parentId: 17, image: 'https://abpcdn.pstatic.gr/P/bpimg128/704_SX400Y400/1629455531/home-audio.webp' },
  { id: 315, name: 'Επαγγελματικός Ήχος', slug: 'professional-sound', parentId: 17, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3280_SX400Y400/1629455501/dj.webp' },
  { id: 316, name: 'Ακουστικά, Αξεσουάρ', slug: 'headphones-accessories', parentId: 17, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2557_SX400Y400/1629455496/akoustika-aksesouar.webp' },
  { id: 317, name: 'Karaoke', slug: 'karaoke', parentId: 17, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3304_SX400Y400/1476430484/karaoke.webp' },
  { id: 318, name: 'Συσκευές Πικάπ, Αξεσουάρ', slug: 'turntables-accessories', parentId: 17, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3289_SX400Y400/1476430484/pickup-aksesouar.webp' },
  { id: 319, name: 'Home Cinema', slug: 'home-cinema', parentId: 17, image: 'https://abpcdn.pstatic.gr/P/bpimg128/692_SX400Y400/1629455530/home-cinema.webp' },
  { id: 320, name: 'Φορητές Συσκευές', slug: 'portable-devices', parentId: 17, image: 'https://abpcdn.pstatic.gr/P/bpimg128/719_SX400Y400/1629455532/portable.webp' },
  { id: 321, name: 'MP3, MP4 Players & Αξεσουάρ', slug: 'mp3-mp4-players-accessories', parentId: 17, image: 'https://abpcdn.pstatic.gr/P/bpimg128/713_SX400Y400/1629455531/mp3-players.webp' },
  { id: 322, name: 'Ηχεία Εγκαταστάσεων', slug: 'installation-speakers', parentId: 17, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8569_SX400Y400/1663747970/ixeia-egkatastaseon.webp' },
  { id: 323, name: 'Αυτοενισχυόμενα Ηχεία', slug: 'powered-speakers', parentId: 17, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8576_SX400Y400/1663748150/aytoenisxyomena-ixeia.webp' },

  // Subcategories of Home Audio of a Subcategory Ήχος of Main Category Τεχνολογία
  { id: 324, name: 'Ενισχυτές, Προενισχυτές', slug: 'amplifiers-preamplifiers', parentId: 314, image: 'https://abpcdn.pstatic.gr/P/bpimg128/705_SX400Y400/1472048939/enisxites-hxou.webp' },
  { id: 325, name: 'Συστήματα Hi-Fi', slug: 'hi-fi-systems', parentId: 314, image: 'https://abpcdn.pstatic.gr/P/bpimg128/709_SX400Y400/1472048939/hifi-systems.webp' },
  { id: 326, name: 'Φορητά Ηχεία Bluetooth', slug: 'portable-bluetooth-speakers', parentId: 314, image: 'https://abpcdn.pstatic.gr/P/bpimg128/820_SX400Y400/1629455540/forita-hxeia.webp' },
  { id: 327, name: 'Ηχεία Hi-Fi', slug: 'hi-fi-speakers', parentId: 314, image: 'https://abpcdn.pstatic.gr/P/bpimg128/708_SX400Y400/1472048939/speakers.webp' },
  { id: 328, name: 'Subwoofer', slug: 'subwoofer', parentId: 314, image: 'https://abpcdn.pstatic.gr/P/bpimg128/5868_SX400Y400/1472048939/subwoofer.webp' },
  { id: 329, name: 'Ραδιόφωνα, Δέκτες', slug: 'radios-receivers', parentId: 314, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3344_SX400Y400/1472048939/radio.webp' },
  { id: 330, name: 'CD Players, Recorders', slug: 'cd-players-recorders', parentId: 314, image: 'https://abpcdn.pstatic.gr/P/bpimg128/707_SX400Y400/1472048939/cd-players-recorders.webp' },
  { id: 331, name: 'Παρελκόμενα Hi-Fi', slug: 'hi-fi-accessories', parentId: 314, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6321_SX400Y400/1472048939/hifi-accessories.webp' },
  { id: 332, name: 'Docking Stations', slug: 'docking-stations', parentId: 314, image: 'https://abpcdn.pstatic.gr/P/bpimg128/5802_SX400Y400/1472048939/docking-stations.webp' },
  { id: 333, name: 'Soundbar', slug: 'soundbar', parentId: 314, image: 'https://abpcdn.pstatic.gr/P/bpimg128/5876_SX400Y400/1472046463/soundbar.webp' },
  { id: 334, name: 'Ηχεία Υπολογιστή', slug: 'computer-speakers', parentId: 314, image: 'https://abpcdn.pstatic.gr/P/bpimg128/2559_SX400Y400/1629455496/ixeia-ypologisti.webp' },

  // Subcategories of Επαγγελματικός Ήχος of a Subcategory Ήχος of Main Category Τεχνολογία
  { id: 335, name: 'Ηχεία PA', slug: 'pa-speakers', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/5872_SX400Y400/1476430484/ixeia-pa.webp' },
  { id: 336, name: 'Επαγγελματικά Μικρόφωνα, Αξεσουάρ', slug: 'professional-microphones-accessories', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3305_SX400Y400/1476430483/epaggelmatika-mirkofona-aksesouar.webp' },
  { id: 337, name: 'Επαγγελματικός Φωτισμός', slug: 'professional-lighting', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3331_SX400Y400/1476430484/epaggelmatikos-fotismos.webp' },
  { id: 338, name: 'Ανταλλακτικά Ηχείων', slug: 'speaker-parts', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6212_SX400Y400/1476430484/speaker-parts.webp' },
  { id: 339, name: 'Εξοπλισμός DJ & Αξεσουάρ', slug: 'dj-equipment-accessories', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3296_SX400Y400/1476430483/players.webp' },
  { id: 340, name: 'Κονσόλες, Μίκτες Ήχου', slug: 'consoles-mixers', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3353_SX400Y400/1476430484/kosnoles-miktes-ixou.webp' },
  { id: 341, name: 'Επαγγελματικές Κάρτες Ήχου', slug: 'professional-sound-cards', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6552_SX400Y400/1476430484/epaggelmatikes-kartes-hxou.webp' },
  { id: 342, name: 'Ηχομονωτικά', slug: 'soundproofing', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6249_SX400Y400/1476430484/soundproof.webp' },
  { id: 343, name: 'Μηχανήματα Καπνού & Ατμόσφαιρας', slug: 'fog-machines-atmosphere', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3306_SX400Y400/1476430484/effects.webp' },
  { id: 344, name: 'Τσάντες, Θήκες', slug: 'bags-cases', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3320_SX400Y400/1476430484/bags.webp' },
  { id: 345, name: 'Βάσεις Ηχείων', slug: 'speaker-stands', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3301_SX400Y400/1685011443/vaseis-ixeion.webp' },
  { id: 346, name: 'Επαγγελματικοί Ενισχυτές, Προενισχυτές', slug: 'professional-amplifiers-preamplifiers', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3281_SX400Y400/1476430484/epaggelmatikoi-enisxites.webp' },
  { id: 347, name: 'Ψηφιακοί Επεξεργαστές, Equalizers', slug: 'digital-processors-equalizers', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/5991_SX400Y400/1476430484/pshfiakoi-epeksergastes-equalizers.webp' },
  { id: 348, name: 'Ψηφιακά Συστήματα Εγγραφής', slug: 'digital-recording-systems', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3383_SX400Y400/1476430484/digital-recording-systems.webp' },
  { id: 349, name: 'Monitor Controllers', slug: 'monitor-controllers', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6211_SX400Y400/1476430484/monitor-controllers.webp' },
  { id: 350, name: 'Συνεδριακά Συστήματα', slug: 'conference-systems', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3382_SX400Y400/1476430484/conference.webp' },
  { id: 351, name: 'Bundles', slug: 'bundles', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/5870_SX400Y400/1476430484/bundles.webp' },
  { id: 352, name: 'Τηλεβόες, Κόρνες', slug: 'megaphones-horns', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3552_SX400Y400/1476430484/tilevoes.webp' },
  { id: 353, name: 'Καλώδια Ήχου', slug: 'audio-cables', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/9040_SX400Y400/1741250527/kalodia-ixoy.webp' },
  { id: 354, name: 'Βύσματα Ήχου', slug: 'audio-connectors', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/9041_SX400Y400/1741250554/vusmata-ixou.webp' },
  { id: 355, name: 'Αντάπτορες, Προεκτάσεις Ήχου', slug: 'audio-adapters-extensions', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/9042_SX400Y400/1741250574/antaptores-proektaseis-ixou.webp' },
  { id: 356, name: 'Διάφορα Επαγγελματικού Ήχου', slug: 'various-professional-sound', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/5556_SX400Y400/1476430484/various-sound-systems.webp' },
  { id: 322, name: 'Ηχεία Εγκαταστάσεων', slug: 'installation-speakers', parentId: 315, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8569_SX400Y400/1663747970/ixeia-egkatastaseon.webp' },

  // Subcategories of Επαγγελματικά Μικρόφωνα, Αξεσουάρ of a Subcategory Επαγγελματικός Ήχος of a Subcategory Ήχος of Main Category Τεχνολογία
  { id: 357, name: 'Επαγγελματικά Μικρόφωνα', slug: 'professional-microphones', parentId: 336, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3339_SX400Y400/1476441478/epaggelmatika-mirkofona.webp' },
  { id: 358, name: 'Δέκτες', slug: 'receivers', parentId: 336, image: 'https://abpcdn.pstatic.gr/P/bpimg128/5947_SX400Y400/1476441478/mic-receivers.webp' },
  { id: 359, name: 'Κάψες', slug: 'capsules', parentId: 336, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6214_SX400Y400/1476441478/microphone-capsules.webp' },
  { id: 360, name: 'Αξεσουάρ Μικροφώνων', slug: 'microphone-accessories', parentId: 336, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3342_SX400Y400/1476441478/microphone-accessories.webp' },

  // Subcategories of Επαγγελματικός Φωτισμός of a Subcategory Επαγγελματικός Ήχος of a Subcategory Ήχος of Main Category Τεχνολογία
  { id: 361, name: 'Φωτορυθμικά', slug: 'lighting-effects', parentId: 337, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3332_SX400Y400/1476452309/led.webp' },
  { id: 362, name: 'Laser', slug: 'lasers', parentId: 337, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3333_SX400Y400/1476452309/laser.webp' },
  { id: 363, name: 'Κεφαλές Laser', slug: 'laser-heads', parentId: 337, image: 'https://abpcdn.pstatic.gr/P/bpimg128/6213_SX400Y400/1476430485/laser-probes.webp' },
  { id: 364, name: 'Par Cans', slug: 'par-cans', parentId: 337, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3336_SX400Y400/1476452309/par-cans.webp' },
  { id: 365, name: 'Μπάλες από Καθρέπτη', slug: 'mirror-balls', parentId: 337, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3337_SX400Y400/1476452309/mirror-balls.webp' },
  { id: 366, name: 'Κονσόλες Φωτισμού', slug: 'lighting-consoles', parentId: 337, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3338_SX400Y400/1476452309/konsoles-fotismou.webp' },

  // Subcategories of Εξοπλισμός DJ & Αξεσουάρ of a Subcategory Επαγγελματικός Ήχος of a Subcategory Ήχος of Main Category Τεχνολογία
  { id: 367, name: 'DJ Controllers', slug: 'dj-controllers', parentId: 339, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3297_SX400Y400/1476435992/dj-controllers.webp' },
  { id: 368, name: 'Εξοπλισμός Midi Υπολογιστή', slug: 'midi-computer-equipment', parentId: 339, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8491_SX400Y400/1639663690/eksoplismos-midi-ypologisti.webp' },
  { id: 369, name: 'DJ CD / MP3 Players', slug: 'dj-cd-mp3-players', parentId: 339, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8877_SX400Y400/1715927792/dj-cd-mp3-players.webp' },
  { id: 370, name: 'DJ Αξεσουάρ', slug: 'dj-accessories', parentId: 339, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8879_SX400Y400/1716447834/dj-aksesoyar.webp' },

  // Subcategories of Μηχανήματα Καπνού & Ατμόσφαιρας of a Subcategory Επαγγελματικός Ήχος of a Subcategory Ήχος of Main Category Τεχνολογία
  { id: 371, name: 'Μηχανές Καπνού', slug: 'smoke-machines', parentId: 343, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3307_SX400Y400/1476454635/smoke-machines.webp' },
  { id: 372, name: 'Μηχανές για Φυσαλίδες', slug: 'bubble-machines', parentId: 343, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3308_SX400Y400/1476454635/bubble-machines.webp' },
  { id: 373, name: 'Μηχανές Χιονιού', slug: 'snow-machines', parentId: 343, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3310_SX400Y400/1476454634/snow-machines.webp' },
  { id: 374, name: 'Αξεσουάρ Μηχανημάτων Καπνού & Ατμόσφαιρας', slug: 'smoke-and-atmosphere-accessories', parentId: 343, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3311_SX400Y400/1476454635/aksesouar-mixanimaton-kapnou-atmosfairas.webp' },

  // Subcategories of Ακουστικά, Αξεσουάρ of a Subcategory Επαγγελματικός Ήχος of a Subcategory Ήχος of Main Category Τεχνολογία
  { id: 375, name: 'Headphones', slug: 'headphones', parentId: 316, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8068_SX400Y400/1629455538/headphones.webp' },
  { id: 376, name: 'Ακουστικά Ψείρες', slug: 'earbuds', parentId: 316, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8069_SX400Y400/1629455538/akoystika-pseires.webp' },
  { id: 377, name: 'Ενισχυτές Ακουστικών', slug: 'headphone-amplifiers', parentId: 316, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8070_SX400Y400/1629455538/enisxytes-akoystikon.webp' },
  { id: 378, name: 'Μαξιλαράκια Ακουστικών', slug: 'headphone-pads', parentId: 316, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8917_SX400Y400/1718796336/maksilarakia-akoystikon.webp' },
  { id: 379, name: 'Βάσεις Ακουστικών', slug: 'headphone-stands', parentId: 316, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8918_SX400Y400/1718796125/vaseis-akoystikon.webp' },
  { id: 380, name: 'Αξεσουάρ, Ανταλλακτικά Ακουστικών', slug: 'headphone-accessories', parentId: 316, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8071_SX400Y400/1718796548/aksesoyar-antallaktika-akoystikon.webp' },
  { id: 381, name: 'Gaming Headsets', slug: 'gaming-headsets', parentId: 316, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8066_SX400Y400/1629455538/gaming-headsets.webp' },
  { id: 382, name: 'Ακουστικά Υπολογιστή', slug: 'computer-headphones', parentId: 316, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8072_SX400Y400/1629455538/akoystika-ypologisti.webp' },

  // Subcategories of Συσκευές Πικάπ, Αξεσουάρ of a Subcategory Επαγγελματικός Ήχος of a Subcategory Ήχος of Main Category Τεχνολογία
  { id: 383, name: 'Πικάπ', slug: 'turntables', parentId: 318, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3290_SX400Y400/1476437680/pickup.webp' },
  { id: 384, name: 'Slipmat', slug: 'slipmats', parentId: 318, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8923_SX400Y400/1720091602/slipmat.webp' },
  { id: 385, name: 'Κεφάλες Πικάπ', slug: 'turntable-cartridges', parentId: 318, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8924_SX400Y400/1720091902/kefales-pikap.webp' },
  { id: 386, name: 'Συντήρηση, Καθαρισμός Πικάπ', slug: 'turntable-maintenance', parentId: 318, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8925_SX400Y400/1720092170/suntirisi-katharismos-pikap.webp' },
  { id: 387, name: 'Ρυθμιστικά Πικάπ', slug: 'turntable-adjustments', parentId: 318, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8926_SX400Y400/1720092391/rythmistika-pikap.webp' },
  { id: 388, name: 'Βελόνες Πικάπ', slug: 'turntable-needles', parentId: 318, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8927_SX400Y400/1720092621/velones-pikap.webp' },
  { id: 389, name: 'Ανταλλακτικά Πικάπ', slug: 'turntable-parts', parentId: 318, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8928_SX400Y400/1720092923/antallaktika-pikap.webp' },
  { id: 390, name: 'Αποθήκευση, Μεταφορά Δίσκων Πικάπ', slug: 'turntable-storage', parentId: 318, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8929_SX400Y400/1720093106/apothikeysi-metafora-diskon-pikap.webp' },
  { id: 391, name: 'Ενισχυτές Πικάπ', slug: 'turntable-amplifiers', parentId: 318, image: 'https://abpcdn.pstatic.gr/P/bpimg128/8930_SX400Y400/1720093321/enisxytes-pikap.webp' },

  // Subcategories of Home Cinema of a Subcategory Επαγγελματικός Ήχος of a Subcategory Ήχος of Main Category Τεχνολογία
  { id: 392, name: 'Σετ Home Cinema', slug: 'set-home-cinema', parentId: 319, image: 'https://abpcdn.pstatic.gr/P/bpimg128/697_SX400Y400/1472046462/set-home-cinema.webp' },
  { id: 393, name: 'Soundbar', slug: 'soundbar', parentId: 319, image: 'https://abpcdn.pstatic.gr/P/bpimg128/5876_SX400Y400/1472046463/soundbar.webp' },
  { id: 394, name: 'Subwoofer', slug: 'subwoofer', parentId: 319, image: 'https://abpcdn.pstatic.gr/P/bpimg128/5868_SX400Y400/1472048939/subwoofer.webp' },

  // Subcategories of Φορητές Συσκευές of a Subcategory Επαγγελματικός Ήχος of a Subcategory Ήχος of Main Category Τεχνολογία
  { id: 395, name: 'Φορητά Ράδιο CD', slug: 'portable-radio-cd-players', parentId: 320, image: 'https://abpcdn.pstatic.gr/P/bpimg128/720_SX400Y400/1472545123/radio-cd-players.webp' },
  { id: 396, name: 'Φορητά Ραδιόφωνα', slug: 'portable-radios', parentId: 320, image: 'https://abpcdn.pstatic.gr/P/bpimg128/721_SX400Y400/1472545123/forhta-radiofona.webp' },
  { id: 397, name: 'Δημοσιογραφικά, Καταγραφικά Ήχου', slug: 'audio-recorders', parentId: 320, image: 'https://abpcdn.pstatic.gr/P/bpimg128/3428_SX400Y400/1472545123/audio-recorders.webp' },
  { id: 398, name: 'Φορητά CD Players', slug: 'portable-cd-players', parentId: 320, image: 'https://abpcdn.pstatic.gr/P/bpimg128/5803_SX400Y400/1472545124/portable-cd-players.webp' },
];

export interface Vendor {
  id: number; 
  name: string;
  logo: string;
  rating: number;
  url: string;
  certification: string;
  telephone: string[]; // Multiple telephone numbers
  location?: { lat: number; lng: number }[]; // Optional multiple locations defined by lat/lng
  address?: string[]; // Optional multiple addresses
  paymentMethods: PaymentMethod[]; // List of payment methods offered
}

// Payment Methods Enum
 export enum PaymentMethod {
   COD = "Αντικαταβολή",
   CreditCard = "Πιστωτικές κάρτες",
   PayPal = "PayPal",
   BankTransfer = "Τραπεζική κατάθεση",
   VivaPayments = "Viva Payments",
   Paysafecard = "Paysafecard",
   Courier = "Ταχυμεταφορά (Courier)",
   NetworkPickup = "Παραλαβή από δίκτυο",
   TransportCompany = "Μεταφορική εταιρία",
   PickupVia = "Παραλαβή μέσω",
   FreeReturn = "Δωρεάν επιστροφή",
   PointsCollection = "Συλλογή πόντων",
   GiftCards = "Δωροκάρτες",
   ExtendedWarranty = "Επέκταση εγγύησης",
   WeddingList = "Λίστα γάμου/μωρού",
   DeviceRecycling = "Ανακύκλωση συσκευών"
 }

export const vendors: Vendor[] = [
  { 
    id: 1, 
    name: 'You', 
    logo: '//orig-bpcdn.pstatic.gr/bpmerchants/252.svg', 
    rating: 4.5, 
    certification: 'Bronze', 
    url: 'https://www.you.gr', 
    telephone: ['211 9991900'], 
    address: ['Αργυρουπόλεως 2Α, Καλλιθέα'], 
    location: [{ lat: 37.9337, lng: 23.7004 }], // Add random latitude and longitude
    paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn] 
  },
  { 
    id: 2, 
    name: 'Plaisio', 
    logo: '//orig-bpcdn.pstatic.gr/bpmerchants/79.svg', 
    rating: 4.2, 
    certification: 'Silver', 
    url: 'https://www.plaisio.gr', 
    telephone: ['456123789'], 
    address: ['Location B'], 
    location: [{ lat: 37.9838, lng: 23.7275 }], // Random latitude and longitude
    paymentMethods: [PaymentMethod.COD, PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.Courier, PaymentMethod.PickupVia, PaymentMethod.FreeReturn, PaymentMethod.GiftCards, PaymentMethod.ExtendedWarranty] 
  },
  { 
    id: 3, 
    name: 'Public', 
    logo: '//orig-bpcdn.pstatic.gr/bpmerchants/743.svg', 
    rating: 4.7, 
    certification: 'Gold', 
    url: 'https://www.public.gr', 
    telephone: ['210 8181333'], 
    address: ['Θηβαϊδος 22, Κηφισιά', 'Καραγεώργη Σερβίας 1, Πλατεία Συντάγματος, 10563, Αθήνα', 'The Mall Athens, Ανδρέα Παπανδρέου 35 (Θέση Ψαλίδι), 15122, Μαρούσι', 'Σ. Καράγιωργα 4 & Λαζαράκη, 16675, Γλυφάδα', 'Γρηγορίου Λαμπράκη 152-154, 18535, Πειραιάς'], 
    location: [{ lat: 38.0747, lng: 23.7582 }], // Random latitude and longitude
    paymentMethods: [PaymentMethod.COD, PaymentMethod.CreditCard, PaymentMethod.PayPal, PaymentMethod.BankTransfer, PaymentMethod.Courier, PaymentMethod.PickupVia, PaymentMethod.FreeReturn, PaymentMethod.PointsCollection, PaymentMethod.GiftCards, PaymentMethod.ExtendedWarranty, PaymentMethod.DeviceRecycling] 
  },
  { 
    id: 4, 
    name: 'Κωτσόβολος', 
    logo: '//orig-bpcdn.pstatic.gr/bpmerchants/496.svg', 
    rating: 4.0, 
    certification: 'Gold',
    url: 'https://example.com/vendor-b', 
    telephone: ['456123789'], 
    address: ['Location C'], 
    location: [{ lat: 37.9090, lng: 23.7105 }], // Random latitude and longitude
    paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn] 
  },
  { 
    id: 5, 
    name: 'Funky Buddha', 
    logo: '//orig-bpcdn.pstatic.gr/bpmerchants/4351.svg', 
    rating: 4.3,
    url: 'https://example.com/vendor-b', 
    telephone: ['456123789'], 
    address: ['Location C'], 
    location: [{ lat: 37.9500, lng: 23.6000 }], // Random latitude and longitude
    paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn] 
  },
  { 
    id: 6, 
    name: 'Germanos', 
    logo: '//orig-bpcdn.pstatic.gr/bpmerchants/8697.svg', 
    rating: 4.1, 
    certification: '',
    url: 'https://example.com/vendor-b', 
    telephone: ['456123789'], 
    address: ['Location C'], 
    location: [{ lat: 37.9700, lng: 23.7350 }], // Random latitude and longitude
    paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn] 
  },
  { 
    id: 7, 
    name: 'e-shop.gr', 
    logo: '//orig-bpcdn.pstatic.gr/bpmerchants/16.svg', 
    rating: 3.2, 
    certification: 'Gold',
    url: 'https://example.com/vendor-b', 
    telephone: ['456123789'], 
    address: ['Location C'], 
    location: [{ lat: 38.0100, lng: 23.6000 }], // Random latitude and longitude
    paymentMethods: [PaymentMethod.CreditCard, PaymentMethod.BankTransfer, PaymentMethod.FreeReturn] 
  },
  { 
    id: 8, 
    name: 'Χαμόγελο του Παιδιού', 
    logo: '//orig-bpcdn.pstatic.gr/bpmerchants/874.svg', 
    rating: 4.7, 
    certification: 'Bronze',
    url: 'https://example.com/vendor-b', 
    telephone: ['456123789'], 
    address: ['Location C'], 
    location: [{ lat: 37.9200, lng: 23.5400 }], // Random latitude and longitude 
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
    categoryIds: [10, 102, 103], // Now includes the smartphone subcategory
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
    categoryIds: [218],
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
    categoryIds: [244],
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
