import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { trpc, getQueryClient, getTRPCClient } from "@/lib/trpc";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  const trpcClient = getTRPCClient();

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
