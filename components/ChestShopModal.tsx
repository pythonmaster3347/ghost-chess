import React, { useState } from 'react';
import { BronzeChest, SilverChest, GoldChest, BronzeKey, SilverKey, GoldKey } from '../constants';

export type KeyType = 'bronze' | 'silver' | 'gold';

interface ChestShopModalProps {
    onClose: () => void;
    keys: { [key in KeyType]: number };
    onOpenChest: (keyType: KeyType) => number;
    isEventActive: boolean;
}

interface ChestReward {
    type: KeyType;
    amount: number;
    id: number;
}

const chestOptions: {
    type: KeyType;
    name: string;
    ChestComponent: React.FC;
    KeyComponent: React.FC;
    borderColor: string;
    bgColor: string;
}[] = [
    { type: 'bronze', name: '동 상자', ChestComponent: BronzeChest, KeyComponent: BronzeKey, borderColor: 'border-amber-700', bgColor: 'bg-amber-800/30' },
    { type: 'silver', name: '은 상자', ChestComponent: SilverChest, KeyComponent: SilverKey, borderColor: 'border-gray-400', bgColor: 'bg-gray-500/30' },
    { type: 'gold', name: '금 상자', ChestComponent: GoldChest, KeyComponent: GoldKey, borderColor: 'border-yellow-500', bgColor: 'bg-yellow-600/30' },
];

const ChestShopModal: React.FC<ChestShopModalProps> = ({ onClose, keys, onOpenChest, isEventActive }) => {
    const [rewards, setRewards] = useState<ChestReward[]>([]);

    const handleOpen = (keyType: KeyType) => {
        const pointsWon = onOpenChest(keyType);
        if (pointsWon > 0) {
            const newReward = { type: keyType, amount: pointsWon, id: Date.now() };
            setRewards(prev => [...prev, newReward]);
            setTimeout(() => {
                setRewards(prev => prev.filter(r => r.id !== newReward.id));
            }, 2000);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-slate-900 rounded-lg shadow-2xl p-6 border border-yellow-800 w-full max-w-2xl relative" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-400">
                            상점
                        </h2>
                        {isEventActive && <p className="text-sm text-purple-400 font-semibold animate-pulse">이벤트! 상자 보상 x1.2!</p>}
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-light">&times;</button>
                </div>
                 <div className="flex justify-center gap-6 mb-6 bg-slate-800/50 p-2 rounded-lg">
                    {Object.keys(keys).map(key => {
                        const keyType = key as KeyType;
                        const KeyIcon = chestOptions.find(c => c.type === keyType)!.KeyComponent;
                        return (
                            <div key={keyType} className="flex items-center gap-2">
                                <div className="w-8 h-8"><KeyIcon /></div>
                                <span className="text-xl font-bold">{keys[keyType]}</span>
                            </div>
                        )
                    })}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {chestOptions.map(({ type, name, ChestComponent, KeyComponent, borderColor, bgColor }) => {
                        const hasKey = keys[type] > 0;
                        return (
                            <div key={type} className={`p-4 rounded-lg border-2 text-center transition-all ${borderColor} ${bgColor}`}>
                                <h3 className="text-xl font-semibold mb-2">{name}</h3>
                                <div className={`w-32 h-32 mx-auto p-2 rounded-md`}>
                                     <div className="w-full h-full">
                                         <ChestComponent />
                                     </div>
                                </div>
                                <div className="flex items-center justify-center gap-2 mt-2 mb-4">
                                    <span className="text-lg">필요:</span>
                                    <div className="w-6 h-6"><KeyComponent /></div>
                                    <span className="text-lg font-bold">x 1</span>
                                </div>
                                <button
                                    onClick={() => handleOpen(type)}
                                    disabled={!hasKey}
                                    className={`w-full font-bold py-2 px-4 rounded transition duration-200 ease-in-out shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                                        hasKey ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-600'
                                    }`}
                                >
                                    열기
                                </button>
                            </div>
                        );
                    })}
                </div>
                 {/* Reward Notifications */}
                 <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {rewards.map(reward => (
                        <div key={reward.id} className="absolute flex items-center justify-center text-3xl font-bold text-yellow-300 animate-float-up drop-shadow-lg">
                           +{reward.amount}P!
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChestShopModal;