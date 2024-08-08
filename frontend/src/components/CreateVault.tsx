import React, { useState, useEffect } from "react";
import LSP9Vault from "@lukso/lsp-smart-contracts/artifacts/LSP9Vault.json";
import UniversalProfile from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";
import { ERC725YDataKeys } from "@lukso/lsp-smart-contracts";
import { ethers } from "ethers";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

interface VaultProps {
  account: string;
}

const CreateVault: React.FC<VaultProps> = ({ account }) => {
  const [address, setAddress] = useState(account);
  const [privateKeyAddress, setPrivateKeyAddress] = useState("");

  useEffect(() => {
    console.log("Account prop received:", account);
    setAddress(account);

    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY as string;
    if (privateKey) {
      setPrivateKeyAddress(privateKey);
    }
  }, [account]);

  const RPC_ENDPOINT = "https://rpc.lukso.sigmacore.io"; //Mainnet
  const RPC_ENDPOINT_Testnet = "https://rpc.testnet.lukso.network"; //Testnet

  const createVault = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT_Testnet);
      const vaultOwner = address; // The address that will be the vault owner

      // setup your EOA
      const privateKey = privateKeyAddress;
      const myEOA = new ethers.Wallet(privateKey).connect(provider);

      // create an factory for the LSP9Vault contract
      let vaultFactory = new ethers.ContractFactory(
        LSP9Vault.abi,
        LSP9Vault.bytecode
      );

      // deploy the vault contract
      const myVault = await vaultFactory.connect(myEOA).deploy(vaultOwner);

      console.log(myVault)

    } catch (error) {
      console.error("Error creating vault:", error);
    }
  };

  return (
    <div>
      <h2>Create Vault for Account: {address}</h2>

      <InputGroup className="mb-3">
        <InputGroup.Text>Vault owner</InputGroup.Text>
        <Form.Control
          aria-label="Vault Owner"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </InputGroup>
      <InputGroup>
        <InputGroup.Text>Private Key</InputGroup.Text>
        <Form.Control
          aria-label="Private Key"
          type="password"
          value={privateKeyAddress}
          onChange={(e) => setPrivateKeyAddress(e.target.value)}
        />
      </InputGroup>
      <Button variant="success" onClick={createVault}>
        Create Vault
      </Button>
    </div>
  );
};

export default CreateVault;