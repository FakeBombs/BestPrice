
import React from 'react';

interface CategoryFiltersProps {
  query: string;
}

const CategoryFilters = ({ query }: CategoryFiltersProps) => {
  return (
    <div className="filters__categories" data-filter-name="categories">
      <div className="filters__header">
        <div className="filters__header-title filters__header-title--filters">Κατηγορίες</div>
      </div>
      <ol>
        <li><a data-c="2" href={`/cat/3446/tablets.html?q=${query}`}><span>Tablets</span></a></li>
        <li><a data-c="2" href={`/cat/5951/screen-protectors-tablets.html?q=${query}`}><span>Προστασία Οθόνης Tablet</span></a></li>
        <li><a data-c="3" href={`/cat/5943/thikes-tablet.html?q=${query}`}><span>Θήκες Tablet</span></a></li>
        <li><a data-c="1" href={`/cat/815/grafides-afis.html?q=${query}`}><span>Γραφίδες Αφής</span></a></li>
      </ol>
    </div>
  );
};

export default CategoryFilters;
