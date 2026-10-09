import React, { useState } from 'react';
import {
  CharacterConfig,
  Gender,
  Expression,
  Outfit,
  VillageDifficulty,
} from '../types/game';
import { CharacterAvatar } from './CharacterAvatar';
import { Play, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { playPop, playWaterSplash } from '../utils/audio';
import { GameImages } from '../assets/images';

interface Props {
  onStartGame: (config: CharacterConfig) => void;
}

export const CharacterSelectScreen: React.FC<Props> = ({ onStartGame }) => {
  const [gender, setGender] = useState<Gender>('male');
  const [expression, setExpression] = useState<Expression>('smile');
  const [outfitMale, setOutfitMale] = useState<Outfit>('football');
  const [outfitFemale, setOutfitFemale] = useState<Outfit>('bean_pajama');
  const [village, setVillage] = useState<VillageDifficulty>('easy');

  const currentOutfit = gender === 'male' ? outfitMale : outfitFemale;

  const handleGenderChange = (g: Gender) => {
    playPop();
    setGender(g);
  };

  const handleExpressionChange = (exp: Expression) => {
    playPop();
    setExpression(exp);
  };

  const handleOutfitChange = (out: Outfit) => {
    playPop();
    if (gender === 'male') {
      setOutfitMale(out);
    } else {
      setOutfitFemale(out);
    }
  };

  const handleVillageChange = (v: VillageDifficulty) => {
    playPop();
    setVillage(v);
  };

  const getVillageName = () => {
    switch (village) {
      case 'easy':
        return 'ซอยถั่วเขียว (โหมดชิล)';
      case 'medium':
        return 'ซอยถั่วแดง บางปลา 12';
      case 'hard':
        return 'ซอย กทม. น้ำท่วมสูงจริง (ลาดพร้าว 101 / ราม 24 / ดอนเมือง)';
    }
  };

  const handleStart = () => {
    playWaterSplash();
    onStartGame({
      gender,
      expression,
      outfit: currentOutfit,
      village,
      villageName: getVillageName(),
    });
  };

  const characterConfig: CharacterConfig = {
    gender,
    expression,
    outfit: currentOutfit,
    village,
    villageName: getVillageName(),
  };

  return (
    <div className="relative min-h-[640px] w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 bg-amber-50 text-slate-800 flex flex-col justify-between">
      {/* Background Image of Flooded Village */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src={GameImages.bgFloodedVillage}
          alt="หมู่บ้านน้ำท่วม"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Header */}
      <div className="relative z-10 px-5 pt-5 pb-3 text-center bg-gradient-to-b from-amber-200/90 to-transparent">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-amber-950 font-black text-xs rounded-full shadow-sm mb-1 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>HTML5 Survival Comedy Game</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-amber-900 tracking-tight font-['Kanit'] drop-shadow-sm">
          หมู่บ้านแห่งถั่ว - ล่า 9,000 บาท
        </h1>
        <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
          แต่งตัวผู้ประสบภัย แล้วลุยน้ำท่วมไปล่าเงินเยียวยาที่ อบต.!
        </p>
      </div>

      {/* Main Form & Avatar Area */}
      <div className="relative z-10 px-4 sm:px-6 py-2 flex flex-col md:flex-row gap-5 items-center">
        {/* Avatar Live Preview */}
        <div className="flex flex-col items-center shrink-0">
          <div className="p-4 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-md flex flex-col items-center">
            <div className="text-xs font-bold text-amber-800 mb-1">ตัวละครของคุณ</div>
            <CharacterAvatar config={characterConfig} size="lg" inWater={true} />
            <div className="mt-2 text-xs font-bold text-slate-600 bg-amber-100 px-3 py-1 rounded-full text-center max-w-[170px] truncate">
              {gender === 'male' ? 'หนุ่มสู้ชีวิต' : 'สาวแกร่งริมคลอง'}
            </div>
          </div>
        </div>

        {/* Options Controls */}
        <div className="w-full flex-1 space-y-3">
          {/* 1. Gender */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">
              1. เลือกเพศ
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleGenderChange('male')}
                className={`py-2 px-3 rounded-xl font-bold text-sm border-2 transition-all cursor-pointer ${
                  gender === 'male'
                    ? 'bg-blue-500 text-white border-blue-600 shadow-md scale-[1.02]'
                    : 'bg-white/90 text-slate-700 border-amber-200 hover:bg-white'
                }`}
              >
                👦 ชาย
              </button>
              <button
                type="button"
                onClick={() => handleGenderChange('female')}
                className={`py-2 px-3 rounded-xl font-bold text-sm border-2 transition-all cursor-pointer ${
                  gender === 'female'
                    ? 'bg-pink-500 text-white border-pink-600 shadow-md scale-[1.02]'
                    : 'bg-white/90 text-slate-700 border-amber-200 hover:bg-white'
                }`}
              >
                👧 หญิง
              </button>
            </div>
          </div>

          {/* 2. Expression */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">
              2. เลือกสีหน้า
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleExpressionChange('smile')}
                className={`py-2 px-2 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                  expression === 'smile'
                    ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-md scale-[1.02]'
                    : 'bg-white/90 text-slate-700 border-amber-200 hover:bg-white'
                }`}
              >
                😄 ยิ้มสู้
              </button>
              <button
                type="button"
                onClick={() => handleExpressionChange('sleepy')}
                className={`py-2 px-2 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                  expression === 'sleepy'
                    ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-md scale-[1.02]'
                    : 'bg-white/90 text-slate-700 border-amber-200 hover:bg-white'
                }`}
              >
                😴 หน้าง่วง
              </button>
              <button
                type="button"
                onClick={() => handleExpressionChange('pout')}
                className={`py-2 px-2 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                  expression === 'pout'
                    ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-md scale-[1.02]'
                    : 'bg-white/90 text-slate-700 border-amber-200 hover:bg-white'
                }`}
              >
                😤 หน้างอน
              </button>
            </div>
          </div>

          {/* 3. Outfits */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">
              3. เลือกชุดประจำกาย
            </label>
            {gender === 'male' ? (
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleOutfitChange('football')}
                  className={`py-2 px-1 text-center rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    outfitMale === 'football'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-[1.02]'
                      : 'bg-white/90 text-slate-700 border-amber-200 hover:bg-white'
                  }`}
                >
                  ⚽ บอล+แตะ
                </button>
                <button
                  type="button"
                  onClick={() => handleOutfitChange('yellow_duck')}
                  className={`py-2 px-1 text-center rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    outfitMale === 'yellow_duck'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-[1.02]'
                      : 'bg-white/90 text-slate-700 border-amber-200 hover:bg-white'
                  }`}
                >
                  🐥 เป็ดเหลือง
                </button>
                <button
                  type="button"
                  onClick={() => handleOutfitChange('pha_khao_ma')}
                  className={`py-2 px-1 text-center rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    outfitMale === 'pha_khao_ma'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-[1.02]'
                      : 'bg-white/90 text-slate-700 border-amber-200 hover:bg-white'
                  }`}
                >
                  🌾 ผ้าขาวม้า+งอบ
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleOutfitChange('bean_pajama')}
                  className={`py-2 px-1 text-center rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    outfitFemale === 'bean_pajama'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-[1.02]'
                      : 'bg-white/90 text-slate-700 border-amber-200 hover:bg-white'
                  }`}
                >
                  🫘 ชุดนอนถั่ว
                </button>
                <button
                  type="button"
                  onClick={() => handleOutfitChange('pink_vest')}
                  className={`py-2 px-1 text-center rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    outfitFemale === 'pink_vest'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-[1.02]'
                      : 'bg-white/90 text-slate-700 border-amber-200 hover:bg-white'
                  }`}
                >
                  🦺 ชูชีพชมพู
                </button>
                <button
                  type="button"
                  onClick={() => handleOutfitChange('vendor')}
                  className={`py-2 px-1 text-center rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    outfitFemale === 'vendor'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-[1.02]'
                      : 'bg-white/90 text-slate-700 border-amber-200 hover:bg-white'
                  }`}
                >
                  👩‍🍳 ชุดแม่ค้า
                </button>
              </div>
            )}
          </div>

          {/* 4. Village / Difficulty */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>4. เลือกหมู่บ้าน (ความยาก)</span>
              {village === 'easy' && (
                <span className="text-emerald-700 text-[11px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> เริ่มต้นมีบัตรประชาชนฟรี!
                </span>
              )}
            </label>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleVillageChange('easy')}
                className={`w-full text-left p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  village === 'easy'
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold shadow-sm'
                    : 'bg-white/90 border-amber-200 text-slate-700 hover:bg-white'
                }`}
              >
                <div>
                  <div className="text-xs sm:text-sm font-bold">🟢 ง่าย: ซอยถั่วเขียว</div>
                  <div className="text-[11px] text-slate-500">น้ำขึ้นช้า + มีบัตร ปชช. ติดตัวตั้งแต่เริ่ม</div>
                </div>
                <span className="text-xs font-black text-emerald-700">ง่าย</span>
              </button>

              <button
                type="button"
                onClick={() => handleVillageChange('medium')}
                className={`w-full text-left p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  village === 'medium'
                    ? 'bg-amber-100 border-amber-500 text-amber-950 font-bold shadow-sm'
                    : 'bg-white/90 border-amber-200 text-slate-700 hover:bg-white'
                }`}
              >
                <div>
                  <div className="text-xs sm:text-sm font-bold">🟡 ปานกลาง: ซอยถั่วแดง บางปลา 12</div>
                  <div className="text-[11px] text-slate-500">น้ำขึ้นปกติ ต้องงมหาเอกสารให้ครบ</div>
                </div>
                <span className="text-xs font-black text-amber-700">ปานกลาง</span>
              </button>

              <button
                type="button"
                onClick={() => handleVillageChange('hard')}
                className={`w-full text-left p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  village === 'hard'
                    ? 'bg-rose-100 border-rose-500 text-rose-950 font-bold shadow-sm'
                    : 'bg-white/90 border-amber-200 text-slate-700 hover:bg-white'
                }`}
              >
                <div>
                  <div className="text-xs sm:text-sm font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>🔴 ยาก: ซอย กทม. น้ำท่วมสูงจริง</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    ลาดพร้าว 101 / ราม 24 / ดอนเมือง สรงประภา (น้ำขึ้นไวมาก!)
                  </div>
                </div>
                <span className="text-xs font-black text-rose-700">ยากสุด</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Start Button */}
      <div className="relative z-10 p-5 bg-gradient-to-t from-amber-200 to-transparent flex flex-col items-center">
        <button
          onClick={handleStart}
          className="w-full max-w-md py-4 px-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xl sm:text-2xl rounded-2xl shadow-[0_8px_20px_rgba(16,185,129,0.4)] border-2 border-emerald-300 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-3 font-['Kanit']"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>ลุยน้ำเลยพี่! (เริ่มเกมส์)</span>
        </button>
      </div>
    </div>
  );
};
