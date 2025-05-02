export interface Vendor {
  id: string;
  name: string;
  logo: string;
  url: string;
  website?: string; // For backward compatibility
  certification?: string;
  address: string[];
  telephone: string[];
  paymentMethods: string[];
}
