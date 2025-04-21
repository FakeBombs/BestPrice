import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vendors } from '@/data/mockData';

const VendorPage = () => {
    const { vendorId, vendorName } = useParams();
    const [vendor, setVendor] = useState(null);
    const displayedVendor = vendorName ? vendors.find((v) => v.name.toLowerCase() === vendorName.toLowerCase()) : null;

    useEffect(() => {
        // Set the vendor based on the displayedVendor found by name
        if (displayedVendor) {
            setVendor(displayedVendor);
        }
    }, [displayedVendor]);

    if (!vendor) {
        return <p>Vendor not found.</p>;
    }

    return (
        <div className="root__wrapper">
            <div className="root">
                <div id="trail">
                    <nav className="breadcrumb">
                        <ol>
                            <li>
                                <Link to="/" rel="home"><span>BestPrice</span></Link>
                                <span className="trail__breadcrumb-separator">›</span>
                            </li>
                            <li>
                                <span className="trail__last">{vendor.name}</span>
                            </li>
                        </ol>
                    </nav>
                </div>

                <header className="vendor-header">
                    <h1>{vendor.name}</h1>
                    {vendor.logo && (
                        <img src={vendor.logo} alt={`${vendor.name} logo`} className="vendor-logo" loading="lazy" />
                    )}
                </header>

                <section className="vendor-details">
                    <h2>Details</h2>
                    <p>{vendor.description || 'No description available'}</p>
                    <Link to={`/m/${vendor.id}`} className="link-to-products">
                        View Products from {vendor.name}
                    </Link>
                </section>

                <section className="vendor-reviews">
                    <h2>Reviews</h2>
                    {vendor.reviews && vendor.reviews.length > 0 ? (
                        vendor.reviews.map((review, index) => (
                            <div key={index} className="vendor-review">
                                <p><strong>{review.rating} / 5</strong> - {review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p>No reviews available for this vendor.</p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default VendorPage;
