import { ethers } from "ethers";

const transactionModule = async (contentCreator: string, contentCosts: number) => {
  try {
    const provider = new ethers.BrowserProvider((window as any).lukso);

    // Request access to the user's Ethereum accounts
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const account = await signer.getAddress();

    const receiver = contentCreator;
    console.log(receiver)
    const amount = contentCosts.toString();
    console.log(amount)

    // Send transaction
    const tx = await signer.sendTransaction({
      from: account,
      to: receiver,
      value: ethers.parseEther(amount),
    });

    console.log("Transaction hash:", tx.hash);
    return tx.hash; // Return transaction hash
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error; // Throw error if transaction fails
  }
};


const sendTransaction = { transactionModule };

export default sendTransaction;