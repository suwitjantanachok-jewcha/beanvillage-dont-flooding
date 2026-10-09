/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GameStage,
  CharacterConfig,
  Inventory,
} from './types/game';
import { CharacterSelectScreen } from './components/CharacterSelectScreen';
import { Stage1Flood } from './components/Stage1Flood';
import { Stage2FoamMarket } from './components/Stage2FoamMarket';
import { Stage3ObTorTor } from './components/Stage3ObTorTor';
import { DefeatScreen } from './components/DefeatScreen';
import { VictoryScreen } from './components/VictoryScreen';
import { SoundToggle } from './components/SoundToggle';
import { Sparkles, Waves, RefreshCw } from 'lucide-react';

const initialInventory: Inventory = {
  idCard: false,
  electricBill: false,
  floodPhoto: false,
  noodles: 0,
  water: 0,
  thaiTea: 0,
  hasGoldenBox: false,
};

const defaultCharacter: CharacterConfig = {
  gender: 'male',
  expression: 'smile',
  outfit: 'football',
  village: 'easy',
  villageName: 'ซอยถั่วเขียว',
};

export default function App() {
  const [stage, setStage] = useState<GameStage>('SELECT_CHARACTER');
  const [character, setCharacter] = useState<CharacterConfig>(defaultCharacter);
  const [inventory, setInventory] = useState<Inventory>(initialInventory);
  const [defeatReason, setDefeatReason] = useState<string>('');
  const [finalVictoryAmount, setFinalVictoryAmount] = useState<number>(9000);
  const [hadGoldenBoxPass, setHadGoldenBoxPass] = useState<boolean>(false);

  // Start from Stage 1
  const handleStartGame = (config: CharacterConfig) => {
    setCharacter(config);
    // If easy village, player starts with citizen ID card already!
    const startingInventory: Inventory = {
      ...initialInventory,
      idCard: config.village === 'easy',
    };
    setInventory(startingInventory);
    setStage('STAGE_1_FLOOD');
  };

  // Stage 1 -> Stage 2
  const handleStage1Success = (updatedInv: Inventory) => {
    setInventory(updatedInv);
    setStage('STAGE_2_FOAM_MARKET');
  };

  // Stage 2 -> Stage 3
  const handleStage2Success = (updatedInv: Inventory) => {
    setInventory(updatedInv);
    setStage('STAGE_3_OB_TOR_TOR');
  };

  // Stage 3 -> Victory
  const handleStage3Victory = (amount: number, hadGoldenBox: boolean) => {
    setFinalVictoryAmount(amount);
    setHadGoldenBoxPass(hadGoldenBox);
    setStage('VICTORY');
  };

  // Any Stage -> Defeat
  const handleDefeat = (reason: string) => {
    setDefeatReason(reason);
    setStage('DEFEAT');
  };

  // Full Restart
  const handleRestart = () => {
    setStage('SELECT_CHARACTER');
    setInventory(initialInventory);
    setDefeatReason('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-sky-50 to-amber-100 text-slate-800 flex flex-col font-['Prompt']">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-2xl filter drop-shadow">🫘</span>
            <div>
              <h1 className="text-base sm:text-lg font-black text-amber-950 tracking-tight font-['Kanit'] leading-tight">
                หมู่บ้านแห่งถั่ว - ล่า 9,000 บาท
              </h1>
              <div className="text-[11px] text-slate-500 font-medium">
                เกมส์ 2D เอาชีวิตรอดน้ำท่วมและผจญภัย อบต.
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {stage !== 'SELECT_CHARACTER' && (
              <button
                onClick={handleRestart}
                className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full text-xs font-bold border border-amber-300 flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
                title="กลับหน้าเลือกตัวละคร"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">เริ่มใหม่</span>
              </button>
            )}
            <SoundToggle />
          </div>
        </div>

        {/* Stage Progress Bar (Visible during gameplay) */}
        {stage !== 'SELECT_CHARACTER' && stage !== 'DEFEAT' && stage !== 'VICTORY' && (
          <div className="bg-amber-50/80 border-t border-amber-200/50 px-4 py-1.5 text-xs">
            <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 sm:gap-4 font-bold text-slate-600">
              <span className={stage === 'STAGE_1_FLOOD' ? 'text-amber-800 font-black' : 'opacity-60'}>
                1. เก็บของหนีน้ำ {stage !== 'STAGE_1_FLOOD' && '✓'}
              </span>
              <span>→</span>
              <span className={stage === 'STAGE_2_FOAM_MARKET' ? 'text-amber-800 font-black' : 'opacity-60'}>
                2. ตลาดโฟมลอยน้ำ {stage === 'STAGE_3_OB_TOR_TOR' && '✓'}
              </span>
              <span>→</span>
              <span className={stage === 'STAGE_3_OB_TOR_TOR' ? 'text-amber-800 font-black' : 'opacity-60'}>
                3. ล่า 9,000 ที่ อบต.
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Main Game Screen Canvas */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-6 flex flex-col justify-center items-center">
        {stage === 'SELECT_CHARACTER' && (
          <CharacterSelectScreen onStartGame={handleStartGame} />
        )}

        {stage === 'STAGE_1_FLOOD' && (
          <Stage1Flood
            character={character}
            inventory={inventory}
            onSuccess={handleStage1Success}
            onFail={handleDefeat}
          />
        )}

        {stage === 'STAGE_2_FOAM_MARKET' && (
          <Stage2FoamMarket
            character={character}
            inventory={inventory}
            onSuccess={handleStage2Success}
            onFail={handleDefeat}
          />
        )}

        {stage === 'STAGE_3_OB_TOR_TOR' && (
          <Stage3ObTorTor
            character={character}
            inventory={inventory}
            onVictory={handleStage3Victory}
            onFail={handleDefeat}
          />
        )}

        {stage === 'DEFEAT' && (
          <DefeatScreen reason={defeatReason} onRestart={handleRestart} />
        )}

        {stage === 'VICTORY' && (
          <VictoryScreen
            amount={finalVictoryAmount}
            character={character}
            hadGoldenBox={hadGoldenBoxPass}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-3 text-xs text-slate-500 border-t border-amber-200/50 bg-white/50">
        <div className="flex items-center justify-center gap-1">
          <span>🇹🇭 หมู่บ้านแห่งถั่ว - ล่า 9,000 บาท</span>
          <span>·</span>
          <span>เล่นได้ทันทีบนคอมและมือถือ</span>
        </div>
      </footer>
    </div>
  );
}
