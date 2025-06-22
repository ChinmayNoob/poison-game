"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaHeart, FaRandom, FaUsers, FaPlay, FaCopy } from "react-icons/fa";
import { toast, Toaster } from "sonner";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const [customRoomId, setCustomRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createRandomRoom = () => {
    setIsLoading(true);
    const roomId = Math.random().toString(36).substr(2, 6).toUpperCase();
    router.push(`/room/${roomId}`);
  };

  const createCustomRoom = () => {
    if (!customRoomId.trim()) {
      toast.error("Please enter a room name");
      return;
    }

    const sanitizedId = customRoomId.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (sanitizedId.length < 3) {
      toast.error("Room name must be at least 3 characters");
      return;
    }

    setIsLoading(true);
    router.push(`/room/${sanitizedId}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      createCustomRoom();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-bounce delay-1000">
          <FaHeart className="text-pink-300 opacity-20" size={60} />
        </div>
        <div className="absolute top-40 right-20 animate-pulse delay-2000">
          <FaHeart className="text-purple-300 opacity-15" size={40} />
        </div>
        <div className="absolute bottom-32 left-20 animate-bounce delay-3000">
          <FaHeart className="text-red-300 opacity-25" size={50} />
        </div>
        <div className="absolute bottom-20 right-10 animate-pulse">
          <FaHeart className="text-pink-200 opacity-20" size={35} />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-lg space-y-8 px-4 sm:px-0">
          {/* Header Card */}
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="relative">
                  <Image
                    src="/Heart Eyes.svg"
                    alt="Heart Eyes"
                    width={80}
                    height={60}
                    className="hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Poison Heart
                  </CardTitle>
                  <div className="text-sm text-gray-600 font-medium">The Ultimate Strategy Game</div>
                </div>
                <div className="relative">
                  <Image
                    src="/Winking.svg"
                    alt="Winking"
                    width={80}
                    height={60}
                    className="hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                Outsmart your opponent by choosing the perfect poison heart. Will you be the hunter or the hunted?
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Quick Start */}
              <div className="space-y-3">
                <Button
                  onClick={createRandomRoom}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  disabled={isLoading}
                >
                  <FaPlay className="mr-3" />
                  {isLoading ? "Starting Game..." : "Quick Play"}
                  <FaRandom className="ml-3" />
                </Button>
                <p className="text-xs text-gray-500 text-center">Instantly create a random room and start playing</p>
              </div>

              <div className="flex items-center">
                <hr className="flex-1 border-gray-300" />
                <span className="px-4 text-gray-500 text-sm font-medium">or create custom room</span>
                <hr className="flex-1 border-gray-300" />
              </div>

              {/* Custom Room */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    <FaUsers className="mr-2 text-purple-500" />
                    Room Name
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="Enter room name (e.g., MYGAME)"
                      value={customRoomId}
                      onChange={(e) => setCustomRoomId(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="h-12 text-lg uppercase font-mono border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-200"
                      maxLength={20}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <FaCopy className="text-gray-400" size={16} />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={createCustomRoom}
                  disabled={!customRoomId.trim() || isLoading}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200"
                >
                  <FaUsers className="mr-2" />
                  {isLoading ? "Joining..." : "Create/Join Room"}
                </Button>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700 text-center leading-relaxed">
                    💡 <strong>Tip:</strong> Share the room name with your friend to play together
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How to Play */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-xl font-bold text-gray-800 flex items-center justify-center">
                <Image
                  src="/Angry.svg"
                  alt="Game Rules"
                  width={40}
                  height={30}
                  className="mr-2"
                />
                How to Play
                <Image
                  src="/Wailing.svg"
                  alt="Game Rules"
                  width={40}
                  height={30}
                  className="ml-2"
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:gap-3">
                <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <FaHeart className="text-red-500 mt-1 flex-shrink-0" size={16} />
                  <div>
                    <p className="text-sm font-semibold text-red-800">Choose Your Poison</p>
                    <p className="text-xs text-red-600">Secretly select one heart color as your &quot;poison&quot;</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="text-blue-500 mt-1 flex-shrink-0 text-lg">🎯</span>
                  <div>
                    <p className="text-sm font-semibold text-blue-800">Take Turns</p>
                    <p className="text-xs text-blue-600">Alternate picking hearts from the circle</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <span className="text-yellow-600 mt-1 flex-shrink-0 text-lg">💀</span>
                  <div>
                    <p className="text-sm font-semibold text-yellow-800">Avoid the Poison</p>
                    <p className="text-xs text-yellow-600">If you pick your opponent&apos;s poison, you lose!</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <span className="text-green-500 mt-1 flex-shrink-0 text-lg">🏆</span>
                  <div>
                    <p className="text-sm font-semibold text-green-800">Victory</p>
                    <p className="text-xs text-green-600">Make your opponent pick your poison to win!</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
                <p className="text-center text-sm font-medium text-purple-800">
                  🧠 <strong>Strategy Tip:</strong> Mind games and psychology are key to victory!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-white/80 text-sm">
            <p>Made with <FaHeart className="inline text-pink-300 mx-1" size={12} /> by Chinmay</p>
          </div>
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
