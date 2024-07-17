import { useState } from 'react'
import './App.css'
import Upload from './components/mint/Upload'

import { Web3Provider } from "./Web3Provider";

import Header from './components/ui/Header/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MintPage from './components/ui/pages/Mint';
import ViewPage from './components/ui/pages/View';

function App() {
 

  return (
    <Web3Provider>
      <Router>
              <Header />
              <Routes>
                <Route path="/mint" element={<MintPage />} />
                <Route path="/view" element={<ViewPage />} />
         
            </Routes>
      
           
          
        </Router>
      </Web3Provider>

  )
}

export default App
// import React, { useState, useEffect } from 'react';
// import { useReadContract } from 'wagmi';
// import { abi } from '../src/components/mint/abi';


// function App() {
//   const [walletAddress, setWalletAddress] = useState<string>('');
//   const [nfts, setNfts] = useState<{ tokenId: string; tokenURI: string }[]>([]);
//   const [imageError, setImageError] = useState<boolean>(false);
  
//   const { data: balance } = useReadContract({
//     abi,
//     address: import.meta.env.VITE_CONTRACT_ADDRESS,
//     functionName: 'balanceOf',
//     args: [walletAddress],
//     enabled: Boolean(walletAddress),
//   });

//   useEffect(() => {
//     if (balance) {
//       const fetchNFTs = async () => {
//         const nfts = [];
//         for (let i = 0; i < balance; i++) {
//           const tokenIdResponse = await useReadContract({
//             abi,
//             address: import.meta.env.VITE_CONTRACT_ADDRESS,
//             functionName: 'tokenOfOwnerByIndex',
//             args: [walletAddress, i],
//           });

//           const tokenId = tokenIdResponse.data;
//           console.log('Token ID:', tokenId);

//           const tokenUriResponse = await useReadContract({
//             abi,
//             address: import.meta.env.VITE_CONTRACT_ADDRESS,
//             functionName: 'tokenURI',
//             args: [tokenId],
//           });

//           const tokenURI = tokenUriResponse.data;
//           console.log('Token URI:', tokenURI);

//           nfts.push({ tokenId, tokenURI });
//         }

//         setNfts(nfts);
//       };

//       fetchNFTs();
//     }
//   }, [balance, walletAddress]);

//   const handleError = () => {
//     setImageError(true);
//     console.error('Error loading image');
//   };

//   return (
//     <>
//      <Web3Provider>
//       <label className="form-label">Wallet Address</label>
//       <input 
//         type="text" 
//         value={walletAddress} 
//         onChange={(e) => setWalletAddress(e.target.value)} 
//         placeholder="Enter wallet address"
//       />
//       <div>
//         {nfts.map((nft) => (
//           <div key={nft.tokenId}>
//             <p>Token ID: {nft.tokenId}</p>
//             <img 
//               src={nft.tokenURI} 
//               alt={`NFT ${nft.tokenId}`} 
//               onError={handleError} 
//             />
//           </div>
//         ))}
//       </div>
//       {imageError && <div>Error loading image. Check the console for more details.</div>}
//       </Web3Provider>
//     </>
//   );
// }

// export default App;
