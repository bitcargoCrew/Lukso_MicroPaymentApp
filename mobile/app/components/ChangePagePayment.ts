import { ethers, BrowserProvider } from "ethers";
import "@walletconnect/react-native-compat";
import {
  useAppKitAccount,
  useAppKitProvider,
} from "@reown/appkit-ethers-react-native";
import { useCallback } from "react";
import { Eip1193Provider } from "ethers";

interface TransactionResult {
  txHash: string;
  contentSupporter: string;
}

export const useTransactionModule = () => {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider();

  const executeTransaction = useCallback(
    async (
      contentCreator: string,
      contentCosts: number
    ): Promise<TransactionResult> => {
      if (!isConnected || !walletProvider) {
        throw new Error("Wallet not connected");
      }

      try {
        const provider = new BrowserProvider(walletProvider as Eip1193Provider);

        const signer = await provider.getSigner();

        const contentSupporter = await signer.getAddress();

        const tx = await signer.sendTransaction({
          to: contentCreator,
          value: ethers.parseEther(contentCosts.toString()),
        });

        console.log("Transaction sent:", tx);

        const receipt = await tx.wait();

        if (!receipt || receipt.status !== 1) {
          throw new Error("Transaction failed");
        }

        return {
          txHash: tx.hash,
          contentSupporter,
        };
      } catch (error) {
        console.error("Transaction failed:", error);
        throw new Error(
          error instanceof Error ? error.message : "Transaction failed"
        );
      }
    },
    [isConnected, walletProvider]
  );

  return {
    executeTransaction,
    isConnected,
    address,
  };
};