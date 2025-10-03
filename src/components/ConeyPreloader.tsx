'use client';

import { useEffect, useState } from 'react';

interface ConeyPreloaderProps {
  isVisible: boolean;
}

export default function ConeyPreloader({ isVisible }: ConeyPreloaderProps) {
  const [currentFrame, setCurrentFrame] = useState(1);

  useEffect(() => {
    if (!isVisible) {
      setCurrentFrame(1);
      return;
    }

    // Reset to frame 1 when visible
    setCurrentFrame(1);

    // Create frame sequence
    const frameCount = 32;
    let frame = 1;

    const runAnimation = () => {
      if (frame <= frameCount) {
        setCurrentFrame(frame);
        frame++;
        // 40fps = 25ms per frame
        setTimeout(runAnimation, 25);
      }
    };

    // Start animation
    runAnimation();
  }, [isVisible]);

  const formatFrameNumber = (frame: number) => {
    return frame.toString().padStart(5, '0');
  };

  if (!isVisible) return null;

  return (
    <div className="flex items-center justify-center">
      <img
        src={`/coney_preloader/Comp 1_${formatFrameNumber(currentFrame)}.png`}
        alt="Loading..."
        style={{
          width: '120px',
          height: '120px',
          objectFit: 'contain'
        }}
      />
    </div>
  );
}
