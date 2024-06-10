import React, { useEffect } from "react";
import { ERC725, ERC725JSONSchema } from "@erc725/erc725.js";
import lsp3ProfileSchema from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json";

interface FetchProfileDataProps {
  account: string;
  onDataFetched: (data: any) => void;
}

const FetchProfileData: React.FC<FetchProfileDataProps> = ({ account, onDataFetched }) => {
  useEffect(() => {
    const fetchData = async () => {
      const erc725js = new ERC725(
        lsp3ProfileSchema as ERC725JSONSchema[],
        account,
        "https://rpc.lukso.sigmacore.io",
        { ipfsGateway: "https://api.universalprofile.cloud/ipfs" }
      );

      try {
        const metaData = await erc725js.fetchData("LSP3Profile");
        onDataFetched(metaData);
        console.log(metaData);
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