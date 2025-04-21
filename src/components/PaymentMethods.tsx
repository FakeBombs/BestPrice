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

const allPaymentMethods = Object.values(PaymentMethod);
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
                                    <svg aria-hidden="true" className="icon" width="16" height="16">
                                        <use xlinkHref="/public/dist/images/icons/icons.svg#icon-check-16"></use>
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
        <section className="merchant__shipping-options">
            {renderList(allPaymentMethods, "Τρόποι πληρωμής")}
            {renderList(shippingMethods, "Αποστολή, μεταφορικά")}
            {renderList(additionalServices, "Επιπλέον υπηρεσίες")}
        </section>
    );
};

export default PaymentMethodsComponent;
