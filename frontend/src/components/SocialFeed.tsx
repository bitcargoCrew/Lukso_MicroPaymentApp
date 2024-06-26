import styles from "./SocialFeed.module.css";
import React, { useEffect, useState, useCallback } from "react";
import { Button, Col, Row, Card, Spinner, Container } from "react-bootstrap";
import config from "../../config";
import SupporterInformation from "@/components/SupporterInformation";
import RootLayout from "@/app/layout";
import { timeSince } from "@/components/timeUtils"

const SocialFeed: React.FC = () => {
  const [last20InteractionsData, setLast20InteractionsData] = useState<any[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLast20InteractionsData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/last20Transactions`);
      if (response.ok) {
        const data = await response.json();
        setLast20InteractionsData(data);
        setError(null); // Clear any previous error
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

  useEffect(() => {
    fetchLast20InteractionsData();
  }, [fetchLast20InteractionsData]);

  const getEventText = (event: string) => {
    if (event.includes("Like")) {
      return "Liked a post";
    } else if (event.includes("Read")) {
      return "Read a post";
    } else {
      return "This is an unknown event.";
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <RootLayout>
      <Container className={styles.stylingContainer}>
        {last20InteractionsData.map((interaction, index) => (
          <Col key={index} xs={12} className={styles.stylingCard}>
            <Card style={{ border: 'none' }}>
              <Card.Body>
                <Row className="align-items-center">
                  <Col>
                    <SupporterInformation
                      contentSupporter={interaction.contentSupporter}
                    />
                  </Col>
                  <Col>
                    <div className={styles.stylingEvent}>
                      {getEventText(interaction.event)} {timeSince(interaction.timestamp)} and received{" "}
                      {interaction.numberOfTokensReceived} Quill Tokens.
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Container>
    </RootLayout>
  );
};

export default SocialFeed;
