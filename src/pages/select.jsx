"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageCard from "../components/ImageCard";
import SelectedImagesBar from "../components/SelectedImagesBar";
import { getNFTsForCollection } from "../services/nftService";
import { useAccount } from "wagmi";
import { useReadContract, useWriteContract } from "wagmi";

export default function SelectPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [selectedNfts, setSelectedNfts] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const { data: isApproved } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
    abi: [{
        name: "isApprovedForAll",
        type: "function",
        stateMutability: "view",
        inputs: [
            {
                name: "owner",
                type: "address",
            },
            {
                name: "operator",
                type: "address",
            }
        ],
        outputs: [
            {
                name: "",
                type: "bool",
            }
        ],
    }],
    functionName: "isApprovedForAll",
    args: [address, process.env.NEXT_PUBLIC_NEW_CONTRACT_ADDRESS],
  });

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
      return;
    }

    async function fetchNFTs() {
      setIsLoading(true);
      try {
        const userNFTs = await getNFTsForCollection(address);
        setNfts(userNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNFTs();
  }, [isConnected, address, router]);

  const handleNftSelect = (nftId) => {
    setSelectedNfts((prev) => {
      if (prev.includes(nftId)) {
        return prev.filter((id) => id !== nftId);
      } else {
        return [...prev, nftId];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedNfts.length === 0) {
      alert("Please select at least one NFT");
      return;
    }

    try {
      setIsApproving(true);

      if (!isApproved) {
        await writeContractAsync({
          address: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
          abi: [{
            name: "setApprovalForAll",
            type: "function",
            stateMutability: "nonpayable",
            inputs: [
              {
                name: "operator",
                type: "address",
              },
              {
                name: "approved",
                type: "bool",
              }
            ],
            outputs: [],
          }],
          functionName: "setApprovalForAll",
          args: [process.env.NEXT_PUBLIC_NEW_CONTRACT_ADDRESS, true],
        });
      }

      const selectedNftsData = selectedNfts.map((id) => {
        const nft = nfts.find((n) => n.id === id);
        return {
          id: nft.id,
          name: nft.name,
          imageUrl: nft.imageUrl,
        };
      });

      localStorage.setItem("selectedNfts", JSON.stringify(selectedNftsData));
      router.push("/transform");
    } catch (error) {
      console.error("Error during approval:", error);
      alert("Failed to approve collection. Please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <main className="relative z-10 min-h-screen pb-36">
      <div className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center">
        <button
          onClick={() => router.push("/")}
          className="bg-transparent hover:bg-white hover:text-gray-700 text-white border-2 border-white font-bold py-2 px-6 rounded-full transition-colors duration-300 hover:scale-105 hover:shadow-lg hover:cursor-pointer">
          GO BACK
        </button>
        <p className="text-white font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      </div>

      <div className="text-center text-white pt-24 container mx-auto">
        <h1 className="text-4xl font-bold mb-12">Select Your NFTs</h1>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : nfts.length === 0 ? (
          <div className="text-center">
            <p className="text-xl">No NFTs found in this collection</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 max-w-6xl mx-auto p-4">
            {nfts.map((nft) => (
              <ImageCard
                key={nft.id}
                imageUrl={nft.imageUrl}
                isSelected={selectedNfts.includes(nft.id)}
                onClick={() => handleNftSelect(nft.id)}
                name={nft.name}
              />
            ))}
          </div>
        )}
      </div>

      {selectedNfts.length > 0 && (
        <SelectedImagesBar
          selectedNfts={selectedNfts}
          nfts={nfts}
          onContinue={handleContinue}
          isApproving={isApproving}
        />
      )}
    </main>
  );
}
