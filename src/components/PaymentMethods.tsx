const PaymentMethod = {
  COD = 'Αντικαταβολή',
  CreditCard = 'Πιστωτικές κάρτες',
  PayPal = 'PayPal',
  BankTransfer = 'Τραπεζική κατάθεση',
  VivaPayments = 'Viva Payments',
  Paysafecard = 'Paysafecard',
  Courier = 'Ταχυμεταφορά (Courier)',
  NetworkPickup = 'Παραλαβή από δίκτυο',
  TransportCompany = 'Μεταφορική εταιρία',
  PickupVia = 'Παραλαβή μέσω',
  FreeReturn = 'Δωρεάν επιστροφή',
  PointsCollection = 'Συλλογή πόντων',
  GiftCards = 'Δωροκάρτες',
  ExtendedWarranty = 'Επέκταση εγγύησης',
  WeddingList = 'Λίστα γάμου/μωρού',
  DeviceRecycling = 'Ανακύκλωση συσκευών',
};

const allPaymentMethods = Object.values(PaymentMethod);
