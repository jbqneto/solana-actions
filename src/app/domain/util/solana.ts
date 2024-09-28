import { clusterApiUrl, Connection } from "@solana/web3.js";

export const Solana = {

    getClusterUrl: function (chain: string): string {
        switch (chain) {
            case 'testnet':
                return clusterApiUrl('testnet');
            case 'mainnet':
                return clusterApiUrl('mainnet-beta');
            default:
                return clusterApiUrl('devnet');
        }
    },

    getConnection: function (url: string | undefined): Connection {
        const chain: string = url ?? 'mainnet';

        if (url) {
            url = url.startsWith('http') ? url : Solana.getClusterUrl(chain);
        } else {
            url = Solana.getClusterUrl(chain);
        }

        return new Connection(url);
    }
}