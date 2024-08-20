import { ethers } from 'hardhat';
import { ERC725YDataKeys } from '@lukso/lsp-smart-contracts';

import { ContentPostCollection, BasicNFTCollection__factory } from '../contracts/ContractContentPost';

export const deployAndSetCollectionMetadata = async (postCID: string, contentCreator: string) {

  try {
  // const provider = new ethers.BrowserProvider((window as any).lukso);
  // await provider.send("eth_requestAccounts", []);
  // const signer = await provider.getSigner();
  // const deployer = await signer.getAddress();
  // Signer used for deployment
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contract with EOA: ', deployer.address);

  // Deploy the contract with custom constructor parameters
  const nftCollection: ContentPostCollection = await new BasicNFTCollection__factory(deployer).deploy(
    'Quill Content Post', // collection name
    'QUART', // collection symbol
    deployer.address, // owner
  );

  // Get the BaseURI data key of LSP8
  const baseURIDataKey = ERC725YDataKeys.LSP8['LSP8TokenMetadataBaseURI'];

  // Set the storage data on the deployed contract
  // https://docs.lukso.tech/contracts/contracts/ERC725/#setdata
  const tx = await nftCollection.setData(baseURIDataKey, ethers.toUtf8Bytes(`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${postCID}?pinataGatewayToken=${process.env.NEXT_PUBLIC_GATEWAY_KEY_PINATA}`));

  // Wait for the transaction to be included in a block
  const receipt = await tx.wait(); // Wait for the transaction to be mined

  // https://docs.lukso.tech/contracts/contracts/ERC725/#getdata
  const result = await nftCollection.getData(baseURIDataKey);
  console.log('Base URI set to: ', result);

  if (receipt && receipt.status === 1) { // Check if the transaction was successful
    console.log("Transaction successful with hash:", tx.hash);
    return {
      txHash: tx.hash, // Return transaction hash
    };
  } else {
    throw new Error("Transaction failed");
  }
} catch (error) {
  console.error("Error sending transaction:", error);
  throw error; // Throw error if transaction fails
}

}

