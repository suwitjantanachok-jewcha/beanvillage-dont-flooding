import React, { useState, useEffect, useRef } from 'react';
import { CharacterConfig, Inventory } from '../types/game';
import { CharacterAvatar } from './CharacterAvatar';
import { CheckCircle2, XCircle, Clock, Waves, Sparkles } from 'lucide-react';
import { playPop, playWaterSplash, playDuckQuack } from '../utils/audio';
import { GameImages } from '../assets/images';

interface Props {
  character: CharacterConfig;
  inventory: Inventory;
  onSuccess: (updatedInventory: Inventory) => void;
  onFail: (reason: string) => void;
}

interface FloatingItem {
  id: string;
  type: 'idCard' | 'electricBill' | 'floodPhoto' | 'basin' | 'croc' | 'slipper' | 'noodle';
  title: string;
  icon: string;
  x: number; // percentage 5% to 85%
  y: number; // percentage 30% to 80%
  speedX: number;
  bobPhase: number;
  isRequired: boolean;
}

export const Stage1Flood: React.FC<Props> = ({
  character,
  inventory,
  onSuccess,
  onFail,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(40);
  const [waterLevel, setWaterLevel] = useState<number>(20);
  const [currentInv, setCurrentInv] = useState<Inventory>(inventory);
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Speed multiplier based on difficulty
  const speedMult = character.village === 'hard' ? 1.4 : character.village === 'medium' ? 1.0 : 0.8;

  // Initialize floating items
  useEffect(() => {
    const items: FloatingItem[] = [];

    // Required items
    if (!inventory.idCard) {
      items.push({
        id: 'req-id',
        type: 'idCard',
        title: 'บัตรประชาชน',
        icon: '🪪',
        x: 15,
        y: 45,
        speedX: 0.12 * speedMult,
        bobPhase: 0,
        isRequired: true,
      });
    }

    items.push({
      id: 'req-bill',
      type: 'electricBill',
      title: 'บิลค่าไฟ',
      icon: '⚡',
      x: 65,
      y: 55,
      speedX: -0.1 * speedMult,
      bobPhase: 1.5,
      isRequired: true,
    });

    items.push({
      id: 'req-photo',
      type: 'floodPhoto',
      title: 'รูปถ่ายน้ำท่วม',
      icon: '📸',
      x: 40,
      y: 68,
      speedX: 0.08 * speedMult,
      bobPhase: 3.0,
      isRequired: true,
    });

    // Fun decoys
    items.push(
      {
        id: 'decoy-basin',
        type: 'basin',
        title: 'กะละมังแดง',
        icon: '🧺',
        x: 80,
        y: 40,
        speedX: -0.15 * speedMult,
        bobPhase: 0.5,
        isRequired: false,
      },
      {
        id: 'decoy-croc',
        type: 'croc',
        title: 'จระเข้ยาง',
        icon: '🐊',
        x: 25,
        y: 72,
        speedX: 0.14 * speedMult,
        bobPhase: 2.2,
        isRequired: false,
      },
      {
        id: 'decoy-slipper',
        type: 'slipper',
        title: 'แตะช้างดาว',
        icon: '🩴',
        x: 50,
        y: 48,
        speedX: -0.09 * speedMult,
        bobPhase: 4.1,
        isRequired: false,
      },
      {
        id: 'decoy-noodle',
        type: 'noodle',
        title: 'ซองมาม่าเปียก',
        icon: '🍜',
        x: 75,
        y: 62,
        speedX: 0.11 * speedMult,
        bobPhase: 1.8,
        isRequired: false,
      }
    );

    setFloatingItems(items);
  }, []);

  // Timer & Water Level Rising
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Water level rises from 20% to 100% every 5 seconds (approx +10% every 5s)
  useEffect(() => {
    const stepInterval = character.village === 'hard' ? 3800 : character.village === 'medium' ? 5000 : 5500;
    const waterTimer = setInterval(() => {
      setWaterLevel((prev) => {
        const next = Math.min(100, prev + 10);
        return next;
      });
    }, stepInterval);

    return () => clearInterval(waterTimer);
  }, [character.village]);

  // Check Game Over / Victory
  useEffect(() => {
    // Check if won
    const hasAll = currentInv.idCard && currentInv.electricBill && currentInv.floodPhoto;
    if (hasAll) {
      setToastMessage('🎉 เก็บเอกสารสำคัญครบแล้ว! ลุยต่อด่าน 2 ทันที!');
      const timeout = setTimeout(() => {
        onSuccess(currentInv);
      }, 1200);
      return () => clearTimeout(timeout);
    }

    // Check if lost
    if (timeLeft <= 0) {
      onFail('หมดเวลา 40 วินาที! เอกสารสำคัญจมหายไปกับสายน้ำ');
    } else if (waterLevel >= 100) {
      onFail('น้ำท่วมทะลักถึง 100% มิดหลังคาบ้านแล้ว! วงดนตรีมาส่งใจ');
    }
  }, [timeLeft, waterLevel, currentInv]);

  // Animate floating items drifting
  useEffect(() => {
    let animId: number;
    const updatePositions = () => {
      setFloatingItems((prevItems) =>
        prevItems.map((item) => {
          let nextX = item.x + item.speedX;
          let nextSpeed = item.speedX;

          // Bounce off left/right edges
          if (nextX <= 5 || nextX >= 88) {
            nextSpeed = -item.speedX;
            nextX = Math.max(5, Math.min(88, nextX));
          }

          return {
            ...item,
            x: nextX,
            speedX: nextSpeed,
            bobPhase: item.bobPhase + 0.05,
          };
        })
      );
      animId = requestAnimationFrame(updatePositions);
    };

    animId = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Handle clicking items
  const handleItemClick = (item: FloatingItem) => {
    if (item.isRequired) {
      playPop();
      if (item.type === 'idCard') {
        setCurrentInv((p) => ({ ...p, idCard: true }));
        setToastMessage('✅ เก็บ "บัตรประชาชน" สำเร็จ!');
      } else if (item.type === 'electricBill') {
        setCurrentInv((p) => ({ ...p, electricBill: true }));
        setToastMessage('✅ เก็บ "บิลค่าไฟ" สำเร็จ!');
      } else if (item.type === 'floodPhoto') {
        setCurrentInv((p) => ({ ...p, floodPhoto: true }));
        setToastMessage('✅ เก็บ "รูปถ่ายน้ำท่วม" สำเร็จ!');
      }

      // Remove from water
      setFloatingItems((items) => items.filter((i) => i.id !== item.id));
    } else {
      // Fun decoys
      if (item.type === 'croc') {
        playDuckQuack();
        setToastMessage('🐊 จระเข้ยางเป่าลม! ตกใจหมดนึกว่าของจริง!');
      } else if (item.type === 'basin') {
        playWaterSplash();
        setToastMessage('🧺 กะละมังแดงลอยน้ำ ซักผ้าไม่ได้แล้วนะ!');
      } else if (item.type === 'slipper') {
        playWaterSplash();
        setToastMessage('🩴 รองเท้าแตะช้างดาวข้างเดียว ลอยไปคลองเตยแล้ว');
      } else if (item.type === 'noodle') {
        playPop();
        setToastMessage('🍜 ซองมาม่าเปียกน้ำ! เอาไว้ไปแย่งใหม่ที่ด่าน 2!');
      }
    }
  };

  return (
    <div className="relative min-h-[640px] w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 bg-sky-900 text-white flex flex-col justify-between">
      {/* Background Flooded Village Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={GameImages.bgFloodedVillage}
          alt="หมู่บ้านน้ำท่วม"
          className="w-full h-full object-cover brightness-75"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-sky-950/40" />
      </div>

      {/* Dynamic Rising Water Level Overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-sky-600/90 via-sky-500/80 to-cyan-400/70 border-t-4 border-white/60 pointer-events-none transition-all duration-700 ease-out z-10"
        style={{ height: `${waterLevel}%` }}
      >
        {/* Animated wave crest */}
        <div className="absolute -top-3 left-0 right-0 h-4 bg-[radial-gradient(circle,rgba(255,255,255,0.6)_2px,transparent_3px)] bg-[length:16px_16px] animate-pulse" />
      </div>

      {/* Top HUD */}
      <div className="relative z-20 p-4 bg-slate-900/85 backdrop-blur-md border-b-2 border-amber-300">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Stage & Title */}
          <div>
            <span className="text-[11px] font-black uppercase text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-400/40">
              ด่าน 1 จาก 3
            </span>
            <h2 className="text-lg sm:text-xl font-black font-['Kanit'] text-white">
              เก็บของหนีน้ำ (ต้องครบ 3 ชิ้น!)
            </h2>
          </div>

          {/* Time & Water Gauges */}
          <div className="flex items-center gap-3">
            {/* Countdown */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-xl border border-slate-700 shadow-inner">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" />
              <span className={`text-base font-black tabular-nums ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}>
                {timeLeft} วิ
              </span>
            </div>

            {/* Water Level Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-xl border border-slate-700 shadow-inner">
              <Waves className="w-4 h-4 text-cyan-400" />
              <span className={`text-base font-black tabular-nums ${waterLevel >= 80 ? 'text-rose-400 animate-pulse' : 'text-cyan-300'}`}>
                {waterLevel}%
              </span>
            </div>
          </div>
        </div>

        {/* Required Items Checklist */}
        <div className="mt-2.5 pt-2 border-t border-slate-700/80 grid grid-cols-3 gap-2 text-xs">
          {/* ID Card */}
          <div
            className={`p-1.5 rounded-lg border flex items-center justify-between transition-all ${
              currentInv.idCard
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-bold'
                : 'bg-slate-800/80 border-slate-600 text-slate-300'
            }`}
          >
            <span className="truncate">🪪 บัตรประชาชน</span>
            {currentInv.idCard ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
            ) : (
              <XCircle className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
            )}
          </div>

          {/* Electricity Bill */}
          <div
            className={`p-1.5 rounded-lg border flex items-center justify-between transition-all ${
              currentInv.electricBill
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-bold'
                : 'bg-slate-800/80 border-slate-600 text-slate-300'
            }`}
          >
            <span className="truncate">⚡ บิลค่าไฟ</span>
            {currentInv.electricBill ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
            ) : (
              <XCircle className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
            )}
          </div>

          {/* Flood Photo */}
          <div
            className={`p-1.5 rounded-lg border flex items-center justify-between transition-all ${
              currentInv.floodPhoto
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-bold'
                : 'bg-slate-800/80 border-slate-600 text-slate-300'
            }`}
          >
            <span className="truncate">📸 รูปน้ำท่วม</span>
            {currentInv.floodPhoto ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
            ) : (
              <XCircle className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
            )}
          </div>
        </div>
      </div>

      {/* Floating Items Playfield */}
      <div className="relative flex-1 w-full z-20 min-h-[360px] overflow-hidden select-none">
        {/* Floating Items */}
        {floatingItems.map((item) => {
          const bobY = Math.sin(item.bobPhase) * 8;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: `translateY(${bobY}px)`,
              }}
              className={`absolute cursor-pointer transition-transform active:scale-90 p-2 sm:p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg backdrop-blur-sm border-2 ${
                item.isRequired
                  ? 'bg-yellow-400/95 text-slate-950 border-white hover:bg-yellow-300 animate-pulse ring-4 ring-yellow-400/40'
                  : 'bg-white/85 text-slate-800 border-sky-300 hover:bg-white'
              }`}
              title={item.title}
            >
              <span className="text-2xl sm:text-3xl filter drop-shadow">{item.icon}</span>
              <span className="text-[10px] sm:text-xs font-black tracking-tight whitespace-nowrap bg-black/70 text-white px-1.5 py-0.5 rounded-md">
                {item.title}
              </span>
            </button>
          );
        })}

        {/* Player Avatar bobbing in lower corner */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-sky-400/60 shadow-lg">
          <CharacterAvatar config={character} size="sm" inWater={true} />
          <div className="text-left text-xs pr-2">
            <div className="font-bold text-amber-300">{character.villageName}</div>
            <div className="text-[11px] text-slate-300">"จิ้มเก็บเอกสารให้ไว!"</div>
          </div>
        </div>
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="relative z-30 p-2.5 bg-amber-400 text-amber-950 text-center font-black text-xs sm:text-sm shadow-md animate-fade-in flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-900" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Helper Bar */}
      <div className="relative z-20 px-4 py-2.5 bg-slate-900/90 text-center text-xs text-slate-300 border-t border-slate-800">
        💡 ใช้นิ้วจิ้มหรือคลิกที่เอกสารลอยน้ำ 3 ชิ้น (บัตร ปชช., บิลค่าไฟ, รูปถ่ายน้ำท่วม) ก่อนน้ำมิด 100%!
      </div>
    </div>
  );
};
