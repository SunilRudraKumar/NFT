import * as React from 'react';
import { 
  type BaseError, 
  useWaitForTransactionReceipt, 
  useWriteContract 
} from 'wagmi';
import { abi } from './abi'; // Ensure abi includes the createNFT function

export function MintNFT() {
  const { 
    data: hash,
    error,   
    isPending, 
    writeContract 
  } = useWriteContract();

  async function submit(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement); 
    const ipfsUrl = formData.get('ipfsUrl') as string;

    if (!ipfsUrl) {
      console.error('IPFS URL is required');
      return;
    }

    try {
      writeContract({
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        abi,
        functionName: 'createNFT',
        args: [ipfsUrl],
      });
    } catch (error) {
      console.error('Error writing contract:', error);
    }
  } 

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    });

  return (
    <form onSubmit={submit}>
      <input name="ipfsUrl" placeholder="IPFS URL" required defaultValue="ipfs://bafybeigejpjvsxrblhrujbcdll462er2bddwya5225oy73gkxpllg4cfrm/" />
      <button 
        disabled={isPending} 
        type="submit"
      >
        {isPending ? 'Confirming...' : 'Mint'} 
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>} 
      {isConfirmed && <div>Transaction confirmed.</div>} 
      {error && ( 
        <div>Error: {(error as BaseError).shortMessage || error.message}</div> 
      )} 
    </form>
  );
}
