import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet } from 'wagmi/chains';

// Get your project ID at https://cloud.walletconnect.com
// This is required for WalletConnect v2
export const config = getDefaultConfig({
  appName: 'laotransformation',
  projectId: 'd6506f86d5777c258b2c9cbc522dc704',
  chains: [mainnet],
  ssr: true,
});
