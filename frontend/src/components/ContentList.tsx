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
  const [selectedContent, setSelectedContent] = useState<string | null>(null); // State to track selected content
  const router = useRouter();

  useEffect(() => {
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery as string);
    }

    const fetchContentData = async () => {
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

    fetchContentData();
  }, [router.query, account, paid]);

  const handlePayment = async (
    contentId: string,
    contentDetails: { contentCreator: string; contentCosts: number }
  ) => {
    const { contentCreator, contentCosts } = contentDetails;
    try {
      setTransactionInProgress(true);
      await ChangePagePayment.transactionModule(contentCreator, contentCosts);
      setPaid(true);
      console.log(contentId);
      router.push({
        pathname: "/contentPage",
        query: { account, paid: true, contentId },
      });
    } catch (error) {
      console.error("Payment failed:", error);
      setError("Payment failed. Please try again.");
    } finally {
      setTransactionInProgress(false);
    }
  };

  const handleButtonClick = (contentId: string) => {
    setSelectedContent(contentId); // Update selected content
    handlePayment(
      contentId,
      contentList.find((content) => content.contentId === contentId)
        ?.contentDetails || { contentCreator: "", contentCosts: 0 }
    );
  };

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Row>
        {contentList.map((content) => (
          <Col key={String(content.contentId)} xs={12} className="mb-4">
            <Card className="customCard">
              <Card.Body>
                <Row>
                  <Col xs={4}>
                    <Image
                      //src={content.contentDetails.contentMedia}
                      src="/quote_image.jpg"
                      alt="Creator Quote Image"
                      fluid
                      className={styles.contentImage}
                    />
                  </Col>
                  <Col xs={8}>
                    <Card.Title className="cardTitleSpace">
                      {content.contentDetails.contentTitle}
                    </Card.Title>
                    <CreatedBy />
                    <Card.Text>
                      <strong>Costs:</strong>{" "}
                      {content.contentDetails.contentCosts} LYX
                    </Card.Text>
                    <Card.Text>
                      <strong>Short Description:</strong>{" "}
                      {content.contentDetails.contentShortDescription}
                    </Card.Text>
                    <Card.Text>
                      <strong>Tags:</strong>{" "}
                      {content.contentDetails.contentTags}
                    </Card.Text>
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
