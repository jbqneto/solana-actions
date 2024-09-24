import {
    ActionError,
    ActionGetResponse,
    ActionPostRequest,
    ActionPostResponse,
    createActionHeaders,
    createPostResponse
} from "@solana/actions";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

function getHeaders() {
    const chainId = process.env.CHAIN ?? null;

    if (!chainId) throw new Error("Chain not defined on your ENV.");

    return createActionHeaders({
        chainId,
        actionVersion: "2.2.1",
    });
}

const headers = getHeaders();

//https://ibb.co/R3jvp8t
const ICON_URL = 'https://i.ibb.co/McB2DdK/cartoon-donate-sol-please.jpg';

function getPublicKey(): PublicKey {
    const pubKey = process.env.PUB_KEY;

    if (!pubKey) throw Error("Public key not defined on your env");

    return new PublicKey(pubKey);
}

function getClusterUrl(chain: string): string {
    switch (chain) {
        case 'testnet':
            return clusterApiUrl('testnet');
        case 'mainnet':
            return clusterApiUrl('mainnet-beta');
        default:
            return clusterApiUrl('devnet');
    }
}

function getConnection(): Connection {
    let url = process.env.SOLANA_RPC;
    const chain: string = process.env.CHAIN ?? 'devnet';

    if (url) {
        url = url.startsWith('http') ? url : getClusterUrl(chain);
    } else {
        url = getClusterUrl(chain);
    }

    return new Connection(url);
}

async function getTransaction(conn: Connection, from: PublicKey, amount: number, to: PublicKey): Promise<Transaction> {
    const transaction = new Transaction();
    transaction.add(
        SystemProgram.transfer({
            fromPubkey: from,
            toPubkey: to,
            lamports: amount * LAMPORTS_PER_SOL
        })
    );

    const ltBlockhash = await conn.getLatestBlockhash();

    transaction.feePayer = from;
    transaction.recentBlockhash = ltBlockhash.blockhash;
    transaction.lastValidBlockHeight = ltBlockhash.lastValidBlockHeight;

    return transaction;
}

function validatedQueryAndGetParams(requestUrl: URL) {
    const toPubkey = getPublicKey();

    let amount: number = 0.02;

    try {
        if (requestUrl.searchParams.get('amount')) {
            amount = parseFloat(requestUrl.searchParams.get('amount')!);
        }

        if (amount <= 0.02) throw 'amount is too small';

    } catch (err) {
        console.log("Error: ", err);
        throw 'Invalid input query parameter: amount';
    }

    return {
        amount,
        toPubkey,
    };
}

export const GET = async (req: Request) => {
    console.log("REQ URl: " + req.url);

    try {
        const requestUrl = new URL(req.url);
        const toPubkey = getPublicKey();

        const baseHref = new URL(
            `/api/actions/donate-sol?`,
            requestUrl.origin,
        ).toString();

        const payload: ActionGetResponse = {
            title: "JBQNETO - Doar SOL",
            icon: ICON_URL,
            description: "Me dê um pouquinho de SOL pra eu tomar meu café.",
            label: "Doar SOL",
            links: {
                actions: [
                    {
                        "label": "0.02 SOL", // button text
                        "href": baseHref + "amount=0.02"
                        // no `parameters` therefore not a text input field
                    },
                    {
                        "label": "0.05 SOL", // button text
                        "href": baseHref + "amount=0.05"
                        // no `parameters` therefore not a text input field
                    },
                    {
                        "label": "0.1 SOL", // button text
                        "href": baseHref + "amount=0.1"
                        // no `parameters` therefore not a text input field
                    },
                    {
                        "label": "Donate", // button text
                        "href": baseHref + "amount={amount}",
                        "parameters": [
                            {
                                "name": "amount", // field name
                                "label": "Doe o quanto o seu coração mandar e sua wallet deixar :)" // text input placeholder
                            }
                        ]
                    }
                ]
            },
        };

        return Response.json(payload, {
            headers,
        });

    } catch (err) {
        console.error("Error getting request:", err);
        let actionError: ActionError = { message: "An unknown error occurred" };
        if (typeof err == "string") actionError.message = err;
        return Response.json(actionError, {
            status: 400,
            headers,
        });
    }

}

export const OPTIONS = GET;

export const POST = async (req: Request) => {
    try {
        const requestUrl = new URL(req.url);
        const { amount, toPubkey } = validatedQueryAndGetParams(requestUrl);
        const body: ActionPostRequest = await req.json();

        // validate the client provided input
        let account: PublicKey;
        try {
            account = new PublicKey(body.account);
        } catch (err) {
            console.log("Error creating publicKey: ", err);
            return new Response('Invalid "account" provided', {
                status: 400,
                headers: headers,
            });
        }

        const connection = getConnection();

        const transaction = await getTransaction(connection, account, amount, toPubkey);

        // insert transaction logic here    

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction,
                message: "Optional message to include with transaction",
            },
        });

        return Response.json(payload, {
            headers,
        });
    } catch (err) {
        return new Response('Internal server error: ' + JSON.stringify(err), {
            status: 500,
            headers: getHeaders(),
        });
    }
}