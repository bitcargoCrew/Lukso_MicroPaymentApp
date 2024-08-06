import { ERC725 } from "@erc725/erc725.js";

// This contains the schemas of the data keys:
// - AddressPermissions[] -> list of controllers
// - `AddressPermission:Permissions:<controller-address> -> permission of a specific controller
import LSP6Schema from "@erc725/erc725.js/schemas/LSP6KeyManager.json";

interface ControllerListProps {
  account: string;
}

const getPermissionedAddresses = async ({ account }: ControllerListProps) => {
  const UNIVERSAL_PROFILE = account;
  const RPC_ENDPOINT = "https://rpc.lukso.sigmacore.io"; //Mainnet
  const RPC_ENDPOINT_Testnet = "https://rpc.testnet.lukso.network"; //Testnet
  // Instantiate erc725.js with a Universal Profile address on Testnet
  const erc725 = new ERC725(
    LSP6Schema,
    UNIVERSAL_PROFILE,
    RPC_ENDPOINT_Testnet
  );

  try {
    // Get the list of addresses that have permissions on the Universal Profile
    const controllerAddresses = await erc725.getData("AddressPermissions[]");

    if (!controllerAddresses) {
      console.error("No controllers listed under this Universal Profile ");
    }

    console.log(controllerAddresses);
    
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default getPermissionedAddresses;
