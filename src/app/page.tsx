import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HomeCard } from "@/components/home-card";

import './page.css';

export default function Page() {

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 overflow-hidden">
        <HomeCard className="home-card" />
      </main>
      <Footer />
    </div>

  )

}