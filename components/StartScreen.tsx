import React, { useState } from 'react';
import type { Difficulty, PlayerMode } from '../App';

interface StartScreenProps {
    onStart: (time: number | null, difficulty: Difficulty, mode: PlayerMode) => void;
    onOpenSkinShop: () => void;
    onOpenChestShop: () => void;
}

const timeOptions = [
    { label: '5분', value: 300 },
    { label: '10분', value: 600 },
    { label: '15분', value: 900 },
    { label: '무제한', value: null },
];

const difficultyOptions: { label: string; value: Difficulty }[] = [
    { label: '쉬움', value: 'easy' },
    { label: '보통', value: 'medium' },
    { label: '어려움', value: 'hard' },
];

const modeOptions: { label: string; value: PlayerMode }[] = [
    { label: 'AI와 하기', value: 'ai' },
    { label: '친구와 하기', value: 'friend' },
]


const StartScreen: React.FC<StartScreenProps> = ({ onStart, onOpenSkinShop, onOpenChestShop }) => {
    const [selectedTime, setSelectedTime] = useState<number | null>(600);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
    const [selectedMode, setSelectedMode] = useState<PlayerMode>('ai');

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg shadow-xl p-8 text-center relative">
                 <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                        onClick={onOpenSkinShop}
                        className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out shadow-lg"
                    >
                        스킨 샵
                    </button>
                     <button
                        onClick={onOpenChestShop}
                        className="bg-yellow-700 hover:bg-yellow-800 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out shadow-lg"
                    >
                        상점
                    </button>
                </div>
                <header className="mb-8 mt-20 sm:mt-0">
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-slate-400">
                        Gemini Chess
                    </h1>
                    <p className="text-slate-400 mt-2">게임 설정을 선택하세요.</p>
                </header>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-200">게임 모드</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {modeOptions.map(({ label, value }) => (
                            <button
                                key={label}
                                onClick={() => setSelectedMode(value)}
                                className={`w-full font-bold py-3 px-4 rounded transition duration-200 ease-in-out shadow-md text-lg ${
                                    selectedMode === value 
                                        ? 'bg-red-700 text-white' 
                                        : 'bg-slate-600 hover:bg-slate-500'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-200">시간 설정</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {timeOptions.map(({ label, value }) => (
                            <button
                                key={label}
                                onClick={() => setSelectedTime(value)}
                                className={`w-full font-bold py-3 px-4 rounded transition duration-200 ease-in-out shadow-md text-lg ${
                                    selectedTime === value 
                                        ? 'bg-red-700 text-white' 
                                        : 'bg-slate-600 hover:bg-slate-500'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                
                {selectedMode === 'ai' && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-200">난이도 설정</h2>
                        <div className="grid grid-cols-3 gap-3">
                            {difficultyOptions.map(({ label, value }) => (
                                <button
                                    key={label}
                                    onClick={() => setSelectedDifficulty(value)}
                                    className={`w-full font-bold py-3 px-4 rounded transition duration-200 ease-in-out shadow-md text-lg ${
                                        selectedDifficulty === value 
                                            ? 'bg-blue-700 text-white' 
                                            : 'bg-slate-600 hover:bg-slate-500'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={() => onStart(selectedTime, selectedDifficulty, selectedMode)}
                    className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition duration-200 ease-in-out text-xl shadow-lg"
                >
                    게임 시작
                </button>
            </div>
        </div>
    );
};

export default StartScreen;