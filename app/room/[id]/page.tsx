"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaHeart, FaCopy, FaArrowLeft, FaUsers } from "react-icons/fa";
import Image from "next/image";
import { toast, Toaster } from "sonner";

import { NameInput } from "@/components/name-input";
import { HeartCircle } from "@/components/heart-circle";
import { SecretHeartSelector } from "@/components/secret-heart-selector";
import { GameState } from "@/lib/game-store";
import {
    useGameState,
    useRoomExists,
    useCreateRoom,
    useJoinRoom,
    useSelectSecretHeart,
    usePickHeart,
    useResetGame
} from "@/lib/game-queries";

type GameScreen = "name" | "waiting" | "game";

export default function GameRoom() {
    const params = useParams();
    const router = useRouter();
    const roomId = params.id as string;

    const [currentScreen, setCurrentScreen] = useState<GameScreen>("name");
    const [playerId, setPlayerId] = useState("");
    const [selectedSecretHeart, setSelectedSecretHeart] = useState<string | null>(null);
    const [lastGamePhase, setLastGamePhase] = useState<string>("");

    // Generate player ID once
    useEffect(() => {
        if (!playerId) {
            setPlayerId(Math.random().toString(36).substr(2, 9));
        }
    }, [playerId]);

    // TanStack Query hooks
    const { data: roomData, isLoading: roomLoading } = useRoomExists(roomId);
    const { data: gameData, isLoading: gameLoading, error: gameError } = useGameState(
        roomId,
        currentScreen === "game"
    );

    const createRoomMutation = useCreateRoom();
    const joinRoomMutation = useJoinRoom();
    const selectHeartMutation = useSelectSecretHeart();
    const pickHeartMutation = usePickHeart();
    const resetGameMutation = useResetGame();

    // Extract data from queries
    const roomExists = roomData?.exists ?? null;
    const gameState = gameData?.gameState ?? null;

    // Handle game phase changes and reset detection
    useEffect(() => {
        if (gameState) {
            // Check if game was reset by detecting phase change from finished to selecting
            if (lastGamePhase === "finished" && gameState.gamePhase === "selecting") {
                setSelectedSecretHeart(null);
                toast.success("Game reset! Choose your secret hearts again.");
            }
            setLastGamePhase(gameState.gamePhase);
        }
    }, [gameState, lastGamePhase]);

    const handleNameSubmit = async (name: string) => {
        try {
            if (roomExists) {
                // Join existing room
                const result = await joinRoomMutation.mutateAsync({ roomId, playerName: name, playerId });
                if (result.success && result.gameState) {
                    setCurrentScreen("game");
                    toast.success(`Joined room: ${roomId}`);
                } else {
                    toast.error(result.error || "Failed to join room");
                }
            } else {
                // Create new room with this ID
                const result = await createRoomMutation.mutateAsync({ roomId, playerName: name, playerId });
                if (result.success) {
                    setCurrentScreen("game");
                    toast.success(`Room created: ${roomId}`);
                } else {
                    toast.error("Failed to create room");
                }
            }
        } catch {
            toast.error("Failed to connect to room");
        }
    };

    const handleSelectSecretHeart = async (heartColor: string) => {
        if (!roomId) return;

        try {
            const result = await selectHeartMutation.mutateAsync({ roomId, playerId, heartColor });
            if (result.gameState) {
                // Update local state only after successful server response
                setSelectedSecretHeart(heartColor);
                if (result.gameState.gamePhase === "playing") {
                    toast.success("Game started! Take turns picking hearts.");
                }
            }
        } catch {
            toast.error("Failed to select heart");
        }
    };

    const handlePickHeart = async (heartColor: string) => {
        if (!roomId || !gameState || gameState.currentTurn !== playerId || pickHeartMutation.isPending) {
            return;
        }

        const currentPlayer = gameState.players.find((p: any) => p.id === playerId);
        if (currentPlayer?.pickedHearts.includes(heartColor)) {
            toast.error("You already picked this heart!");
            return;
        }

        try {
            const result = await pickHeartMutation.mutateAsync({ roomId, playerId, heartColor });
            if (result.gameState) {
                if (result.isPoisoned) {
                    toast.error("💀 You picked the poison heart! You lose!");
                } else {
                    toast.success("✅ Safe! Other player's turn.");
                }
            } else {
                toast.error("Failed to pick heart - invalid move");
            }
        } catch (error) {
            console.error('Error picking heart:', error);
            toast.error("Failed to pick heart");
        }
    };

    const handleResetGame = async () => {
        if (!roomId) return;

        try {
            const result = await resetGameMutation.mutateAsync(roomId);
            if (result.gameState) {
                setSelectedSecretHeart(null);
                setLastGamePhase("selecting");
                toast.success("Game reset! Choose your secret hearts again.");
            }
        } catch {
            toast.error("Failed to reset game");
        }
    };

    const copyRoomLink = () => {
        const link = window.location.href;
        navigator.clipboard.writeText(link);
        toast.success("Room link copied to clipboard!");
    };

    const goBack = () => {
        router.push('/');
    };

    if (currentScreen === "name") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4 flex items-center justify-center">
                {/* Animated background hearts */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 animate-bounce delay-1000">
                        <FaHeart className="text-pink-300 opacity-20" size={40} />
                    </div>
                    <div className="absolute bottom-32 right-20 animate-pulse delay-2000">
                        <FaHeart className="text-purple-300 opacity-15" size={35} />
                    </div>
                </div>

                <div className="relative z-10 w-full max-w-md">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            <Badge variant="secondary" className="bg-white/90">Room: {roomId}</Badge>
                            <div className="text-white text-sm font-medium">
                                {roomExists === null && "🔍 Checking room..."}
                                {roomExists === true && "🚪 Joining existing room"}
                                {roomExists === false && "✨ Creating new room"}
                            </div>
                        </div>
                    </div>

                    <NameInput onNameSubmit={handleNameSubmit} />

                    <div className="mt-6">
                        <Button
                            onClick={goBack}
                            variant="outline"
                            className="w-full bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 transition-all duration-200"
                        >
                            <FaArrowLeft className="mr-2" /> Back to Main Menu
                        </Button>
                    </div>
                </div>

                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: {
                            background: 'white',
                            color: 'black',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                        },
                    }}
                />
            </div>
        );
    }

    if (!gameState) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
                <div className="text-white">Loading game...</div>
                <Toaster />
            </div>
        );
    }

    const currentPlayer = gameState.players.find((p: any) => p.id === playerId);
    const isMyTurn = gameState.currentTurn === playerId;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-2 sm:p-4">
            {/* Animated background hearts */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-5 animate-bounce delay-1000">
                    <FaHeart className="text-pink-300 opacity-10" size={30} />
                </div>
                <div className="absolute top-40 right-10 animate-pulse delay-2000">
                    <FaHeart className="text-purple-300 opacity-15" size={25} />
                </div>
                <div className="absolute bottom-20 left-10 animate-bounce delay-3000">
                    <FaHeart className="text-red-300 opacity-20" size={35} />
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-4 sm:mb-6">
                    <div className="flex items-center justify-center mb-4">
                        <div className="relative mr-3">
                            <Image
                                src="/Heart Eyes.svg"
                                alt="Game Logo"
                                width={50}
                                height={35}
                                className="hidden sm:block"
                            />
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-bold text-white">Poison Heart Game</h1>
                        <div className="relative ml-3">
                            <Image
                                src="/Winking.svg"
                                alt="Game Logo"
                                width={50}
                                height={35}
                                className="hidden sm:block"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                        <Badge variant="secondary" className="bg-white/90 text-lg px-4 py-1">
                            Room: {roomId}
                        </Badge>
                        <Button
                            onClick={copyRoomLink}
                            variant="outline"
                            size="sm"
                            className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                        >
                            <FaCopy className="mr-1" /> Copy Link
                        </Button>
                        <Button
                            onClick={goBack}
                            variant="outline"
                            size="sm"
                            className="bg-red-500/20 backdrop-blur-sm border-red-300/50 text-white hover:bg-red-500/30 transition-all duration-200"
                        >
                            <FaArrowLeft className="mr-1" /> Exit Game
                        </Button>
                    </div>

                    <Badge
                        variant={isMyTurn ? "default" : "outline"}
                        className={`text-base px-4 py-2 ${isMyTurn
                            ? "bg-green-500 text-white animate-pulse"
                            : "bg-white/20 text-white border-white/30"
                            }`}
                    >
                        {isMyTurn ? "🎯 Your Turn" : "⏳ Waiting..."}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
                    {/* Players Panel */}
                    <Card className="xl:col-span-1 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-lg">
                                <span>Players ({gameState.players.length}/2)</span>
                                <FaUsers className="text-purple-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {gameState.players.map((player: any) => (
                                <div
                                    key={player.id}
                                    className={`flex items-center justify-between p-3 rounded-lg transition-all ${player.id === playerId
                                        ? "bg-purple-50 border-2 border-purple-200"
                                        : "bg-gray-50"
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-3 h-3 rounded-full ${player.id === playerId ? "bg-purple-500" : "bg-gray-400"
                                            }`}></div>
                                        <span className={`${player.id === playerId ? "font-bold text-purple-800" : "text-gray-700"}`}>
                                            {player.name}
                                            {player.id === playerId && (
                                                <span className="text-xs text-purple-600 ml-1">(You)</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {player.isPoisoned && <span className="text-red-500 text-lg">💀</span>}
                                        {player.secretHeart && gameState.gamePhase === "finished" && (
                                            <FaHeart color={player.secretHeart} size={16} />
                                        )}
                                    </div>
                                </div>
                            ))}

                            {gameState.gamePhase === "waiting" && gameState.players.length === 1 && (
                                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                                    <div className="text-center space-y-2">
                                        <div className="flex items-center justify-center mb-2">
                                            <Image
                                                src="/Wailing.svg"
                                                alt="Waiting"
                                                width={40}
                                                height={30}
                                            />
                                        </div>
                                        <p className="text-sm font-semibold text-blue-800">
                                            Waiting for another player...
                                        </p>
                                        <p className="text-xs text-blue-600">
                                            Share the room link with a friend:
                                        </p>
                                        <Button
                                            onClick={copyRoomLink}
                                            variant="outline"
                                            size="sm"
                                            className="w-full mt-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                                        >
                                            <FaCopy className="mr-1" /> Copy Room Link
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Game Board */}
                    <Card className="xl:col-span-3 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                        <CardHeader className="text-center pb-4">
                            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
                                {gameState.gamePhase === "waiting" && (
                                    <div className="flex items-center justify-center space-x-2">
                                        <Image src="/Wailing.svg" alt="Waiting" width={40} height={30} />
                                        <span>Waiting for another player...</span>
                                    </div>
                                )}
                                {gameState.gamePhase === "selecting" && (
                                    <div className="flex items-center justify-center space-x-2">
                                        <Image src="/Heart Eyes.svg" alt="Choose" width={40} height={30} />
                                        <span>Choose your secret poison heart!</span>
                                    </div>
                                )}
                                {gameState.gamePhase === "playing" && (
                                    <div className="flex items-center justify-center space-x-2">
                                        <Image src="/Angry.svg" alt="Battle" width={40} height={30} />
                                        <span>Pick hearts carefully!</span>
                                    </div>
                                )}
                                {gameState.gamePhase === "finished" && (
                                    <div className="flex items-center justify-center space-x-2">
                                        {gameState.winner === playerId ? (
                                            <>
                                                <Image src="/Heart Eyes.svg" alt="Victory" width={40} height={30} />
                                                <span className="text-green-600">🎉 You Won!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Image src="/Wailing.svg" alt="Defeat" width={40} height={30} />
                                                <span className="text-red-600">💀 Game Over!</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            {gameState.gamePhase === "selecting" && (
                                <SecretHeartSelector
                                    onHeartSelect={handleSelectSecretHeart}
                                    selectedHeart={currentPlayer?.secretHeart || null}
                                />
                            )}

                            {(gameState.gamePhase === "playing" || gameState.gamePhase === "finished") && (
                                <div className="w-full">
                                    <HeartCircle
                                        myPickedHearts={currentPlayer?.pickedHearts || []}
                                        allPickedHearts={gameState.players.flatMap((p: any) => p.pickedHearts)}
                                        selectedSecretHeart={selectedSecretHeart}
                                        onHeartClick={handlePickHeart}
                                        canPickHeart={isMyTurn && gameState.gamePhase === "playing"}
                                        isLoading={pickHeartMutation.isPending}
                                    />
                                    <div className="text-center mt-4">
                                        <div className="inline-flex items-center space-x-4 bg-gray-50 px-4 py-2 rounded-lg">
                                            <p className="text-sm text-gray-600">
                                                Your picks: <span className="font-bold">{currentPlayer?.pickedHearts?.length || 0}</span>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Total hearts: <span className="font-bold">{gameState.hearts.length}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {gameState.gamePhase === "finished" && (
                                <div className="text-center mt-6 space-y-3">
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Button
                                            onClick={handleResetGame}
                                            disabled={resetGameMutation.isPending}
                                            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-6 py-3"
                                        >
                                            {resetGameMutation.isPending ? "Resetting..." : "🔄 Play Again"}
                                        </Button>
                                        <Button
                                            onClick={goBack}
                                            variant="outline"
                                            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3"
                                        >
                                            🏠 New Game
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: 'white',
                        color: 'black',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                    },
                }}
            />
        </div>
    );
} 