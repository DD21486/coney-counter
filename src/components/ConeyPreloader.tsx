'use client';

import { useEffect, useState, useRef } from 'react';

interface ConeyPreloaderProps {
  isVisible: boolean;
}

export default function ConeyPreloader({ isVisible }: ConeyPreloaderProps) {
  const [isReady, setIsReady] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(1);
  const frameCount = 32;
  const preloadedImages = useRef<HTMLImageElement[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isVisible) {
      setIsReady(false);
      setCurrentFrame(1);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    // Preload all images
    const preloadImages = async () => {
      const imagePromises = [];
      
      for (let i = 1; i <= frameCount; i++) {
        const frameNum = i.toString().padStart(5, '0');
        const image = new Image();
        const imagePromise = new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = reject;
          image.src = `/coney_preloader/Comp 1_${frameNum}.png`;
        });
        imagePromises.push(imagePromise);
        preloadedImages.current.push(image);
      }
      
      await Promise.all(imagePromises);
      setIsReady(true);
    };

    preloadImages();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !isReady) return;

    let frame = 1;
    const startTime = Date.now();
    const fps = 40;
    const frameDuration = 1000 / fps; // 25ms per frame

    const animate = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const targetFrame = Math.min(Math.floor(elapsed / frameDuration) + 1, frameCount);
      
      if (targetFrame !== currentFrame) {
        setCurrentFrame(targetFrame);
      }

      // Continue animation if not at final frame
      if (targetFrame < frameCount) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, isReady, currentFrame]);

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
          objectFit: 'contain',
          opacity: isReady ? 1 : 0
        }}
      />
    </div>
  );
}