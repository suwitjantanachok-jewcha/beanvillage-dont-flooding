import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Share2, Award, Coffee, Coins } from 'lucide-react';
import { CharacterConfig } from '../types/game';
import { CharacterAvatar } from './CharacterAvatar';
import { playVictoryFanfare, playGoldDing } from '../utils/audio';

interface Props {
  amount: number;
  character: CharacterConfig;
  hadGoldenBox: boolean;
  onRestart: () => void;
}

export const VictoryScreen: React.FC<Props> = ({
  amount,
  character,
  hadGoldenBox,
  onRestart,
}) => {
  const isFull = amount >= 9000;
  const isMid = amount >= 5000 && amount < 9000;
  const isLow = amount < 5000;

  useEffect(() => {
    playVictoryFanfare();
    playGoldDing();

    if (isFull) {
      // Massive confetti blast
      const end = Date.now() + 2500;
      const interval: NodeJS.Timeout = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          return;
        }
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [isFull]);

  // Titles and flavor text
  let title = '';
  let badgeText = '';
  let subQuote = '';
  let themeBg = '';

  if (isFull) {
    title = 'โอนเงินสำเร็จ 9,000 บาท! เลี้ยงชาเย็นทั้งหมู่บ้าน';
    badgeText = '🏆 ผู้พิชิตเงินเยียวยาสูงสุด!';
    subQuote = hadGoldenBox
      ? 'ใช้กล่องทองอัลติเมต ผ่านฉลุย อบต. ไม่กล้าหักแม้แต่บาทเดียว!'
      : 'เอกสารครบ ยื่นไว ไหวพริบเทพ ได้ 9,000 เต็มกระเป๋า!';
    themeBg = 'from-emerald-500 via-teal-500 to-green-600';
  } else if (isMid) {
    title = 'ช่วยได้แค่นี้ครับ';
    badgeText = '💰 ได้เงินเยียวยาระดับกลาง';
    subQuote = `หักค่าเอกสารและค่าส่ง เหลือรับกลับบ้าน ${amount.toLocaleString()} บาท ยังพอซื้อมาม่าได้หลายแพ็ค!`;
    themeBg = 'from-amber-500 via-orange-500 to-yellow-600';
  } else {
    title = 'ได้น้อยแต่ก็ยังดี';
    badgeText = '🪙 รอดตายหวุดหวิด!';
    subQuote = `โดน อบต. หักจนเกือบหมดตัว เหลือ ${amount.toLocaleString()} บาท แต่ยังดีกว่ามือเปล่ากลับบ้าน!`;
    themeBg = 'from-slate-600 via-zinc-600 to-slate-700';
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'หมู่บ้านแห่งถั่ว - ล่า 9,000 บาท',
        text: `ฉันรอดน้ำท่วมและคว้าเงินเยียวยาได้ ${amount.toLocaleString()} บาท! มาลองเล่นกันเลย!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `ฉันรอดน้ำท่วมในเกม "หมู่บ้านแห่งถั่ว" คว้าเงินเยียวยาได้ ${amount.toLocaleString()} บาท!`
      );
      alert('คัดลอกข้อความแชร์ผลสำเร็จแล้ว!');
    }
  };

  return (
    <div className="relative min-h-[580px] w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 bg-white text-slate-800 flex flex-col items-center justify-between p-6">
      {/* Top Banner */}
      <div className={`w-full py-4 px-6 rounded-2xl bg-gradient-to-r ${themeBg} text-white text-center shadow-lg`}>
        <div className="text-xs uppercase tracking-widest font-bold opacity-90 mb-1 flex items-center justify-center gap-1">
          <Award className="w-4 h-4" />
          <span>{badgeText}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-['Kanit'] leading-tight drop-shadow-sm">
          {title}
        </h1>
      </div>

      {/* Center Character Showcase */}
      <div className="flex flex-col items-center my-4">
        <div className="relative p-4 bg-amber-50 rounded-full border-4 border-amber-200 shadow-inner">
          <CharacterAvatar config={character} size="xl" isCelebrating={isFull} />
          {isFull && (
            <div className="absolute -top-2 -right-2 bg-yellow-400 p-2.5 rounded-full shadow-lg border-2 border-white animate-bounce">
              <Coffee className="w-6 h-6 text-amber-900" />
            </div>
          )}
        </div>

        {/* Amount Received Card */}
        <div className="mt-4 px-8 py-3 bg-gradient-to-b from-amber-100 to-amber-50 rounded-2xl border-2 border-amber-300 shadow-md text-center">
          <div className="text-xs text-slate-500 font-semibold">ยอดเงินโอนเข้าบัญชีพร้อมเพย์</div>
          <div className="text-4xl sm:text-5xl font-black text-amber-600 font-['Kanit'] flex items-center justify-center gap-2 mt-1">
            <Coins className="w-8 h-8 text-amber-500" />
            <span>{amount.toLocaleString()}</span>
            <span className="text-2xl text-slate-600 font-medium">บาท</span>
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-600 text-center max-w-md font-medium px-4">
          {subQuote}
        </p>

        {isFull && (
          <div className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            🧋 โรงทานชาเย็นเปิดบริการแล้ว ชาวบ้านชื่นมื่นทั้งซอย!
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="w-full max-w-md flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleShare}
          className="flex-1 py-3 px-4 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl border border-amber-300 shadow-sm flex items-center justify-center gap-2 text-sm transition-transform active:scale-95 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>แชร์ความสำเร็จ</span>
        </button>
        <button
          onClick={onRestart}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-black rounded-xl shadow-md border-2 border-amber-300 flex items-center justify-center gap-2 text-base transition-transform active:scale-95 cursor-pointer font-['Kanit']"
        >
          <RotateCcw className="w-5 h-5" />
          <span>เล่นใหม่อีกรอบ</span>
        </button>
      </div>
    </div>
  );
};
