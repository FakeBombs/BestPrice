
import React from 'react';

const PaymentMethod = {
    COD: 'Αντικαταβολή',
    CreditCard: 'Πιστωτικές κάρτες',
    PayPal: 'PayPal',
    BankTransfer: 'Τραπεζική κατάθεση',
    VivaPayments: 'Viva Payments',
    Paysafecard: 'Paysafecard',
    Courier: 'Ταχυμεταφορά (Courier)',
    NetworkPickup: 'Παραλαβή από δίκτυο',
    TransportCompany: 'Μεταφορική εταιρία',
    PickupVia: 'Παραλαβή μέσω',
    FreeReturn: 'Δωρεάν επιστροφή',
    PointsCollection: 'Συλλογή πόντων',
    GiftCards: 'Δωροκάρτες',
    ExtendedWarranty: 'Επέκταση εγγύησης',
    WeddingList: 'Λίστα γάμου/μωρού',
    DeviceRecycling: 'Ανακύκλωση συσκευών',
};

const PaymentMethods = [
    PaymentMethod.COD,
    PaymentMethod.CreditCard,
    PaymentMethod.PayPal,
    PaymentMethod.BankTransfer,
    PaymentMethod.VivaPayments,
    PaymentMethod.Paysafecard,
];
const shippingMethods = [
    PaymentMethod.Courier,
    PaymentMethod.NetworkPickup,
    PaymentMethod.TransportCompany,
    PaymentMethod.PickupVia,
];
const additionalServices = [
    PaymentMethod.FreeReturn,
    PaymentMethod.PointsCollection,
    PaymentMethod.GiftCards,
    PaymentMethod.ExtendedWarranty,
    PaymentMethod.WeddingList,
    PaymentMethod.DeviceRecycling,
];

const PaymentMethodsComponent = ({ paymentMethods }) => {
    const renderList = (methods, title) => (
        <div>
            <h4 className="ui-kit__text ui-kit__strong ui-kit__mb-3">{title}</h4>
            <ol>
                {methods.map((method, index) => {
                    const isSupported = paymentMethods.includes(method);
                    return (
                        <li className={isSupported ? 'supported' : ''} key={index}>
                            <span className="ui-kit__text">{method}</span>
                            {isSupported ? (
                                <span className="check-icon--supported">
                                    <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" role="img">
                                        <path xmlns="http://www.w3.org/2000/svg" d="M15.5826 0.190838V0.190838C15.1338 -0.130939 14.5091 -0.0279674 14.1873 0.420838L4.83063 13.4662L1.7073 10.3402C1.31683 9.94952 0.683609 9.94937 0.292963 10.3398C-0.0976867 10.7303 -0.0978361 11.3635 0.292629 11.7542C0.292629 11.7542 0.292629 11.7542 0.292629 11.7542L4.2493 15.7102C4.65389 16.0995 5.29749 16.0871 5.68682 15.6825C5.71606 15.6521 5.74338 15.62 5.76863 15.5862L15.8126 1.58617C16.1344 1.13734 16.0314 0.512645 15.5826 0.190838L15.5826 0.190838Z"/>
                                    </svg>
                                </span>
                            ) : (
                                <span>—</span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </div>
    );

    return (
      <section>
        <h2 className="ui-kit__secondary">Χαρακτηριστικά καταστήματος</h2>
        <div className="merchant__shipping-options">
            {renderList(PaymentMethods, "Τρόποι πληρωμής")}
            {renderList(shippingMethods, "Αποστολή, μεταφορικά")}
            {renderList(additionalServices, "Επιπλέον υπηρεσίες")}
        </div>
      </section>
    );
};

export default PaymentMethodsComponent;
