import React from 'react'; // Removed useState
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

// Define the structure for recipient categories including an English slug
const giftRecipientCategories = [
    { slug: 'men',      greeklishSlug: 'andres',       titleKey: 'giftsForMen',       nameKey: 'men' },
    { slug: 'women',    greeklishSlug: 'gynaikes',     titleKey: 'giftsForWomen',     nameKey: 'women' },
    { slug: 'teens',    greeklishSlug: 'efhboi',       titleKey: 'giftsForTeens',     nameKey: 'teens' },
    { slug: 'kids-9-11',greeklishSlug: 'paidia-9-11',  titleKey: 'giftsForKids9_11',  nameKey: 'kids9_11' },
    { slug: 'kids-6-8', greeklishSlug: 'paidia-6-8',   titleKey: 'giftsForKids6_8',   nameKey: 'kids6_8' },
    { slug: 'toddlers', greeklishSlug: 'nhpia',        titleKey: 'giftsForToddlers',  nameKey: 'toddlers' },
    { slug: 'babies',   greeklishSlug: 'mwra',         titleKey: 'giftsForBabies',    nameKey: 'babies' },
];

const Gifts: React.FC = () => {
    // Correctly destructuring both t and language
    const { t, language } = useTranslation();
    const totalGiftCount = 2250; // Placeholder

    return (
        <div className="gift-finder">
            <div className="sc-jScdur iyzBDo root__wrapper">
                <div className="sc-dcKlJK cquxZx root">
                    <img alt={t('gifts_page_alt', 'Gift Ideas at BestPrice')} width="200" height="108" className="sc-guGTOK irbLXu" src="src/pages/assets/gift.svg" loading="eager"/>
                    <h1 className="sc-jPkiSJ jBXYhC">{t('gifts', 'Δώρα')}</h1>
                    <p className="sc-lixPIL cuyAJX">
                        {t('gifts_page_subtitle', 'Επίλεξε για ποιον ψάχνεις δώρο και δες τα δώρα που έχουμε διαλέξει για σένα.')}
                    </p>
                    <div className="sc-iQQCXo ebbwJS">
                        <div className="sc-gDpztx fknxFk">
                            {giftRecipientCategories.map((cat) => (
                                <Link key={cat.slug} to={`/gifts/${cat.slug}`} title={t(cat.titleKey, `Gifts for ${cat.nameKey}`)} className="sc-kpOvIu kHmeXZ">
                                    <img alt={t(cat.nameKey, cat.nameKey)} width={90} height={90} src={`/dist/images/${cat.slug}.webp`} loading="lazy" className="rounded-full mb-2 group-hover:opacity-80 transition-opacity"/>
                                    <h2>{t(cat.nameKey, cat.nameKey)}</h2>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <p className="sc-cZSric geFCaT">
                        {t('gifts_total_count', '{{count}} επιλεγμένα δώρα για όλους', { count: totalGiftCount.toLocaleString(language === 'el' ? 'el-GR' : 'de-DE') })} {/* Example usage of language for formatting */}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Gifts;
