import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, optimism, base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Token Portfolio',
  projectId: 'token-portfolio-demo', // For WalletConnect - in production use real project ID
  chains: [mainnet, polygon, arbitrum, optimism, base],
  ssr: false,
});
