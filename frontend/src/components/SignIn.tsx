import { useEffect, useState } from "react";
import { ethers } from "ethers";
import UniversalProfileContract from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";
import { SiweMessage } from "siwe";

interface SignInProps {
  onSignInSuccess: (account: string) => void;
}

// Wrap your code in a React component
const SignIn: React.FC<SignInProps> = ({ onSignInSuccess }) => {
  const [account, setAccount] = useState<string | undefined>();

  useEffect(() => {
    async function connectToLukso() {
      try {
        // Initialize ethers provider with the injected Ethereum provider
        const provider = new ethers.BrowserProvider((window as any).lukso);

        // Request user accounts
        const accounts = await provider.send("eth_requestAccounts", []);
        const { chainId } = await provider.getNetwork();
        const chainIdNumber: number = Number(chainId);

        const siweMessage = new SiweMessage({
          domain: window.location.host, // Domain requesting the signing
          address: accounts[0], // Address performing the signing
          statement: "By logging in you agree to the terms and conditions.", // Human-readable assertion the user signs
          uri: window.location.origin, // URI from the resource that is the subject of the signature
          version: "1", // Current version of the SIWE Message
          chainId: chainIdNumber, // Chain ID to which the session is bound to
          resources: ["https://terms.website.com"], // Authentication resource as part of authentication by the relying party
        }).prepareMessage();

        // Get the signer of the Universal Profile
        const signer = await provider.getSigner(accounts[0]);

        // Request the extension to sign the message
        const signature = await signer.signMessage(siweMessage);
        // 0x38c53...

        // Create a contract instance to verify the signature on
        const universalProfileContract = new ethers.Contract(
          accounts[0],
          UniversalProfileContract.abi,
          provider
        );

        // Create the message's hash for verification purposes
        const hashedMessage = ethers.hashMessage(siweMessage);

        const isValidSignature = await universalProfileContract
          .isValidSignature(hashedMessage, signature)

        // Check if the response is equal to the magic value
        if (isValidSignature === "0x1626ba7e") {
          console.log("Log In successful!");
        } else {
          // The signing EOA has no SIGN permission on this UP.
          console.log("Log In failed");
        }

        console.log("Connected with", accounts[0]);

        onSignInSuccess(accounts[0]);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error getting user accounts:", error);
      }


    }

    connectToLukso();
  }, [onSignInSuccess]);

  // Render JSX
  return (
    <div>
      {account ? (
        <div>Successful Universal Profile login</div>
      ) : (
        <div>Universal Profile is loading...</div>
      )}
    </div>
  );
}

export default SignIn;