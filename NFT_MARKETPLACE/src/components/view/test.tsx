import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import { abi } from '../mint/abi'; // Ensure the ABI is correctly imported

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS; // Replace with your actual contract address

const FetchNFTs = () => {
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [nfts, setNfts] = useState<{ tokenId: string; tokenURI: string }[]>([]);
    const [imageError, setImageError] = useState<boolean>(false);

    const fetchNFTs = async (address: string) => {
        if (!address) {
            console.error('Wallet address is required');
            return;
        }

        console.log('Wallet Address:', address);

        if (typeof window.ethereum === 'undefined') {
            console.error('Ethereum provider is not available');
            return;
        }

        console.log('Ethereum provider detected');

        try {
            // Connect to the Ethereum network
            const provider = new BrowserProvider(window.ethereum);
            console.log('Connected to provider:', provider);

            const signer = await provider.getSigner();
            console.log('Signer:', signer);

            const contract = new Contract(contractAddress, abi, signer);
            console.log('Contract:', contract);

            const tokenIds = await contract.getNFTsOwnedByUser(address);
            console.log('Token IDs:', tokenIds);

            const fetchedNFTs = await Promise.all(
                tokenIds.map(async (tokenId: bigint) => {
                    try {
                        console.log(`Fetching URI for token ID: ${tokenId}`);
                        const tokenURI = await contract.tokenURI(tokenId);
                        console.log(`Token URI for ${tokenId}:`, tokenURI);
                        return { tokenId: tokenId.toString(), tokenURI };
                    } catch (tokenError) {
                        console.error(`Error fetching token ${tokenId}:`, tokenError);
                        return null;
                    }
                })
            );

            setNfts(fetchedNFTs.filter(nft => nft !== null));
            console.log('Fetched NFTs:', fetchedNFTs);

        } catch (error) {
            console.error('Error fetching NFTs:', error);
        }
    };

    const connectWallet = async () => {
        if (typeof window.ethereum === 'undefined') {
            console.error('Ethereum provider is not available');
            return;
        }

        console.log('Ethereum provider detected');

        try {
            // Connect to the Ethereum network
            const provider = new BrowserProvider(window.ethereum);
            console.log('Connected to provider:', provider);

            // Request account access if needed
            const accounts = await provider.send('eth_requestAccounts', []);
            console.log('Account access granted');

            const address = accounts[0];
            setWalletAddress(address);

            // Fetch NFTs after wallet is connected
            fetchNFTs(address);
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    };

    useEffect(() => {
        connectWallet();
    }, []);

    const handleError = () => {
        setImageError(true);
        console.error('Error loading image');
    };

    return (
        <div>
            {/* <label className="form-label">Wallet Address</label> */}
            {/* <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter wallet address"
                readOnly
            /> */}
            <div>
                {nfts.map((nft) => (
                    <div key={nft.tokenId} style={{ margin: '10px 0' }}>
                        <p>NFT: {nft.tokenId}</p>
                        <img
                            src={nft.tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                            alt={`NFT ${nft.tokenId}`}
                            onError={handleError}
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                    </div>
                ))}
            </div>
           
        </div>
    );
};

export default FetchNFTs;
