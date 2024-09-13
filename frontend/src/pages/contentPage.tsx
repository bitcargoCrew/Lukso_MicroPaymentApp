import styles from "./contentPage.module.css";
import { Button, Col, Container, Row, Image, Spinner } from "react-bootstrap";
import React, { useEffect, useState } from "react";
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
import { config, pinata } from "../../config";

const ContentPage: React.FC = () => {
  const [account, setAccount] = useState("");
  const [contentData, setContentData] = useState<ContentDataInterface | null>(
    null
  );
  const [contentCid, setContentCid] = useState("");
  const [ipfsResponse, setIpfsResponse] = useState<ContentDataInterface | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeButtonDisabled, setIsLikeButtonDisabled] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState("");
  const router = useRouter();
  const { query } = router;
  const { paid, contentId } = query;

  useEffect(() => {
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery as string);
    }
  }, [router.query, account]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchContentData();
      if (contentCid) {
        await fetchContentFromIPFS(contentCid); // Wait for IPFS data after CID is set
      }
      setIsLikeButtonDisabled(false);
    };
    fetchData();
  }, [contentId, contentCid]); // Added contentCid as a dependency

  const fetchContentData = async () => {
    if (contentId) {
      try {
        const response = await fetch(
          `${config.apiUrl}/getContent/${contentId}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched data:", data); // Log the fetched data
          setContentData(data);
          setContentCid(data.postCID);
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

  const fetchContentFromIPFS = async (contentCid: string) => {
    try {
      const response = await pinata.gateways.get(contentCid);
      let ipfsData: any = response?.data;

      if (ipfsData instanceof Blob) {
        ipfsData = await ipfsData.text();
      }

      if (typeof ipfsData === "string") {
        ipfsData = JSON.parse(ipfsData);
      }

      if (typeof ipfsData !== "object" || ipfsData === null) {
        console.error(`Invalid data format for CID ${contentCid}`);
        return;
      }

      const ipfsResponse: ContentDataInterface = {
        contentId: ipfsData.contentId || "",
        contentTitle: ipfsData.contentTitle || "",
        contentMedia: ipfsData.contentMedia || "",
        contentCreator: ipfsData.contentCreator || "",
        contentCosts: ipfsData.contentCosts || 0,
        creatorMessage: ipfsData.creatorMessage || "",
        contentShortDescription: ipfsData.contentShortDescription || "",
        contentLongDescription: ipfsData.contentLongDescription || "",
        contentTags: ipfsData.contentTags || [],
        numberOfRead: ipfsData.numberOfRead || 0,
        numberOfLikes: ipfsData.numberOfLikes || 0,
        numberOfComments: ipfsData.numberOfComments || 0,
        contentComments: ipfsData.contentComments || [],
        contentSupporters: ipfsData.contentSupporters || [],
      };

      setIpfsResponse(ipfsResponse);
    } catch (error) {
      if (error instanceof Error) {
        setError(`An error occurred: ${error.message}`);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

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

  if (!contentData || !ipfsResponse) {
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
    JSON.parse(ipfsResponse.contentLongDescription)
  );
  const editorState = EditorState.createWithContent(contentState);

  return (
    <div>
      <NavBar account={account}></NavBar>
      <RootLayout>
        <div>
          <Row className={styles.rowSpace}>
            <h1>{ipfsResponse.creatorMessage}</h1>
          </Row>
          <Row className={styles.rowSpace}>
            <div className={styles.imageContainer}>
              <Image
                src={ipfsResponse.contentMedia}
                alt="Creator Quote Image"
                fluid
                className={styles.contentImage}
              />
            </div>
          </Row>
          <Row className={styles.rowSpace}>
            <h1>{ipfsResponse.contentTitle}</h1>
          </Row>
          <Row>
            <CreatedBy contentCreator={ipfsResponse.contentCreator} />
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
