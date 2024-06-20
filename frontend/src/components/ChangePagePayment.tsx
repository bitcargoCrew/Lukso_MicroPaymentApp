import { ethers } from "ethers";

const transactionModule = async (contentCreator: string, contentCosts: number) => {
  try {
    const provider = new ethers.BrowserProvider((window as any).lukso);

    // Request access to the user's Ethereum accounts
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contentSupporter = await signer.getAddress();

    const amount = contentCosts.toString();

    // Send transaction
    const tx = await signer.sendTransaction({
      from: contentSupporter,
      to: contentCreator,
      value: ethers.parseEther(amount),
    });

    console.log("Transaction sent, waiting for confirmation...");
    const receipt = await tx.wait(); // Wait for the transaction to be mined

    if (receipt && receipt.status === 1) { // Check if the transaction was successful
      console.log("Transaction successful with hash:", tx.hash);
      return {
        txHash: tx.hash, // Return transaction hash
        contentSupporter: contentSupporter // Return content supporter address
      };
    } else {
      throw new Error("Transaction failed");
    }
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error; // Throw error if transaction fails
  }
};

const sendTransaction = { transactionModule };

export default sendTransaction;