import { DonateConstants } from "@/app/domain/util/constants";
import { Solana } from "@/app/domain/util/solana";
import {
    ActionError,
    ActionGetResponse,
    ActionPostRequest,
    ActionPostResponse,
    createActionHeaders,
    createPostResponse
} from "@solana/actions";
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

function getHeaders(chainId?: string) {

    if (chainId && !['devnet', 'mainnet', 'testnet'].includes(chainId)) {
        throw "Invalid cluster: " + chainId;
    }

    return createActionHeaders({
        chainId,
        actionVersion: "2.2.1",
    });
}

function getPublicKey(pubKey: string | undefined): PublicKey {
    if (!pubKey) throw Error("Public key not defined on your env");

    return new PublicKey(pubKey);
}

function getConnection(chain: string = 'devnet'): Connection {
    let url = process.env.SOLANA_RPC;

    if (url) {
        url = url.startsWith('http') ? url : Solana.getClusterUrl(chain);
    } else {
        url = Solana.getClusterUrl(chain);
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

    let amount: number = 0.02;
    let cluster: string | undefined | null = process.env.CHAIN;

    try {
        console.log("Url: ", requestUrl);
        const urlAmount = requestUrl.searchParams.get('amount');
        cluster = requestUrl.searchParams.get("cluster");

        if (urlAmount) {
            amount = parseFloat(urlAmount);
        }

        if (!cluster) {
            cluster = 'devnet';
        }

        if (amount < 0.02) throw 'amount is too small: ' + amount;

    } catch (err) {
        console.log("Error getting amount: ", err);
        throw 'Invalid input query parameter: amount';
    }

    return {
        amount,
        cluster
    };
}

export const GET = async (req: Request) => {
    console.log("REQ URl: " + req.url);
    const url = new URL(req.url);
    const cluster = url.searchParams.get('cluster') ?? process.env.CHAIN ?? 'mainnet';

    try {
        const headers = getHeaders(cluster);
        const requestUrl = new URL(req.url);

        const baseHref = new URL(
            `/api/actions/donate?cluster=${cluster}&`,
            requestUrl.origin,
        ).toString();

        const iconUrl = new URL(DonateConstants.icon, requestUrl.origin);

        const payload: ActionGetResponse = {
            title: DonateConstants.title,
            icon: iconUrl.toString(),
            description: DonateConstants.description,
            label: DonateConstants.label,
            links: {
                actions: [
                    {
                        "label": "0.02 SOL",
                        "href": baseHref + "amount=0.02"
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
                                "label": "Doe o quanto o coração mandar :)" // text input placeholder
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
        const error = typeof err === 'string' ? err : "An unknown error occurred";
        const actionError: ActionError = { message: error };
        if (typeof err == "string") actionError.message = err;
        return Response.json(actionError, {
            status: 400,
            headers: getHeaders(),
        });
    }

}

export const OPTIONS = GET;

export const POST = async (req: Request) => {
    try {
        const requestUrl = new URL(req.url);
        const toPubkey = getPublicKey(process.env.PUBLIC_KEY);
        console.log("url: " + requestUrl);
        const { amount, cluster } = validatedQueryAndGetParams(requestUrl);
        const headers = getHeaders(cluster);
        const body: ActionPostRequest = await req.json();

        console.log("body: ", body);

        // validate the client provided input
        let account: PublicKey;
        try {
            account = new PublicKey(body.account);
        } catch (err) {
            console.log("Error creating publicKey: ", err);
            return new Response('Invalid "account" provided', {
                status: 400,
                headers,
            });
        }

        const connection = getConnection(cluster);

        const transaction = await getTransaction(connection, account, amount, toPubkey);

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction,
                message: "Que a força do café esteja com você. Thanks my friend! :)",
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