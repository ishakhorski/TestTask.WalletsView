import type { NetworkType } from './networkType';

interface WalletAsset {
    id: string;
    name: string;
    asset: {
      identifier: string;
      network: NetworkType;
      symbol: string;
    },
    assetUsdValue: { value: number };
    assetAmount: number;
  }

  export type { WalletAsset }