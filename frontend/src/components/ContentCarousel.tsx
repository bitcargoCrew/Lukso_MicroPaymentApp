import { useEffect, useState, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  Image,
  Button,
  Spinner,
  Carousel,
} from "react-bootstrap";
import { useRouter } from "next/router";
import ChangePagePayment from "@/components/ChangePagePayment";
import CreatedBy from "./CreatedBy";
import ContentDataInterface from "./ContentDataInterface";
import config from "../../config";
import styles from "./ContentCarousel.module.css"; // Assuming you're using the same styles

const ContentCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [contentList, setContentList] = useState<ContentDataInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [paid, setPaid] = useState(false);
  const [account, setAccount] = useState("");
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery as string);
    }

    fetchContentData();
  }, [router.query, account]);

  const fetchContentData = useCallback(async () => {
    setLoading(true);
    setError(null); // Reset the error state when retrying
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
  }, []);

  const handlePayment = async (
    contentId: string,
    contentCreator: string,
    contentCosts: number,
    numberOfRead: number
  ) => {
    try {
      setTransactionInProgress(true);
      const { contentSupporter } = await ChangePagePayment.transactionModule(
        contentCreator,
        contentCosts
      );
      setPaid(true);
      const updatedNumberOfRead = (numberOfRead || 0) + 1;
      console.log(contentSupporter);
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

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  if (loading) {
    return <Spinner animation="border" role="status"className={styles.spinnerOverlayContent}/>;
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
    <div className={styles.carouselContainer}>
      {transactionInProgress && (
        <div className={styles.spinnerOverlay}>
          <div className={styles.spinnerOverlayContent}>
            <Spinner animation="border" role="status" />
            <div>Processing... Waiting for confirmation</div>
          </div>
        </div>
      )}
      <Carousel activeIndex={index} onSelect={handleSelect}>
        {contentList.map((content) => (
          <Carousel.Item key={String(content.contentId)}>
            <Row>
              <Col xs={12} className="mb-4">
                <Card>
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
                            <CreatedBy
                              contentCreator={content.contentCreator}
                            />
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
                          disabled={transactionInProgress} // Disable if any transaction is in progress
                          aria-label={`Read more about ${content.contentTitle}`}
                        >
                          Read More
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ContentCarousel;
