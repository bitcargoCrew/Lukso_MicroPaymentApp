import styles from "./ContentList.module.css";
import React, { useEffect, useState } from "react";
import { Row, Col, Spinner, Card, Image, Button } from "react-bootstrap";
import { ContentDataInterface } from "../components/ContentDataInterface";
import { config } from "../../config"
import { useRouter } from "next/router";
import CreatedBy from "./CreatedBy";

interface PurchasedContentInterface {
  uniqueContentIds: string[];
}

const PurchasedContent: React.FC = () => {
  const [contentList, setContentList] = useState<ContentDataInterface[]>([]);
  const [purchasedContent, setPurchasedContent] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<string>("");
  const router = useRouter();

  const fetchPurchasedContent = async (account: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.apiUrl}/getContentPerSupporter/${account}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched purchased content:", data);

        setPurchasedContent(data.uniqueContentIds);
        console.log(data.uniqueContentIds);
        fetchContentIdData(data.uniqueContentIds);
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

  const fetchContentIdData = async (contentIds: string[]) => {
    try {
      const fetchRequests = contentIds.map((contentId) =>
        fetch(`${config.apiUrl}/content/${contentId}`).then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch content ID ${contentId}`);
          }
          return response.json();
        })
      );

      const data = await Promise.all(fetchRequests);
      console.log("Fetched content list data:", data); // Log data to verify
      setContentList(data);
      console.log(contentList)
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
  }, [router.query]);

  useEffect(() => {
    if (account) {
      fetchPurchasedContent(account);
    }
  }, [account]);

  const handleButtonClick = (contentId: string) => {
    router.push({
      pathname: "/contentPage",
      query: { account, paid: "true", contentId },
    });
  };

  const handleRetryClick = () => {
    if (account) {
      fetchPurchasedContent(account);
    }
  };

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    return (
      <div className={styles.rowSpace}>
        <Button variant="danger" onClick={handleRetryClick}>
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
                    >
                      Read More
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

export default PurchasedContent;