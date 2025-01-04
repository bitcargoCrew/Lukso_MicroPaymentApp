import styles from "./reputationPage.module.css";
import { Row, Col, Spinner, Card } from "react-bootstrap";
import React, { useEffect, useState, useCallback } from "react";
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
  const [account, setAccount] = useState("");
  const [addressCounters, setAddressCounters] =
    useState<AddressCountersInterface | null>(null);
  const [addressInfo, setAddressInfo] = useState<AddressInfoInterface | null>(
    null
  );
  const [transactionDetails, setTransactionDetails] =
    useState<TransactionDetailsInterface | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  // Fetch the account from query
  useEffect(() => {
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      const accountValue = accountQuery as string;
      setAccount(accountValue);
    }
  }, [router.query, account]);

  // Fetch address counters
  const fetchAddressCounters = useCallback(async () => {
    if (!account) return;

    try {
      const response = await fetch(
        `https://explorer.execution.mainnet.lukso.network/api/v2/addresses/${account}/counters`
      );
      if (response.ok) {
        const data: AddressCountersInterface = await response.json();
        setAddressCounters(data);
      } else {
        setError(`Failed to fetch counters: ${response.statusText}`);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  }, [account]);

  // Fetch address info
  const fetchAddressInfo = useCallback(async () => {
    if (!account) return;

    try {
      const response = await fetch(
        `https://explorer.execution.mainnet.lukso.network/api/v2/addresses/${account}`
      );
      if (response.ok) {
        const data: AddressInfoInterface = await response.json();
        setAddressInfo(data);
      } else {
        setError(`Failed to fetch address info: ${response.statusText}`);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  }, [account]);

  // Fetch transaction details
  const fetchTransactionDetails = useCallback(async () => {
    if (!addressInfo?.creation_tx_hash) return;

    try {
      const response = await fetch(
        `https://explorer.execution.mainnet.lukso.network/api/v2/transactions/${addressInfo.creation_tx_hash}`
      );
      if (response.ok) {
        const data: TransactionDetailsInterface = await response.json();
        setTransactionDetails(data);
      } else {
        setError(`Failed to fetch transaction details: ${response.statusText}`);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  }, [addressInfo?.creation_tx_hash]);

  // Load all data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAddressCounters();
      await fetchAddressInfo();
      setLoading(false);
    };

    loadData();
  }, [fetchAddressCounters, fetchAddressInfo]);

  useEffect(() => {
    if (addressInfo?.creation_tx_hash) {
      fetchTransactionDetails();
    }
  }, [addressInfo?.creation_tx_hash, fetchTransactionDetails]);

  // Calculate reputation points based on transaction count
  const calculateTransactionPoints = (transactionsCount: number): string => {
    let points = 0;
    if (transactionsCount >= 1000) {
      points = 1.0;
    } else {
      points = Math.min(Math.floor(transactionsCount / 100) * 0.1, 1.0);
    }
    return points.toFixed(2); // Return as a string with 2 decimals
  };

  // Calculate reputation points based on token transfers count
  const calculateTokenTransferPoints = (
    tokenTransfersCount: number
  ): string => {
    let points = 0;
    if (tokenTransfersCount >= 500) {
      points = 1.0;
    } else {
      points = Math.min(Math.floor(tokenTransfersCount / 10) * 0.1, 1.0);
    }
    return points.toFixed(2); // Return as a string with 2 decimals
  };

  // Calculate reputation points based on creation timestamp
  const calculateTimestampPoints = (timestamp: string): string => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-based

    let points = 0;
    if (year < 2024) {
      points = 1.0; // Before 2024
    } else if (year === 2024) {
      if (month >= 1 && month <= 3) {
        points = 0.9; // Q1 2024 (Jan - Mar)
      } else if (month >= 4 && month <= 6) {
        points = 0.8; // Q2 2024 (Apr - Jun)
      } else if (month >= 7 && month <= 9) {
        points = 0.7; // Q3 2024 (Jul - Sep)
      } else if (month >= 10 && month <= 12) {
        points = 0.6; // Q4 2024 (Oct - Dec)
      }
    } else {
      points = 0.5; // 2025 or later
    }
    return points.toFixed(2); // Return as a string with 2 decimals
  };

  // Format timestamp to a more readable format
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // Calculate final reputation score by multiplying the points
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
    return finalScore.toFixed(2); // Return as a string with 2 decimals
  };

  const finalReputationScore = calculateFinalReputationScore();

  // Determine the rank based on final score
  const getRank = (finalScore: number): string => {
    if (finalScore > 0.5) {
      return "Lukso Legend"; // Above 0.5 is "Lukso Legend"
    } else if (finalScore >= 0.3) {
      return "Lukso Elite";
    } else if (finalScore >= 0.2) {
      return "Lukso Pro";
    } else if (finalScore >= 0.1) {
      return "Lukso Member";
    } else {
      return "Lukso Novice";
    }
  };

  const userRank = getRank(parseFloat(finalReputationScore));

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
            {addressCounters && (
              <div>
                <h1>Transaction Reputation</h1>
                <Row className={styles.rowSpace}>
                  <Col>
                    <Card style={{ width: "18rem" }}>
                      <Card.Body>
                        <Card.Title style={{ paddingBottom: "10px" }}>Transaction Reputation I</Card.Title>
                        <Card.Text>
                          <p>
                            Transactions Count UP:{" "}
                            {addressCounters.transactions_count}
                          </p>
                          <p>
                            Reputation Points:{" "}
                            {calculateTransactionPoints(
                              addressCounters.transactions_count
                            )}
                          </p>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card style={{ width: "18rem" }}>
                      <Card.Body>
                        <Card.Title style={{ paddingBottom: "10px" }}>Transaction Reputation II</Card.Title>
                        <Card.Text>
                          <p>
                            Token Transfers Count UP:{" "}
                            {addressCounters.token_transfers_count}
                          </p>
                          <p>
                            Reputation Points:{" "}
                            {calculateTokenTransferPoints(
                              addressCounters.token_transfers_count
                            )}
                          </p>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col></Col>
                </Row>
              </div>
            )}
            {transactionDetails && (
              <div>
                <h1>Creation Reputation</h1>
                <Row className={styles.rowSpace}>
                  <Col>
                    <Card style={{ width: "18rem" }}>
                      <Card.Body>
                        <Card.Title style={{ paddingBottom: "10px" }}>Creation Date</Card.Title>
                        <Card.Text>
                          <p>
                            Creation Timestamp:{" "}
                            {formatTimestamp(transactionDetails.timestamp)}
                          </p>
                          <p>
                            Reputation Points:{" "}
                            {calculateTimestampPoints(
                              transactionDetails.timestamp
                            )}
                          </p>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}
            <div className={styles.reputationSection}>
              <h1>Final Reputation</h1>
              <p className={styles.finalScore}>
                Final Reputation Score: {finalReputationScore}
              </p>
              <p className={styles.rank}>
                User Rank:
                <span
                  className={`${styles.rankBadge} ${
                    styles[userRank.replace(" ", "")]
                  }`}
                >
                  {userRank}
                </span>
              </p>
            </div>
          </>
        )}
      </RootLayout>
    </div>
  );
};

export default Reputation;
