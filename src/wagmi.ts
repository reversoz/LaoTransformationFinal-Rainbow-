import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'laotransformation',
  projectId: 'd6506f86d5777c258b2c9cbc522dc704',
  chains: [mainnet],
  transports: {
    [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/Lhl4ddnfjJecFpB_6rUsx'),
  },
  ssr: true,
});