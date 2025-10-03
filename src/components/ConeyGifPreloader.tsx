'use client';

import { useEffect, useState } from 'react';

interface ConeyGifPreloaderProps {
  isVisible: boolean;
}

export default function ConeyGifPreloader({ isVisible }: ConeyGifPreloaderProps) {
  const [shouldFreeze, setShouldFreeze] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setShouldFreeze(false);
      return;
    }

    // Let the GIF play once, then freeze it
    // Based on typical GIF timing - adjust this duration as needed
    const freezeTimer = setTimeout(() => {
      setShouldFreeze(true);
    }, 1500); // GIF will play for 1.5 seconds then freeze

    return () => clearTimeout(freezeTimer);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="flex items-center justify-center">
      <img
        src="/coney_preloader/coney_anim.gif"
        alt="Loading..."
        style={{
          width: '120px',
          height: '120px',
          objectFit: 'contain',
          // When frozen, we'll use a different approach
          animationPlayState: shouldFreeze ? 'paused' : 'running'
        }}
        className={shouldFreeze ? 'animate-none' : ''}
      />
      {shouldFreeze && (
        // Show a static image of the last frame after GIF stops
        <img
          src="/Coney_color.svg"
          alt="Coney Counter"
          style={{
            width: '120px',
            height: '120px',
            objectFit: 'contain',
            position: 'absolute',
            opacity: 1
          }}
          // This overlay appears when GIF should freeze
        />
      )}
    </div>
  );
}
