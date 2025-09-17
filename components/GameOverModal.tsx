import React from 'react';
import type { KeyType } from './ChestShopModal';
import { KEY_SVG_MAP } from '../constants';

interface GameOverModalProps {
    message: string;
    onReset: () => void;
    wonKey: KeyType | null;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ message, onReset, wonKey }) => {
    const keyNameMap: { [key in KeyType]: string } = {
        bronze: '동 열쇠',
        silver: '은 열쇠',
        gold: '금 열쇠'
    };
    const KeyIcon = wonKey ? KEY_SVG_MAP[wonKey] : null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-slate-900 rounded-lg shadow-2xl p-8 text-center border border-red-800">
                <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-slate-400">
                    Game Over
                </h2>
                <p className="text-xl mb-6 text-gray-300">{message}</p>
                
                {wonKey && KeyIcon && (
                    <div className="mb-6 bg-slate-800 p-4 rounded-lg">
                        <p className="text-lg text-yellow-400 font-semibold">보상을 획득했습니다!</p>
                        <div className="flex items-center justify-center mt-2">
                             <div className="w-8 h-8 mr-2">
                                <KeyIcon />
                            </div>
                            <span className="text-xl text-white">{keyNameMap[wonKey]}</span>
                        </div>
                    </div>
                )}

                <button
                    onClick={onReset}
                    className="bg-red-800 hover:bg-red-900 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ease-in-out text-lg"
                >
                    Play Again
                </button>
            </div>
        </div>
    );
};

export default GameOverModal;