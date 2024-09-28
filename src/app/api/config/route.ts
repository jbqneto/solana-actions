
import { Solana } from "@/app/domain/util/solana";
import { ACTIONS_CORS_HEADERS } from "@solana/actions";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

async function getBalance(pubkeyAddr: string | undefined): Promise<number> {
    let pubKey: PublicKey;

    try {
        if (!pubkeyAddr) throw Error("Public key not configured.");

        const connection = Solana.getConnection(process.env.SOLANA_RPC);
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

    return Response.json({
        url: req.url,
        chain: process.env.CHAIN,
        publicKey: pubKey,
        amount: await getBalance(pubKey)
    }, {
        headers: ACTIONS_CORS_HEADERS,
    });
}