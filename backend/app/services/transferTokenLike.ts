import {
  JsonRpcProvider,
  Wallet,
  Contract,
  parseEther,
  toUtf8Bytes,
} from "ethers";
import { OPERATION_TYPES } from "@lukso/lsp0-contracts";
import { db } from "../index"

// artifacts
import LSP7Mintable from "@lukso/lsp7-contracts/artifacts/LSP7Mintable.json";
import UniversalProfile from "@lukso/universalprofile-contracts/artifacts/UniversalProfile.json";

// Ensure environment variables are present
if (!process.env.PRIVATE_KEY || !process.env.UP_ADDR) {
  throw new Error("Environment variables PRIVATE_KEY or UP_ADDR are missing");
}

const transferTokenLike = async (contentCreator: string) => {
  try {
    const provider = new JsonRpcProvider("https://rpc.testnet.lukso.network"); //testnet
    const privateKey: string = process.env.PRIVATE_KEY || "";
    const signer = new Wallet(privateKey, provider);
    const tokenContractAddress = "0x04e88e1b017baf2f2a15468b2a567a20f81c64b8"; //testnet contract
    const universalProfileAddress: string = process.env.UP_ADDR || "";
    const token = new Contract(
      tokenContractAddress,
      LSP7Mintable.abi,
      provider
    );

    const universalProfile = new Contract(
      universalProfileAddress,
      UniversalProfile.abi,
      provider
    );

    const transferDetails = {
      recipient: contentCreator, //testnet UP sandro
      amount: parseEther("10"),
      force: true,
      data: toUtf8Bytes("Thank you for the support!"),
    };

    const encodedMintCall = token.interface.encodeFunctionData("mint", [
      transferDetails.recipient,
      transferDetails.amount,
      transferDetails.force,
      transferDetails.data,
    ]);

    console.log("Encoded mint call:", encodedMintCall);

    const tx = await universalProfile
      .connect(signer)
      .getFunction("execute")
      .send(OPERATION_TYPES.CALL, tokenContractAddress, 0, encodedMintCall);

    console.log("Transaction sent:", tx.hash);

    // Wait for the transaction to be confirmed
    await tx.wait();

    console.log("Transaction confirmed");

    //send data to firebase
    const timestamp = new Date()
    const reads = 0
    const likes = 1
    const numberOfTokensReceived = 10
    const docRef = db.collection("socialLeaderboard").doc(timestamp)
    const result = await docRef.set({
      contentCreator,
      reads,
      likes,
      numberOfTokensReceived,
      transactionHash: tx.hash,
    });

    console.log("Data inserted into Firestore:", docRef.id);


  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in transferToken function:", error.message);
      console.error("Stack trace:", error.stack);
    } else {
      console.error("Unknown error in transferToken function", error);
    }
  }
};

export default transferTokenLike;