'use client';

import { useState, useEffect } from 'react';

interface ConeyPreloaderProps {
  isVisible: boolean;
}

export default function ConeyPreloader({ isVisible }: ConeyPreloaderProps) {
  const [currentFrame, setCurrentFrame] = useState(1);

  useEffect(() => {
    if (!isVisible) {
      setCurrentFrame(1); // Reset to first frame when not visible
      return;
    }

    const frameCount = 32;
    const fps = 40; // Increased to 40fps for quicker animation
    const frameDuration = 1000 / fps; // 25ms per frame

    const interval = setInterval(() => {
      setCurrentFrame((prevFrame) => {
        const nextFrame = prevFrame + 1;
        // Stop the interval when we reach the final frame
        if (nextFrame > frameCount) {
          clearInterval(interval);
          return frameCount;
        }
        return nextFrame;
      });
    }, frameDuration);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const formatFrameNumber = (frame: number) => {
    return frame.toString().padStart(5, '0');
  };

  return (
    <div className="flex items-center justify-center">
      <img
        src={`/coney_preloader/Comp 1_${formatFrameNumber(currentFrame)}.png`}
        alt="Loading..."
        className="w-30 h-30" // 120x120px (w-30 = 7.5rem = 120px)
        style={{
          width: '120px',
          height: '120px',
          objectFit: 'contain'
        }}
      />
    </div>
  );
}
