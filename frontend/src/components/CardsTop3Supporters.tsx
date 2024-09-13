import styles from "./CardsTop3Supporters.module.css";
import React, { useEffect, useState, useCallback } from "react";
import { Button, Col, Row, Card, Spinner } from "react-bootstrap";
import { config } from "../../config";
import SupporterInformation from "@/components/SupporterInformation";
import { Icon1Circle, Icon2Circle, Icon3Circle } from "react-bootstrap-icons";

const CardsTop3Supporters: React.FC = () => {
  const [top3SupportersData, setTop3SupportersData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTop3SupportersData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/top3Supporters`);
      if (response.ok) {
        const data = await response.json();
        setTop3SupportersData(data);
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
    fetchTop3SupportersData();
  }, [fetchTop3SupportersData]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Row className={styles.rowSpace}>
      {top3SupportersData.map((top3Supporter, index) => (
        <Col key={index} xs={12} md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Row>
                <Col
                  xs={2}
                  className="d-flex align-items-center justify-content-center"
                >
                  {index === 0 && <Icon1Circle size={60} />}
                  {index === 1 && <Icon2Circle size={60} />}
                  {index === 2 && <Icon3Circle size={60} />}
                </Col>
                <Col xs={10}>
                  <Row>
                    <Card.Title>
                      <SupporterInformation
                        contentSupporter={top3Supporter.contentSupporter}
                      />
                    </Card.Title>
                  </Row>
                  <Row>
                    <Card.Text>
                      <span style={{ paddingRight: "1%" }}>
                        Quill Tokens Received:
                      </span>
                      <strong>{top3Supporter.totalTokensReceived}</strong>
                    </Card.Text>
                  </Row>
                  <Row>
                    <Button
                      variant="dark"
                      className={styles.buttonStyling}
                      onClick={() =>
                        window.open(
                          `https://universalprofile.cloud/${top3Supporter.contentSupporter}`,
                          "_blank"
                        )
                      }
                    >
                      Check out UP
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CardsTop3Supporters;
