import type { NextPage } from 'next';
import Header from '../components/Header';
import { useRouter } from "next/navigation";
import { useAccount } from 'wagmi';
import { useEffect } from 'react';

const Home: NextPage = () => {

  const { address, isConnected } = useAccount();
  const router = useRouter();

  return (
    <div>
      <Header />
      <main className="relative z-10 min-h-screen p-24">
        <div className="container mx-auto flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-white text-center">
            TRANSFORM YOUR OG TO AN OZ
          </h1>
          <div className="flex flex-col items-center gap-6">
            {isConnected && (
              <button
                onClick={() => router.push("/select")}
                className="bg-transparent hover:bg-white hover:text-gray-700 text-white border-2 border-white font-bold py-3 px-12 text-xl rounded-full transition-colors duration-300 hover:scale-105 hover:shadow-lg hover:cursor-pointer">
                START NOW
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
