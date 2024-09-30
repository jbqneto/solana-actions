"use client"

import { DonateConstants } from "@/app/domain/util/constants";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import { Card, CardButton, CardContent } from "../card";

import './home-card.css';

const DIAL_URL = 'https://dial.to/?action=solana-action';

const WarningLabel = ({ show }: { show: boolean }) => (
    <div className={`card-warn flex items-center p-0.5 mt-2 text-yellow-400 ${show ? '' : 'hidden'}`}>
        <AlertCircle className="w-5 h-5 mr-2" />
        <span>Atenção: Você está em MAIN-NET e qualquer transação confirmada será pra valer.</span>
    </div>
)

const NetworkSelect = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-700 text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        <option value="devnet">Devnet</option>
        <option value="mainnet">Main Net</option>
    </select>
)
//https://dial.to/?action=solana-action%3Ahttp%3A%2F%2Flocalhost%3A3000%2Fapi%2Factions%2Fdonate&cluster=devnet

function encodeUrl(url: string) {
    // Codifica a URL usando encodeURIComponent
    const encodedUrl = encodeURIComponent(url);

    // Adiciona o caractere ':' no início (se necessário)
    return encodedUrl;
}

export function HomeCard({ className }: { className?: string }) {
    const [cluster, setCluster] = useState('devnet');
    const [host, setHost] = useState('');
    const pathname = usePathname();

    const handleDonate = () => {
        const url = encodeUrl(`:${host}/api/actions/donate`);

        window.open(DIAL_URL + url + `&cluster=${cluster}`, '_blank');
    }

    useEffect(() => {
        console.log("pathname: ", pathname);
        console.log(window.location);
        setHost(window.location.origin);
    }, []);

    return (
        <Card className={`bg-gray-800 rounded-lg shadow-lg ${className}`}>
            <div className="bg-gray-700 px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-100">Selecione a rede</h1>
                <NetworkSelect value={cluster} onChange={setCluster} />
            </div>
            <WarningLabel show={cluster === 'mainnet'} />
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