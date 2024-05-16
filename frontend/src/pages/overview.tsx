import styles from "./overview.module.css";
import Dashboard from "../components/Dashboard";
import { Button, Col, Container, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import RootLayout from "../app/layout";
import Link from "next/link";
import { useRouter } from "next/router";

const Overview: React.FC = () => {
  const [account, setAccount] = useState("");
  const router = useRouter();
  const { query } = router;
  const { paid } = query;

  useEffect(() => {
    const { account } = router.query;
    if (account) {
      setAccount(account as string);
      console.log(account);
    }
  }, [router.query]);

  return (
    <RootLayout>
      <Dashboard />
      {paid === "true" ? (
        <Row className={styles.rowSpace}>
          <h1 className={styles.rowSpace}>This is the New Page</h1>
          <Col>
            <Link href={`/profile?account=${account}`}>
              <Button variant="dark">Go to Last Page</Button>
            </Link>
          </Col>
          <Col></Col>
          <Col></Col>
        </Row>
      ) : (
        <div>
          <p>You are not authorized to view this page.</p>
          <p>Please make a payment to access this page.</p>
        </div>
      )}
    </RootLayout>
  );
};

export default Overview;
