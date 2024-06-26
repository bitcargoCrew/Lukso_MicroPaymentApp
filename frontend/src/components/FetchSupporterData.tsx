// FetchCreatorData.ts
import { ERC725, ERC725JSONSchema } from "@erc725/erc725.js";
import lsp3ProfileSchema from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json";

interface FetchContentDataProps {
  contentSupporter: string;
  onDataFetched: (data: any) => void;
}

const fetchSupporterData = async ({ contentSupporter, onDataFetched }: FetchContentDataProps) => {
  const RPC_ENDPOINT = "https://rpc.lukso.sigmacore.io"; //Mainnet
  const RPC_ENDPOINT_Testnet = "https://rpc.testnet.lukso.network"; //Testnet
  const erc725js = new ERC725(
    lsp3ProfileSchema as ERC725JSONSchema[],
    contentSupporter,
    RPC_ENDPOINT_Testnet,
    { ipfsGateway: "https://api.universalprofile.cloud/ipfs" }
  );

  try {
    const metaData = await erc725js.fetchData("LSP3Profile");
    onDataFetched(metaData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default fetchSupporterData;