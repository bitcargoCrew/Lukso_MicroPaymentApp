import styles from "./contentPage.module.css";
import { Button, Col, Container, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import RootLayout from "../app/layout";
import Link from "next/link";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";

const ContentPage: React.FC = () => {
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
    <div>
      <NavBar></NavBar>
      <RootLayout>
        {paid === "true" ? (
          <Row className={styles.rowSpace}>
            <h1 className={styles.rowSpace}>
              Congratulations, you have reached my Creator page
            </h1>
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
    </div>
  );
};

export default ContentPage;
