const API_BASE = '/api/game';

export const gameActions = {
    createRoom: async (playerName: string, playerId: string) => {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'create-room', playerName, playerId }),
        });
        return response.json();
    },

    createRoomWithId: async (roomId: string, playerName: string, playerId: string) => {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'create-room-with-id', roomId, playerName, playerId }),
        });
        return response.json();
    },

    joinRoom: async (roomId: string, playerName: string, playerId: string) => {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'join-room', roomId, playerName, playerId }),
        });
        return response.json();
    },

    getGame: async (roomId: string) => {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'get-game', roomId }),
        });
        return response.json();
    },

    selectSecretHeart: async (roomId: string, playerId: string, heartColor: string) => {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'select-secret-heart', roomId, playerId, heartColor }),
        });
        return response.json();
    },

    pickHeart: async (roomId: string, playerId: string, heartColor: string) => {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'pick-heart', roomId, playerId, heartColor }),
        });
        return response.json();
    },

    resetGame: async (roomId: string) => {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'reset-game', roomId }),
        });
        return response.json();
    },

    debugRooms: async () => {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'debug-rooms' }),
        });
        return response.json();
    },
}; 