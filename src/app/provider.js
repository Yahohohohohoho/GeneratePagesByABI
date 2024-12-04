"use client";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, goerli, optimism, arbitrum, base, sepolia, holesky } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { http } from 'wagmi';

const config = getDefaultConfig({
  appName: "task-demo",
  projectId: "a778dc2ceaed2fe943923df3f8e3cd79",
  chains: [mainnet, sepolia, holesky],
  ssr: true, // If your dApp uses server side rendering (SSR)
  transports: {
    [mainnet.id]: http('https://mainnet.infura.io/v3/1ffdb388b04849289427741d9ec75b50'),
    [sepolia.id]: http('https://sepolia.infura.io/v3/1ffdb388b04849289427741d9ec75b50'),
    [holesky.id]: http('https://holesky.infura.io/v3/1ffdb388b04849289427741d9ec75b50'),
  },
});

const queryClient = new QueryClient();
export function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
