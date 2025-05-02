
import React from 'react';

interface StoreFilterSectionProps {
  query: string;
}

const StoreFilterSection = ({ query }: StoreFilterSectionProps) => {
  return (
    <div className="filter-store filter-collapsed default-list" data-filter-name="Πιστοποιημένα καταστήματα" data-filter-id="store" data-type="store" data-key="store">
      <div className="filter__header"><h4>Πιστοποιημένα καταστήματα</h4></div>
      <div className="filter-container">
        <ol data-total="15" data-hidden="10">
          <li><a data-l="3" rel="nofollow" href={`/search?q=${query}&store=plaisio.gr`}><span>Plaisio</span></a></li>
          <li><a data-l="3" rel="nofollow" href={`/search?q=${query}&store=germanos.gr`}><span>Germanos</span></a></li>
          <li><a data-l="3" rel="nofollow" href={`/search?q=${query}&store=you.gr`}><span>You</span></a></li>
          <li><a data-l="3" rel="nofollow" href={`/search?q=${query}&store=e-gateway.gr`}><span>e-Gateway</span></a></li>
          <li className="hidden"><a data-l="3" rel="nofollow" href={`/search?q=${query}&store=websupplies.gr`}><span>Websupplies</span></a></li>
          <li className="hidden"><a data-l="3" rel="nofollow" href={`/search?q=${query}&store=adaptoras.gr`}><span>Adaptoras</span></a></li>
          <li className="hidden"><a data-l="3" rel="nofollow" href={`/search?q=${query}&store=madhawk.gr`}><span>Madhawk</span></a></li>
          <li className="hidden"><a data-l="3" rel="nofollow" href={`/search?q=${query}&store=plusmobi.net`}><span>Plusmobi</span></a></li>
          <li className="hidden"><a data-l="3" rel="nofollow" href={`/search?q=${query}&store=metrostore.gr`}><span>Metrostore</span></a></li>
          <li className="hidden"><a data-l="3" rel="nofollow" href={`/search?q=${query}&store=twiinshop.gr`}><span>Twiinshop</span></a></li>
          <li className="hidden"><a data-l="2" rel="nofollow" href={`/search?q=${query}&store=electroholic.gr`}><span>Electroholic</span></a></li>
          <li className="hidden"><a data-l="2" rel="nofollow" href={`/search?q=${query}&store=3dmall.gr`}><span>3dMall</span></a></li>
          <li className="hidden"><a data-l="2" rel="nofollow" href={`/search?q=${query}&store=mobicell.gr`}><span>MobiCell</span></a></li>
          <li className="hidden"><a data-l="2" rel="nofollow" href={`/search?q=${query}&store=gadgetmart.gr`}><span>GadgetMart</span></a></li>
          <li className="hidden"><a data-l="1" rel="nofollow" href={`/search?q=${query}&store=techstores.gr`}><span>Techstores</span></a></li>
        </ol>
        <div id="filter-store-prompt" className="filters-more-prompt" title="Εμφάνιση όλων των πιστοποιημένων καταστημάτων">
          <svg aria-hidden="true" className="icon" width="100%" height="100%">
            <use xlinkHref="//www.bestprice.gr/public/dist/images/icons/icons.svg#icon-plus-more"></use>
          </svg> 
          Εμφάνιση όλων
        </div>
      </div>
    </div>
  );
};

export default StoreFilterSection;
