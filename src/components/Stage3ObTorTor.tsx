import React, { useState, useEffect } from 'react';
import { CharacterConfig, Inventory, CourierType, CourierOption } from '../types/game';
import { CharacterAvatar } from './CharacterAvatar';
import {
  FileText,
  AlertOctagon,
  CheckCircle,
  Truck,
  RotateCcw,
  Sparkles,
  Coins,
  ShieldAlert,
} from 'lucide-react';
import { GameImages } from '../assets/images';
import {
  playStamp,
  playErrorBuzzer,
  playMotorcycleWin,
  playGoldDing,
  playPop,
} from '../utils/audio';

interface Props {
  character: CharacterConfig;
  inventory: Inventory;
  onVictory: (finalAmount: number, hadGoldenBox: boolean) => void;
  onFail: (reason: string) => void;
}

interface QuestionRound {
  stepNumber: number;
  docTitle: string;
  officialStatement: string;
  officialExcuse: string;
  options: {
    text: string;
    isCorrect: boolean;
    reply: string;
  }[];
}

export const Stage3ObTorTor: React.FC<Props> = ({
  character,
  inventory,
  onVictory,
  onFail,
}) => {
  // Relief funds: starts at 9,000 Baht, lowest 3,000 Baht
  const [reliefFunds, setReliefFunds] = useState<number>(9000);
  const [strikes, setStrikes] = useState<number>(0); // Max 3 strikes
  const [courierUsesRemaining, setCourierUsesRemaining] = useState<number>(4);

  // Current questioning step (0, 1, 2)
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [stampedDocs, setStampedDocs] = useState<boolean[]>([false, false, false]);

  // Delivery rider pending animation
  const [isCourierRiding, setIsCourierRiding] = useState<boolean>(false);
  const [courierStatusText, setCourierStatusText] = useState<string>('');

  const [dialogueText, setDialogueText] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const couriers: CourierOption[] = [
    {
      id: 'grab',
      name: 'Grab Express',
      cost: 500,
      delayMs: 600,
      desc: 'หัก 500 บาท ส่งเอกสารถึงมือไวปานสายฟ้า',
      badgeColor: 'bg-emerald-600',
    },
    {
      id: 'lineman',
      name: 'LINE MAN',
      cost: 500,
      delayMs: 600,
      desc: 'หัก 500 บาท ไรเดอร์เสื้อเขียวเร่งเครื่องเต็มสูบ',
      badgeColor: 'bg-green-500',
    },
    {
      id: 'bolt',
      name: 'BOLT Rider',
      cost: 500,
      delayMs: 600,
      desc: 'หัก 500 บาท ซิ่งลัดเลาะมาส่งเอกสารทันใจ',
      badgeColor: 'bg-teal-600',
    },
    {
      id: 'village_win',
      name: 'วินมอไซค์หมู่บ้าน',
      cost: 0,
      delayMs: 4000,
      desc: 'ฟรี 0 บาท! แต่วิ่งช้าหน่อย แวะเติมลมแป๊บ',
      badgeColor: 'bg-orange-500',
    },
  ];

  const questions: QuestionRound[] = [
    {
      stepNumber: 1,
      docTitle: 'ช่องที่ 1: ยื่นบัตรประชาชน',
      officialStatement: 'เอกสารนี้คุณลืมเอามานะครับ! แล้วทำไมหน้าในบัตรไม่เหมือนตัวจริง?!',
      officialExcuse: 'เจ้าหน้าที่ อบต.: "รูปในบัตรหน้าผอม แต่ตัวจริงแก้มบวมน้ำท่วมนะครับ!"',
      options: [
        {
          text: 'นี่ครับบัตรประชาชนตัวจริงเพิ่งเก็บมาจากน้ำท่วม หน้าบวมเพราะอดนอนครับ!',
          isCorrect: true,
          reply: 'เจ้าหน้าที่: เอ่อ... เหตุผลฟังขึ้น ประทับตราผ่าน!',
        },
        {
          text: 'งั้นผมใช้บัตรสมาชิกร้านหมูกระทะแทนได้ไหมครับ มีแต้มสะสมเยอะ',
          isCorrect: false,
          reply: 'เจ้าหน้าที่: บ้าไปแล้ว! ไม่ใช่ร้านบุฟเฟต์นะคุณ!',
        },
        {
          text: 'ลืมเอามาครับ ขอยืมบัตรประชาชนของคนข้างๆ ยื่นแทนได้ปะ',
          isCorrect: false,
          reply: 'เจ้าหน้าที่: ผิดกฎหมายชัดเจน! หักเงินเยียวยา!',
        },
      ],
    },
    {
      stepNumber: 2,
      docTitle: 'ช่องที่ 2: ยื่นรูปถ่ายน้ำท่วม',
      officialStatement: 'รูปตอนตาตุ่มใช้ไม่ได้นะครับ! ระเบียบใหม่ต้องท่วมมิดระดับเอว!',
      officialExcuse: 'เจ้าหน้าที่ อบต.: "น้ำท่วมแค่ตาตุ่มถือว่าพรมน้ำมนต์ครับ ไม่ใช่อุทกภัย!"',
      options: [
        {
          text: 'ดูรูปนี้สิครับ! มิดอก มิดคอ แทบจะว่ายน้ำไปเก็บผักบุ้งแล้ว!',
          isCorrect: true,
          reply: 'เจ้าหน้าที่: โอ้โห ท่วมสูงจริงอันนี้ ยอมรับก็ได้!',
        },
        {
          text: 'ผมตักน้ำใส่ถังมาวางหน้าโต๊ะให้ดูเลยครับ จะได้รู้ว่าท่วมจริง',
          isCorrect: false,
          reply: 'เจ้าหน้าที่: อย่าเอาน้ำเน่ามาเทในห้องแอร์ อบต. สิ!',
        },
        {
          text: 'ตาตุ่มบ้านผมอยู่สูงนะพี่ สูงเท่าตู้เย็นเลย',
          isCorrect: false,
          reply: 'เจ้าหน้าที่: โกหกหน้าตาย! หักเงินเยียวยา!',
        },
      ],
    },
    {
      stepNumber: 3,
      docTitle: 'ช่องที่ 3: ยื่นบิลค่าไฟและรับรองสำเนา',
      officialStatement: 'สำเนาของสำเนาใช้ไม่ได้นะครับ! แล้วคุณเซ็นชื่อด้วยปากกาอะไร?!',
      officialExcuse: 'เจ้าหน้าที่ อบต.: "ต้องปากกาหมึกซึมสีน้ำเงินเท่านั้น ห้ามหมึกดำ ห้ามลิควิด!"',
      options: [
        {
          text: 'ผมเซ็นกำกับด้วยปากกาหมึกสีน้ำเงิน เขียนว่า "สำเนาถูกต้องเพื่อรับเงิน 9,000" เรียบร้อยครับ!',
          isCorrect: true,
          reply: 'เจ้าหน้าที่: เป๊ะตามระเบียบทุกตัวอักษร! อนุมัติ!',
        },
        {
          text: 'ผมใช้ดินสอ 2B วาดรูปหัวใจกำกับแทนลายเซ็นครับ น่ารักดี',
          isCorrect: false,
          reply: 'เจ้าหน้าที่: เล่นเป็นเด็กประถมไปได้! เอกสารตกหล่น!',
        },
        {
          text: 'ไม่มีปากกาน้ำเงิน เลยเอาลิปสติกสีแดงปาดแทนครับ ชัดเจนดี',
          isCorrect: false,
          reply: 'เจ้าหน้าที่: เลอะเทอะโต๊ะทำงานผมหมด! หักเงินเยียวยา!',
        },
      ],
    },
  ];

  // Golden Box instant pass check
  if (inventory.hasGoldenBox) {
    return (
      <div className="relative min-h-[640px] w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 bg-amber-50 text-slate-800 flex flex-col justify-between p-6">
        <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
          <img
            src={GameImages.bgObTorTorOffice}
            alt="ห้องทำงาน อบต."
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 text-center pt-4">
          <div className="inline-block p-3 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full shadow-lg border-2 border-white mb-3 animate-bounce">
            <Sparkles className="w-8 h-8 text-amber-950" />
          </div>
          <h2 className="text-3xl font-black text-amber-900 font-['Kanit']">
            กล่องทองคำอัลติเมตสำแดงเดช!
          </h2>
          <p className="mt-2 text-sm text-slate-700 font-medium max-w-md mx-auto">
            เจ้าหน้าที่ อบต. เห็นกล่องทองคำจากส่วนกลางแล้วถึงกับลุกขึ้นยืนทำความเคารพ!
          </p>
        </div>

        <div className="relative z-10 my-auto p-6 bg-white/95 rounded-3xl border-2 border-amber-300 shadow-xl text-center max-w-md mx-auto">
          <div className="text-5xl mb-2 animate-pulse">👑</div>
          <div className="text-xl font-black text-slate-900 font-['Kanit']">
            "ไม่ต้องเถียง ไม่ต้องตรวจเอกสาร!"
          </div>
          <p className="mt-2 text-sm text-slate-600">
            "นี่มันเอกสารคำสั่งพิเศษ อนุมัติเงินเยียวยาสูงสุดเต็มอัตรา 9,000 บาททันทีครับท่าน!"
          </p>

          <div className="mt-4 p-4 bg-amber-100 rounded-2xl border border-amber-300 flex items-center justify-center gap-2 text-3xl font-black text-amber-700 font-['Kanit']">
            <Coins className="w-8 h-8 text-amber-500" />
            <span>9,000 บาทเต็ม!</span>
          </div>
        </div>

        <div className="relative z-10 pb-4 text-center">
          <button
            onClick={() => onVictory(9000, true)}
            className="w-full max-w-md py-4 px-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xl rounded-2xl shadow-xl border-2 border-emerald-300 cursor-pointer active:scale-95 font-['Kanit']"
          >
            รับเงิน 9,000 บาท เข้าบัญชีเลย!
          </button>
        </div>
      </div>
    );
  }

  // Handle Option Click
  const handleSelectOption = (isCorrect: boolean, reply: string) => {
    if (isCorrect) {
      playStamp();
      const updatedStamped = [...stampedDocs];
      updatedStamped[currentRoundIdx] = true;
      setStampedDocs(updatedStamped);
      setDialogueText(`✅ ${reply}`);
      setToastMessage('🎉 ปั๊มตราผ่านเรียบร้อย 1 ช่อง!');

      // Check if finished all 3
      if (currentRoundIdx + 1 >= questions.length) {
        setTimeout(() => {
          onVictory(reliefFunds, false);
        }, 1500);
      } else {
        setTimeout(() => {
          setCurrentRoundIdx((prev) => prev + 1);
          setDialogueText('');
        }, 1300);
      }
    } else {
      // Wrong answer
      playErrorBuzzer();
      const nextStrikes = strikes + 1;
      const nextFunds = Math.max(3000, reliefFunds - 1000);
      setReliefFunds(nextFunds);
      setStrikes(nextStrikes);
      setDialogueText(`❌ ${reply} (เงินเยียวยาลดลงเหลือ ${nextFunds.toLocaleString()} บาท!)`);
      setToastMessage('⚠️ ตอบผิด! โดน อบต. หักเงิน 1,000 บาท');

      if (nextStrikes >= 3) {
        // Check if user has courier uses left to save themselves
        if (courierUsesRemaining <= 0) {
          setTimeout(() => {
            onFail('โดนเจ้าหน้าที่ อบต. ตีกลับเอกสารครบ 3 รอบ! แพ้แล้วจ้า ต้องเริ่มใหม่');
          }, 1500);
        } else {
          setDialogueText('🚨 โดนหักครบ 3 ครั้งแล้ว! รีบกดใช้สกิลเรียกคนส่งเอกสารด่วน!');
        }
      }
    }
  };

  // Handle Calling Rider Courier
  const handleCallCourier = (courier: CourierOption) => {
    if (courierUsesRemaining <= 0 || isCourierRiding) return;

    if (courier.cost > 0 && reliefFunds - courier.cost < 3000) {
      setToastMessage('❌ เงินเยียวยาเหลือน้อยเกินไป ไม่สามารถหักค่าส่งเพิ่มได้');
      return;
    }

    setIsCourierRiding(true);
    setCourierUsesRemaining((prev) => prev - 1);

    if (courier.id === 'village_win') {
      playMotorcycleWin();
      setCourierStatusText('🛵 วินมอไซค์หมู่บ้าน: "บรื้นนน แว้นนนน! กำลังซิ่งฝ่าน้ำท่วมมาส่งเอกสารให้!"');
    } else {
      playPop();
      setCourierStatusText(`🛵 ${courier.name}: รับออเดอร์แล้ว กำลังส่งเอกสารถึง อบต.!`);
    }

    setTimeout(() => {
      setIsCourierRiding(false);
      playGoldDing();

      // Deduct courier cost from relief fund if any
      const nextFunds = Math.max(3000, reliefFunds - courier.cost);
      setReliefFunds(nextFunds);

      // Erase 1 strike
      setStrikes((s) => Math.max(0, s - 1));
      setToastMessage(`✨ ${courier.name} นำเอกสารตัวจริงมาส่งถึงมือ! ลบความผิดพลาด 1 ครั้ง!`);
      setDialogueText('เจ้าหน้าที่: เอ่อ... เอกสารมาทันเวลาพอดี ถือว่ายกประโยชน์ให้จำเลย!');
    }, courier.delayMs);
  };

  const currentQ = questions[currentRoundIdx] || questions[0];

  return (
    <div className="relative min-h-[640px] w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 bg-amber-50 text-slate-800 flex flex-col justify-between">
      {/* Background Government Office Image */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src={GameImages.bgObTorTorOffice}
          alt="ห้อง อบต."
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Top HUD: Funds Gauge & Strikes */}
      <div className="relative z-20 p-4 bg-slate-900/95 backdrop-blur-md border-b-2 border-amber-300 text-white">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-black uppercase text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-400/40">
              ด่าน 3 FINAL BOSS
            </span>
            <h2 className="text-lg sm:text-xl font-black font-['Kanit'] text-white">
              ล่า 9,000 ที่ อบต. (ด่านประทับตรา)
            </h2>
          </div>

          {/* Relief Funds Meter */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl border border-yellow-300 text-slate-950 font-black text-sm sm:text-base flex items-center gap-1.5 shadow-md">
              <Coins className="w-5 h-5 text-amber-950" />
              <span>{reliefFunds.toLocaleString()} บาท</span>
            </div>

            {/* Strikes Indicator */}
            <div className="px-2.5 py-1 bg-slate-800 rounded-xl border border-slate-700 flex items-center gap-1 text-xs">
              <span className="text-slate-400">ผิด:</span>
              <span className={`font-black ${strikes >= 2 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
                {strikes}/3
              </span>
            </div>
          </div>
        </div>

        {/* 3 Document Submission Trays */}
        <div className="mt-2.5 pt-2 border-t border-slate-700 grid grid-cols-3 gap-2 text-xs">
          {questions.map((q, idx) => (
            <div
              key={q.stepNumber}
              className={`p-1.5 rounded-lg border flex items-center justify-between transition-all ${
                stampedDocs[idx]
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                  : currentRoundIdx === idx
                  ? 'bg-amber-950/80 border-amber-400 text-amber-300 font-bold ring-2 ring-amber-400/40'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400'
              }`}
            >
              <span className="truncate">ช่องที่ {idx + 1}</span>
              {stampedDocs[idx] ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <FileText className="w-4 h-4 text-slate-500 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Office Interrogation Desk */}
      <div className="relative z-20 flex-1 p-4 sm:p-5 flex flex-col justify-between">
        {/* Official's Desk & Speech Bubble */}
        <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-md">
          <div className="flex items-start gap-3">
            {/* Official Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-400 flex flex-col items-center justify-center text-2xl shrink-0 shadow-inner">
              👨‍💼
              <span className="text-[9px] font-black text-amber-900 leading-none mt-0.5">จนท.อบต.</span>
            </div>

            <div className="flex-1">
              <div className="text-xs font-bold text-amber-800">{currentQ.docTitle}</div>
              <p className="text-sm sm:text-base font-bold text-slate-900 mt-0.5 font-['Prompt']">
                "{currentQ.officialStatement}"
              </p>
              <p className="text-xs text-slate-500 italic mt-0.5">
                {currentQ.officialExcuse}
              </p>
            </div>
          </div>

          {/* Reaction / Status Line */}
          {dialogueText && (
            <div className="mt-2.5 pt-2 border-t border-slate-200 text-xs sm:text-sm font-bold text-slate-800">
              {dialogueText}
            </div>
          )}
        </div>

        {/* Player Options (3 choices) */}
        <div className="my-3 space-y-2">
          <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>เลือกคำตอบ / ยื่นเอกสารแก้ต่าง:</span>
            <span className="text-slate-500 text-[11px]">ตอบถูก = ประทับตราผ่าน</span>
          </div>

          {currentQ.options.map((opt, oIdx) => (
            <button
              key={oIdx}
              onClick={() => handleSelectOption(opt.isCorrect, opt.reply)}
              className="w-full text-left p-3 rounded-xl border-2 border-amber-200 bg-white/95 hover:bg-amber-50 hover:border-amber-400 text-slate-800 font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.99] cursor-pointer"
            >
              {opt.text}
            </button>
          ))}
        </div>

        {/* Courier Rider Skill System */}
        <div className="p-3 bg-amber-100/90 rounded-2xl border border-amber-300 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-amber-950 flex items-center gap-1">
              <Truck className="w-4 h-4 text-amber-800" />
              <span>สกิลเรียกคนส่งเอกสาร (เหลือ {courierUsesRemaining} ครั้ง)</span>
            </span>
            <span className="text-[11px] text-slate-600 font-medium">
              กดใช้เพื่อลบความผิดพลาด 1 ครั้ง!
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {couriers.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCallCourier(c)}
                disabled={courierUsesRemaining <= 0 || isCourierRiding}
                className={`p-2 rounded-xl text-center text-white text-xs font-bold shadow-sm transition-transform active:scale-95 cursor-pointer ${
                  c.badgeColor
                } ${courierUsesRemaining <= 0 || isCourierRiding ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'}`}
              >
                <div className="font-black truncate">{c.name}</div>
                <div className="text-[10px] opacity-90">
                  {c.cost > 0 ? `หัก ${c.cost}บ.` : 'ฟรี 0บ. (ช้า)'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courier Riding Loading Banner */}
      {isCourierRiding && (
        <div className="relative z-30 p-2.5 bg-orange-500 text-white text-center font-bold text-xs sm:text-sm shadow-md animate-pulse flex items-center justify-center gap-2">
          <Truck className="w-4 h-4 animate-bounce" />
          <span>{courierStatusText}</span>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMessage && !isCourierRiding && (
        <div className="relative z-30 p-2.5 bg-amber-400 text-amber-950 text-center font-black text-xs sm:text-sm shadow-md animate-fade-in flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-900" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer Helper */}
      <div className="relative z-20 px-4 py-2.5 bg-slate-900/90 text-center text-xs text-slate-300 border-t border-slate-800">
        💡 ตอบให้ถูกช่องเพื่อประทับตราครบ 3 ใบ! ถ้าทำผิด 3 ครั้งจะแพ้ หรือกดเรียกไรเดอร์มาช่วยส่งเอกสารได้!
      </div>
    </div>
  );
};
