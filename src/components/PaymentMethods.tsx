// PaymentMethods.js
const PaymentMethod = {
    COD: 'Αντικαταβολή',
    CreditCard: 'Πιστωτικές κάρτες',
    PayPal: 'PayPal',
    BankTransfer: 'Τραπεζική κατάθεση',
    PickupVia: 'Παραλαβή από δίκτυο',
    FreeReturn: 'Δωρεάν επιστροφή',
    PointsCollection: 'Συλλογή πόντων',
    GiftCards: 'Δωροκάρτες',
    ExtendedWarranty: 'Επέκταση εγγύησης',
    DeviceRecycling: 'Ανακύκλωση συσκευών',
};

const allPaymentMethods = Object.values(PaymentMethod);
