import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

// Get your project ID at https://cloud.walletconnect.com
// This is required for WalletConnect v2
export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [sepolia],
  ssr: true,
});
