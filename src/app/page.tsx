"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import WalletConnection from "../components/WalletConnection";
import CreateCollection from "../components/CreateCollection";
import MintForm from "../components/MintForm";

export default function Home() {
  const [signer, setSigner] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<string>("");

  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setUserAddress(accounts[0]);
        setSigner(provider.getSigner());
      }
    };

    connectWallet();
  }, []);

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length > 0) {
      setUserAddress(accounts[0]);
      const provider = new ethers.BrowserProvider(window.ethereum);
      setSigner(provider.getSigner());
    } else {
      setUserAddress("");
      setSigner(null);
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">NFT Creator Dashboard</h1>
        <Link
          href="/marketplace"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Marketplace
        </Link>
      </div>

      <WalletConnection
        walletConnected={signer !== null}
        userAddress={userAddress}
        onConnect={handleAccountsChanged}
      />

      {signer !== null && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <CreateCollection />
          <MintForm signer={signer} userAddress={userAddress} />
        </div>
      )}
    </main>
  );
}
