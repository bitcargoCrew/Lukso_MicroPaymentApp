import styles from "./index.module.css";
import { Button, Col, Container, Row } from "react-bootstrap";
import SignIn from "../components/SignIn";
import React, { useState } from "react";
import Link from "next/link";
import RootLayout from "../app/layout";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [account, setAccount] = useState(""); // State to store account

  const handleButtonClick = () => {
    setButtonClicked(true);
  };

  const handleSignInSuccess = (account: string) => {
    setAccount(account); // Update account state
  };

  return (
    <RootLayout>
      <Row className={styles.rowSpace}>
        <Col>
          <h1>Lukso Copyright Management</h1>
          <p>
            This Lukso demo app addresses the issue of intellectual property
            rights rights and aims to ensure fair compensation for content
            creators. The app makes it possible to pay a small fee, known
            as a micropayment, to the creator for visiting their page.
          </p>
        </Col>
      </Row>
      <Row className={styles.rowSpace}>
        <Col>
          <h3>Royalties and Compensation</h3>
          <p>
            Authors of a page receive royalties for the usage of their content
            based on page visits. This compensation model aimes to ensure that
            content creators are fairly rewarded for their contributions.
          </p>
        </Col>
      </Row>
      <Row className={styles.rowSpace}>
        <Col>
          <h3>Micropayments and Transactions</h3>
          <p>
            I envision a system of micropayments to facilitate the transfer of
            royalties between content creators and users. Whenever a user
            accessed copyrighted content, a small payment will be made to the
            author or rights holder. These micropayments will accumulate over
            time, allowing authors to receive compensation for the ongoing usage
            of their work.
          </p>
        </Col>
      </Row>
      <Row className={styles.rowSpace}>
        <Col>
          <h3>Digital Idendity</h3>
          <p>
            Every creator and user requires a digital identity (e.g. a universal
            profile). This identity is responsible for displaying the creator of
            the page and managing micropayments in the background.
          </p>
        </Col>
      </Row>
      <Row className={styles.rowSpace}>
        <Col>
          If you want to test it out you can click on the Button to connect your
          profile.
        </Col>
        <Col>
          <div>
            {!buttonClicked && (
              <Button variant="success" onClick={handleButtonClick}>
                Connect UP
              </Button>
            )}
            {buttonClicked && !account && (
              <SignIn onSignInSuccess={handleSignInSuccess} />
            )}
            {account && (
              <Link
                href={{
                  pathname: "/profile",
                  query: { account: account },
                }}
              >
                <Button variant="success">Go to your profile</Button>
              </Link>
            )}
          </div>
        </Col>
      </Row>
    </RootLayout>
  );
};

export default Home;
