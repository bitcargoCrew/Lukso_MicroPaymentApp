import { View, Text, Image, ScrollView, Button, Modal, ActivityIndicator, StyleSheet } from "react-native";
const backgroundImage = require("@/assets/images/profile_background.jpeg");
import { useState, useEffect } from "react";
import Greet from "@/components/Greet";

const App = () => {
  const [isModalVisibile, setIsModalVisible] = useState(true);
  const [isSpinnerVisibile, setIsSpinnerVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSpinnerVisible(false);
    }, 5000); // Stop spinner after 5 seconds

    // Cleanup the timer in case the component unmounts before the timer finishes
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: "#ffebee" }}>
        <Modal
          visible={isModalVisibile}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={{ padding: 60 }}>
            <Text>Please switch to testnet</Text>
            <Button title="Close" onPress={() => setIsModalVisible(false)} />
          </View>
        </Modal>
        <Image
          source={backgroundImage}
          style={{ width: "auto", height: 200 }}
        ></Image>
        <Text style={{ padding: 60 }}>
          What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing
          and typesetting industry. Lorem Ipsum has been the industry's standard
          dummy text ever since the 1500s, when an unknown printer took a galley
          of type and scrambled it to make a type specimen book. It has survived
          not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in
          the 1960s with the release of Letraset sheets containing Lorem Ipsum
          passages, and more recently with desktop publishing software like
          Aldus PageMaker including versions of Lorem Ipsum. Where does it come
          from? Contrary to popular belief, Lorem Ipsum is not simply random
          text. It has roots in a piece of classical Latin literature from 45
          BC, making it over 2000 years old. Richard McClintock, a Latin
          professor at Hampden-Sydney College in Virginia, looked up one of the
          more obscure Latin words, consectetur, from a Lorem Ipsum passage, and
          going through the cites of the word in classical literature,
          discovered the undoubtable source. Lorem Ipsum comes from sections
          1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes
          of Good and Evil) by Cicero, written in 45 BC. This book is a treatise
          on the theory of ethics, very popular during the Renaissance. The
          first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from
          a line in section 1.10.32.
        </Text>
        <Greet/>
        <Button
          title="Press"
          color="midnightblue"
          onPress={() => console.log("Button pressed")}
        />
      </ScrollView>

      {/* ActivityIndicator as an overlay */}
      {isSpinnerVisibile && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="black" />
        </View>
      )}
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