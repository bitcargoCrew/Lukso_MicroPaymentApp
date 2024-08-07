import styles from "./ContentList.module.css";
import React, { useEffect, useState } from "react";
import { Row, Col, Spinner, Card, Image, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import ChangePagePayment from "@/components/ChangePagePayment";
import CreatedBy from "./CreatedBy";
import ContentDataInterface from "./ContentDataInterface";
import config from "../../config";

const ContentList: React.FC = () => {
  const [contentList, setContentList] = useState<ContentDataInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [paid, setPaid] = useState(false);
  const [account, setAccount] = useState("");
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [supporterAddress, setSupporterAddress] = useState<string | null>(null);
  const router = useRouter();

  const fetchContentData = async () => {
    setError(null); // Reset the error state when retrying
    setLoading(true); // Ensure loading is true while fetching data
    try {
      const response = await fetch(`${config.apiUrl}/allContent`);
      if (response.ok) {
        const data = await response.json();
        setContentList(data);
      } else {
        setError(`Failed to fetch content data: ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(`An error occurred: ${error.message}`);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery as string);
    }

    fetchContentData();
  }, [router.query, account, paid]);

  const handlePayment = async (
    contentId: string,
    contentCreator: string,
    contentCosts: number,
    numberOfRead: number
  ) => {
    try {
      setTransactionInProgress(true);
      const { txHash, contentSupporter } =
        await ChangePagePayment.transactionModule(contentCreator, contentCosts);
      setSupporterAddress(contentSupporter);
      setPaid(true);
      const updatedNumberOfRead = (numberOfRead || 0) + 1;

      // Send the update to the server
      const response = await fetch(`${config.apiUrl}/content/${contentId}`, {
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
      });

      if (response.ok) {
        console.log("Updated content data:", await response.json());

        // Redirect to the content page
        router.push({
          pathname: "/contentPage",
          query: { account, paid: "true", contentId },
        });
      } else {
        setError(`Failed to update content data: ${response.statusText}`);
      }
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
      (content) => content.contentId === contentId
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
    return (
      <div className={styles.rowSpace}>
        <Button variant="danger" onClick={fetchContentData}>
          {error}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Row>
        {contentList.map((content) => (
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
                      src={
                        typeof content.contentMedia === "string"
                          ? content.contentMedia
                          : content.contentMedia instanceof File
                          ? URL.createObjectURL(content.contentMedia)
                          : undefined
                      }
                      alt="Creator Quote Image"
                      fluid
                      className={styles.contentImage}
                    />
                  </Col>
                  <Col xs={8}>
                    <Card.Title className="cardTitleSpace">
                      {content.contentTitle ?? "No Title Available"}
                    </Card.Title>
                    {content && (
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
                    )}
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
        ))}
      </Row>
    </div>
  );
};

export default ContentList;
