import styles from "./ContentList.module.css";
import React, { useEffect, useState } from "react";
import { Row, Col, Spinner, Card, Image, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import ChangePagePayment from "@/components/ChangePagePayment";
import CreatedBy from "./CreatedBy";
import {
  ContentDataInterface
} from "../components/ContentDataInterface";
import { config } from "../../config";
import {
  fetchAllIpfsData
} from "@/components/FetchIPFSData"; // Import the functions
import { setContentSupporter } from "./PageAccess"

const ContentList: React.FC = () => {
  const [contentList, setContentList] = useState<
    (ContentDataInterface | null)[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [account, setAccount] = useState("");
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery as string);
    }
    fetchData(); // Use a function to fetch data
  }, [router.query, account]);

  const fetchData = async () => {
    try {
      setError(null); // Reset error before retrying
      setLoading(true);
      const contentDataIPFS = await fetchAllIpfsData(); // Fetch IPFS data
      setContentList(contentDataIPFS);
    } catch (error) {
      console.error("Failed to fetch content", error);
      if (error instanceof Error) {
        setError(error.message);
      }
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
      setTransactionInProgress(true);
      const { contentSupporter } =
        await ChangePagePayment.transactionModule(contentCreator, contentCosts);

      // Send contentSupporter to getAccessPerson
      await setContentSupporter(contentSupporter);

      const updatedNumberOfRead = (numberOfRead || 0) + 1;

      // Send the read update to the server
      const readUpdateResponse = await fetch(
        `${config.apiUrl}/updateContent/${contentId}`,
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
        `${config.apiUrl}/updateSupporters/${contentId}`,
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

      // Redirect to the content page
      router.push({
        pathname: "/contentPage",
        query: { account, contentId },
      });
    } catch (error) {
      console.error("Payment failed:", error);
      setError("Payment failed. Please try again.");
    } finally {
      setTransactionInProgress(false);
    }
  };

  const handleButtonClick = (contentId: string) => {
    setSelectedContent(contentId);
    const selectedContent = contentList.find(
      (content) => content && content.contentId === contentId
    );

    if (selectedContent) {
      handlePayment(
        contentId,
        selectedContent.contentCreator,
        selectedContent.contentCosts,
        selectedContent.numberOfRead
      );
    } else {
      setError("Content details not found for the selected content.");
    }
  };

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    console.log(error);
    return (
      <div className={styles.rowSpace}>
        <p>{error}</p>
        <Button variant="danger" onClick={fetchData}>
          Retry Fetching Content
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Row>
        {contentList.map((content, index) =>
          content ? (
            <Col key={String(content.contentId)} xs={12} className="mb-4">
              <Card className={styles.custumCard}>
                <Card.Body>
                  {selectedContent === content.contentId &&
                    transactionInProgress && (
                      <div className={styles.overlay}>
                        <div className={styles.spinnerOverlayContent}>
                          <Spinner animation="border" variant="light" />
                          <div>Processing... Waiting for confirmation</div>
                        </div>
                      </div>
                    )}
                  <Row>
                    <Col xs={4} className={styles.customCol}>
                      <Image
                        src={content.contentMedia}
                        alt="Creator Quote Image"
                        fluid
                        className={styles.contentImage}
                      />
                    </Col>
                    <Col xs={8}>
                      <Card.Title className="cardTitleSpace">
                        {content.contentTitle ?? "No Title Available"}
                      </Card.Title>
                      <>
                        <CreatedBy contentCreator={content.contentCreator} />
                        <Card.Text>
                          <strong>Costs:</strong> {content.contentCosts} LYX
                        </Card.Text>
                        <Card.Text>
                          <strong>Short Description:</strong>{" "}
                          {content.contentShortDescription}
                        </Card.Text>
                        <Card.Text>
                          <strong>Tags:</strong> {content.contentTags}
                        </Card.Text>
                      </>
                      <Button
                        variant="dark"
                        onClick={() => handleButtonClick(content.contentId)}
                        disabled={transactionInProgress}
                      >
                        {selectedContent === content.contentId &&
                        transactionInProgress
                          ? "Processing... Waiting for confirmation"
                          : "Read More"}
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ) : null
        )}
      </Row>
    </div>
  );
};

export default ContentList;
