
import { Solana } from "@/app/domain/util/solana";
import { ACTIONS_CORS_HEADERS } from "@solana/actions";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

async function getBalance(chain: string, pubkeyAddr: string | undefined): Promise<number> {
    let pubKey: PublicKey;

    try {
        if (!pubkeyAddr) throw Error("Public key not configured.");

        const connection = Solana.getConnection(chain);
        pubKey = new PublicKey(pubkeyAddr);

        const balance = await connection.getBalance(pubKey);

        return balance / LAMPORTS_PER_SOL;

    } catch (error) {
        console.error("Error getting balance:", error);
    }

    return 0;
}


export const GET = async (req: Request) => {
    const pubKey = process.env.PUBLIC_KEY;
    const chain = process.env.CHAIN ?? 'mainnet';

    return Response.json({
        url: req.url,
        chain,
        publicKey: pubKey,
        amount: await getBalance(chain, pubKey)
    }, {
        headers: ACTIONS_CORS_HEADERS,
    });
}