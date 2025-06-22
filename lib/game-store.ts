export interface Player {
    id: string;
    name: string;
    secretHeart: string | null;
    isPoisoned: boolean;
    pickedHearts: string[];
}

export interface GameState {
    players: Player[];
    hearts: string[];
    currentTurn: string;
    gamePhase: "waiting" | "selecting" | "playing" | "finished";
    winner: string | null;
}

export const HEART_COLORS = [
    // Outer ring (18 hearts)
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
    "#DDA0DD", "#F39C12", "#E74C3C", "#9B59B6", "#1ABC9C",
    "#2ECC71", "#3498DB", "#FF9800", "#27AE60", "#8E44AD",
    "#17A2B8", "#F1C40F", "#E91E63",
    // Inner ring (8 hearts)
    "#FF5722", "#795548", "#607D8B", "#FF1744", "#00BCD4",
    "#9C27B0", "#FF6F00", "#4CAF50"
];

// Event listener type
type GameEventListener = (gameState: GameState) => void;

// Use globalThis to persist across serverless function calls
declare global {
    var gameRooms: Map<string, GameState> | undefined;
    var gameListeners: Map<string, Set<GameEventListener>> | undefined;
}

// Initialize global storage
if (!globalThis.gameRooms) {
    globalThis.gameRooms = new Map<string, GameState>();
}

if (!globalThis.gameListeners) {
    globalThis.gameListeners = new Map<string, Set<GameEventListener>>();
}

const gameRooms = globalThis.gameRooms;
const gameListeners = globalThis.gameListeners;

// Event emitter functions
const emitGameUpdate = (roomId: string, gameState: GameState) => {
    const listeners = gameListeners.get(roomId);
    if (listeners) {
        listeners.forEach(listener => {
            try {
                listener(gameState);
            } catch (error) {
                console.error('Error in game event listener:', error);
            }
        });
    }
};

export const gameEvents = {
    addListener: (roomId: string, listener: GameEventListener) => {
        if (!gameListeners.has(roomId)) {
            gameListeners.set(roomId, new Set());
        }
        gameListeners.get(roomId)!.add(listener);
    },

    removeListener: (roomId: string, listener: GameEventListener) => {
        const listeners = gameListeners.get(roomId);
        if (listeners) {
            listeners.delete(listener);
            if (listeners.size === 0) {
                gameListeners.delete(roomId);
            }
        }
    },

    removeAllListeners: (roomId: string) => {
        gameListeners.delete(roomId);
    }
};

export const gameStore = {
    createRoom: (roomId: string, playerName: string, playerId: string): GameState => {
        const gameState: GameState = {
            players: [{ id: playerId, name: playerName, secretHeart: null, isPoisoned: false, pickedHearts: [] }],
            hearts: HEART_COLORS,
            currentTurn: "",
            gamePhase: "waiting",
            winner: null
        };

        gameRooms.set(roomId, gameState);
        console.log(`Room created: ${roomId}, Total rooms: ${gameRooms.size}`);
        emitGameUpdate(roomId, gameState);
        return gameState;
    },

    createRoomWithId: (roomId: string, playerName: string, playerId: string): { success: boolean; gameState?: GameState; error?: string } => {
        // Check if room already exists
        if (gameRooms.has(roomId)) {
            return { success: false, error: 'Room already exists' };
        }

        const gameState: GameState = {
            players: [{ id: playerId, name: playerName, secretHeart: null, isPoisoned: false, pickedHearts: [] }],
            hearts: HEART_COLORS,
            currentTurn: "",
            gamePhase: "waiting",
            winner: null
        };

        gameRooms.set(roomId, gameState);
        console.log(`Room created with custom ID: ${roomId}, Total rooms: ${gameRooms.size}`);
        emitGameUpdate(roomId, gameState);
        return { success: true, gameState };
    },

    joinRoom: (roomId: string, playerName: string, playerId: string): { success: boolean; gameState?: GameState; error?: string } => {
        console.log(`Attempting to join room: ${roomId}, Available rooms: ${Array.from(gameRooms.keys()).join(', ')}`);

        const gameState = gameRooms.get(roomId);

        if (!gameState) {
            console.log(`Room ${roomId} not found`);
            return { success: false, error: 'Room not found' };
        }

        if (gameState.players.length >= 2) {
            return { success: false, error: 'Room is full' };
        }

        // Check if player is already in the room
        const existingPlayer = gameState.players.find(p => p.id === playerId);
        if (existingPlayer) {
            return { success: true, gameState };
        }

        gameState.players.push({ id: playerId, name: playerName, secretHeart: null, isPoisoned: false, pickedHearts: [] });
        gameState.gamePhase = "selecting";

        console.log(`Player ${playerName} joined room ${roomId}`);
        emitGameUpdate(roomId, gameState);
        return { success: true, gameState };
    },

    getRoom: (roomId: string): GameState | null => {
        return gameRooms.get(roomId) || null;
    },

    selectSecretHeart: (roomId: string, playerId: string, heartColor: string): GameState | null => {
        const gameState = gameRooms.get(roomId);
        if (!gameState) return null;

        const player = gameState.players.find(p => p.id === playerId);
        if (player) {
            player.secretHeart = heartColor;
        }

        // Check if both players have selected
        const allSelected = gameState.players.every(p => p.secretHeart);
        if (allSelected && gameState.players.length === 2) {
            gameState.gamePhase = "playing";
            gameState.currentTurn = gameState.players[0].id;
        }

        emitGameUpdate(roomId, gameState);
        return gameState;
    },

    pickHeart: (roomId: string, playerId: string, heartColor: string): { gameState: GameState | null; isPoisoned: boolean } => {
        const gameState = gameRooms.get(roomId);
        if (!gameState || gameState.currentTurn !== playerId) {
            return { gameState: null, isPoisoned: false };
        }

        const currentPlayer = gameState.players.find(p => p.id === playerId);
        const otherPlayer = gameState.players.find(p => p.id !== playerId);

        if (!currentPlayer || currentPlayer.pickedHearts.includes(heartColor)) {
            return { gameState: null, isPoisoned: false };
        }

        const isPoisoned = otherPlayer?.secretHeart === heartColor;

        currentPlayer.pickedHearts.push(heartColor);

        if (isPoisoned && currentPlayer) {
            currentPlayer.isPoisoned = true;
            gameState.gamePhase = "finished";
            gameState.winner = otherPlayer?.id || null;
        } else if (otherPlayer) {
            gameState.currentTurn = otherPlayer.id;
        }

        emitGameUpdate(roomId, gameState);
        return { gameState, isPoisoned };
    },

    resetGame: (roomId: string): GameState | null => {
        const gameState = gameRooms.get(roomId);
        if (!gameState) return null;

        gameState.players.forEach(p => {
            p.secretHeart = null;
            p.isPoisoned = false;
            p.pickedHearts = [];
        });
        gameState.currentTurn = "";
        gameState.gamePhase = "selecting";
        gameState.winner = null;

        emitGameUpdate(roomId, gameState);
        return gameState;
    },

    // Debug function to list all rooms
    listRooms: (): string[] => {
        return Array.from(gameRooms.keys());
    }
}; 