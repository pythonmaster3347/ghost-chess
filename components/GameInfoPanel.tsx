import React from 'react';
import type { Move, Color } from 'chess.js';
import type { PlayerMode } from '../App';

type Difficulty = 'easy' | 'medium' | 'hard';

interface GameInfoPanelProps {
    status: string;
    history: Move[];
    onReset: () => void;
    isAiThinking: boolean;
    isLightningMateAvailable: boolean;
    isLightningMateActive: boolean;
    onLightningMateActivate: () => void;
    difficulty: Difficulty;
    onDifficultyChange: (level: Difficulty) => void;
    isGameInProgress: boolean;
    whiteTime: number;
    blackTime: number;
    turn: Color;
    timeControl: number | null;
    playerMode: PlayerMode;
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const Timer: React.FC<{ name: string; time: number; isActive: boolean }> = ({ name, time, isActive }) => (
    <div className={`w-1/2 p-3 rounded-lg text-center ${isActive ? 'bg-slate-600' : 'bg-slate-900'}`}>
        <p className="text-sm text-slate-400">{name}</p>
        <p className="text-3xl font-mono font-bold">{formatTime(time)}</p>
    </div>
);


const GameInfoPanel: React.FC<GameInfoPanelProps> = ({ 
    status, 
    history, 
    onReset, 
    isAiThinking,
    isLightningMateAvailable,
    isLightningMateActive,
    onLightningMateActivate,
    difficulty,
    onDifficultyChange,
    isGameInProgress,
    whiteTime,
    blackTime,
    turn,
    timeControl,
    playerMode,
}) => {
    const moveHistoryRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (moveHistoryRef.current) {
            moveHistoryRef.current.scrollTop = moveHistoryRef.current.scrollHeight;
        }
    }, [history]);

    const lightningButtonText = isLightningMateActive ? '취소' : '번개매이트';
    const difficultyLevels: { level: Difficulty; label: string; color: string; selectedColor: string }[] = [
        { level: 'easy', label: '쉬움', color: 'bg-green-700 hover:bg-green-800', selectedColor: 'bg-green-600' },
        { level: 'medium', label: '보통', color: 'bg-yellow-700 hover:bg-yellow-800', selectedColor: 'bg-yellow-600' },
        { level: 'hard', label: '어려움', color: 'bg-red-700 hover:bg-red-800', selectedColor: 'bg-red-600' },
    ];

    return (
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg shadow-xl p-4 flex flex-col h-full max-h-[calc(80vh-100px)] lg:max-h-[640px] text-gray-200">
            {timeControl !== null && (
                <div className="flex justify-between gap-4 mb-4">
                    <Timer name="Black" time={blackTime} isActive={turn === 'b'} />
                    <Timer name="White" time={whiteTime} isActive={turn === 'w'} />
                </div>
            )}
            
            <h2 className="text-2xl font-bold text-center mb-2 border-b-2 border-gray-600 pb-2">Game Info</h2>
            
            <div className="bg-slate-900/70 rounded p-3 mb-4 text-center">
                <p className="font-semibold text-lg">{status}</p>
                 {isAiThinking && playerMode === 'ai' && (
                    <div className="flex items-center justify-center mt-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-400"></div>
                        <span className="ml-2 text-sm text-red-300">Gemini is thinking...</span>
                    </div>
                )}
            </div>

            <h3 className="font-semibold mb-2 text-lg">Move History</h3>
            <div ref={moveHistoryRef} className="flex-grow bg-slate-900/70 rounded p-2 overflow-y-auto mb-4 min-h-[150px]">
                <ol className="list-decimal list-inside text-sm">
                    {history.reduce<React.ReactNode[]>((acc, move, index) => {
                        if (index % 2 === 0) {
                            const moveNumber = Math.floor(index / 2) + 1;
                            const blackMove = history[index + 1];
                            acc.push(
                                <li key={moveNumber} className="grid grid-cols-3 gap-2 p-1 even:bg-slate-700/50 rounded">
                                    <span className="text-gray-400">{moveNumber}.</span>
                                    <span>{move.san}</span>
                                    <span>{blackMove ? blackMove.san : ''}</span>
                                </li>
                            );
                        }
                        return acc;
                    }, [])}
                </ol>
            </div>

            {playerMode === 'ai' && (
                <div className="mb-4">
                    <h3 className="font-semibold mb-2 text-lg">난이도</h3>
                    <div className="flex justify-between gap-2">
                        {difficultyLevels.map(({ level, label, color, selectedColor }) => (
                            <button
                                key={level}
                                onClick={() => onDifficultyChange(level)}
                                disabled={isGameInProgress}
                                className={`w-full font-bold py-2 px-4 rounded transition duration-200 ease-in-out shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                                    difficulty === level ? selectedColor : `bg-slate-600 hover:bg-slate-500`
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    {isGameInProgress && <p className="text-xs text-slate-400 text-center mt-1">게임 중에는 난이도를 변경할 수 없습니다.</p>}
                </div>
            )}
            
            <div className="space-y-2 mt-auto">
                 {isLightningMateAvailable && (
                     <button
                        onClick={onLightningMateActivate}
                        className={`w-full font-bold py-2 px-4 rounded transition duration-200 ease-in-out shadow-lg ${isLightningMateActive ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-700 hover:bg-blue-800'}`}
                     >
                        {lightningButtonText}
                    </button>
                 )}
                <button
                    onClick={onReset}
                    className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out shadow-lg"
                >
                    New Game
                </button>
            </div>
        </div>
    );
};

export default GameInfoPanel;