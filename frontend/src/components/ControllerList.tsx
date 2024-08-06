import { ERC725 } from "@erc725/erc725.js";
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

    if (!controllerAddresses || !Array.isArray(controllerAddresses.value)) {
      console.error("No controllers listed under this Universal Profile ");
      return [];
    }

    const permissionedData = [];

    // Get the permissions of each controller of the UP
    for (let i = 0; i < controllerAddresses.value.length; i++) {
      const address = controllerAddresses.value[i] as string;

      const addressPermission = await erc725.getData({
        keyName: "AddressPermissions:Permissions:<address>",
        dynamicKeyParts: address,
      });

      // Decode the permission of each address
      const decodedPermission = erc725.decodePermissions(
        addressPermission.value as string
      );

      // Push the address and its permissions to the permissionedData array
      permissionedData.push({
        address,
        permissions: decodedPermission,
      });

      // Display the permission in a readable format
      console.log(
        `Decoded permission for ${address} = ` +
          JSON.stringify(decodedPermission, null, 2)
      );
    }
    return permissionedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export default getPermissionedAddresses;
