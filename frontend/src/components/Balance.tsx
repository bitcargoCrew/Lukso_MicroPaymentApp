import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

interface BalanceProps {
  account: string;
}

const Balance: React.FC<BalanceProps> = ({ account }) => {
  const [balance, setBalance] = useState<string | undefined>();

  useEffect(() => {
    async function getWalletBalance() {
      try {
        const RPC_ENDPOINT = "https://rpc.lukso.sigmacore.io";
        const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);
        const walletBalance = await provider.getBalance(account);
        const walletBalanceConverted = ethers.formatEther(walletBalance);

        const outputWalletBalance =
          "Balance: " + parseFloat(walletBalanceConverted).toFixed(2) + " LYX";

        setBalance(outputWalletBalance);
      } catch (error) {
        console.error("Error getting wallet balance:", error);
      }
    }

    if (account) {
      getWalletBalance();
    }
  }, [account]);

  // Render JSX
  return (
    <div>
      {balance ? (
        <div>
          <p>{balance}</p>
        </div>
      ) : (
        <div>Wallet is loading...</div>
      )}
    </div>
  );
};

export default Balance;
