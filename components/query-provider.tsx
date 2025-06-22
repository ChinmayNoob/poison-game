"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Optimize for game data
                        staleTime: 1000, // Data considered fresh for 1 second
                        gcTime: 1000 * 60 * 5, // Cache for 5 minutes
                        refetchOnWindowFocus: false, // Don't refetch on window focus
                        refetchOnReconnect: true, // Refetch on reconnect
                        retry: 3, // Retry failed requests 3 times
                        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
} 