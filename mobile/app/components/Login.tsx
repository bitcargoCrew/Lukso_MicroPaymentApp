import "@walletconnect/react-native-compat";
import { View, Text, Modal, Button, StyleSheet } from "react-native";
import {
  createAppKit,
  defaultConfig,
  AppKitButton,
  AppKit,
  useAppKitAccount,
} from "@reown/appkit-ethers-react-native";
import React, { useEffect, useState } from "react";

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

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (onAddressChange) {
      onAddressChange(address);
    }
    if (isConnected) {
      setModalVisible(true);
    }
  }, [address, isConnected, onAddressChange]);

  return (
    <View style={styles.container}>
      {!isConnected && (
        <>
          <Text style={{ marginTop: 20, marginBottom: 20 }}>
            You can connect your Universal Profile here:
          </Text>
          <AppKitButton label="Connect Universal Profile" />
        </>
      )}
      {isConnected && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={{ marginBottom: 20 }}>
                Congrats, you are connected with your Universal Profile:
                {"\n\n"}
                {address}
              </Text>
              <Button title="OK" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}

      <AppKit />
      {isConnected && (
        <View style={styles.bottomRightButton}>
          <AppKitButton label="Reconnect Profile" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  bottomRightButton: {
    top: 20,
    bottom: 20,
  },
});

export default Login;