import { ethers } from "ethers";

const transactionModule = async () => {
  try {
    const provider = new ethers.BrowserProvider((window as any).lukso);

    // Request access to the user's Ethereum accounts
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const account = await signer.getAddress();

    const receiver = '0x1C0b106cB4189FaCA9Ab34B6bf5CF86b7979342C';
    const amount = '0.01';

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