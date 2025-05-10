// Brand Interface
export interface Brand {
  id: number;
  name: string;
  logo?: string;
  slug?: string;
  officialWebsite?: string;
  description?: string;
  countryOfOrigin?: string;
}

// --- Brands ---
export const brands: Brand[] = [
  // -- A --
  { id: 26, name: 'Adidas', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/4698.svg', slug: 'adidas' },
  { id: 25, name: 'AEG', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/895.svg', slug: 'aeg' },
  { id: 10, name: 'Asus', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/161.svg', slug: 'asus' },
  { id: 11, name: 'Acer', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/7.svg', slug: 'acer' },
  { id: 21, name: 'Akai', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/755.svg', slug: 'akai' },
  { id: 27, name: 'Ajax', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/1065.svg', slug: 'ajax' },
  { id: 22, name: 'Alpine', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/3403.svg', slug: 'alpine' },
  { id: 1, name: 'Apple', logo: 'brands/1.svg', slug: 'apple', officialWebsite: 'https://www.apple.com', countryOfOrigin: 'USA' },
  { id: 23, name: 'Apivita', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/16461.svg', slug: 'apivita' },
  { id: 24, name: 'Ariel', slug: 'ariel' },
  { id: 31, name: 'Attrattivo', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/22199.svg', slug: 'attrattivo' },
  { id: 30, name: 'Avin', slug: 'avin' },
  { id: 28, name: 'Avon', slug: 'avon' },
  { id: 29, name: 'Avon', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/4790.svg', slug: 'avon' },
  { id: 32, name: 'AXE', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/19762.svg', slug: 'axe' },

  // -- B --
  { id: 33, name: 'B&C Collection', slug: 'b-c-collection' },

  // -- C --
  { id: 5, name: 'Canon', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/10.svg', slug: 'canon' },
  
  // -- D --
  { id: 8, name: 'Dell', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/292.svg', slug: 'dell' },

  // -- H --
  { id: 9, name: 'HP', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/1.svg', slug: 'hp' },

  // -- L --
  { id: 7, name: 'Lenovo', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/728.svg', slug: 'lenovo' },
  { id: 4, name: 'LG', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/293.svg', slug: 'lg' },

  // -- M --
  { id: 12, name: 'Microsoft', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/100.svg', slug: 'microsoft' },

  // -- N --
  { id: 6, name: 'Nikon', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/281.svg', slug: 'nikon' },

  // -- S --
  { id: 2, name: 'Samsung', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/26.svg', slug: 'samsung', officialWebsite: 'https://www.samsung.com', countryOfOrigin: 'South Korea' },
  { id: 3, name: 'Sony', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/5.svg', slug: 'sony' },

  // -- 0-9 --
  { id: 15, name: '2K Games', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/18388.svg', slug: '2k-games' },
  { id: 14, name: '3Guys', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/16764.svg', slug: '3guys' },
  { id: 16, name: '7Days', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/39065.svg', slug: '7days' },

  // -- Α-Ω --
  { id: 13, name: 'ΑΛΦΑ', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/30165.svg', slug: 'alfa' },
  { id: 17, name: 'Βιοκαρπέτ', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/30055.svg', slug: 'viokarpet' },
  { id: 20, name: 'Γιώτης', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/21623.svg', slug: 'giotis' },
  { id: 18, name: 'Χαμόγελο του Παιδιού', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/33632.svg', slug: 'hamogelo-tou-paidiou' },
  { id: 19, name: 'Χρωτέχ', logo: 'https://orig-bpcdn.pstatic.gr/logs/brands/36032.svg', slug: 'xrotex' },
];

export const getBrandById = (id: number): Brand | undefined => {
  return brands.find(brand => brand.id === id);
};
