
// Fix: Implement the Square component to render a chessboard square.
import React from 'react';
import type { Piece as PieceType, Square as SquareType } from 'chess.js';
import Piece from './Piece';
import type { SkinSet } from './SkinShopModal';

interface SquareProps {
    square: SquareType;
    piece: PieceType | null;
    shade: 'light' | 'dark';
    isSelected: boolean;
    isPossibleMove: boolean;
    isMergeTarget: boolean;
    isLightningMateTarget: boolean;
    onClick: (square: SquareType) => void;
    skinSet: SkinSet;
}

const Square: React.FC<SquareProps> = ({ square, piece, shade, isSelected, isPossibleMove, isMergeTarget, isLightningMateTarget, onClick, skinSet }) => {
    const bgClass = shade === 'light' ? 'bg-slate-200' : 'bg-slate-500';
    const selectedClass = isSelected ? 'bg-yellow-400/80' : '';

    return (
        <div
            onClick={() => onClick(square)}
            className={`w-full h-full flex items-center justify-center cursor-pointer relative ${bgClass} ${selectedClass}`}
        >
            {piece && <Piece piece={piece} skinSet={skinSet} />}
            {/* Indicator for a move to an empty square */}
            {isPossibleMove && !piece && (
                <div className="absolute w-1/3 h-1/3 bg-slate-900/40 rounded-full" />
            )}
            {/* Indicator for a capture move */}
            {isPossibleMove && piece && (
                <div className="absolute w-full h-full border-4 border-slate-900/50 rounded-sm box-border" />
            )}
            {/* Indicator for a merge target */}
            {isMergeTarget && (
                 <div className="absolute w-1/2 h-1/2 bg-purple-600/70 rounded-full animate-pulse" />
            )}
            {/* Indicator for Lightning Mate target */}
            {isLightningMateTarget && (
                 <div className="absolute w-1/2 h-1/2 bg-yellow-400/70 rounded-full animate-pulse" />
            )}
        </div>
    );
};

export default Square;
