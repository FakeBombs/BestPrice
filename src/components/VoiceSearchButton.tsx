
import React from 'react';

export interface VoiceSearchButtonProps {
  onSearchComplete: (query: string) => void;
}

const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({ onSearchComplete }) => {
  const handleVoiceSearch = () => {
    // Mock implementation - in a real app this would use the Web Speech API
    setTimeout(() => {
      onSearchComplete("voice search demo");
    }, 1000);
  };

  return (
    <div 
      role="button" 
      className="search__icon tooltip__anchor search__voice search__icon--actionable"
      onClick={handleVoiceSearch}
    >
      <svg aria-hidden="true" className="icon" width="18" height="18" viewBox="0 0 18 18" role="img">
        <path xmlns="http://www.w3.org/2000/svg" d="M8.25 2.25h1.5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V3a.75.75 0 01.75-.75zm3.75 3v.75c0 2.9-2.35 5.25-5.25 5.25S1.5 8.9 1.5 6V5.25H3V6a3.75 3.75 0 107.5 0v-.75H12z" fillRule="evenodd"/>
      </svg>
    </div>
  );
};

export default VoiceSearchButton;
