

import React from 'react';
import type { Piece as PieceType } from 'chess.js';
import { PIECE_SVG_SETS } from '../constants';
import type { SkinSet } from './SkinShopModal';

interface PieceProps {
    piece: PieceType;
    skinSet: SkinSet;
}

const Piece: React.FC<PieceProps> = ({ piece, skinSet }) => {
    const SvgComponent = PIECE_SVG_SETS[skinSet][piece.type];
    const fillClass = piece.color === 'w' ? 'text-gray-100' : 'text-gray-900';
    
    return (
        <div className={`w-full h-full p-1 drop-shadow-[0_2px_1px_rgba(0,0,0,0.5)] ${fillClass}`}>
             <SvgComponent />
        </div>
    );
};

export default Piece;
