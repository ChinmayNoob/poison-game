"use client";

import { FaHeart } from "react-icons/fa";
import { HEART_COLORS } from "@/lib/game-store";

interface SecretHeartSelectorProps {
    onHeartSelect: (color: string) => void;
    selectedHeart: string | null;
}

export function SecretHeartSelector({ onHeartSelect, selectedHeart }: SecretHeartSelectorProps) {
    if (selectedHeart) {
        return (
            <div className="text-center mb-6">
                <p className="mb-2">Your secret poison heart:</p>
                <div className="flex justify-center items-center space-x-2">
                    <FaHeart color={selectedHeart} size={24} />
                    <span className="text-sm text-gray-600">Waiting for other player...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6">
            <p className="text-center mb-4 text-lg font-medium">
                Choose your secret poison heart
            </p>
            <p className="text-center mb-4 text-sm text-gray-600">
                (Don&apos;t let the other player see!)
            </p>
            <div className="grid grid-cols-6 gap-3 max-w-md mx-auto">
                {HEART_COLORS.map((color) => (
                    <button
                        key={color}
                        onClick={() => onHeartSelect(color)}
                        className="p-3 rounded-lg hover:scale-110 transition-transform bg-white/20 hover:bg-white/30"
                    >
                        <FaHeart color={color} size={24} />
                    </button>
                ))}
            </div>
        </div>
    );
} 