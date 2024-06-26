import styles from "./index.module.css";
import {
  Button,
  Col,
  Container,
  Row,
  Nav,
  Navbar,
  Image,
  Modal,
} from "react-bootstrap";
import SignIn from "../components/SignIn";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import RootLayout from "../app/layout";
import ContentCarousel from "@/components/ContentCarousel";
import CardsTop3Supporters from "@/components/CardsTop3Supporters";
import SocialFeed from "@/components/SocialFeed";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [account, setAccount] = useState(""); // State to store account
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility

  useEffect(() => {
    setShowModal(true);
  }, []);

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
        <Image
          src="/background_image_creator.jpg"
          alt="Creator Background Image"
          className={styles.backgroundImage}
        />
        <p className={styles.backgroundText}>
          &quot;Web3 has struggled to drive consumer adoption. Quill enables the
          UX of Web2 while offering the benefits of Web3. Quill gives creators
          ownership and control of their content distribution/monetization with
          a direct view to their end consumer&quot;
        </p>
      </div>

      <RootLayout>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Important</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            We are currently in development. Please use the application with
            your Lukso testnet UP
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Row className={styles.centeredText} id="solution">
          <h1>
            Quill is a content platform that integrates micropayments for the
            consumption of content (SocialFi).
          </h1>
        </Row>
        <ContentCarousel />
        <Row className={styles.centeredText} id="solution">
          <h1>Why should you join Quill?</h1>
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
            <h3>Flexible Payment Options</h3>
            <p>
              Traditional payment methods involve high transaction fees that
              reduce the overall profit for creators. We avoid this by using the
              Lukso blockchain as a payment layer. Additionally, we offer a
              flexible way for users to consume content with a pay-what-you-read
              mechanism.
            </p>
          </Col>
        </Row>
        <Row className={styles.rowSpace}>
          <Col className="d-flex justify-content-center">
            <div className={styles.centeredTextUPCreationBox}>
              <p className={styles.centeredTextUPCreationTitle}>
                Interested in using our DApp? Create your Universal Profile
                (Digital Identity)
                <Image
                  src="/UP_logo.png"
                  alt="UP Logo"
                  className={styles.centeredTextUPCreationImage}
                />
              </p>
              <Link href="https://universalprofile.cloud/" passHref>
                <Button variant="dark">Create your profile</Button>
              </Link>
            </div>
          </Col>
        </Row>
      </RootLayout>
      <div className={styles.backgroundContainer}>
        <Image
          src="/quote_image.jpg"
          alt="Creator Quote Image"
          className={styles.backgroundImage}
        />
        <p className={styles.backgroundText}>
          &quot;Artists should own their own work for so many reasons, but the
          most screamingly obvious one is that if you own what you create, you
          have control over what happens to it.&quot;
          <br />
          <br />
          Taylor Swift, World Renowned Performing Artist
        </p>
      </div>
      <RootLayout>
        <Row>
          <h3 className={styles.centeredText}>
            Checkout the Quill Leaderboard
          </h3>
          <CardsTop3Supporters />
        </Row>
        <Row>
          <h3 className={styles.centeredTextFeed}>Social Feed of Quill</h3>
          <SocialFeed />
        </Row>
      </RootLayout>
      <Navbar expand="lg" bg="dark" data-bs-theme="dark">
        <Container>
          <Nav className="me-auto">
            <Nav.Link>Contact</Nav.Link>
            <Nav.Link>Social Media</Nav.Link>
            <Nav.Link>Legal information</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default Home;
