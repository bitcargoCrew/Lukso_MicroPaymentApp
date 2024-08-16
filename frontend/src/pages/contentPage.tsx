import styles from "./contentPage.module.css";
import { Button, Col, Container, Row, Image, Spinner } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import RootLayout from "../app/layout";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import CreatedBy from "@/components/CreatedBy";
import ContentDataInterface from "@/components/ContentDataInterface";
import config from "../../config";
import Link from "next/link";
import { Heart } from "react-bootstrap-icons";
import LikePayment from "../components/LikePayment";
import { Editor, EditorState, convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";

const ContentPage: React.FC = () => {
  const [account, setAccount] = useState("");
  const [contentData, setContentData] = useState<ContentDataInterface | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [errorLike, setErrorLike] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeButtonDisabled, setIsLikeButtonDisabled] = useState(false);
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState("");
  const router = useRouter();
  const { query } = router;
  const { paid, contentId } = query;

  useEffect(() => {
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery as string);
    }
    fetchContentData();
    setIsLikeButtonDisabled(false);
  }, [router.query, account, contentId]);

  const fetchContentData = async () => {
    if (contentId) {
      try {
        const response = await fetch(`${config.apiUrl}/content/${contentId}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched data:", data); // Log the fetched data
          setContentData(data);
        } else {
          setError(`Failed to fetch content data: ${response.statusText}`);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(`An error occurred: ${error.message}`);
        } else {
          setError("An unknown error occurred.");
        }
      }
    }
  };

  const handleLike = async () => {
    if (isLikeButtonDisabled || !contentData) return;
    setIsLikeButtonDisabled(true); // Disable the button
    setTransactionInProgress(true);
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
      const response = await fetch(`${config.apiUrl}/content/${contentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numberOfLikes: updatedNumberOfLikes,
          contentCreator: contentData.contentCreator,
          contentSupporter,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setIsLiked(true); // Optional: Update local state to indicate that the content is liked
      setTransactionMessage("Like added successfully!");
    } catch (error) {
      console.error("Error updating like:", error);
      setErrorLike("Failed to update like. Please try again.");
      setTransactionMessage("Failed to add like. Please try again.");
      setIsLiked(false); // Ensure
    } finally {
      setTransactionInProgress(false);
      setTimeout(() => setTransactionMessage(""), 10000); // Clear the message after 10 seconds
    }
  };

  if (!paid || paid !== "true") {
    return (
      <RootLayout>
        <div>
          <h3>
            You are not authorized to view this page. Please make a payment to
            access this page.
          </h3>
        </div>
      </RootLayout>
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

  // Convert the raw content state to EditorState
  const contentState = convertFromRaw(
    JSON.parse(contentData.contentLongDescription)
  );
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
                src={
                  typeof contentData.contentMedia === "string"
                    ? contentData.contentMedia
                    : contentData.contentMedia instanceof File
                    ? URL.createObjectURL(contentData.contentMedia)
                    : undefined
                }
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
                    className={`${styles.heartIcon} ${isLiked ? styles.liked : ""}`}
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