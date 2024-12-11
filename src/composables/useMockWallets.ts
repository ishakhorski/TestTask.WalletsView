import walletsData from '@/api/wallets.json';

import type { Wallet } from '@/models/wallet';

const useMockWallets = () => {
    const wallets: Wallet[] = walletsData as Wallet[];

    const getWallets = (take: number, skip: number): Promise<{ data: Wallet[]; total: number }> => {
        return Promise.resolve({
            data: wallets.slice(skip, skip + take),
            total: wallets.length
        });
    }

    return {
        getWallets
    }
};

export default useMockWallets;
