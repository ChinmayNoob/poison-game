import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gameActions } from "./game-actions";

// Query keys
export const gameKeys = {
    all: ['games'] as const,
    game: (roomId: string) => [...gameKeys.all, roomId] as const,
};

// Game state query hook
export function useGameState(roomId: string, enabled: boolean = true) {
    return useQuery({
        queryKey: gameKeys.game(roomId),
        queryFn: () => gameActions.getGame(roomId),
        enabled: enabled && !!roomId,
        refetchInterval: (query) => {
            // Smart refetch intervals based on game phase
            if (!query.state.data?.gameState) return false;

            const phase = query.state.data.gameState.gamePhase;
            switch (phase) {
                case "waiting":
                    return 3000; // Check frequently for new players
                case "selecting":
                    return 2000; // Check frequently during selection
                case "playing":
                    return 1500; // Most frequent during active play
                case "finished":
                    return false; // Stop polling when finished
                default:
                    return 5000;
            }
        },
        staleTime: 500, // Consider data fresh for 500ms
        gcTime: 1000 * 60 * 2, // Cache for 2 minutes
    });
}

// Room existence check
export function useRoomExists(roomId: string) {
    return useQuery({
        queryKey: ['room-exists', roomId],
        queryFn: async () => {
            try {
                const response = await gameActions.getGame(roomId);
                return { exists: !!response.gameState, gameState: response.gameState };
            } catch {
                return { exists: false, gameState: null };
            }
        },
        enabled: !!roomId,
        staleTime: 1000 * 30, // Cache room existence for 30 seconds
        retry: 1, // Only retry once for room existence
    });
}

// Mutations for game actions
export function useCreateRoom() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ roomId, playerName, playerId }: { roomId: string; playerName: string; playerId: string }) =>
            gameActions.createRoomWithId(roomId, playerName, playerId),
        onSuccess: (data, variables) => {
            // Update game state cache
            if (data.gameState) {
                queryClient.setQueryData(gameKeys.game(variables.roomId), {
                    gameState: data.gameState,
                    success: true
                });
            }
            // Mark room as existing
            queryClient.setQueryData(['room-exists', variables.roomId], {
                exists: true,
                gameState: data.gameState
            });
        },
    });
}

export function useJoinRoom() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ roomId, playerName, playerId }: { roomId: string; playerName: string; playerId: string }) =>
            gameActions.joinRoom(roomId, playerName, playerId),
        onSuccess: (data, variables) => {
            if (data.gameState) {
                queryClient.setQueryData(gameKeys.game(variables.roomId), {
                    gameState: data.gameState,
                    success: true
                });
            }
        },
    });
}

export function useSelectSecretHeart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ roomId, playerId, heartColor }: { roomId: string; playerId: string; heartColor: string }) =>
            gameActions.selectSecretHeart(roomId, playerId, heartColor),
        onSuccess: (data, variables) => {
            if (data.gameState) {
                queryClient.setQueryData(gameKeys.game(variables.roomId), {
                    gameState: data.gameState,
                    success: true
                });
            }
        },
    });
}

export function usePickHeart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ roomId, playerId, heartColor }: { roomId: string; playerId: string; heartColor: string }) =>
            gameActions.pickHeart(roomId, playerId, heartColor),
        onSuccess: (data, variables) => {
            if (data.gameState) {
                queryClient.setQueryData(gameKeys.game(variables.roomId), {
                    gameState: data.gameState,
                    success: true
                });
            }
        },
    });
}

export function useResetGame() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (roomId: string) => gameActions.resetGame(roomId),
        onSuccess: (data, roomId) => {
            if (data.gameState) {
                queryClient.setQueryData(gameKeys.game(roomId), {
                    gameState: data.gameState,
                    success: true
                });
            }
        },
    });
} 