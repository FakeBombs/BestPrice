import React, { useRef, useEffect, useState } from 'react';

// Generic Scrollable Slider Component
const ScrollableSlider = ({ children }) => {
  const scrollableRef = useRef(null);
  const [isLeftDisabled, setIsLeftDisabled] = useState(true);
  const [isRightDisabled, setIsRightDisabled] = useState(false);

  useEffect(() => {
    const element = scrollableRef.current;

    const checkScrollButtons = () => {
      if (element) {
        setIsLeftDisabled(element.scrollLeft === 0);
        setIsRightDisabled(element.scrollLeft + element.clientWidth >= element.scrollWidth);
      }
    };

    checkScrollButtons();

    const handleScroll = () => {
      checkScrollButtons();
    };

    if (element) {
      element.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleScrollLeft = () => {
    scrollableRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    scrollableRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  return (
    <div className="scroll">
      <div className="scroll__clip">
        <div className="scroll__scroller" ref={scrollableRef} style={{ overflowX: 'auto', display: 'flex', whiteSpace: 'nowrap', maxHeight: '400px' }}>
          {children.length > 0 ? children : <p>No categories to display</p>}  {/* Render a fallback when no children */}
        </div>
      </div>
      <button onClick={handleScrollLeft} disabled={isLeftDisabled} className="scroll-button">Left</button>
      <button onClick={handleScrollRight} disabled={isRightDisabled} className="scroll-button">Right</button>
    </div>
  );
};

export default ScrollableSlider;
