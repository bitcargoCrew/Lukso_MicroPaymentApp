// FetchCreatorData.ts
import { ERC725, ERC725JSONSchema } from "@erc725/erc725.js";
import lsp3ProfileSchema from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json";

interface FetchContentDataProps {
  contentCreator: string;
  onDataFetched: (data: any) => void;
}

const fetchCreatorData = async ({ contentCreator, onDataFetched }: FetchContentDataProps) => {
  const RPC_ENDPOINT = "https://rpc.lukso.sigmacore.io"; //Mainnet
  const RPC_ENDPOINT_Testnet = "https://rpc.testnet.lukso.network"; //Testnet
  const erc725js = new ERC725(
    lsp3ProfileSchema as ERC725JSONSchema[],
    contentCreator,
    RPC_ENDPOINT,
    { ipfsGateway: "https://api.universalprofile.cloud/ipfs" }
  );

  try {
    const metaData = await erc725js.fetchData("LSP3Profile");
    onDataFetched(metaData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default fetchCreatorData;