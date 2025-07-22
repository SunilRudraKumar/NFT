"use client";

import { useState } from "react";
import { ethers } from "ethers";

interface RentalSectionProps {
  nftContract: string;
  tokenId: number;
  userAddress: string;
  isOwner: boolean;
  marketplaceABI: any;
  collectionABI: any;
  currentUser?: string;
  expires?: number;
  onRentalUpdate: () => void;
}

const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;

export default function RentalSection({
  nftContract,
  tokenId,
  userAddress,
  isOwner,
  marketplaceABI,
  collectionABI,
  currentUser,
  expires,
  onRentalUpdate,
}: RentalSectionProps) {
  const [dailyPrice, setDailyPrice] = useState<string>("");
  const [maxDuration, setMaxDuration] = useState<number>(30);
  const [rentDuration, setRentDuration] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const isRented =
    currentUser && currentUser !== "0x0000000000000000000000000000000000000000";
  const isRentedByUser =
    isRented && currentUser?.toLowerCase() === userAddress.toLowerCase();
  const isExpired = expires && expires * 1000 < Date.now();

  const listForRent = async () => {
    if (!dailyPrice || parseFloat(dailyPrice) <= 0) {
      alert("Please enter a valid daily price");
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Use standard ERC721 approve function
      const erc721ABI = [
        "function approve(address to, uint256 tokenId) external",
        "function ownerOf(uint256 tokenId) external view returns (address)"
      ];
      const collection = new ethers.Contract(nftContract, erc721ABI, signer);

      // Approve marketplace for setting user
      const approveTx = await collection.approve(marketplaceAddress, tokenId);
      await approveTx.wait();

      // List for rent
      const marketplace = new ethers.Contract(
        marketplaceAddress!,
        marketplaceABI,
        signer
      );
      const priceInWei = ethers.parseEther(dailyPrice);

      const tx = await marketplace.listNFTForRent(
        nftContract,
        tokenId,
        priceInWei,
        maxDuration
      );

      await tx.wait();
      alert("NFT successfully listed for rent!");
      onRentalUpdate();
    } catch (error) {
      console.error("Error listing for rent:", error);
      alert("Error listing NFT for rent: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const rentNFT = async () => {
    if (rentDuration <= 0) {
      alert("Please enter a valid rental duration");
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const marketplace = new ethers.Contract(
        marketplaceAddress!,
        marketplaceABI,
        signer
      );

      // Get rental listing details to calculate total price
      const listing = await marketplace.rentListings(nftContract, tokenId);
      const totalPrice = BigInt(listing.dailyPrice) * BigInt(rentDuration);

      const tx = await marketplace.rentNFT(nftContract, tokenId, rentDuration, {
        value: totalPrice,
      });

      await tx.wait();
      alert(`NFT successfully rented for ${rentDuration} days!`);
      onRentalUpdate();
    } catch (error) {
      console.error("Error renting NFT:", error);
      alert("Error renting NFT: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const cancelRentListing = async () => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const marketplace = new ethers.Contract(
        marketplaceAddress!,
        marketplaceABI,
        signer
      );

      const tx = await marketplace.cancelRentListing(nftContract, tokenId);
      await tx.wait();

      alert("Rental listing cancelled!");
      onRentalUpdate();
    } catch (error) {
      console.error("Error cancelling rental listing:", error);
      alert("Error cancelling rental listing: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rental-section bg-blue-50 p-4 rounded-lg mt-4">
      <h4 className="font-semibold text-blue-800 mb-3">🏠 Rental Options</h4>

      {/* Rental Status */}
      {isRented && !isExpired && (
        <div className="mb-4 p-3 bg-yellow-100 rounded border-l-4 border-yellow-500">
          <p className="text-sm">
            <strong>Currently Rented</strong>
            <br />
            Renter: {currentUser}
            <br />
            Expires: {new Date(expires! * 1000).toLocaleDateString()}
            {isRentedByUser && " (You are the renter)"}
          </p>
        </div>
      )}

      {/* Owner can list for rent */}
      {isOwner && (!isRented || isExpired) && (
        <div className="mb-4">
          <h5 className="font-medium mb-2">List for Rent</h5>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium">
                Daily Price (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                value={dailyPrice}
                onChange={(e) => setDailyPrice(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Max Duration (days)
              </label>
              <input
                type="number"
                value={maxDuration}
                onChange={(e) => setMaxDuration(parseInt(e.target.value))}
                className="w-full p-2 border rounded"
                min="1"
                max="365"
              />
            </div>
            <button
              onClick={listForRent}
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Listing..." : "List for Rent"}
            </button>
          </div>
        </div>
      )}

      {/* Non-owners can rent */}
      {!isOwner && (!isRented || isExpired) && (
        <div className="mb-4">
          <h5 className="font-medium mb-2">Rent this NFT</h5>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium">
                Rental Duration (days)
              </label>
              <input
                type="number"
                value={rentDuration}
                onChange={(e) => setRentDuration(parseInt(e.target.value))}
                className="w-full p-2 border rounded"
                min="1"
                max={maxDuration}
              />
            </div>
            <button
              onClick={rentNFT}
              disabled={loading}
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Renting..." : `Rent for ${rentDuration} days`}
            </button>
          </div>
        </div>
      )}

      {/* Owner can cancel listing */}
      {isOwner && (
        <button
          onClick={cancelRentListing}
          disabled={loading}
          className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled:opacity-50 text-sm"
        >
          {loading ? "Cancelling..." : "Cancel Rental Listing"}
        </button>
      )}
    </div>
  );
}
