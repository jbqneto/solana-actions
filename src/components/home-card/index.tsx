"use client"

import { DonateConstants } from "@/app/domain/util/constants";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../card";

const WarningLabel = ({ show }: { show: boolean }) => (
    <div className={`flex items-center p-0.5 mt-2 text-yellow-400 ${show ? '' : 'hidden'}`}>
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

export function HomeCard() {
    const [network, setNetwork] = useState('devnet');

    return (
        <Card className="w-full max-w-md mx-auto bg-gray-800 text-gray-100">
            <div className="bg-gray-700 px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-100">Network Dashboard</h1>
                <NetworkSelect value={network} onChange={setNetwork} />
            </div>
            <WarningLabel show={network === 'mainnet'} />
            <Image
                src={DonateConstants.icon}
                alt="Sad man begging for some SOLANA"
                width={400}
                height={200}
                className="w-full object-cover"
            />
            <CardHeader>
                <CardTitle className="text-center text-gray-100">{DonateConstants.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center text-gray-300">
                    {DonateConstants.description}
                </p>
            </CardContent>
        </Card>
    )

}