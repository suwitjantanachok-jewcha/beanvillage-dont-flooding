import React, { useEffect } from 'react';
import { RotateCcw, Music } from 'lucide-react';
import { playBrassBandDefeat } from '../utils/audio';
import { GameImages } from '../assets/images';

interface Props {
  reason: string;
  onRestart: () => void;
}

export const DefeatScreen: React.FC<Props> = ({ reason, onRestart }) => {
  useEffect(() => {
    // Play funny Thai temple fair brass band defeat melody
    playBrassBandDefeat();
  }, []);

  return (
    <div className="relative min-h-[580px] w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400 bg-slate-900 text-white flex flex-col items-center justify-between p-6">
      {/* Background Image of 4-man brass band in yellow raincoats */}
      <div className="absolute inset-0 z-0">
        <img
          src={GameImages.brassBandRaincoats}
          alt="วงดนตรีชุดกันฝนสีเหลืองกลางน้ำท่วม"
          className="w-full h-full object-cover opacity-85 brightness-90 filter"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70" />
      </div>

      {/* Floating Neon Sign: "แพ้แล้วจ้าาา" */}
      <div className="relative z-10 w-full flex flex-col items-center pt-2">
        <div className="inline-block px-8 py-3 rounded-2xl bg-black/75 border-4 border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.9)] animate-pulse">
          <h1 className="text-4xl sm:text-5xl font-black text-yellow-300 tracking-wider text-center drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] font-['Kanit']">
            แพ้แล้วจ้าาา
          </h1>
        </div>
        <p className="mt-3 text-sm sm:text-base font-semibold text-amber-200 bg-black/60 px-4 py-1.5 rounded-full border border-amber-400/50">
          🎺 {reason || 'น้ำมาเร็วเกินต้าน! วงดนตรีมาส่งใจถึงหน้าบ้าน'}
        </p>
      </div>

      {/* Center Comedic Sound Indicator */}
      <div className="relative z-10 my-auto text-center px-4">
        <button
          onClick={() => playBrassBandDefeat()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 rounded-full border border-yellow-400/40 text-xs backdrop-blur-sm transition-transform active:scale-95 cursor-pointer"
        >
          <Music className="w-4 h-4 animate-bounce" />
          <span>กดฟังแตรวงดนตรีงานวัดอีกรอบ</span>
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 w-full flex flex-col items-center gap-3 pb-2">
        <p className="text-xs sm:text-sm text-slate-300 text-center bg-black/50 px-4 py-1 rounded-lg">
          "สู้เขาสิวะไอ้ถั่ว! เงิน 9,000 บาทรออยู่ที่ อบต."
        </p>
        <button
          onClick={onRestart}
          className="w-full max-w-sm py-4 px-8 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xl sm:text-2xl rounded-2xl shadow-[0_8px_20px_rgba(234,179,8,0.4)] border-2 border-white transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-3 font-['Kanit']"
        >
          <RotateCcw className="w-6 h-6 stroke-[3]" />
          <span>เริ่มใหม่</span>
        </button>
      </div>
    </div>
  );
};
