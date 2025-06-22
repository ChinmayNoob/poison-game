import { NextRequest, NextResponse } from 'next/server';
import { gameStore } from '@/lib/game-store';

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        if (!body) {
            return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
        }

        const { action, ...data } = JSON.parse(body);

        switch (action) {
            case 'create-room': {
                const { playerName, playerId } = data;
                const roomId = Math.random().toString(36).substr(2, 6).toUpperCase();
                const gameState = gameStore.createRoom(roomId, playerName, playerId);
                return NextResponse.json({ success: true, roomId, gameState });
            }

            case 'create-room-with-id': {
                const { roomId, playerName, playerId } = data;
                const result = gameStore.createRoomWithId(roomId, playerName, playerId);
                return NextResponse.json(result);
            }

            case 'join-room': {
                const { roomId, playerName, playerId } = data;
                console.log(`Join room request: ${roomId} by ${playerName} (${playerId})`);
                const result = gameStore.joinRoom(roomId, playerName, playerId);
                return NextResponse.json(result);
            }

            case 'get-game': {
                const { roomId } = data;
                const gameState = gameStore.getRoom(roomId);
                return NextResponse.json({ gameState });
            }

            case 'select-secret-heart': {
                const { roomId, playerId, heartColor } = data;
                const gameState = gameStore.selectSecretHeart(roomId, playerId, heartColor);
                return NextResponse.json({ gameState });
            }

            case 'pick-heart': {
                const { roomId, playerId, heartColor } = data;
                const result = gameStore.pickHeart(roomId, playerId, heartColor);
                return NextResponse.json(result);
            }

            case 'reset-game': {
                const { roomId } = data;
                console.log(`Resetting game: ${roomId}`);
                const gameState = gameStore.resetGame(roomId);
                return NextResponse.json({ gameState, reset: true });
            }

            case 'debug-rooms': {
                const rooms = gameStore.listRooms();
                return NextResponse.json({ rooms });
            }

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('Game API error:', error);
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Add GET endpoint for debugging
export async function GET() {
    const rooms = gameStore.listRooms();
    return NextResponse.json({
        message: 'Poison Game API',
        activeRooms: rooms,
        totalRooms: rooms.length
    });
} 