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
          <Navbar.Brand href="#home">Quill</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#solution">Solution</Nav.Link>
              <Nav.Link href="#story">Story</Nav.Link>
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
      <div className={styles.backgroundContainer} id="home">
        <img
          src="/background_image_creator.jpg"
          alt="Creator Background Image"
          className={styles.backgroundImage}
        />
        <p className={styles.backgroundText}>
          “Web3 has struggled to drive consumer adoption. Quill enables the UX
          of Web2 while offering the benefits of Web3. Quill gives creators
          ownership and control of their content distribution/monetization with
          a direct view to their end consumer"
        </p>
      </div>

      <RootLayout>
        <Row className={styles.centeredText} id="solution">
          <h1>
            Quill is a content platform that integrates micropayments for the
            consumption of content (SocialFi). Why should you join?
          </h1>
        </Row>
        <Row className={styles.rowSpace}>
          <Col>
            <h3>Income Generation for Creators</h3>
            <p>
              Creators need effective ways to monetize their content through
              page traffic. We offer this by integrating the Lukso blockchain as
              a micopayment solution.
            </p>
          </Col>
          <Col>
            <h3>Creators Meet Consumers</h3>
            <p>
              Creators have a platform to know who consumes their content. We
              provide detailed statistics about your customers so that you can
              tailor your content to your target group.
            </p>
          </Col>
          <Col>
            <h3>Low Transaction Fees</h3>
            <p>
              Traditional payment methods involve high transaction fees that
              reduce the overall profit for creators. We avoid this by using the
              Lukso blockchain as a payment layer.
            </p>
          </Col>
          <Col>
            <h3>Avoiding Hefty Subscriptions</h3>
            <p>
              Users are deterred by expensive monthly subscriptions for content
              they find interesting but may not consume regularly. We offer a
              flexible way to consume content with a pay-what-you-read
              mechanism.
            </p>
          </Col>
        </Row>
      </RootLayout>
      <div className={styles.backgroundContainer}>
        <img
          src="/quote_image.jpg"
          alt="Creator Quote Image"
          className={styles.backgroundImage}
        />
        <p className={styles.backgroundText}>
          "Artists should own their own work for so many reasons, but the most
          screamingly obvious one is that if you own what you create, you have
          control over what happens to it." ​<p></p>
          <p>Taylor Swift, World Renowned Performing Artist</p>
        </p>
      </div>
      <RootLayout>
        <Row className={styles.centeredText} id="story">
          <h1>How can Quill achieve this?</h1>
        </Row>
        <Row className={styles.centeredText}>
          <p>Our explanation video will be published soon.</p>
        </Row>
      </RootLayout>
    </div>
  );
};

export default Home;
