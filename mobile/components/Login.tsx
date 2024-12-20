// _layout.tsx
import React, { useEffect } from "react";
import { View, Text } from "react-native";
import {
  createAppKit,
  defaultConfig,
  AppKitButton,
  AppKit,
  useAppKitAccount,
} from "@reown/appkit-ethers-react-native";
import { useAddress } from "@/components/AddressContext"; // Import the context

export const Login: React.FC = () => {
  const { setAddress } = useAddress(); // Access the context's setAddress function
  const projectId = process.env.EXPO_PUBLIC_PROJECT_ID as string;

  const metadata = {
    name: "Quill Lukso App",
    description: "Quill Lukso App",
    url: "https://lukso-micropaymentapp.onrender.com/",
    icons: [
      "https://ipfs.io/ipfs/bafybeifm6sog5yhelzotggpsuhekwssmytbkcb4fgudsjtaw7dwfqwqrti",
    ],
    redirect: {
      native: "luksoapp://",
    },
  };

  const config = defaultConfig({ metadata });

  const lukso = {
    chainId: 42,
    name: "LUKSO",
    currency: "LYX",
    explorerUrl: "https://explorer.lukso.network",
    rpcUrl: "https://rpc.lukso.sigmacore.io",
  };

  const chains = [lukso];

  try {
    createAppKit({
      projectId,
      chains,
      config,
      enableAnalytics: true,
    });
  } catch (error) {
    console.error("AppKit initialization error:", error);
  }

  const { address, isConnected } = useAppKitAccount();

  useEffect(() => {
    setAddress(address); // Update the global address state
  }, [address, setAddress]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {!isConnected && (
        <>
          <Text style={{ marginTop: 20, marginBottom: 20 }}>
            You can connect your Universal Profile here:
          </Text>
          <AppKitButton label="Connect Universal Profile" />
        </>
      )}
      {isConnected && (
        <>
          <Text style={{ marginTop: 20, marginBottom: 20 }}>
            Congrats, you are connected with the address:
          </Text>
          <AppKitButton />
        </>
      )}
      <AppKit />
    </View>
  );
};

export default Login;