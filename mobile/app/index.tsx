import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import React, { useState } from 'react';
const backgroundImage = require("@/assets/images/profile_background.jpeg");
import ContentList from "@/components/ContentList";
import Login from "@/components/Login";
import 'react-native-get-random-values';

const App = () => {
  const [userAddress, setUserAddress] = useState<string | undefined>(undefined);

  const handleAddressChange = (address: string | undefined) => {
    setUserAddress(address);
  };

  console.log(userAddress)

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: "#ffebee" }}>
        <Image
          source={backgroundImage}
          style={{ width: "auto", height: 100 }}
        ></Image>
        <Login onAddressChange={handleAddressChange}/>
        <Text style={{ paddingTop: 30, paddingBottom: 20, fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#333' }}>
          Explore the content of Quill
        </Text>
        <ContentList/>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
});

export default App;