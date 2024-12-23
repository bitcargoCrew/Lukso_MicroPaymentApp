import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const ContentPage: React.FC = () => {
  // Using useSearchParams to retrieve the parameters from the URL
  const { contentId } = useLocalSearchParams<{ contentId: string }>();

  console.log("contentPage")

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Content Page</Text>
      {contentId ? (
        <Text>Content ID: {contentId}</Text>
      ) : (
        <Text>No content ID provided</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
});

export default ContentPage;