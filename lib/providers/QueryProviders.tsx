"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 30 * 1000, // 30 seconds
                        refetchOnWindowFocus: false, // Set to false to avoid excessive refetching
                        refetchOnMount: true,
                        refetchOnReconnect: true,
                        retry: (failureCount, error) => {
                            // Don't retry on 4xx errors
                            if (error && 'status' in error && typeof error.status === 'number') {
                                if (error.status >= 400 && error.status < 500) {
                                    return false;
                                }
                            }
                            return failureCount < 3;
                        },
                        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
                    },
                    mutations: {
                        retry: (failureCount, error) => {
                            // Don't retry mutations on client errors
                            if (error && 'status' in error && typeof error.status === 'number') {
                                if (error.status >= 400 && error.status < 500) {
                                    return false;
                                }
                            }
                            return failureCount < 1;
                        },
                        retryDelay: 1000,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}