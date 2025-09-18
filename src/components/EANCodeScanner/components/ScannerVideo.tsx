import type { RefObject } from 'react';
import clsx from 'clsx';

import Button from '../../Button/Button';

type ScannerVideoProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  active: boolean;
  onStop: () => void;
};

const ScannerVideo = ({ videoRef, active, onStop }: ScannerVideoProps) => {
  return (
    <div className={clsx('scanner__video-wrapper', { 
      'scanner__video-wrapper--active': active 
    })}>
      <div className="scanner__video-container">
        <video
          ref={videoRef}
          className="scanner__video"
          autoPlay
          playsInline
        />
        <div className="scanner__overlay" aria-hidden />
      </div>
      <Button 
        label="Cancel" 
        className="scanner__button-cancel" 
        onClick={onStop} 
      />
    </div>
  );
};

export default ScannerVideo;
