import styles from "./index.module.css";
import { Button, Col, Container, Row, Nav, Navbar } from "react-bootstrap";
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
    <div>
      <Navbar
        expand="lg"
        className={styles.loginButton}
        bg="dark"
        data-bs-theme="dark"
        sticky="top"
      >
        <Container>
          <Navbar.Brand href="#home">MicroLYX</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Solution</Nav.Link>
              <Nav.Link href="#link">Story</Nav.Link>
            </Nav>
            <div className="justify-content-end">
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
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div>
        <img
          src="/pink_background_image.jpeg"
          alt="Pink Background Image"
          className={styles.backgroundImage}
        />
        <h1 className={styles.backgroundText}>
          The future of the internet: Microtransactions
        </h1>
      </div>
      <RootLayout>
        <Row className={styles.rowSpace}>
          <Col>
            <h1>Lukso Copyright Management</h1>
            <p>
              This Lukso demo app addresses the issue of intellectual property
              rights rights and aims to ensure fair compensation for content
              creators. The app makes it possible to pay a small fee, known as a
              micropayment, to the creator for visiting their page.
            </p>
          </Col>
          <Col>
            {" "}
            <img
              src="/solution_image.jpeg"
              alt="Solution Image"
              className={styles.solutionImage}
            />
          </Col>
        </Row>
        <Row className={styles.rowSpace}>
          <h1>Why should you care?</h1>
          <Col>
            <h3>Royalties and Compensation</h3>
            <p>
              Authors of a page receive royalties for the usage of their content
              based on page visits. This compensation model aimes to ensure that
              content creators are fairly rewarded for their contributions.
            </p>
          </Col>
          <Col>
            <h3>Micropayments and Transactions</h3>
            <p>
              I envision a system of micropayments to facilitate the transfer of
              royalties between content creators and users. Whenever a user
              accessed copyrighted content, a small payment will be made to the
              author or rights holder. These micropayments will accumulate over
              time, allowing authors to receive compensation for the ongoing
              usage of their work.
            </p>
          </Col>
          <Col>
            <h3>Digital Identity</h3>
            <p>
              Every creator and user requires a digital identity (e.g. a
              universal profile). This identity is responsible for displaying
              the creator of the page and managing micropayments in the
              background.
            </p>
          </Col>
        </Row>
        <Row className={styles.rowSpace}>
          <h1>How does it work??</h1>
          <Col>
            <h3>You can find a demo video here:</h3>
            <p>
              Video
            </p>
          </Col>
        </Row>
      </RootLayout>
    </div>
  );
};

export default Home;
