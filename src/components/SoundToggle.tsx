import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { getMuted, setMuted } from '../utils/audio';

export const SoundToggle: React.FC = () => {
  const [muted, setMutedState] = useState<boolean>(getMuted());

  useEffect(() => {
    setMutedState(getMuted());
  }, []);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  return (
    <button
      onClick={toggleSound}
      title={muted ? 'เปิดเสียง' : 'ปิดเสียง'}
      className="p-2.5 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 rounded-full shadow-md backdrop-blur-sm border border-amber-200 transition-transform active:scale-95 flex items-center justify-center cursor-pointer"
      aria-label="Toggle Sound"
    >
      {muted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
    </button>
  );
};
