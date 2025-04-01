
import React from 'react';

interface BrandFilterSectionProps {
  query: string;
}

const BrandFilterSection = ({ query }: BrandFilterSectionProps) => {
  return (
    <div className="filter-brand filter-collapsed default-list" data-filter-name="Κατασκευαστής" data-filter-id="1" data-type="brand" data-key="brand">
      <div className="filter__header"><h4>Κατασκευαστής</h4></div>
      <div className="filter-container">
        <ol data-total="4" data-hidden="-1">
          <li><a data-c="4" data-id="9" rel="nofollow" href={`/search?q=${query}&f1=9`}>Apple</a></li>
          <li><a data-c="2" data-id="20028" rel="nofollow" href={`/search?q=${query}&f1=20028`}>Spigen</a></li>
          <li><a data-c="1" data-id="128" rel="nofollow" href={`/search?q=${query}&f1=128`}>Targus</a></li>
          <li><a data-c="1" data-id="39080" rel="nofollow" href={`/search?q=${query}&f1=39080`}>Techsuit</a></li>
        </ol>
      </div>
    </div>
  );
};

export default BrandFilterSection;
