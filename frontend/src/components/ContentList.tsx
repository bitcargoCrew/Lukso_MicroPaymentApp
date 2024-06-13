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
  const [contentMedia, setContentMedia] = useState<File | undefined>(undefined);
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
          console.log("Fetched data:", data); // Log the fetched data
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
    contentCreator: string,
    contentCosts: number
  ) => {
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
    const selectedContent = contentList.find(
      (content) => content.contentId === contentId
    );

    if (selectedContent) {
      handlePayment(
        contentId,
        selectedContent.contentCreator,
        selectedContent.contentCosts
      );
    } else {
      setError("Content details not found for the selected content.");
    }
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
