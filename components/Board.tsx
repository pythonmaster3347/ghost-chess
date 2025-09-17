// Fix: Implement the Board component to render the chessboard and handle user interactions.
import React, from 'react';
// Fix: The 'Board' type is not exported from chess.js. It has been removed from the import and BoardType is defined manually.
import type { Square as SquareType, Color, Piece } from 'chess.js';
import Square from './Square';
import BoardEvents from './BoardEvents';
import type { BoardEvent, PointNotification } from '../App';
import type { SkinSet } from './SkinShopModal';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
// chess.js board array is indexed from rank 8 (index 0) to rank 1 (index 7)
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

type BoardType = (Piece | null)[][];
type GameMode = 'normal' | 'checkEscapeKingMove' | 'checkEscapeSecondMove';

interface BoardProps {
    board: BoardType;
    turn: Color;
    onMove: (from: SquareType, to: SquareType) => boolean;
    getLegalMoves: (square: SquareType) => string[];
    isQueenOffBoard: boolean;
    isLightningMateActive: boolean;
    onPawnSelectForLightningMate: (square: SquareType) => void;
    gameMode: GameMode;
    getLegalMovesForCheckEscape: (square: SquareType) => string[];
    event: BoardEvent;
    skinSet: SkinSet;
    pointNotifications: PointNotification[];
}

const Board: React.FC<BoardProps> = ({
    board,
    turn,
    onMove,
    getLegalMoves,
    isQueenOffBoard,
    isLightningMateActive,
    onPawnSelectForLightningMate,
    gameMode,
    getLegalMovesForCheckEscape,
    event,
    skinSet,
    pointNotifications,
}) => {
    const [selectedSquare, setSelectedSquare] = React.useState<SquareType | null>(null);

     React.useEffect(() => {
        // Deselect piece when game mode changes to avoid invalid states
        setSelectedSquare(null);
    }, [gameMode]);


    const handleSquareClick = (square: SquareType) => {
        if (isLightningMateActive) {
            onPawnSelectForLightningMate(square);
            setSelectedSquare(null);
            return;
        }

        const rankIndex = RANKS.indexOf(square[1]);
        const fileIndex = FILES.indexOf(square[0]);
        const piece = board[rankIndex]?.[fileIndex];

        if (selectedSquare) {
            const moveSuccessful = onMove(selectedSquare, square);
            if (!moveSuccessful) {
                // If move failed, allow re-selecting another valid piece
                if (piece && piece.color === turn) {
                    // Check mode-specific selection rules
                    if (gameMode === 'checkEscapeKingMove' && piece.type !== 'k') return;
                    if (gameMode === 'checkEscapeSecondMove' && piece.type === 'k') return;
                    setSelectedSquare(square);
                } else {
                    setSelectedSquare(null);
                }
            } else {
                setSelectedSquare(null);
            }
        } else {
             if (piece && piece.color === turn) {
                 // Check mode-specific selection rules
                if (gameMode === 'checkEscapeKingMove' && piece.type !== 'k') return;
                if (gameMode === 'checkEscapeSecondMove' && piece.type === 'k') return;
                setSelectedSquare(square);
            }
        }
    };

    let possibleMoves: string[] = [];
    if (selectedSquare) {
        if (gameMode === 'checkEscapeSecondMove') {
            possibleMoves = getLegalMovesForCheckEscape(selectedSquare as SquareType);
        } else {
            possibleMoves = getLegalMoves(selectedSquare as SquareType);
        }
    }

    const fromPiece = selectedSquare 
        ? board[RANKS.indexOf(selectedSquare[1])][FILES.indexOf(selectedSquare[0])] 
        : null;

    return (
        <div className="relative w-full h-full">
            <div className="grid grid-cols-8 grid-rows-8 w-full h-full border-4 border-slate-700 bg-slate-700 aspect-square">
                {board.map((row, rowIndex) =>
                    row.map((piece, colIndex) => {
                        const square = `${FILES[colIndex]}${RANKS[rowIndex]}` as SquareType;
                        // Fix: The 'shade' prop for the Square component expects 'light' or 'dark', not a CSS class.
                        const shade = (rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark';
                        
                        const isSelected = selectedSquare === square;
                        const isPossibleMove = possibleMoves.includes(square);

                        let isMergeTarget = false;
                        if (isQueenOffBoard && fromPiece?.color === 'w' && piece?.color === 'w' && gameMode === 'normal') {
                            if (
                                (fromPiece.type === 'r' && piece.type === 'b') ||
                                (fromPiece.type === 'b' && piece.type === 'r')
                            ) {
                                isMergeTarget = true;
                            }
                        }

                        const isLightningMateTarget = 
                            isLightningMateActive &&
                            piece?.type === 'p' && 
                            piece?.color === 'w' &&
                            !square.startsWith('e');

                        return (
                            <Square
                                key={square}
                                square={square}
                                piece={piece}
                                shade={shade}
                                isSelected={isSelected}
                                isPossibleMove={isPossibleMove}
                                isMergeTarget={isMergeTarget}
                                isLightningMateTarget={isLightningMateTarget}
                                onClick={handleSquareClick}
                                skinSet={skinSet}
                            />
                        );
                    })
                )}
            </div>
            <div className="absolute inset-0 pointer-events-none">
                {pointNotifications.map(notification => {
                    const rankIndex = RANKS.indexOf(notification.square[1]);
                    const fileIndex = FILES.indexOf(notification.square[0]);
                    const top = `${rankIndex * 12.5}%`;
                    const left = `${fileIndex * 12.5}%`;
                    const textColor = notification.isBonus ? 'text-purple-400' : 'text-yellow-300';

                    return (
                        <div
                            key={notification.id}
                            className="absolute flex items-center justify-center w-[12.5%] h-[12.5%] pointer-events-none animate-float-up"
                            style={{ top, left }}
                        >
                            <span className={`text-lg font-bold ${textColor} drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]`}>
                                +{notification.points}{notification.isBonus && ' (x1.5!)'}
                            </span>
                        </div>
                    );
                })}
            </div>
            <BoardEvents event={event} />
        </div>
    );
};

export default Board;