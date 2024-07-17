import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  type BaseError, 
  useWaitForTransactionReceipt, 
  useWriteContract 
} from 'wagmi';
import { abi } from './abi'; // Ensure abi includes the createNFT function

const MintNFT = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { 
    data: hash,
    error,   
    isPending, 
    writeContract 
  } = useWriteContract();

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file && file.type.startsWith('image/')) {
      console.log('File selected:', file);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage(null);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
      setErrorMessage('Please select a valid image file.');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMessage(null);
  };

  const uploadToIPFS = async () => {
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    try {
      console.log('Preparing to upload file to IPFS...');
      const formData = new FormData();
      formData.append("file", selectedFile);
      const metadata = JSON.stringify({
        name: "File name",
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      console.log('Sending request to Pinata...');
      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );
      console.log('Request sent. Awaiting response...');
      const resData = await res.json();
      console.log('Response received:', resData);
      setIpfsUrl(`ipfs://${resData.IpfsHash}`);
      console.log('IPFS URL set:', `ipfs://${resData.IpfsHash}`);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const mintNFT = async () => {
    if (!ipfsUrl) {
      console.error('IPFS URL is required');
      return;
    }

    try {
      console.log('Minting NFT with IPFS URL:', ipfsUrl);
      writeContract({
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        abi,
        functionName: 'createNFT',
        args: [ipfsUrl],
      });
      console.log('Contract write initiated');
    } catch (error) {
      console.error('Error writing contract:', error);
    }
  };

  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submission initiated');
    await uploadToIPFS();
    console.log('IPFS upload complete, proceeding to mint');
  };

  useEffect(() => {
    if (ipfsUrl) {
      mintNFT();
    }
  }, [ipfsUrl]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    });

  return (
    <form onSubmit={handleSubmission} className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <label className="block text-gray-700 font-bold mb-2">Choose File</label>
      <input 
        type="file" 
        onChange={changeHandler} 
        required 
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
      />
      {previewUrl && (
        <div className="mt-4 flex flex-col items-center">
          <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg mb-2" />
          <button 
            type="button" 
            onClick={removeFile} 
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            Remove File
          </button>
        </div>
      )}
      {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
      <button 
        disabled={isPending || !selectedFile} 
        type="submit"
        className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {isPending ? 'Confirming...' : 'Upload and Mint'} 
      </button>
      {hash && <div className="mt-4 text-sm text-gray-700">Transaction Hash: {hash}</div>}
      {isConfirming && <div className="mt-4 text-sm text-gray-700">Waiting for confirmation...</div>} 
      {isConfirmed && <div className="mt-4 text-sm text-green-500">Transaction confirmed.</div>} 
      {error && ( 
        <div className="mt-4 text-sm text-red-500">Error: {(error as BaseError).shortMessage || error.message}</div> 
      )} 
    </form>
  );
};

export default MintNFT;
