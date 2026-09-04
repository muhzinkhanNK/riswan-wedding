import { VolumeX } from 'lucide-react';
import './AudioControl.css';

interface AudioControlProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function AudioControl({ isPlaying, onToggle }: AudioControlProps) {
  return (
    <button
      className={`audio-floating-btn ${!isPlaying ? 'paused' : ''}`}
      onClick={onToggle}
      aria-label={isPlaying ? 'Mute background music' : 'Play background music'}
      title={isPlaying ? 'Mute Music' : 'Play Music'}
    >
      {isPlaying ? (
        <>
          <div className="soundwave-wrap" aria-hidden="true">
            <span className="soundwave-bar" />
            <span className="soundwave-bar" />
            <span className="soundwave-bar" />
            <span className="soundwave-bar" />
          </div>
          <span>Music On</span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-amber-200/60" />
          <span>Music Off</span>
        </>
      )}
    </button>
  );
}
