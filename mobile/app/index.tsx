import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import ContentList from "./components/ContentList";
import Login from "@/app/components/Login";

const backgroundImage = require("@/assets/images/profile_background.jpeg");

export default function Home() {
  const [address, setAddress] = useState<string | undefined>(undefined);

  const handleAddressChange = (address: string | undefined) => {
    setAddress(address);
  };

  console.log("index", address)

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* Overlay content */}
        </ImageBackground>
        <Login onAddressChange={handleAddressChange} />
        <Text style={styles.titleText}>Explore the content of Quill</Text>
        <ContentList/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: "#ffebee",
    padding: 16,
  },
  backgroundImage: {
    width: "100%",
    height: 100,
  },
  titleText: {
    paddingTop: 30,
    paddingBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
