import { View, Text } from "react-native";
import {
  createAppKit,
  defaultConfig,
  AppKitButton,
  AppKit,
  useAppKitAccount,
} from "@reown/appkit-ethers-react-native";
import React, { useEffect } from "react";

interface LoginProps {
  onAddressChange?: (address: string | undefined) => void;
}

const Login: React.FC<LoginProps> = ({ onAddressChange }) => {
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

    // Use useEffect to call the onAddressChange prop when address changes
    useEffect(() => {
      if (onAddressChange) {
        onAddressChange(address);
      }
    }, [address, onAddressChange]);

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