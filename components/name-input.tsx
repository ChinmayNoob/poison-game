"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaUser, FaArrowRight, FaHeart } from "react-icons/fa";
import Image from "next/image";

interface NameInputProps {
    onNameSubmit: (name: string) => void;
}

export function NameInput({ onNameSubmit }: NameInputProps) {
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (name.trim() && !isSubmitting) {
            setIsSubmitting(true);
            setTimeout(() => {
                onNameSubmit(name.trim());
            }, 300); // Small delay for animation
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
            <div className="relative">
                {/* Decorative header with gradient */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2"></div>

                <CardHeader className="text-center space-y-4 pt-8 pb-6">
                    {/* Avatar section with SVGs */}
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <div className="relative animate-bounce delay-100">
                            <Image
                                src="/Heart Eyes.svg"
                                alt="Welcome"
                                width={60}
                                height={45}
                                className="hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                        <div className="relative animate-bounce delay-300">
                            <Image
                                src="/Winking.svg"
                                alt="Welcome"
                                width={60}
                                height={45}
                                className="hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                    </div>

                    <div>
                        <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Welcome, Player!
                        </CardTitle>
                        <p className="text-gray-600 text-sm mt-2">
                            Enter your name to join the ultimate poison heart challenge
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 px-8 pb-8">
                    {/* Name input section */}
                    <div className="space-y-4">
                        <div className="relative">
                            <label className="text-sm font-semibold text-gray-700 flex items-center mb-2">
                                <FaUser className="mr-2 text-purple-500" />
                                Your Name
                            </label>

                            <div className="relative">
                                <Input
                                    placeholder="Enter your gaming name..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="h-14 text-lg pl-12 pr-4 border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-200 rounded-xl transition-all duration-200"
                                    autoFocus
                                    maxLength={20}
                                    disabled={isSubmitting}
                                />
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                    <FaUser className="text-purple-400" size={18} />
                                </div>

                                {/* Character counter */}
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <span className="text-xs text-gray-400">
                                        {name.length}/20
                                    </span>
                                </div>
                            </div>

                            {/* Input feedback */}
                            <div className="mt-2 h-4">
                                {name.trim().length > 0 && name.trim().length < 2 && (
                                    <p className="text-xs text-red-500">Name must be at least 2 characters</p>
                                )}
                                {name.trim().length >= 2 && (
                                    <p className="text-xs text-green-600 flex items-center">
                                        <span className="mr-1">✓</span> Looks good!
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit button */}
                        <Button
                            onClick={handleSubmit}
                            className={`w-full h-14 text-lg font-semibold rounded-xl transition-all duration-300 transform ${isSubmitting
                                ? "bg-green-500 hover:bg-green-600 scale-105"
                                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105"
                                }`}
                            disabled={!name.trim() || name.trim().length < 2 || isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Joining Game...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    Continue to Game
                                    <FaArrowRight className="ml-2" />
                                </div>
                            )}
                        </Button>
                    </div>

                    {/* Fun tip section */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                        <div className="flex items-center justify-center mb-2">
                            <FaHeart className="text-pink-500 mr-2" size={16} />
                            <span className="text-sm font-semibold text-purple-800">Pro Tip</span>
                            <FaHeart className="text-pink-500 ml-2" size={16} />
                        </div>
                        <p className="text-xs text-purple-700 text-center leading-relaxed">
                            Choose a memorable name - your opponent will see it during the epic poison heart battles!
                        </p>
                    </div>
                </CardContent>

                {/* Decorative animated hearts */}
                <div className="absolute top-4 right-4 opacity-20">
                    <FaHeart className="text-pink-400 animate-pulse" size={20} />
                </div>
                <div className="absolute bottom-4 left-4 opacity-20">
                    <FaHeart className="text-purple-400 animate-bounce" size={16} />
                </div>
            </div>
        </Card>
    );
} 