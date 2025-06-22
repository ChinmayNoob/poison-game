import { gameStore, gameEvents, GameState } from '@/lib/game-store';
import { NextRequest } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    const { roomId } = await params;

    // Check if room exists
    const gameState = gameStore.getRoom(roomId);
    if (!gameState) {
        return new Response('Room not found', { status: 404 });
    }

    // Create a readable stream for SSE
    const stream = new ReadableStream({
        start(controller) {
            // Send initial game state
            const initialData = `data: ${JSON.stringify(gameState)}\n\n`;
            controller.enqueue(new TextEncoder().encode(initialData));

            // Create event listener for this room
            const listener = (updatedGameState: GameState) => {
                try {
                    const data = `data: ${JSON.stringify(updatedGameState)}\n\n`;
                    controller.enqueue(new TextEncoder().encode(data));
                } catch (error) {
                    console.error('Error sending SSE update:', error);
                }
            };

            // Add listener to the room
            gameEvents.addListener(roomId, listener);

            // Store listener reference for cleanup
            const cleanup = () => {
                gameEvents.removeListener(roomId, listener);
            };

            // Handle client disconnect
            request.signal.addEventListener('abort', () => {
                cleanup();
                try {
                    controller.close();
                } catch (error) {
                    console.log('SSE connection already closed:', error);
                }
            });

            // Keep connection alive with periodic heartbeat
            const heartbeat = setInterval(() => {
                try {
                    controller.enqueue(new TextEncoder().encode(`: heartbeat\n\n`));
                } catch (error) {
                    console.log('SSE heartbeat failed, cleaning up:', error);
                    clearInterval(heartbeat);
                    cleanup();
                }
            }, 30000); // Send heartbeat every 30 seconds

            // Clean up heartbeat when stream is cancelled
            const originalClose = controller.close.bind(controller);
            controller.close = () => {
                clearInterval(heartbeat);
                cleanup();
                originalClose();
            };
        },
    });

    // Return SSE response
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Cache-Control',
        },
    });
} 