import styles from "./reputationPage.module.css";
import { Row, Col, Spinner, Card, Image } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import RootLayout from "../app/layout";
import NavBar from "../components/NavBar";

interface AddressCountersInterface {
  transactions_count: number;
  token_transfers_count: number;
  gas_usage_count: number;
  validations_count: number;
}

interface AddressInfoInterface {
  creation_tx_hash: string;
}

interface TransactionDetailsInterface {
  timestamp: string;
}

const Reputation = () => {
  const [account, setAccount] = useState<string>("");
  const [addressCounters, setAddressCounters] =
    useState<AddressCountersInterface | null>(null);
  const [addressInfo, setAddressInfo] = useState<AddressInfoInterface | null>(
    null
  );
  const [transactionDetails, setTransactionDetails] =
    useState<TransactionDetailsInterface | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  // Fetch the account from query
  useEffect(() => {
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery as string);
    }
  }, [router.query, account]);

  // Fetch address counters and info concurrently
  useEffect(() => {
    const fetchData = async () => {
      if (!account) return;

      try {
        setLoading(true);
        setError(null);

        const [countersResponse, infoResponse] = await Promise.all([
          fetch(
            `https://explorer.execution.mainnet.lukso.network/api/v2/addresses/${account}/counters`
          ),
          fetch(
            `https://explorer.execution.mainnet.lukso.network/api/v2/addresses/${account}`
          ),
        ]);

        if (countersResponse.ok && infoResponse.ok) {
          const countersData: AddressCountersInterface =
            await countersResponse.json();
          const infoData: AddressInfoInterface = await infoResponse.json();
          console.log(countersData);
          console.log(infoData);
          setAddressCounters(countersData);
          setAddressInfo(infoData);
        } else {
          setError(
            `Failed to fetch: ${
              countersResponse.statusText || infoResponse.statusText
            }`
          );
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [account]);

  // Fetch transaction details when creation hash is available
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!addressInfo?.creation_tx_hash) return;

      try {
        const response = await fetch(
          `https://explorer.execution.mainnet.lukso.network/api/v2/transactions/${addressInfo.creation_tx_hash}`
        );

        if (response.ok) {
          const data: TransactionDetailsInterface = await response.json();
          console.log(data);
          setTransactionDetails(data);
        } else {
          setError(
            `Failed to fetch transaction details: ${response.statusText}`
          );
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred."
        );
      }
    };

    fetchTransactionDetails();
  }, [addressInfo?.creation_tx_hash]);

  // Helper functions for reputation calculations
  const calculateTransactionPoints = (transactionsCount: number): string => {
    let points =
      transactionsCount >= 1000
        ? 1.0
        : Math.min(Math.floor(transactionsCount / 100) * 0.1, 1.0);
    return points.toFixed(2);
  };

  const calculateTokenTransferPoints = (
    tokenTransfersCount: number
  ): string => {
    let points =
      tokenTransfersCount >= 500
        ? 1.0
        : Math.min(Math.floor(tokenTransfersCount / 10) * 0.1, 1.0);
    return points.toFixed(2);
  };

  const calculateTimestampPoints = (timestamp: string): string => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    let points = 0;
    if (year < 2024) points = 1.0;
    else if (year === 2024) {
      if (month <= 3) points = 0.9;
      else if (month <= 6) points = 0.8;
      else if (month <= 9) points = 0.7;
      else points = 0.6;
    } else points = 0.5;

    return points.toFixed(2);
  };

  const calculateFinalReputationScore = (): string => {
    const transactionPoints = addressCounters
      ? calculateTransactionPoints(addressCounters.transactions_count)
      : "0.00";
    const tokenTransferPoints = addressCounters
      ? calculateTokenTransferPoints(addressCounters.token_transfers_count)
      : "0.00";
    const timestampPoints = transactionDetails
      ? calculateTimestampPoints(transactionDetails.timestamp)
      : "0.00";

    const finalScore =
      parseFloat(transactionPoints) *
      parseFloat(tokenTransferPoints) *
      parseFloat(timestampPoints);
    return finalScore.toFixed(2);
  };

  const getRank = (finalScore: number): string => {
    if (finalScore > 0.5) return "Lukso Legend";
    if (finalScore >= 0.3) return "Lukso Elite";
    if (finalScore >= 0.2) return "Lukso Pro";
    if (finalScore >= 0.1) return "Lukso Member";
    return "Lukso Novice";
  };

  const finalReputationScore = calculateFinalReputationScore();
  const userRank = getRank(parseFloat(finalReputationScore));

  // Helper function to determine which image to display based on final score
  const getReputationImage = (score: number): string => {
    if (score > 0.5) return "/Lukso_Legend.png";
    if (score >= 0.3) return "/Lukso_Elite.png";
    if (score >= 0.2) return "/Lukso_Pro.png";
    if (score >= 0.1) return "/Lukso_Member.png";
    return "/Lukso_Novice.png";
  };

  const reputationImage = getReputationImage(parseFloat(finalReputationScore));

  // Format timestamps for display
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div>
      <NavBar account={account} />
      <RootLayout>
        {loading ? (
          <div className={styles.spinnerContainer}>
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : (
          <>
            <h1>Reputation Calculation</h1>
            <Row className={styles.rowSpace}>
              {addressCounters && (
                <>
                  <Col>
                    <Card>
                      <Card.Body>
                        <Card.Title>Transaction Reputation</Card.Title>
                        <p>
                          Transactions: {addressCounters.transactions_count}
                        </p>
                        <p style={{marginBottom: "0px"}}>
                          Reputation Score:{" "}
                          {calculateTransactionPoints(
                            addressCounters.transactions_count
                          )}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Body>
                        <Card.Title>Token Transfer Reputation</Card.Title>
                        <p>
                          Token Transfers:{" "}
                          {addressCounters.token_transfers_count}
                        </p>
                        <p style={{marginBottom: "0px"}}>
                          Reputation Score:{" "}
                          {calculateTokenTransferPoints(
                            addressCounters.token_transfers_count
                          )}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                </>
              )}
              {transactionDetails && (
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>Creation Date Reputation</Card.Title>
                      <p>
                        Created: {formatTimestamp(transactionDetails.timestamp)}
                      </p>
                      <p style={{marginBottom: "0px"}}>
                        Reputation Score:{" "}
                        {calculateTimestampPoints(transactionDetails.timestamp)}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              )}
            </Row>
            <h1>Your Universal Reputation</h1>
            <Row className={styles.rowSpace}>
              <Col>
                <Card>
                  <Card.Img
                    variant="top"
                    src={reputationImage}
                    alt="Reputation Image"
                    className={styles.badge}
                  />
                  <Card.Body>
                    <h4>You are a {userRank}</h4>
                    <p >Reputation Score: {finalReputationScore}</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col></Col>
              <Col></Col>
            </Row>
          </>
        )}
      </RootLayout>
    </div>
  );
};

export default Reputation;
