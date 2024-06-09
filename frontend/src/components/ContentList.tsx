import React, { useEffect, useState } from "react";
import { Row, Col, Spinner, Card, Image, Button } from "react-bootstrap";
import { useRouter } from "next/router";

interface ContentData {
  id: string;
  contentTitle: string;
  contentMedia: string;
  contentCreator: string;
  contentCosts: number;
  creatorMessage: string;
  contentShortDescription: string;
  contentLongDescription: string;
  contentTags: string;
  numberOfRead: number;
  numberofLikes: number;
  numberOfComments: number;
  contentComments: string;
}

const ContentList: React.FC = () => {
  const [contentList, setContentList] = useState<ContentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/content`);
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
  }, []);

  const handlePayment = async (contentId: string) => {
    try {
      setTransactionInProgress(true);
      // Simulate a payment transaction, replace with your actual payment logic
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push(`/contentPage?contentId=${contentId}&paid=true`);
    } catch (error) {
      console.error("Payment failed:", error);
      setTransactionInProgress(false);
    }
  };

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Row>
      {contentList.map((content) => (
        <Col key={content.id} xs={12} className="mb-4">
          <Card className="customCard">
            <Card.Body>
              <Row>
                <Col xs={4}>
                  <Image
                    src={content.contentMedia}
                    alt="Content Media"
                    fluid
                    className="contentImage"
                  />
                </Col>
                <Col xs={8}>
                  <Card.Title className="cardTitleSpace">
                    {content.contentTitle}
                  </Card.Title>
                  <Card.Text>Creator: {content.contentCreator}</Card.Text>
                  <Card.Text>Costs: {content.contentCosts}</Card.Text>
                  <Card.Text>
                    <strong>Creator Message:</strong> {content.creatorMessage}
                  </Card.Text>
                  <Card.Text>
                    <strong>Short Description:</strong>{" "}
                    {content.contentShortDescription}
                  </Card.Text>
                  <Card.Text>
                    <strong>Long Description:</strong>{" "}
                    {content.contentLongDescription}
                  </Card.Text>
                  <Card.Text>
                    <strong>Tags:</strong> {content.contentTags}
                  </Card.Text>
                  <Card.Text>
                    <strong>Number of Reads:</strong> {content.numberOfRead}
                  </Card.Text>
                  <Card.Text>
                    <strong>Number of Likes:</strong> {content.numberofLikes}
                  </Card.Text>
                  <Card.Text>
                    <strong>Number of Comments:</strong>{" "}
                    {content.numberOfComments}
                  </Card.Text>
                  <Card.Text>
                    <strong>Comments:</strong> {content.contentComments}
                  </Card.Text>
                  {transactionInProgress ? (
                    <Spinner animation="border" role="status" />
                  ) : (
                    <Button
                      variant="dark"
                      onClick={() => handlePayment(content.id)}
                      disabled={transactionInProgress}
                    >
                      Read more
                    </Button>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ContentList;