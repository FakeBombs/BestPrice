// Brand Interface
export interface Brand {
  id: number;
  name: string;
  logo: string;
  slug?: string;
  officialWebsite?: string;
  description?: string;
  countryOfOrigin?: string;
}
