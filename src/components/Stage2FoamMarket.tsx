import React, { useState, useEffect, useRef } from 'react';
import { CharacterConfig, Inventory } from '../types/game';
import { CharacterAvatar } from './CharacterAvatar';
import { AlertCircle, Sparkles, Heart, ShoppingBag, ShieldAlert } from 'lucide-react';
import { GameImages } from '../assets/images';
import {
  playPop,
  playWaterSplash,
  playGoldDing,
  playDuckQuack,
  playErrorBuzzer,
} from '../utils/audio';

interface Props {
  character: CharacterConfig;
  inventory: Inventory;
  onSuccess: (updatedInventory: Inventory) => void;
  onFail: (reason: string) => void;
}

interface VendorStock {
  noodles: number;
  water: number;
  thaiTea: number;
}

interface NPCGrabber {
  id: string;
  name: string;
  avatar: string;
  status: string;
}

export const Stage2FoamMarket: React.FC<Props> = ({
  character,
  inventory,
  onSuccess,
  onFail,
}) => {
  // Player collected quantities in this stage
  const [playerNoodles, setPlayerNoodles] = useState<number>(inventory.noodles || 0);
  const [playerWater, setPlayerWater] = useState<number>(inventory.water || 0);
  const [playerThaiTea, setPlayerThaiTea] = useState<number>(inventory.thaiTea || 0);
  const [hasGoldenBox, setHasGoldenBox] = useState<boolean>(inventory.hasGoldenBox || false);

  // Vendor remaining stock
  const [stocks, setStocks] = useState<VendorStock>({
    noodles: 6,
    water: 6,
    thaiTea: 4,
  });

  // Foam tilt physics angle
  const [foamAngle, setFoamAngle] = useState<number>(0);

  // Golden box spawn state (floats for 3 seconds)
  const [showGoldenBox, setShowGoldenBox] = useState<boolean>(false);
  const [goldenBoxCollected, setGoldenBoxCollected] = useState<boolean>(false);

  // Mee Gun Jom Palang revive state (1 time per game)
  const [hasRevived, setHasRevived] = useState<boolean>(false);
  const [showMeeGunModal, setShowMeeGunModal] = useState<boolean>(false);

  // NPC dialogue / activity
  const [npcActionText, setNpcActionText] = useState<string>('ชาวบ้านกำลังลุยน้ำมาแย่ง!');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Game timer in seconds
  const [stageTimer, setStageTimer] = useState<number>(25);

  const npcs: NPCGrabber[] = [
    { id: '1', name: 'ลุงบุญชู', avatar: '👴', status: 'วิ่งแย่งมาม่า' },
    { id: '2', name: 'เจ๊แต๋ว', avatar: '👵', status: 'เหมาขวดน้ำ' },
    { id: '3', name: 'น้องบิว ทรงเอ', avatar: '👦', status: 'จิ้มไวมาก' },
    { id: '4', name: 'ป้าสาย ขาใหญ่', avatar: '👩', status: 'แทรกคิว' },
    { id: '5', name: 'พี่หมวดโต้ง', avatar: '👮', status: 'ช่วยชาวบ้าน' },
  ];

  // Spawn Golden Box after 6 seconds
  useEffect(() => {
    const goldTimer = setTimeout(() => {
      setShowGoldenBox(true);
      playGoldDing();
      setToastMessage('✨ กล่องทองอัลติเมตลอยน้ำมาแล้ว! จิ้มให้ทันใน 3 วินาที!');

      const hideTimer = setTimeout(() => {
        setShowGoldenBox(false);
      }, 3500);

      return () => clearTimeout(hideTimer);
    }, 6000);

    return () => clearTimeout(goldTimer);
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setStageTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Wobble physics
  useEffect(() => {
    const wobbleInterval = setInterval(() => {
      // Natural gentle tilt with random nudge
      setFoamAngle((prev) => {
        const delta = (Math.random() - 0.5) * 3;
        const next = Math.max(-10, Math.min(10, prev + delta));
        return next;
      });
    }, 400);

    return () => clearInterval(wobbleInterval);
  }, []);

  // NPC snatcher loop: every 1.2 to 2 seconds, an NPC grabs something from the vendors
  useEffect(() => {
    const npcInterval = setInterval(() => {
      setStocks((prev) => {
        const availableItems: ('noodles' | 'water' | 'thaiTea')[] = [];
        if (prev.noodles > 0) availableItems.push('noodles');
        if (prev.water > 0) availableItems.push('water');
        if (prev.thaiTea > 0) availableItems.push('thaiTea');

        if (availableItems.length === 0) return prev;

        // Pick random item to snatch
        const snatchedItem = availableItems[Math.floor(Math.random() * availableItems.length)];
        const randomNpc = npcs[Math.floor(Math.random() * npcs.length)];

        const itemNameThai =
          snatchedItem === 'noodles'
            ? 'มาม่า'
            : snatchedItem === 'water'
            ? 'น้ำดื่ม'
            : 'ชาเย็น';

        setNpcActionText(`⚡ ${randomNpc.name} แย่งชิง "${itemNameThai}" ไปได้ 1 ชิ้น!`);

        return {
          ...prev,
          [snatchedItem]: Math.max(0, prev[snatchedItem] - 1),
        };
      });
    }, character.village === 'hard' ? 1200 : character.village === 'medium' ? 1700 : 2200);

    return () => clearInterval(npcInterval);
  }, [character.village]);

  // Check end conditions
  useEffect(() => {
    // Condition 1: Player secured at least 1 noodles AND 1 water
    const hasMetRequirements = playerNoodles >= 1 && playerWater >= 1;

    // Check if time up or stock completely depleted
    const totalRemaining = stocks.noodles + stocks.water + stocks.thaiTea;
    const isOut = totalRemaining === 0 || stageTimer <= 0;

    if (hasMetRequirements && (isOut || (playerNoodles >= 2 && playerWater >= 2))) {
      // Success!
      setToastMessage('🎉 แย่งเสบียงสำเร็จ! พร้อมลุย อบต. ล่า 9,000 บาท!');
      const timeout = setTimeout(() => {
        onSuccess({
          ...inventory,
          noodles: playerNoodles,
          water: playerWater,
          thaiTea: playerThaiTea,
          hasGoldenBox: goldenBoxCollected,
        });
      }, 1400);
      return () => clearTimeout(timeout);
    }

    // Failure check: supplies ran out or time expired without meeting Mama 1 + Water 1
    if (isOut && !hasMetRequirements) {
      if (!hasRevived) {
        // Trigger "Mee Gun Jom Palang" rescue!
        playDuckQuack();
        setShowMeeGunModal(true);
      } else {
        // Already used revive, absolute defeat
        playErrorBuzzer();
        onFail('แย่งเสบียงไม่ทัน! ขาดแคลนมาม่าและน้ำดื่ม อดข้าวกลางน้ำท่วม');
      }
    }
  }, [playerNoodles, playerWater, stocks, stageTimer, hasRevived]);

  // Handle Mee Gun Revive Confirmation
  const handleMeeGunRevive = () => {
    playDuckQuack();
    playPop();
    setHasRevived(true);
    setShowMeeGunModal(false);
    // Give player minimum essential supplies & extra time
    setPlayerNoodles((p) => Math.max(1, p));
    setPlayerWater((p) => Math.max(1, p));
    setStageTimer(15);
    setStocks((s) => ({
      noodles: s.noodles + 2,
      water: s.water + 2,
      thaiTea: s.thaiTea + 1,
    }));
    setToastMessage('🐥 มีกัน จอมพลัง ช่วยชุบชีวิต! ได้มาม่า+น้ำดื่มชุดฉุกเฉินแล้ว!');
  };

  // Player action: Snatch item
  const handlePlayerSnatch = (itemType: 'noodles' | 'water' | 'thaiTea') => {
    if (stocks[itemType] <= 0) {
      playErrorBuzzer();
      setToastMessage('❌ ของหมดแล้ว! โดนชาวบ้านแย่งไปก่อนหน้า');
      return;
    }

    playPop();
    setStocks((s) => ({
      ...s,
      [itemType]: s[itemType] - 1,
    }));

    if (itemType === 'noodles') {
      setPlayerNoodles((p) => p + 1);
      setToastMessage('🍜 เยี่ยม! แย่ง "มาม่า" ได้แล้ว 1 ซอง!');
    } else if (itemType === 'water') {
      setPlayerWater((p) => p + 1);
      setToastMessage('💧 ยอดเยี่ยม! แย่ง "น้ำดื่ม" ได้แล้ว 1 ขวด!');
    } else if (itemType === 'thaiTea') {
      playGoldDing();
      setPlayerThaiTea((p) => p + 1);
      setToastMessage('🧋 ว้าว! ชาเย็นชื่นใจ โบนัสพลังใจเต็มเปี่ยม!');
    }
  };

  // Player action: Click Golden Box
  const handleGoldenBoxClick = () => {
    playGoldDing();
    setGoldenBoxCollected(true);
    setShowGoldenBox(false);
    setToastMessage('🌟 สุดยอด!! ได้รับ [กล่องทองอัลติเมต]! ด่าน 3 รับ 9,000 บาททันที!');
  };

  // Foam stabilize button
  const handleStabilize = () => {
    playWaterSplash();
    setFoamAngle(0);
  };

  return (
    <div className="relative min-h-[640px] w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 bg-sky-950 text-white flex flex-col justify-between">
      {/* Background Floating Foam Market Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={GameImages.bgFoamMarket}
          alt="ตลาดโฟมลอยน้ำ"
          className="w-full h-full object-cover brightness-75"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-sky-950/45" />
      </div>

      {/* Top HUD */}
      <div className="relative z-20 p-4 bg-slate-900/90 backdrop-blur-md border-b-2 border-amber-300">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-black uppercase text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-400/40">
              ด่าน 2 จาก 3
            </span>
            <h2 className="text-lg sm:text-xl font-black font-['Kanit'] text-white">
              เซเว่นหมด ไปตลาดโฟม (แย่งเสบียง)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Timer */}
            <div className="px-3 py-1 bg-slate-800 rounded-xl border border-slate-700 text-amber-300 font-black text-sm">
              ⏱️ {stageTimer} วิ
            </div>

            {/* Golden Box Indicator */}
            {goldenBoxCollected && (
              <div className="px-2.5 py-1 bg-yellow-400 text-slate-950 rounded-xl font-black text-xs flex items-center gap-1 shadow-md animate-bounce">
                <Sparkles className="w-3.5 h-3.5 text-amber-900" />
                <span>มีกล่องทอง!</span>
              </div>
            )}
          </div>
        </div>

        {/* Player Inventory Target Bar */}
        <div className="mt-2.5 pt-2 border-t border-slate-700 grid grid-cols-3 gap-2 text-xs">
          <div
            className={`p-1.5 rounded-lg border flex items-center justify-between ${
              playerNoodles >= 1
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                : 'bg-rose-950/70 border-rose-600 text-rose-300'
            }`}
          >
            <span>🍜 มาม่า ({playerNoodles}/1)</span>
            {playerNoodles >= 1 ? '✅' : '❌ ต้องมี'}
          </div>

          <div
            className={`p-1.5 rounded-lg border flex items-center justify-between ${
              playerWater >= 1
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                : 'bg-rose-950/70 border-rose-600 text-rose-300'
            }`}
          >
            <span>💧 น้ำดื่ม ({playerWater}/1)</span>
            {playerWater >= 1 ? '✅' : '❌ ต้องมี'}
          </div>

          <div className="p-1.5 rounded-lg border border-amber-500/70 bg-amber-950/70 text-amber-300 flex items-center justify-between font-bold">
            <span>🧋 ชาเย็น ({playerThaiTea})</span>
            <span className="text-[10px] bg-amber-500 text-black px-1 rounded">โบนัส</span>
          </div>
        </div>

        {/* NPC Activity Ticker */}
        <div className="mt-1.5 text-xs text-amber-200 truncate flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{npcActionText}</span>
        </div>
      </div>

      {/* Center Interactive Wobbly Foam Raft Arena */}
      <div className="relative flex-1 w-full z-20 min-h-[380px] p-4 flex flex-col justify-between select-none">
        {/* Floating Golden Box Event */}
        {showGoldenBox && !goldenBoxCollected && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 animate-bounce">
            <button
              onClick={handleGoldenBoxClick}
              className="py-2.5 px-5 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-[0_0_30px_rgba(250,204,21,1)] border-4 border-white cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-800 animate-spin" />
              <span>🎁 กล่องทองคำอัลติเมต! (จิ้มด่วน!!)</span>
            </button>
          </div>
        )}

        {/* 3 Vendors on Styrofoam Rafts */}
        <div
          className="my-auto transition-transform duration-300 ease-out"
          style={{ transform: `rotate(${foamAngle}deg)` }}
        >
          {/* Raft platform representation */}
          <div className="max-w-xl mx-auto p-4 bg-white/95 text-slate-900 rounded-3xl border-4 border-sky-300 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-3 border-b pb-2">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1">
                🌊 แพลอยน้ำโฟมขาว (โคลงเคลง: {foamAngle > 0 ? `+${foamAngle.toFixed(1)}°` : `${foamAngle.toFixed(1)}°`})
              </span>
              <button
                onClick={handleStabilize}
                className="text-[11px] font-bold bg-sky-100 hover:bg-sky-200 text-sky-800 px-3 py-1 rounded-full border border-sky-300 cursor-pointer active:scale-95"
              >
                ⚖️ กดทรงตัวโฟม
              </button>
            </div>

            {/* 3 Vendor Stalls */}
            <div className="grid grid-cols-3 gap-3">
              {/* Vendor 1: Mama Noodles */}
              <div className="flex flex-col items-center p-3 bg-amber-50 rounded-2xl border-2 border-amber-300 text-center shadow-sm">
                <div className="text-xs font-black text-amber-900">ป้าสมใจ</div>
                <div className="text-3xl my-1">🍜</div>
                <div className="text-xs font-bold text-slate-700">บะหมี่กึ่งสำเร็จรูป</div>
                <div className="text-xs font-black text-amber-700 mt-1">
                  เหลือ: {stocks.noodles} ซอง
                </div>
                <button
                  onClick={() => handlePlayerSnatch('noodles')}
                  disabled={stocks.noodles <= 0}
                  className={`mt-2 w-full py-2 px-1 rounded-xl font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer ${
                    stocks.noodles > 0
                      ? 'bg-amber-500 hover:bg-amber-400 text-white border-2 border-amber-300'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {stocks.noodles > 0 ? 'แย่งมาม่า!' : 'หมดแล้ว'}
                </button>
              </div>

              {/* Vendor 2: Water */}
              <div className="flex flex-col items-center p-3 bg-sky-50 rounded-2xl border-2 border-sky-300 text-center shadow-sm">
                <div className="text-xs font-black text-sky-900">น้าสม</div>
                <div className="text-3xl my-1">💧</div>
                <div className="text-xs font-bold text-slate-700">น้ำดื่มสะอาด</div>
                <div className="text-xs font-black text-sky-700 mt-1">
                  เหลือ: {stocks.water} ขวด
                </div>
                <button
                  onClick={() => handlePlayerSnatch('water')}
                  disabled={stocks.water <= 0}
                  className={`mt-2 w-full py-2 px-1 rounded-xl font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer ${
                    stocks.water > 0
                      ? 'bg-sky-500 hover:bg-sky-400 text-white border-2 border-sky-300'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {stocks.water > 0 ? 'แย่งน้ำดื่ม!' : 'หมดแล้ว'}
                </button>
              </div>

              {/* Vendor 3: Thai Tea */}
              <div className="flex flex-col items-center p-3 bg-orange-50 rounded-2xl border-2 border-orange-300 text-center shadow-sm">
                <div className="text-xs font-black text-orange-900">พี่โอ ชงสด</div>
                <div className="text-3xl my-1">🧋</div>
                <div className="text-xs font-bold text-slate-700">ชาเย็นหวาน 100%</div>
                <div className="text-xs font-black text-orange-700 mt-1">
                  เหลือ: {stocks.thaiTea} แก้ว
                </div>
                <button
                  onClick={() => handlePlayerSnatch('thaiTea')}
                  disabled={stocks.thaiTea <= 0}
                  className={`mt-2 w-full py-2 px-1 rounded-xl font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer ${
                    stocks.thaiTea > 0
                      ? 'bg-orange-500 hover:bg-orange-400 text-white border-2 border-orange-300'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {stocks.thaiTea > 0 ? 'แย่งชาเย็น!' : 'หมดแล้ว'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Floating Villagers & Player */}
        <div className="flex items-center justify-between gap-2 bg-slate-900/80 p-2.5 rounded-2xl border border-sky-400/50 backdrop-blur-sm">
          {/* Player avatar */}
          <div className="flex items-center gap-2">
            <CharacterAvatar config={character} size="sm" inWater={true} />
            <div className="text-xs">
              <div className="font-bold text-yellow-300">ตัวคุณบนโฟม</div>
              <div className="text-slate-300 text-[11px]">
                {playerNoodles >= 1 && playerWater >= 1 ? '✅ ผ่านเกณฑ์แล้ว!' : '⚠️ ต้องการมาม่า 1 + น้ำ 1'}
              </div>
            </div>
          </div>

          {/* 5 NPC icons swarming */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {npcs.map((npc) => (
              <div
                key={npc.id}
                title={`${npc.name}: ${npc.status}`}
                className="w-8 h-8 rounded-full bg-slate-800 border border-amber-300/40 flex items-center justify-center text-base"
              >
                {npc.avatar}
              </div>
            ))}
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
        💡 จิ้มปุ่มแย่งซื้อให้ไวแข่งกับ NPC! ต้องได้ มาม่า อย่างน้อย 1 + น้ำดื่ม 1 ถึงจะผ่าน!
      </div>

      {/* RESCUE MODAL: มีกัน จอมพลัง (Mee Gun Jom Palang) */}
      {showMeeGunModal && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl border-4 border-amber-400 p-5 shadow-2xl flex flex-col items-center text-center">
            {/* Mee Gun Hero Image */}
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-amber-400 shadow-lg mb-3">
              <img
                src={GameImages.meeGunHero}
                alt="มีกัน จอมพลัง"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="inline-block px-3 py-1 bg-yellow-400 text-yellow-950 font-black text-xs rounded-full uppercase tracking-wider mb-2">
              🚨 หน่วยกู้ภัยพิเศษมาช่วยแล้ว!
            </div>

            <h3 className="text-2xl font-black text-amber-900 font-['Kanit']">
              "มีกัน จอมพลัง" ขี่ห่วงยางเป็ดมาช่วย!
            </h3>

            <p className="mt-2 text-sm text-slate-700 leading-relaxed font-medium">
              "อย่าเพิ่งยอมแพ้พี่น้อง! ข้าพเจ้าเอามาม่าและน้ำดื่มถุงยังชีพสำรองมาให้! ตั้งสติแล้วฮึดสู้ไปต่อ!"
            </p>

            <div className="mt-3 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
              ⚡ สิทธิ์ชุบชีวิตฟรี 1 ครั้งต่อเกมส์ (ถ้าพลาดอีกรอบจะแพ้จริงนะ!)
            </div>

            <button
              onClick={handleMeeGunRevive}
              className="mt-4 w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-lg rounded-2xl shadow-lg border-2 border-emerald-300 cursor-pointer active:scale-95 font-['Kanit']"
            >
              รับถุงยังชีพแล้วสู้ต่อ!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
