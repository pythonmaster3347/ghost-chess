import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess, Move, Square } from 'chess.js';
import Board from './components/Board';
import GameInfoPanel from './components/GameInfoPanel';
import GameOverModal from './components/GameOverModal';
import StartScreen from './components/StartScreen';
import SkinShopModal from './components/SkinShopModal';
import ChestShopModal from './components/ChestShopModal';
import { getAIMove } from './services/aiService';
import { PIECE_POINT_VALUES, SKIN_PRICES, KEY_DROP_CHANCES, CHEST_REWARDS } from './constants';
import type { SkinSet } from './components/SkinShopModal';
import type { KeyType } from './components/ChestShopModal';


type GameMode = 'normal' | 'checkEscapeKingMove' | 'checkEscapeSecondMove';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type PlayerMode = 'ai' | 'friend';
export type BoardEvent = 'skulls' | 'ghosts' | 'tombs' | 'none';

export interface PointNotification {
    id: number;
    points: number;
    square: Square;
    isBonus: boolean;
}

const App: React.FC = () => {
    const [game, setGame] = useState(new Chess());
    const [board, setBoard] = useState(game.board());
    const [status, setStatus] = useState("White's turn to move.");
    const [history, setHistory] = useState<Move[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [gameOverMessage, setGameOverMessage] = useState('');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [gameMode, setGameMode] = useState<GameMode>('normal');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [playerMode, setPlayerMode] = useState<PlayerMode>('ai');
    
    // Start screen and timers
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [timeControl, setTimeControl] = useState<number | null>(600);
    const [whiteTime, setWhiteTime] = useState(600);
    const [blackTime, setBlackTime] = useState(600);
    const [event, setEvent] = useState<BoardEvent>('none');

    // Shops, points, and keys
    const [skinSet, setSkinSet] = useState<SkinSet>('default');
    const [isSkinShopOpen, setIsSkinShopOpen] = useState(false);
    const [isChestShopOpen, setIsChestShopOpen] = useState(false);
    const [playerPoints, setPlayerPoints] = useState<number>(0);
    const [unlockedSkins, setUnlockedSkins] = useState<SkinSet[]>(['default']);
    const [keys, setKeys] = useState<{ [key in KeyType]: number }>({ bronze: 0, silver: 0, gold: 0 });
    const [lastWonKey, setLastWonKey] = useState<KeyType | null>(null);
    const [pointNotifications, setPointNotifications] = useState<PointNotification[]>([]);

    // Lightning Mate
    const [capturedWhiteKnights, setCapturedWhiteKnights] = useState(0);
    const [lightningMateUsed, setLightningMateUsed] = useState(false);
    const [isLightningMateActive, setIsLightningMateActive] = useState(false);

    // Load data from local storage
    useEffect(() => {
        const savedPoints = localStorage.getItem('playerPoints');
        if (savedPoints) setPlayerPoints(JSON.parse(savedPoints));
        
        const savedSkins = localStorage.getItem('unlockedSkins');
        if (savedSkins) {
            setUnlockedSkins(JSON.parse(savedSkins));
        }
        
        const savedSkinSet = localStorage.getItem('selectedSkin');
        if(savedSkinSet) setSkinSet(JSON.parse(savedSkinSet));

        const savedKeys = localStorage.getItem('playerKeys');
        if(savedKeys) setKeys(JSON.parse(savedKeys));
    }, []);

    // Save data to local storage
    useEffect(() => { localStorage.setItem('playerPoints', JSON.stringify(playerPoints)); }, [playerPoints]);
    useEffect(() => { localStorage.setItem('unlockedSkins', JSON.stringify(unlockedSkins)); }, [unlockedSkins]);
    useEffect(() => { localStorage.setItem('selectedSkin', JSON.stringify(skinSet)); }, [skinSet]);
    useEffect(() => { localStorage.setItem('playerKeys', JSON.stringify(keys)); }, [keys]);

    const whiteQueenOnBoard = useMemo(() => {
        return game.board().flat().some(p => p?.type === 'q' && p?.color === 'w');
    }, [game]);

    const isGameInProgress = useMemo(() => {
        return history.length > 0 && !gameOver;
    }, [history, gameOver]);

    // Time-based board events
    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const hour = now.getHours();
            const minute = now.getMinutes();
            if (hour >= 7 && hour < 10) setEvent('skulls');
            else if (hour >= 11 && (hour < 14 || (hour === 14 && minute <= 30))) setEvent('ghosts');
            else if (hour >= 15 && hour < 19) setEvent('tombs');
            else setEvent('none');
        };
        checkTime();
        const intervalId = setInterval(checkTime, 60000);
        return () => clearInterval(intervalId);
    }, []);

    // Captured knights for Lightning Mate
    useEffect(() => {
        const knightsOnBoard = game.board().flat().filter(p => p?.type === 'n' && p?.color === 'w').length;
        setCapturedWhiteKnights(2 - knightsOnBoard);
    }, [game, history]);

    const isLightningMateAvailable = useMemo(() => {
        return capturedWhiteKnights >= 2 && !lightningMateUsed;
    }, [capturedWhiteKnights, lightningMateUsed]);

    const awardKeyOnGameEnd = () => {
        if (playerMode !== 'ai') return;
        const rand = Math.random();
        let cumulativeChance = 0;
        
        const keyToAward = (Object.keys(KEY_DROP_CHANCES) as KeyType[]).find(key => {
            cumulativeChance += KEY_DROP_CHANCES[key];
            return rand < cumulativeChance;
        });

        if (keyToAward) {
            setKeys(prevKeys => ({ ...prevKeys, [keyToAward]: prevKeys[keyToAward] + 1 }));
            setLastWonKey(keyToAward);
        }
    };
    
    const updateStatus = useCallback((currentGame: Chess, overrideStatus?: string) => {
        if (overrideStatus) {
            setStatus(overrideStatus);
            setBoard(currentGame.board());
            setHistory(currentGame.history({ verbose: true }));
            return;
        }

        let newStatus = '';
        const turn = currentGame.turn() === 'w' ? 'White' : 'Black';

        if (currentGame.isCheckmate() || currentGame.isDraw()) {
            if (currentGame.isCheckmate()) {
                 newStatus = `Checkmate! ${turn === 'White' ? 'Black' : 'White'} wins.`;
            } else {
                newStatus = 'Draw!';
            }
            if (!gameOver) { // Prevent awarding keys multiple times
                awardKeyOnGameEnd();
            }
            setGameOverMessage(newStatus);
            setGameOver(true);
        } else {
             if (gameMode === 'checkEscapeKingMove') {
                newStatus = "Check! Move your King to start an escape, or move another piece to forfeit.";
            } else if (gameMode === 'checkEscapeSecondMove') {
                newStatus = "Bonus move! Move any piece except the King (sliding pieces move 1 square).";
            } else {
                newStatus = `${turn}'s turn to move.`;
                if (currentGame.isCheck()) {
                    newStatus += ` ${turn} is in check.`;
                }
            }
        }
        setStatus(newStatus);
        setBoard(currentGame.board());
        setHistory(currentGame.history({ verbose: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameMode, gameOver]);
    
    useEffect(() => {
        if (game.turn() === 'w' && game.isCheck() && !isLightningMateActive) {
            setGameMode('checkEscapeKingMove');
        } else if (gameMode !== 'checkEscapeSecondMove') {
            setGameMode('normal');
        }
        updateStatus(game);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [game.fen()]);

    // Timer logic
    useEffect(() => {
        if (!isGameStarted || gameOver || timeControl === null) return;
        const timer = setInterval(() => {
            if (game.turn() === 'w') setWhiteTime(t => t > 0 ? t - 1 : 0);
            else setBlackTime(t => t > 0 ? t - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, [isGameStarted, gameOver, game.turn(), timeControl]);

    useEffect(() => {
        if (whiteTime <= 0) { setGameOver(true); setGameOverMessage('Black wins on time!'); }
        if (blackTime <= 0) { setGameOver(true); setGameOverMessage('White wins on time!'); }
    }, [whiteTime, blackTime]);

    const handleAiMove = useCallback(async (currentGame: Chess) => {
        if (!currentGame.isGameOver() && currentGame.turn() === 'b') {
            setIsAiThinking(true);
            const legalMoves = currentGame.moves();
            const pgn = currentGame.pgn();
            const aiMove = await getAIMove(pgn, legalMoves, difficulty);
            
            const gameCopy = new Chess(currentGame.fen());
            if (gameCopy.move(aiMove)) {
                setGame(gameCopy);
                updateStatus(gameCopy);
            } else {
                console.error("AI made an invalid move:", aiMove);
                const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
                gameCopy.move(randomMove);
                setGame(gameCopy);
                updateStatus(gameCopy);
            }
            setIsAiThinking(false);
        }
    }, [updateStatus, difficulty]);

    useEffect(() => {
        if (isGameStarted && playerMode === 'ai' && game.turn() === 'b' && !game.isGameOver()) {
            const timer = setTimeout(() => handleAiMove(game), 500);
            return () => clearTimeout(timer);
        }
    }, [isGameStarted, game, handleAiMove, playerMode]);

    const getLegalMovesForCheckEscape = (square: Square): string[] => {
        const piece = game.get(square);
        if (gameMode !== 'checkEscapeSecondMove' || !piece || piece.type === 'k') return [];
    
        const legalMoves = game.moves({ square, verbose: true });
        if (['r', 'b', 'q'].includes(piece.type)) {
            return legalMoves.filter(move => {
                const fileDiff = Math.abs(move.from.charCodeAt(0) - move.to.charCodeAt(0));
                const rankDiff = Math.abs(parseInt(move.from[1], 10) - parseInt(move.to[1], 10));
                return fileDiff <= 1 && rankDiff <= 1;
            }).map(move => move.to);
        }
        return legalMoves.map(move => move.to);
    };

    const handleMove = (from: Square, to: Square): boolean => {
         if ((playerMode === 'ai' && game.turn() !== 'w') || isAiThinking || isLightningMateActive) return false;
        
        const gameCopy = new Chess(game.fen());
        let moveResult: Move | null = null;
        
        if (gameMode === 'checkEscapeKingMove') {
            const fromPiece = gameCopy.get(from);
            if (fromPiece?.type !== 'k') {
                moveResult = gameCopy.move({ from, to, promotion: 'q' });
                if (moveResult) setGame(gameCopy);
            } else {
                moveResult = gameCopy.move({ from, to });
                if (moveResult) {
                    let fen = gameCopy.fen();
                    fen = fen.replace(' b ', ' w ');
                    gameCopy.load(fen);
                    setGame(gameCopy);
                    setGameMode('checkEscapeSecondMove');
                    updateStatus(gameCopy, "Bonus move! Move any piece except the King (sliding pieces move 1 square).");
                    return true;
                }
            }
        } else if (gameMode === 'checkEscapeSecondMove') {
            if (!getLegalMovesForCheckEscape(from).includes(to)) return false;
            moveResult = gameCopy.move({ from, to, promotion: 'q' });
            if (moveResult) setGame(gameCopy);
        } else {
            const fromPiece = gameCopy.get(from);
            const toPiece = gameCopy.get(to);
            const isMergeAttempt = !whiteQueenOnBoard && fromPiece && toPiece && fromPiece.color === 'w' && toPiece.color === 'w' &&
                ((fromPiece.type === 'r' && toPiece.type === 'b') || (fromPiece.type === 'b' && toPiece.type === 'r'));
            
            if (isMergeAttempt) {
                gameCopy.remove(from); gameCopy.remove(to);
                gameCopy.put({ type: 'q', color: 'w' }, to);
                let fen = gameCopy.fen();
                const currentTurn = gameCopy.turn();
                fen = fen.replace(` ${currentTurn} `, ` ${currentTurn === 'w' ? 'b' : 'w'} `);
                gameCopy.load(fen);
                setGame(gameCopy);
                updateStatus(gameCopy);
                return true;
            }
            moveResult = gameCopy.move({ from, to, promotion: 'q' });
        }
        if (moveResult === null) return false;

        if (playerMode === 'ai' && moveResult.color === 'w' && moveResult.captured) {
            const basePoints = PIECE_POINT_VALUES[moveResult.captured];
            if (basePoints) {
                const isEventActive = event !== 'none';
                const pointsToAward = isEventActive ? Math.floor(basePoints * 1.5) : basePoints;
                setPlayerPoints(prev => prev + pointsToAward);
                const newNotification: PointNotification = { id: Date.now(), points: pointsToAward, square: to, isBonus: isEventActive };
                setPointNotifications(current => [...current, newNotification]);
                setTimeout(() => setPointNotifications(current => current.filter(n => n.id !== newNotification.id)), 2000);
            }
        }
        setGame(gameCopy);
        updateStatus(gameCopy);
        return true;
    };
    
    const getLegalMoves = (square: Square): string[] => {
        return game.moves({ square, verbose: true }).map(move => move.to);
    };

    const handleReset = () => {
        setIsGameStarted(false);
        const newGame = new Chess();
        setGame(newGame);
        setBoard(newGame.board());
        setStatus("White's turn to move.");
        setHistory([]);
        setGameOver(false);
        setGameOverMessage('');
        setIsAiThinking(false);
        setLightningMateUsed(false);
        setIsLightningMateActive(false);
        setCapturedWhiteKnights(0);
        setGameMode('normal');
        setLastWonKey(null);
    };
    
    const handleDifficultyChange = (level: Difficulty) => {
        if (!isGameInProgress) setDifficulty(level);
    };

    const handleLightningMateActivate = () => {
        if (isLightningMateAvailable) {
            setIsLightningMateActive(!isLightningMateActive);
             if (!isLightningMateActive) setGameMode('normal');
        }
    };
    
    const handlePawnSelectForLightningMate = (square: Square) => {
        if (!isLightningMateActive) return;
        const piece = game.get(square);
        if (piece && piece.type === 'p' && piece.color === 'w' && !square.startsWith('e')) {
            const gameCopy = new Chess(game.fen());
            gameCopy.remove(square);
            const promotionPiece = whiteQueenOnBoard ? 'r' : 'q';
            gameCopy.put({ type: promotionPiece, color: 'w' }, square);
            let fen = gameCopy.fen();
            fen = fen.replace(' w ', ' b ');
            gameCopy.load(fen);
            setGame(gameCopy);
            updateStatus(gameCopy);
            setLightningMateUsed(true);
            setIsLightningMateActive(false);
        }
    };
    
    const handleGameStart = (time: number | null, difficulty: Difficulty, mode: PlayerMode) => {
        setTimeControl(time);
        if (time !== null) { setWhiteTime(time); setBlackTime(time); }
        setDifficulty(difficulty);
        setPlayerMode(mode);
        setIsGameStarted(true);
    };

    const handleBuySkin = (skinId: SkinSet) => {
        const price = SKIN_PRICES[skinId as Exclude<SkinSet, 'default'>];
        if (price && playerPoints >= price && !unlockedSkins.includes(skinId)) {
            setPlayerPoints(prevPoints => prevPoints - price);
            setUnlockedSkins(prevSkins => [...prevSkins, skinId]);
            setSkinSet(skinId);
        }
    };

    const handleOpenChest = (keyType: KeyType): number => {
        if (keys[keyType] > 0) {
            setKeys(prev => ({ ...prev, [keyType]: prev[keyType] - 1 }));
            const rewards = CHEST_REWARDS[keyType];
            let pointsWon = Math.floor(Math.random() * (rewards.max - rewards.min + 1)) + rewards.min;
            if (event !== 'none') {
                pointsWon = Math.floor(pointsWon * 1.2);
            }
            setPlayerPoints(prev => prev + pointsWon);
            return pointsWon;
        }
        return 0;
    };

    if (!isGameStarted) {
        return <StartScreen 
                    onStart={handleGameStart} 
                    onOpenSkinShop={() => setIsSkinShopOpen(true)}
                    onOpenChestShop={() => setIsChestShopOpen(true)}
                />;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 font-sans">
            <header className="w-full max-w-7xl flex justify-between items-center mb-4">
                 <div className="w-64"></div> {/* Spacer */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-slate-400">
                        Gemini Chess
                    </h1>
                    <p className="text-slate-400">Play against a Gemini-powered AI.</p>
                </div>
                <div className="w-64 flex justify-end items-center gap-2">
                    <div className="text-lg font-semibold text-yellow-400 bg-slate-800/50 px-3 py-1 rounded-md">
                        {playerPoints}P
                    </div>
                     <button 
                        onClick={() => setIsChestShopOpen(true)}
                        className="bg-yellow-700 hover:bg-yellow-800 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out shadow-lg"
                    >
                        상점
                    </button>
                    <button 
                        onClick={() => setIsSkinShopOpen(true)}
                        className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out shadow-lg"
                    >
                        스킨 샵
                    </button>
                </div>
            </header>
            <main className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl">
                <div className="w-full lg:w-2/3 aspect-square max-w-[640px] mx-auto shadow-2xl">
                     <Board 
                        board={board} 
                        turn={game.turn()} 
                        onMove={handleMove}
                        getLegalMoves={getLegalMoves}
                        isQueenOffBoard={!whiteQueenOnBoard}
                        isLightningMateActive={isLightningMateActive}
                        onPawnSelectForLightningMate={handlePawnSelectForLightningMate}
                        gameMode={gameMode}
                        getLegalMovesForCheckEscape={getLegalMovesForCheckEscape}
                        event={event}
                        skinSet={skinSet}
                        pointNotifications={pointNotifications}
                    />
                </div>
                <div className="w-full lg:w-1/3">
                    <GameInfoPanel 
                        status={status}
                        history={history}
                        onReset={handleReset}
                        isAiThinking={isAiThinking}
                        isLightningMateAvailable={isLightningMateAvailable}
                        isLightningMateActive={isLightningMateActive}
                        onLightningMateActivate={handleLightningMateActivate}
                        difficulty={difficulty}
                        onDifficultyChange={handleDifficultyChange}
                        isGameInProgress={isGameInProgress}
                        whiteTime={whiteTime}
                        blackTime={blackTime}
                        turn={game.turn()}
                        timeControl={timeControl}
                        playerMode={playerMode}
                    />
                </div>
            </main>
            {isSkinShopOpen && (
                <SkinShopModal 
                    onClose={() => setIsSkinShopOpen(false)}
                    onSelectSkin={(skin) => setSkinSet(skin)}
                    currentSkin={skinSet}
                    playerPoints={playerPoints}
                    unlockedSkins={unlockedSkins}
                    onBuySkin={handleBuySkin}
                />
            )}
             {isChestShopOpen && (
                <ChestShopModal
                    onClose={() => setIsChestShopOpen(false)}
                    keys={keys}
                    onOpenChest={handleOpenChest}
                    isEventActive={event !== 'none'}
                />
            )}
            {gameOver && <GameOverModal message={gameOverMessage} onReset={handleReset} wonKey={lastWonKey} />}
        </div>
    );
};

export default App;