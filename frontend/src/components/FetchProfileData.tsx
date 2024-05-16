import React, { useEffect, useState } from "react";
import { ERC725, ERC725JSONSchema } from "@erc725/erc725.js";
import lsp3ProfileSchema from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json";

interface FetchProfileDataProps {
  account: string;
  onDataFetched: (data: any) => void; // Callback function to pass fetched data back to parent
}

const FetchProfileData: React.FC<FetchProfileDataProps> = ({ account, onDataFetched }) => {
  useEffect(() => {
    const fetchData = async () => {
      const erc725js = new ERC725(
        lsp3ProfileSchema as ERC725JSONSchema[],
        account,
        "https://rpc.lukso.gateway.fm",
        { ipfsGateway: "https://api.universalprofile.cloud/ipfs" }
      );

      try {
        const metaData = await erc725js.fetchData("LSP3Profile");
        onDataFetched(metaData); // Pass fetched data back to parent component
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (account) {
      fetchData();
    }
  }, [account, onDataFetched]);

  return null;
};

export default FetchProfileData;
