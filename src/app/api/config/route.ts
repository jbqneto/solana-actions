import { ACTIONS_CORS_HEADERS } from "@solana/actions";


export const GET = async (req: Request) => {
    console.log("REQ URl: " + req.url);

    return Response.json({
        chain: process.env.CHAIN,
        publicKey: process.env.PUBLIC_KEY
    }, {
        headers: ACTIONS_CORS_HEADERS,
    });
}