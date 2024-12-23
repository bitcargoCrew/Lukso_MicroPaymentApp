import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { ContentDataInterface } from "@/app/components/ContentDataInterface";
import { useTransactionModule } from "@/app/components/ChangePagePayment";

const ContentList: React.FC = () => {
  const router = useRouter();
  const [contentList, setContentList] = useState<ContentDataInterface[]>([]);
  const { executeTransaction } = useTransactionModule();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionInProgress, setTransactionInProgress] = useState(false);

  useEffect(() => {
    fetchAllIpfsData();
  }, []);

  const fetchAllIpfsData = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch(
        `https://lukso-micropaymentapp-1.onrender.com/getAllContentPostsFromIPFS`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);

      if (response.ok) {
        const ipfsData: ContentDataInterface[] = await response.json();
        console.log(ipfsData);
        setContentList(ipfsData);
      } else {
        throw new Error(`Failed to fetch content data: ${response.statusText}`);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (
    contentId: string,
    contentCreator: string,
    contentCosts: number,
    numberOfRead: number
  ) => {
    try {
      console.log("Payment start")
      setTransactionInProgress(true);
      const { contentSupporter } = await executeTransaction(contentCreator, contentCosts);
      console.log("Payment done")
      const updatedNumberOfRead = (numberOfRead || 0) + 1;

      // Send the read update to the server
      const readUpdateResponse = await fetch(
        `https://lukso-micropaymentapp-1.onrender.com/updateContent/${contentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            numberOfRead: updatedNumberOfRead,
            contentCreator,
            contentCosts,
            contentSupporter,
          }),
        }
      );

      if (!readUpdateResponse.ok) {
        setError(
          `Failed to update the number of reads: ${readUpdateResponse.statusText}`
        );
        return;
      }

      // Add current user (account) as a supporter
      const supporterUpdateResponse = await fetch(
        `https://lukso-micropaymentapp-1.onrender.com/updateSupporters/${contentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supporter: contentSupporter, // current user account as a supporter
          }),
        }
      );

      if (!supporterUpdateResponse.ok) {
        setError(
          `Failed to update supporters: ${supporterUpdateResponse.statusText}`
        );
        return;
      }

      console.log(
        "Updated content data:",
        await supporterUpdateResponse.json()
      );

      router.push({
        pathname: '../contentPages/[contentId]', // Static route for contentPage
        params: { contentId: contentId }, // Passing contentId as query parameter
      });

    } catch (error) {
      console.error("Payment failed:", error);
      setError("Payment failed. Please try again.");
    } finally {
      setTransactionInProgress(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchAllIpfsData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry Fetching Content</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {contentList.map((content) => (
        <View key={content.contentId} style={styles.contentCard}>
          {transactionInProgress && (
            <View style={styles.overlayLoading}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>
                Processing... Waiting for confirmation
              </Text>
            </View>
          )}

          <Image
            source={{ uri: content.contentMedia }}
            style={styles.contentImage}
            resizeMode="cover"
          />

          <View style={styles.contentDetails}>
            <Text style={styles.contentTitle}>{content.contentTitle}</Text>
            <Text style={styles.contentCreator}>
              Created by: {content.contentCreator}
            </Text>
            <Text style={styles.contentCost}>
              Costs: {content.contentCosts} LYX
            </Text>
            <Text style={styles.contentDescription}>
              Summary: {content.contentShortDescription}
            </Text>
            <Text style={styles.contentTags}>
              Tags: {content.contentTags}
            </Text>

            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => handlePayment(content.contentId,
                content.contentCreator,
                content.contentCosts,
                content.numberOfRead)}
              disabled={transactionInProgress}
            >
              <Text style={styles.readMoreButtonText}>
                {transactionInProgress ? "Processing..." : "Read More"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentCard: {
    backgroundColor: "white",
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  contentDetails: {
    padding: 15,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  contentCreator: {
    color: "#666",
    marginBottom: 5,
  },
  contentCost: {
    color: "#4a4a4a",
    marginBottom: 5,
  },
  contentDescription: {
    color: "#333",
    marginBottom: 5,
  },
  contentTags: {
    color: "#666",
    marginBottom: 10,
  },
  readMoreButton: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  readMoreButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
  },
  overlayLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    color: "white",
    marginTop: 10,
  },
});

export default ContentList;
