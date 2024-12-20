import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import ContentList from "@/components/ContentList";
import Login from "@/components/Login";

// Path for the background image
const backgroundImage = require("@/assets/images/profile_background.jpeg");

// Define the valid routes for navigation
type ValidRoute = "/ContentPage" | "/";  // Add more valid routes if needed

const Profile: React.FC = () => {
  // Updated function to handle navigation with a more specific type for route
  const handleNavigation = (route: ValidRoute, params?: Record<string, any>) => {
    router.push({ pathname: route, params });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image source={backgroundImage} style={styles.backgroundImage} />
        <Login />
        <Text style={styles.title}>Explore the content of Quill</Text>
       {/* <ContentList onNavigate={handleNavigation} /> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { backgroundColor: "#ffebee" },
  backgroundImage: { width: "100%", height:200 },
  title: {
    paddingTop: 30,
    paddingBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
});

export default Profile;
