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

  // Use React.Children.toArray to ensure children is always an array
  const childrenArray = React.Children.toArray(children);

  return (
    <div className="scroll">
      <div className="scroll__clip">
        <div className="scroll__scroller" ref={scrollableRef} style={{ whiteSpace: 'nowrap' }}>
          {childrenArray.length > 0 ? childrenArray : <p>No categories to display</p>}  {/* Render a fallback when no children */}
        </div>
      </div>
      <button aria-label="Scroll arrow previous" onClick={handleScrollLeft} disabled={isLeftDisabled} className="scroll__arrow scroll__arrow--previous scroll__arrow--disabled" style={{ left: '-23px' }}><svg class="icon" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M8 0L9.41 1.41L3.83 7H16V9H3.83L9.41 14.59L8 16L0 8L8 0Z"/></svg></button>
      <button aria-label="Scroll arrow next" onClick={handleScrollRight} disabled={isRightDisabled} className="scroll__arrow scroll__arrow--next" style={{ rightt: '-23px' }}><svg class="icon" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" role="img"><path xmlns="http://www.w3.org/2000/svg" d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z"/></svg></button>
    </div>
  );
};

export default ScrollableSlider;
