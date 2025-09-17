import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

type Difficulty = 'easy' | 'medium' | 'hard';

export const getAIMove = async (pgn: string, moves: string[], difficulty: Difficulty): Promise<string> => {
    const model = 'gemini-2.5-flash';
    
    let systemPrompt = '';
    let temperature = 0.5;

    switch (difficulty) {
        case 'easy':
            systemPrompt = `You are a beginner chess player. Your name is "Gemini-Chess". You sometimes make mistakes or less-than-optimal moves. Choose a reasonable but not necessarily the best move.`;
            temperature = 1.0;
            break;
        case 'medium':
            systemPrompt = `You are a skilled chess club player. Your name is "Gemini-Chess". Analyze the position and choose a strong move.`;
            temperature = 0.5;
            break;
        case 'hard':
            systemPrompt = `You are a world-class chess grandmaster. Your name is "Gemini-Chess". Analyze the position deeply and choose the absolute best possible move to crush your opponent.`;
            temperature = 0.2;
            break;
    }

    const prompt = `
        ${systemPrompt}
        You are playing a game of chess as the black pieces. It is your turn to move.
        The game history is provided in PGN format.
        The list of legal moves available to you is also provided.

        Game PGN:
        ${pgn}

        Legal moves available to you:
        [${moves.join(', ')}]

        Respond with ONLY the best move in Standard Algebraic Notation (SAN). For example: "Nf3" or "e4" or "O-O".
        Do not provide any explanation, commentary, or any text other than the chosen move. Your entire response should be just the move.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                temperature: temperature,
                topP: 0.9,
                thinkingConfig: { thinkingBudget: 0 } // For low latency
            }
        });

        const move = response.text.trim().replace(/['"`]/g, ''); // Clean up potential quotes

        if (moves.includes(move)) {
            return move;
        } else {
            console.warn(`AI returned a move not in the legal list: "${move}". Falling back to a random legal move.`);
            return moves[Math.floor(Math.random() * moves.length)];
        }
    } catch (error) {
        console.error("Error fetching AI move from Gemini API:", error);
        console.log("Falling back to a random legal move due to API error.");
        return moves[Math.floor(Math.random() * moves.length)];
    }
};