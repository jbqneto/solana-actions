"use client";

import { useClusterContext } from "@/providers/cluster.provider";
import { AlertCircle } from "lucide-react";

import './header.css';

const WarningLabel = ({ show }: { show: boolean }) => (
    <div className={`card-warn items-center p-0.5 mt-2`}>
        <div className={`msg flex text-yellow-400 ${show ? '' : 'hidden'}`}>
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>Atenção: Você está em MAIN-NET e qualquer transação confirmada será pra valer.</span>
        </div>
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

export const Header = () => {
    const { cluster, setCluster } = useClusterContext();

    return (
        <header className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4">
                <div className="title">
                    <h1 className="text-2xl font-bold">Actions & Blinks teste</h1>
                </div>
                <div className="network">
                    <div className="bg-gray-700 px-6 py-4 flex justify-between items-center">
                        <h1 className="text-xl font-bold text-gray-100">Selecione a rede</h1>
                        <NetworkSelect value={cluster} onChange={setCluster} />
                    </div>
                </div>
            </div>

            <WarningLabel show={cluster === 'mainnet'} />
        </header>
    )
}