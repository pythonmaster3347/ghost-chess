import React from 'react';
import type { PieceSymbol } from 'chess.js';
import type { SkinSet } from './components/SkinShopModal';
import type { KeyType } from './components/ChestShopModal';

// --- POINT & PRICE CONSTANTS ---
export const PIECE_POINT_VALUES: { [key: string]: number } = {
    p: 10,
    n: 30,
    b: 30,
    r: 50,
    q: 90,
};

export const SKIN_PRICES: { [key in Exclude<SkinSet, 'default'>]: number } = {
    ghost: 250,
    angel: 500,
    devil: 500,
    crystal: 1000,
};

export const KEY_DROP_CHANCES: { [key in KeyType]: number } = {
    gold: 0.15,
    silver: 0.20,
    bronze: 0.50,
};

export const CHEST_REWARDS: { [key in KeyType]: { min: number; max: number } } = {
    bronze: { min: 50, max: 150 },
    silver: { min: 200, max: 500 },
    gold: { min: 600, max: 1200 },
};


// --- DEFAULT PIECES ---
const KingDefault: React.FC<{}> = () => (
    <svg viewBox="0 0 45 45" className="w-full h-full">
        <g fill="none" fillRule="evenodd" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.5 11.63V6M20 8h5" />
            <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="currentColor" strokeLinecap="butt" />
            <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-5s9-6.5 6-12.5c-4-6.5-13.5-3.5-16.5 5.5v0c-3-9-12.5-12-16.5-5.5-3 6 6 12.5 6 12.5v5z" fill="currentColor" />
            <path d="M11.5 30c5.5-3 15.5-3 21 0M11.5 33.5c5.5-3 15.5-3 21 0M11.5 37c5.5-2.5 15.5-2.5 21 0" />
        </g>
    </svg>
);

const QueenDefault: React.FC<{}> = () => (
    <svg viewBox="0 0 45 45" className="w-full h-full">
        <g fill="none" fillRule="evenodd" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.5 37c5.5 3.5 15.5 3.5 21 0v-5s9-6.5 6-12.5c-4-6.5-13.5-3.5-16.5 5.5v0c-3-9-12.5-12-16.5-5.5-3 6 6 12.5 6 12.5v5z" fill="currentColor" />
            <path d="M11.5 30c5.5-3 15.5-3 21 0M11.5 33.5c5.5-3 15.5-3 21 0M11.5 37c5.5-2.5 15.5-2.5 21 0" />
            <path d="M9 16a13.5 13.5 0 0113.5-8 13.5 13.5 0 0113.5 8v0c0 0-1.5-2.5-5-2.5s-5 2.5-5 2.5-2.5-2.5-5-2.5-5 2.5-5 2.5z" fill="currentColor" />
            <circle cx="6" cy="12" r="2" fill="currentColor" />
            <circle cx="14" cy="9" r="2" fill="currentColor" />
            <circle cx="22.5" cy="8" r="2" fill="currentColor" />
            <circle cx="31" cy="9" r="2" fill="currentColor" />
            <circle cx="39" cy="12" r="2" fill="currentColor" />
        </g>
    </svg>
);

const RookDefault: React.FC<{}> = () => (
    <svg viewBox="0 0 45 45" className="w-full h-full">
        <g fill="currentColor" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" strokeLinecap="butt" />
            <path d="M34 14l-3 3H14l-3-3" />
            <path d="M31 17v12.5H14V17" />
            <path d="M14 29.5l1.5 2.5h14l1.5-2.5" />
            <path d="M11 14h23" fill="none" />
        </g>
    </svg>
);

const BishopDefault: React.FC<{}> = () => (
    <svg viewBox="0 0 45 45" className="w-full h-full">
        <g fill="currentColor" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5h-20zM12 36v-4h21v4H12z" />
            <path d="M14.5 24.5c4.5-5 11.5-5 16 0 .5 2.5-1.5 5.5-8 5.5s-8.5-3-8-5.5z" />
            <path d="M22.5 24.5s-2-2-2-3.5c0-1.5 2-1.5 2-1.5s2 0 2 1.5c0 1.5-2 3.5-2 3.5z" fill="none" />
            <path d="M17.5 14c2-2.5 7.5-2.5 9.5 0" fill="none" strokeLinecap="butt" />
        </g>
    </svg>
);

const KnightDefault: React.FC<{}> = () => (
    <svg viewBox="0 0 45 45" className="w-full h-full">
        <g fill="currentColor" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM12 21.5v-1c0-2 1.5-4.5 4.5-4.5h3c2 0 3 2 3 4s-1 4-2.5 4.5l-2 2.5-3 2-2-5.5z" />
            <path d="M13.5 21c-1.5-2.5-1-5 1.5-7 2-1.5 4 0 5 1 2-1.5 5-1 6.5 1l-1.5 2-2.5-1-1 3.5 2 2.5s-2 1-3.5 0l-4-4z" />
        </g>
    </svg>
);

const PawnDefault: React.FC<{}> = () => (
    <svg viewBox="0 0 45 45" className="w-full h-full">
        <g fill="currentColor" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4z" />
            <path d="M17.5 17.5 C 20 25, 20 30, 16 37 H 29 C 25 30, 25 25, 27.5 17.5 Z" />
        </g>
    </svg>
);

// --- GHOST SKINS ---
const GhostPiece: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <g opacity="0.7" filter="url(#ghost-blur)">
        {children}
        <defs>
            <filter id="ghost-blur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
            </filter>
        </defs>
    </g>
);
const KingGhost: React.FC = () => <GhostPiece><KingDefault /></GhostPiece>;
const QueenGhost: React.FC = () => <GhostPiece><QueenDefault /></GhostPiece>;
const RookGhost: React.FC = () => <GhostPiece><RookDefault /></GhostPiece>;
const BishopGhost: React.FC = () => <GhostPiece><BishopDefault /></GhostPiece>;
const KnightGhost: React.FC = () => <GhostPiece><KnightDefault /></GhostPiece>;
const PawnGhost: React.FC = () => <GhostPiece><PawnDefault /></GhostPiece>;


// --- ANGEL SKINS ---
const AngelHalo: React.FC = () => (
    <ellipse cx="22.5" cy="6" rx="8" ry="2.5" fill="#FFD700" stroke="#F0C400" strokeWidth="0.5" />
);
const KingAngel: React.FC = () => <><AngelHalo /><KingDefault /></>;
const QueenAngel: React.FC = () => <><AngelHalo /><QueenDefault /></>;
const RookAngel: React.FC = () => <><AngelHalo /><RookDefault /></>;
const BishopAngel: React.FC = () => <><AngelHalo /><BishopDefault /></>;
const KnightAngel: React.FC = () => <><AngelHalo /><KnightDefault /></>;
const PawnAngel: React.FC = () => <><AngelHalo /><PawnDefault /></>;

// --- DEVIL SKINS ---
const DevilHorns: React.FC = () => (
    <g fill="#B22222" stroke="#800000" strokeWidth="0.75">
        <path d="M 12,15 C 10,10 15,8 15,8 L 17,12 Z" />
        <path d="M 33,15 C 35,10 30,8 30,8 L 28,12 Z" />
    </g>
);
const KingDevil: React.FC = () => <><DevilHorns /><KingDefault /></>;
const QueenDevil: React.FC = () => <><DevilHorns /><QueenDefault /></>;
const RookDevil: React.FC = () => <><DevilHorns /><RookDefault /></>;
const BishopDevil: React.FC = () => <><DevilHorns /><BishopDefault /></>;
const KnightDevil: React.FC = () => <><DevilHorns /><KnightDefault /></>;
const PawnDevil: React.FC = () => <><DevilHorns /><PawnDefault /></>;


// --- CRYSTAL SKINS ---
const CrystalDefs: React.FC = () => (
    <defs>
        <linearGradient id="crystalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: 'rgba(0, 255, 255, 0.7)'}} />
            <stop offset="50%" style={{stopColor: 'rgba(255, 0, 255, 0.7)'}} />
            <stop offset="100%" style={{stopColor: 'rgba(128, 0, 255, 0.7)'}} />
        </linearGradient>
        <filter id="crystalShine" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
    </defs>
);
const CrystalPiece: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg viewBox="0 0 45 45" className="w-full h-full">
        <CrystalDefs />
        <g filter="url(#crystalShine)">
            {children}
        </g>
    </svg>
);

const KingCrystal: React.FC = () => <CrystalPiece><g fill="url(#crystalGradient)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22.5 11.63V6M20 8h5" fill="none"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" strokeLinecap="butt"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-5s9-6.5 6-12.5c-4-6.5-13.5-3.5-16.5 5.5v0c-3-9-12.5-12-16.5-5.5-3 6 6 12.5 6 12.5v5z"/><path d="M11.5 30c5.5-3 15.5-3 21 0" fill="none"/><path d="M11.5 33.5c5.5-3 15.5-3 21 0" fill="none"/><path d="M11.5 37c5.5-2.5 15.5-2.5 21 0" fill="none"/></g></CrystalPiece>;
const QueenCrystal: React.FC = () => <CrystalPiece><g fill="url(#crystalGradient)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12.5 37c5.5 3.5 15.5 3.5 21 0v-5s9-6.5 6-12.5c-4-6.5-13.5-3.5-16.5 5.5v0c-3-9-12.5-12-16.5-5.5-3 6 6 12.5 6 12.5v5z"/><path d="M11.5 30c5.5-3 15.5-3 21 0" fill="none"/><path d="M11.5 33.5c5.5-3 15.5-3 21 0" fill="none"/><path d="M11.5 37c5.5-2.5 15.5-2.5 21 0" fill="none"/><path d="M9 16a13.5 13.5 0 0113.5-8 13.5 13.5 0 0113.5 8v0c0 0-1.5-2.5-5-2.5s-5 2.5-5 2.5-2.5-2.5-5-2.5-5 2.5-5 2.5z"/><circle cx="6" cy="12" r="2"/><circle cx="14" cy="9" r="2"/><circle cx="22.5" cy="8" r="2"/><circle cx="31" cy="9" r="2"/><circle cx="39" cy="12" r="2"/></g></CrystalPiece>;
const RookCrystal: React.FC = () => <CrystalPiece><g fill="url(#crystalGradient)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" strokeLinecap="butt" /><path d="M34 14l-3 3H14l-3-3" /><path d="M31 17v12.5H14V17" /><path d="M14 29.5l1.5 2.5h14l1.5-2.5" /><path d="M11 14h23" fill="none" /></g></CrystalPiece>;
const BishopCrystal: React.FC = () => <CrystalPiece><g fill="url(#crystalGradient)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5h-20zM12 36v-4h21v4H12z" /><path d="M14.5 24.5c4.5-5 11.5-5 16 0 .5 2.5-1.5 5.5-8 5.5s-8.5-3-8-5.5z" /><path d="M22.5 24.5s-2-2-2-3.5c0-1.5 2-1.5 2-1.5s2 0 2 1.5c0 1.5-2 3.5-2 3.5z" fill="none" /><path d="M17.5 14c2-2.5 7.5-2.5 9.5 0" fill="none" strokeLinecap="butt" /></g></CrystalPiece>;
const KnightCrystal: React.FC = () => <CrystalPiece><g fill="url(#crystalGradient)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM12 21.5v-1c0-2 1.5-4.5 4.5-4.5h3c2 0 3 2 3 4s-1 4-2.5 4.5l-2 2.5-3 2-2-5.5z" /><path d="M13.5 21c-1.5-2.5-1-5 1.5-7 2-1.5 4 0 5 1 2-1.5 5-1 6.5 1l-1.5 2-2.5-1-1 3.5 2 2.5s-2 1-3.5 0l-4-4z" /></g></CrystalPiece>;
const PawnCrystal: React.FC = () => <CrystalPiece><g fill="url(#crystalGradient)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4z" /><path d="M17.5 17.5 C 20 25, 20 30, 16 37 H 29 C 25 30, 25 25, 27.5 17.5 Z" /></g></CrystalPiece>;


// --- SVG SETS ---
type PieceComponent = React.FC<{}>;
type PieceSvgSet = { [key in PieceSymbol]: PieceComponent };

export const PIECE_SVG_SETS: { [key in SkinSet]: PieceSvgSet } = {
    default: { k: KingDefault, q: QueenDefault, r: RookDefault, b: BishopDefault, n: KnightDefault, p: PawnDefault },
    ghost: { k: KingGhost, q: QueenGhost, r: RookGhost, b: BishopGhost, n: KnightGhost, p: PawnGhost },
    angel: { k: KingAngel, q: QueenAngel, r: RookAngel, b: BishopAngel, n: KnightAngel, p: PawnAngel },
    devil: { k: KingDevil, q: QueenDevil, r: RookDevil, b: BishopDevil, n: KnightDevil, p: PawnDevil },
    crystal: { k: KingCrystal, q: QueenCrystal, r: RookCrystal, b: BishopCrystal, n: KnightCrystal, p: PawnCrystal },
};


// --- EVENT DECORATION SVGs ---
export const Skull: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A9,9,0,0,0,3,11V22H6V20H18V22H21V11A9,9,0,0,0,12,2Z" /></svg>
);
export const Ghost: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A9,9,0,0,0,3,11V22H21V11A9,9,0,0,0,12,2M9,13A2,2,0,0,1,11,15A2,2,0,0,1,9,17A2,2,0,0,1,7,15A2,2,0,0,1,9,13M15,13A2,2,0,0,1,17,15A2,2,0,0,1,15,17A2,2,0,0,1,13,15A2,2,0,0,1,15,13Z" /></svg>
);
export const Tomb: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.5,4A2.5,2.5,0,0,0,8,6.5V10H2V12H8V20H13V12H19V10H13V6.5A2.5,2.5,0,0,0,10.5,4Z" /></svg>
);

// --- SHOP SVGs ---
export const BronzeKey: React.FC = () => <svg viewBox="0 0 24 24" fill="#CD7F32"><path d="M14.5,4A1.5,1.5 0 0,0 13,5.5V7H11.5A2.5,2.5 0 0,0 9,9.5V11H7V13H9V15H11V13H13V11H14.5A2.5,2.5 0 0,0 17,8.5V7A2.5,2.5 0 0,0 14.5,4Z" /></svg>;
export const SilverKey: React.FC = () => <svg viewBox="0 0 24 24" fill="#C0C0C0"><path d="M14.5,4A1.5,1.5 0 0,0 13,5.5V7H11.5A2.5,2.5 0 0,0 9,9.5V11H7V13H9V15H11V13H13V11H14.5A2.5,2.5 0 0,0 17,8.5V7A2.5,2.5 0 0,0 14.5,4Z" /></svg>;
export const GoldKey: React.FC = () => <svg viewBox="0 0 24 24" fill="#FFD700"><path d="M14.5,4A1.5,1.5 0 0,0 13,5.5V7H11.5A2.5,2.5 0 0,0 9,9.5V11H7V13H9V15H11V13H13V11H14.5A2.5,2.5 0 0,0 17,8.5V7A2.5,2.5 0 0,0 14.5,4Z" /></svg>;

export const BronzeChest: React.FC = () => <svg viewBox="0 0 24 24" fill="#A0522D"><path d="M20,6H4A2,2 0 0,0 2,8V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8A2,2 0 0,0 20,6M12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15M20,10H18V8H20V10Z" /></svg>;
export const SilverChest: React.FC = () => <svg viewBox="0 0 24 24" fill="#BDBDBD"><path d="M20,6H4A2,2 0 0,0 2,8V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8A2,2 0 0,0 20,6M12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15M20,10H18V8H20V10Z" /></svg>;
export const GoldChest: React.FC = () => <svg viewBox="0 0 24 24" fill="#FBC02D"><path d="M20,6H4A2,2 0 0,0 2,8V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8A2,2 0 0,0 20,6M12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15M20,10H18V8H20V10Z" /></svg>;

export const KEY_SVG_MAP: { [key in KeyType]: React.FC } = {
    bronze: BronzeKey,
    silver: SilverKey,
    gold: GoldKey,
};