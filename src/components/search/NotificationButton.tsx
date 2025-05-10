import React from 'react';

interface NotificationButtonProps {
  query: string;
}

const NotificationButton = ({ query }: NotificationButtonProps) => {
  return (
    <div className="alerts">
      <button data-url={`/search?q=${query}`} data-title={query} data-max-price="0" className="alerts__button pressable">
        <svg aria-hidden="true" className="icon" width="20" height="20">
          <use href="/dist/images/icons/icons.svg#icon-notification-outline-20"></use>
        </svg>
        <span className="alerts__label">Ειδοποίηση</span>
      </button>
      <div className="alerts__prompt"> σε 
        <span className="alerts__title"> {query}</span>
      </div>
    </div>
  );
};

export default NotificationButton;
