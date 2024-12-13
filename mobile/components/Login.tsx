import "@walletconnect/react-native-compat";
import { View, Text } from "react-native";
import {
  createAppKit,
  defaultConfig,
  AppKitButton,
  AppKit,
  useWalletInfo,
  useAppKitAccount,
} from "@reown/appkit-ethers-react-native";

const Login = () => {
  const projectId = process.env.EXPO_PUBLIC_PROJECT_ID as string;
  const metadata = {
    name: "AppKit RN Lukso App",
    description: "AppKit RN Lukso App",
    url: "https://reown.com/appkit",
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
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

  const ethereum = {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://cloudflare-eth.com",
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

  const { isConnected } = useAppKitAccount();

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
