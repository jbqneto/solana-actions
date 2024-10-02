"use client"

import { DonateConstants } from "@/app/domain/util/constants";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import { Card, CardButton, CardContent } from "../card";

import { useClusterContext } from "@/providers/cluster.provider";
import './home-card.css';

const DIAL_URL = 'https://dial.to/?action=solana-action';

//https://dial.to/?action=solana-action%3Ahttp%3A%2F%2Flocalhost%3A3000%2Fapi%2Factions%2Fdonate&cluster=devnet

function encodeUrl(url: string) {
    // Codifica a URL usando encodeURIComponent
    const encodedUrl = encodeURIComponent(url);

    // Adiciona o caractere ':' no início (se necessário)
    return encodedUrl;
}

export function HomeCard({ className }: { className?: string }) {
    const [host, setHost] = useState('');
    const { cluster } = useClusterContext();
    const pathname = usePathname();

    const handleDonate = () => {
        const url = encodeUrl(`:${host}/api/actions/donate`) + `&cluster=${cluster}`;

        console.log("will open bilnk URL: " + url);

        window.open(DIAL_URL + url, '_blank');
    }

    useEffect(() => {
        console.log("pathname: ", pathname);
        console.log(window.location);
        setHost(window.location.origin);
    }, []);

    useEffect(() => {
        console.log("CLuster changed: " + cluster);
    }, [cluster]);

    return (
        <Card className={`bg-gray-800 rounded-lg shadow-lg ${className}`}>
            <Image
                src={DonateConstants.icon}
                alt="Sad man begging for some SOLANA"
                width={300}
                height={100}
                className="w-full object-cover"
            />
            <CardContent>
                <p className="text-center text-gray-300">
                    {DonateConstants.description}
                </p>
            </CardContent>
            <div className="card-footer mt-auto px-4 py-2 bg-gray-700">
                <CardButton onClick={handleDonate}>Abrir blink</CardButton>
            </div>
        </Card>
    )

}