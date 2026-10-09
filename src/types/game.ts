export type Gender = 'male' | 'female';

export type Expression = 'smile' | 'sleepy' | 'pout';

export type OutfitMale = 'football' | 'yellow_duck' | 'pha_khao_ma';
export type OutfitFemale = 'bean_pajama' | 'pink_vest' | 'vendor';
export type Outfit = OutfitMale | OutfitFemale;

export type VillageDifficulty = 'easy' | 'medium' | 'hard';

export interface CharacterConfig {
  gender: Gender;
  expression: Expression;
  outfit: Outfit;
  village: VillageDifficulty;
  villageName: string;
}

export type GameStage = 
  | 'SELECT_CHARACTER'
  | 'STAGE_1_FLOOD'
  | 'STAGE_2_FOAM_MARKET'
  | 'STAGE_3_OB_TOR_TOR'
  | 'DEFEAT'
  | 'VICTORY';

export interface Inventory {
  idCard: boolean;
  electricBill: boolean;
  floodPhoto: boolean;
  noodles: number;
  water: number;
  thaiTea: number;
  hasGoldenBox: boolean;
}

export type CourierType = 'grab' | 'lineman' | 'bolt' | 'village_win';

export interface CourierOption {
  id: CourierType;
  name: string;
  cost: number;
  delayMs: number;
  desc: string;
  badgeColor: string;
}
