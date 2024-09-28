import { Solana } from "@/app/domain/util";
import { DonateConstants } from "@/app/domain/util/constants";
import {
    ActionError,
    ActionGetResponse,
    ActionPostRequest,
    ActionPostResponse,
    createActionHeaders,
    createPostResponse
} from "@solana/actions";
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

function getHeaders() {
    const chainId = process.env.CHAIN ?? null;

    if (!chainId) throw new Error("Chain not defined on your ENV.");

    return createActionHeaders({
        chainId,
        actionVersion: "2.2.1",
    });
}

const headers = getHeaders();

function getPublicKey(pubKey: string | undefined): PublicKey {
    if (!pubKey) throw Error("Public key not defined on your env");

    return new PublicKey(pubKey);
}

function getConnection(): Connection {
    let url = process.env.SOLANA_RPC;
    const chain: string = process.env.CHAIN ?? 'devnet';

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

    try {
        console.log("Url: ", requestUrl);
        const urlAmount = requestUrl.searchParams.get('amount');
        if (urlAmount) {
            amount = parseFloat(urlAmount);
        }

        if (amount < 0.02) throw 'amount is too small: ' + amount;

    } catch (err) {
        console.log("Error getting amount: ", err);
        throw 'Invalid input query parameter: amount';
    }

    return {
        amount
    };
}

export const GET = async (req: Request) => {
    console.log("REQ URl: " + req.url);

    try {
        const requestUrl = new URL(req.url);

        const baseHref = new URL(
            `/api/actions/donate?`,
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
        const actionError: ActionError = { message: "An unknown error occurred" };
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
        const toPubkey = getPublicKey(process.env.PUBLIC_KEY);
        console.log("url: " + requestUrl);
        const { amount } = validatedQueryAndGetParams(requestUrl);
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
                headers: headers,
            });
        }

        const connection = getConnection();

        const transaction = await getTransaction(connection, account, amount, toPubkey);

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction,
                message: "Com esse 'SOLzinho' posso tomar mais um cafezinho. Thanks my friend! :)",
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