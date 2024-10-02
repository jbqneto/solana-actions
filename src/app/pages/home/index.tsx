"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { HomeCard } from "@/components/home-card"
import { ClusterProvider } from "@/providers/cluster.provider"

export function Home() {

    return (
        <ClusterProvider>
            <Header />
            <main className="flex-grow flex items-center justify-center p-4 overflow-hidden">
                <HomeCard className="home-card" />
            </main>
            <Footer />
        </ClusterProvider>
    )
}