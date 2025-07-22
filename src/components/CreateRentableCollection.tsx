"use client";

import { useState } from "react";
import { ethers } from "ethers";

// Use the deployed rentable factory or create collections directly
const rentableFactoryAddress = process.env.NEXT_PUBLIC_RENTABLE_FACTORY_ADDRESS;

export default function CreateRentableCollection() {
  const [collectionName, setCollectionName] = useState("");
  const [collectionSymbol, setCollectionSymbol] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRentableCollection = async () => {
    if (!collectionName || !collectionSymbol) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      if (rentableFactoryAddress) {
        // Use factory if available
        const factoryAbi = await fetch(
          "/abi/NFTCollectionRentableFactory.json"
        ).then((res) => res.json());
        const factoryContract = new ethers.Contract(
          rentableFactoryAddress,
          factoryAbi,
          signer
        );

        const tx = await factoryContract.createRentableCollection(
          collectionName,
          collectionSymbol
        );
        await tx.wait();
      } else {
        // Deploy directly using the rentable collection contract
        const rentableAbi = await fetch("/abi/NFTCollectionRentable.json").then(
          (res) => res.json()
        );

        // Get the contract factory
        const ContractFactory = new ethers.ContractFactory(
          rentableAbi,
          // Note: You'd need the bytecode here for direct deployment
          // For now, we'll show an error message
          "",
          signer
        );

        throw new Error(
          "Direct deployment not implemented. Please deploy rentable factory first."
        );
      }

      alert(
        "Rentable Collection created successfully! You can now list NFTs for rent."
      );
      setCollectionName("");
      setCollectionSymbol("");
    } catch (err) {
      console.error("Error creating rentable collection:", err);
      alert("Error creating collection: " + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-blue-50 rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-blue-500 font-semibold mb-1">
          🏠 Create Rentable Collection
        </div>
        <h2 className="block mt-1 text-lg leading-tight font-medium text-black">
          ERC-4907 Compatible NFT Collection
        </h2>
        <p className="mt-2 text-gray-500 text-sm">
          Create a collection that supports NFT rentals. Users can list NFTs for
          rent while keeping ownership.
        </p>

        <div className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Collection Name
            </label>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="e.g., Rentable Art Collection"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Collection Symbol
            </label>
            <input
              type="text"
              value={collectionSymbol}
              onChange={(e) => setCollectionSymbol(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="e.g., RART"
            />
          </div>

          <button
            onClick={handleCreateRentableCollection}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 w-full"
          >
            {isLoading ? "Creating..." : "Create Rentable Collection"}
          </button>
        </div>

        <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Only ERC-4907 compatible collections can be
            listed for rent. Regular collections created with the standard
            factory won&apos;t support rental features.
          </p>
        </div>
      </div>
    </div>
  );
}
