"use client";

import { AiOutlineHeart } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { HEART_COLORS } from "@/lib/game-store";
import { useState } from "react";

interface HeartCircleProps {
    myPickedHearts: string[];
    allPickedHearts: string[];
    selectedSecretHeart: string | null;
    onHeartClick: (color: string) => void;
    canPickHeart: boolean;
    isLoading?: boolean;
}

export function HeartCircle({
    myPickedHearts,
    allPickedHearts,
    selectedSecretHeart,
    onHeartClick,
    canPickHeart,
    isLoading = false
}: HeartCircleProps) {
    const [clickingHeart, setClickingHeart] = useState<string | null>(null);
    const centerX = 225;
    const centerY = 225;

    const handleHeartClick = async (color: string) => {
        if (!canPickHeart || allPickedHearts.includes(color) || color === selectedSecretHeart || isLoading || clickingHeart) {
            return;
        }

        setClickingHeart(color);
        try {
            await onHeartClick(color);
        } finally {
            // Clear clicking state after a short delay to show feedback
            setTimeout(() => setClickingHeart(null), 300);
        }
    };

    // Calculate position for hearts in two rings
    const getHeartPosition = (index: number) => {
        if (index < 18) {
            // Outer ring - first 18 hearts
            const angle = (index * 2 * Math.PI) / 18 - Math.PI / 2;
            const radius = 160;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            return { x, y, ring: 'outer' };
        } else {
            // Inner ring - last 8 hearts
            const innerIndex = index - 18;
            const angle = (innerIndex * 2 * Math.PI) / 8 - Math.PI / 2;
            const radius = 80;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            return { x, y, ring: 'inner' };
        }
    };

    return (
        <>
            <div className="relative w-[450px] h-[450px] mx-auto">
                {/* Background circles for visual reference */}
                <div className="absolute inset-0 rounded-full border-2 border-gray-200 opacity-20" />
                <div className="absolute inset-[80px] rounded-full border border-gray-200 opacity-15" />

                {HEART_COLORS.map((color, index) => {
                    const { x, y, ring } = getHeartPosition(index);
                    const isPicked = allPickedHearts.includes(color);
                    const isMySecret = selectedSecretHeart === color;
                    const isClicking = clickingHeart === color;
                    const isDisabled = !canPickHeart || isPicked || isMySecret || isLoading;

                    return (
                        <button
                            key={index}
                            onClick={() => handleHeartClick(color)}
                            disabled={isDisabled}
                            className={`
                            absolute w-12 h-12 rounded-full border-2 transition-all duration-200 
                            flex items-center justify-center
                            ${isPicked
                                    ? "bg-gray-100 border-gray-300 opacity-60"
                                    : "bg-white border-gray-300 shadow-md"
                                }
                            ${isMySecret
                                    ? "border-yellow-400 border-4 shadow-lg ring-2 ring-yellow-200"
                                    : ""
                                }
                            ${!isDisabled && !isPicked
                                    ? "hover:scale-110 hover:shadow-lg hover:border-blue-400 cursor-pointer active:scale-95"
                                    : ""
                                }
                            ${isDisabled && !isPicked
                                    ? "cursor-not-allowed opacity-50"
                                    : ""
                                }
                            ${isClicking
                                    ? "scale-95 bg-blue-50 border-blue-500"
                                    : ""
                                }
                            ${ring === 'inner' ? 'z-20' : 'z-10'}
                        `}
                            style={{
                                left: x - 24, // Center the 48px button (12 * 4 = 48px)
                                top: y - 24,
                            }}
                            title={
                                isPicked
                                    ? "Already picked"
                                    : isMySecret
                                        ? "Your secret poison heart - can't pick this!"
                                        : !canPickHeart
                                            ? "Wait for your turn"
                                            : `Pick ${color} heart`
                            }
                        >
                            {isPicked ? (
                                <AiOutlineHeart
                                    size={20}
                                    color="#888"
                                    className="transition-all duration-200"
                                />
                            ) : (
                                <FaHeart
                                    size={20}
                                    color={color}
                                    className={`transition-all duration-200 ${isClicking ? "scale-110" : ""
                                        }`}
                                />
                            )}

                            {/* Loading indicator for the heart being clicked */}
                            {isClicking && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </button>
                    );
                })}

            </div>

            {/* Turn indicator below the circle */}
            <div className="mt-6 text-center">
                {isLoading && (
                    <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        Processing...
                    </div>
                )}
                {!canPickHeart && !isLoading && (
                    <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border">
                        {myPickedHearts.length === 0 ? "⏳ Waiting for your turn..." : "🎯 Other player's turn"}
                    </div>
                )}
                {canPickHeart && !isLoading && (
                    <div className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                        ✨ Your turn - Pick a heart!
                    </div>
                )}
            </div>
        </>
    );
} 