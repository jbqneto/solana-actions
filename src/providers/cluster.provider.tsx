import { createContext, ReactNode, useContext, useState } from "react";

type Props = {
    children: ReactNode;
};

type IClusterContext = {
    cluster: string,
    setCluster: (cluster: string) => void
}

const ClusterContext = createContext<IClusterContext>({
    cluster: process.env.CHAIN ?? 'devnet',
    setCluster: (cluster: string) => { console.log("selected cluster: " + cluster); }
});

const useClusterContext = () => {
    const context = useContext(ClusterContext);

    if (!context) {
        throw new Error('useLoader must be used within an LoaderProvider');
    }

    return context;
}

const ClusterProvider = ({ children }: Props) => {
    const [cluster, setCluster] = useState(process.env.CHAIN ?? 'devnet');

    return (
        <ClusterContext.Provider value={{ cluster, setCluster }}>
            {children}
        </ClusterContext.Provider>
    )
}

export { ClusterProvider, useClusterContext };
