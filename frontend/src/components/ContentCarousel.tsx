import { useEffect, useState } from "react";
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
import {
  ContentDataInterface,
  IPFSCidInterface,
} from "../components/ContentDataInterface";
import { config } from "../../config";
import {
  fetchAllContentCID,
  fetchAllContentFromIPFS,
} from "@/components/FetchIPFSData"; // Import the functions
import styles from "./ContentCarousel.module.css"; // Assuming you're using the same styles
import { setContentSupporter } from "./PageAccess";

const ContentCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [contentList, setContentList] = useState<
    (ContentDataInterface | null)[]
  >([]);
  const [cidList, setCidList] = useState<IPFSCidInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchContentCID(); // Use a function to fetch data
  }, []);

  useEffect(() => {
    if (cidList.length > 0) {
      fetchContentFromIPFS(); // Fetch content from IPFS when cidList changes
    }
  }, [cidList]);

  const fetchContentCID = async () => {
    try {
      setError(null); // Reset error before retrying
      setLoading(true);
      const cidData = await fetchAllContentCID(); // Fetch CIDs
      setCidList(cidData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchContentFromIPFS = async () => {
    try {
      const contentDataIPFS = await fetchAllContentFromIPFS(cidList); // Fetch content from IPFS
      setContentList(contentDataIPFS);
    } catch (error) {
      console.error("Failed to fetch content from IPFS", error);
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
      const { contentSupporter } = await ChangePagePayment.transactionModule(
        contentCreator,
        contentCosts
      );

      // Send contentSupporter to getAccessPerson
      await setContentSupporter(contentSupporter);
      const account = contentSupporter

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

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  if (loading) {
    return (
      <Spinner
        animation="border"
        role="status"
        className={styles.spinnerOverlayContent}
      />
    );
  }

  if (error) {
    return (
      <div className={styles.rowSpace}>
        <p>{error}</p>
        <Button variant="danger" onClick={fetchContentCID}>
          Retry Fetching Content
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
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        controls
        variant="dark"
      >
        {contentList.map(
          (content) =>
            content && (
              <Carousel.Item key={String(content.contentId)}>
                <Row>
                  <Col xs={12} className="mb-4">
                    <Card>
                      <Card.Body>
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
                            {content && (
                              <>
                                <CreatedBy
                                  contentCreator={content.contentCreator}
                                />
                                <Card.Text>
                                  <strong>Costs:</strong> {content.contentCosts}{" "}
                                  LYX
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
                              onClick={() =>
                                handleButtonClick(content.contentId)
                              }
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
            )
        )}
      </Carousel>
    </div>
  );
};

export default ContentCarousel;
