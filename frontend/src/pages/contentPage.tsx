import styles from "./contentPage.module.css";
import { Button, Row, Image, Spinner } from "react-bootstrap";
import React, { useEffect, useState, useCallback } from "react";
import RootLayout from "../app/layout";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import CreatedBy from "@/components/CreatedBy";
import { ContentDataInterface } from "../components/ContentDataInterface";
import Link from "next/link";
import { Heart } from "react-bootstrap-icons";
import LikePayment from "../components/LikePayment";
import { Editor, EditorState, convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import { config } from "../../config";
import { setSupporterArray } from "../components/PageAccess";
import { fetchAllIpfsData } from "@/components/FetchIPFSData"; // Import the functions

const ContentPage: React.FC = () => {
  const [account, setAccount] = useState("");
  const [contentData, setContentData] = useState<ContentDataInterface | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeButtonDisabled, setIsLikeButtonDisabled] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState("");
  const [accessGranted, setAccessGranted] = useState<boolean>(false); // Track access
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const { query } = router;
  const { contentId } = query;

  useEffect(() => {
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery as string);
    }
  }, [router.query, account]);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      setIsLikeButtonDisabled(false);

      const contentDataIPFS: ContentDataInterface[] = await fetchAllIpfsData();

      if (contentDataIPFS && contentDataIPFS.length > 0) {
        // Select the first item from the array
        const selectedContent = contentDataIPFS[0];
        setContentData(selectedContent);

        // Check access based on supporters
        await setSupporterArray(
          selectedContent.contentSupporters || [],
          (access) => setAccessGranted(access)
        );
      } else {
        setContentData(null);
        throw new Error("No content found");
      }
    } catch (error) {
      console.error("Failed to fetch content", error);
      setContentData(null);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []); // Dependency array

  useEffect(() => {
    if (contentId) {
      fetchData();
    }
  }, [contentId, fetchData]);

  const handleLike = async () => {
    if (isLikeButtonDisabled || !contentData) return;
    setIsLikeButtonDisabled(true); // Disable the button
    setTransactionMessage("Like processing... Waiting for confirmation");
    try {
      const likeCost = 0.01;
      const { contentSupporter } = await LikePayment.transactionModule(
        contentData.contentCreator,
        likeCost
      );
      const updatedNumberOfLikes = (contentData.numberOfLikes || 0) + 1;
      setContentData({ ...contentData, numberOfLikes: updatedNumberOfLikes });

      // Send the updated numberOfLikes to backend
      const response = await fetch(
        `${config.apiUrl}/updateContent/${contentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            numberOfLikes: updatedNumberOfLikes,
            contentCreator: contentData.contentCreator,
            contentSupporter,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setIsLiked(true); // Optional: Update local state to indicate that the content is liked
      setTransactionMessage("Like added successfully!");
    } catch (error) {
      console.error("Error updating like:", error);
      setTransactionMessage("Failed to add like. Please try again.");
      setIsLiked(false); // Ensure
    } finally {
      setTimeout(() => setTransactionMessage(""), 10000); // Clear the message after 10 seconds
    }
  };

  // Access denied handling
  if (accessGranted === false) {
    return (
      <div>
        <NavBar account={account}></NavBar>
        <RootLayout>
          <div>
            <h3>You do not have access to view this content.</h3>
          </div>
          <Row style={{ paddingTop: "20px" }}>
            <Link
              href={{
                pathname: "/profile",
                query: { account: account },
              }}
            >
              <Button variant="dark">Back</Button>
            </Link>
          </Row>
        </RootLayout>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavBar account={account}></NavBar>
        <RootLayout>
          <div>
            <h3>The content is not available. Please open another post.</h3>
          </div>
          <Row style={{ paddingTop: "20px" }}>
            <Link
              href={{
                pathname: "/profile",
                query: { account: account },
              }}
            >
              <Button variant="dark">Back</Button>
            </Link>
          </Row>
        </RootLayout>
      </div>
    );
  }

  if (!contentData) {
    return (
      <div>
        <NavBar account={account}></NavBar>
        <RootLayout>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </RootLayout>
      </div>
    );
  }

  const contentState = convertFromRaw(contentData.contentLongDescription); // no need for parse

  const editorState = EditorState.createWithContent(contentState);

  return (
    <div>
      <NavBar account={account}></NavBar>
      <RootLayout>
        <div>
          <Row className={styles.rowSpace}>
            <h1>{contentData.creatorMessage}</h1>
          </Row>
          <Row className={styles.rowSpace}>
            <div className={styles.imageContainer}>
              <Image
                src={contentData.contentMedia}
                alt="Creator Quote Image"
                fluid
                className={styles.contentImage}
              />
            </div>
          </Row>
          <Row className={styles.rowSpace}>
            <h1>{contentData.contentTitle}</h1>
          </Row>
          <Row>
            <CreatedBy contentCreator={contentData.contentCreator} />
          </Row>
          <Row className={styles.rowSpace}>
            <div>
              <strong>Number of Reads:</strong> {contentData.numberOfRead}
            </div>
          </Row>
          <Row className={styles.rowSpace}>
            <div className={styles.draftEditorWrapper}>
              <Editor
                editorState={editorState}
                readOnly={true}
                onChange={() => {}}
              />
            </div>
          </Row>
          <Row className={styles.rowSpace}>
            <div>
              <div className={styles.heartButton}>
                <Button
                  variant={"outline-dark"}
                  onClick={handleLike}
                  disabled={isLikeButtonDisabled}
                >
                  <Heart
                    size={16}
                    className={`${styles.heartIcon} ${
                      isLiked ? styles.liked : ""
                    }`}
                  />
                </Button>
              </div>
              <div style={{ paddingTop: "5px" }}>
                {transactionMessage && <p>{transactionMessage}</p>}
              </div>
            </div>
          </Row>
          <Row style={{ paddingTop: "20px" }}>
            <Link
              href={{
                pathname: "/profile",
                query: { account: account },
              }}
            >
              <Button variant="dark">Back</Button>
            </Link>
          </Row>
        </div>
      </RootLayout>
    </div>
  );
};

export default ContentPage;
