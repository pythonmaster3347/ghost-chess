import React from 'react';
import { PIECE_SVG_SETS, SKIN_PRICES } from '../constants';

export type SkinSet = 'default' | 'ghost' | 'angel' | 'devil' | 'crystal';

interface SkinShopModalProps {
    onClose: () => void;
    onSelectSkin: (skin: SkinSet) => void;
    currentSkin: SkinSet;
    playerPoints: number;
    unlockedSkins: SkinSet[];
    onBuySkin: (skinId: SkinSet) => void;
}

const skinOptions: { id: SkinSet; name: string }[] = [
    { id: 'default', name: 'Default' },
    { id: 'crystal', name: '크리스탈' },
    { id: 'ghost', name: '유령' },
    { id: 'angel', name: '천사' },
    { id: 'devil', name: '악마' },
];

const SkinShopModal: React.FC<SkinShopModalProps> = ({ 
    onClose, 
    onSelectSkin, 
    currentSkin,
    playerPoints,
    unlockedSkins,
    onBuySkin
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-slate-900 rounded-lg shadow-2xl p-6 border border-purple-800 w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-400">
                            스킨 샵
                        </h2>
                        <p className="text-yellow-400 font-semibold">보유 포인트: {playerPoints}P</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-light">&times;</button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {skinOptions.map(skin => {
                        const KingPreview = PIECE_SVG_SETS[skin.id]['k']; 
                        const isSelected = currentSkin === skin.id;
                        const isUnlocked = unlockedSkins.includes(skin.id);
                        const price = SKIN_PRICES[skin.id as Exclude<SkinSet, 'default' | 'crystal'>];
                        const canAfford = price ? playerPoints >= price : true;

                        return (
                            <div key={skin.id} className={`p-4 rounded-lg border-2 transition-all ${isSelected ? 'border-purple-500 bg-slate-700' : 'border-slate-700 bg-slate-800'}`}>
                                <h3 className="text-lg font-semibold mb-2 text-center">{skin.name}</h3>
                                <div className={`w-24 h-24 mx-auto p-2 rounded-md`}>
                                     <div className="w-full h-full text-gray-100">
                                         <KingPreview />
                                     </div>
                                </div>

                                {isUnlocked ? (
                                     <button
                                        onClick={() => onSelectSkin(skin.id)}
                                        disabled={isSelected}
                                        className="w-full mt-4 font-bold py-2 px-4 rounded transition duration-200 ease-in-out shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-purple-700 hover:bg-purple-800 disabled:bg-purple-500"
                                    >
                                        {isSelected ? '선택됨' : '선택'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onBuySkin(skin.id)}
                                        disabled={!canAfford}
                                        className={`w-full mt-4 font-bold py-2 px-4 rounded transition duration-200 ease-in-out shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                                            canAfford ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-600'
                                        }`}
                                    >
                                        {canAfford ? `구매 (${price}P)` : `부족 (${price}P)`}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SkinShopModal;