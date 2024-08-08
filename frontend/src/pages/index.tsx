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
import JobBoard from "@/components/JobBoard";

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
        <div className={styles.overlay}>
          <p className={styles.backgroundText}>
            &quot;Quill revolutionizes content creation by combining the
            seamless experience of Web2 with the empowering benefits of Web3.
            Creators, take control of your content distribution and monetization
            while connecting directly with your audience.&quot;
          </p>
        </div>
      </div>

      <RootLayout>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Important</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            We are currently in development. Dive into Quill with your Lukso
            testnet UP and be part of the future of content creation.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Row className={styles.centeredText} id="solution">
          <h1>
            Welcome to Quill - The Ultimate Content Platform Integrating
            Micropayments (SocialFi).
          </h1>
        </Row>
        <ContentCarousel />
        <Row className={styles.centeredText} id="solution">
          <h1>
            Empower Your Creativity: Generate Income, Know Your Audience, and
            Enjoy Flexible Payment Options.
          </h1>
        </Row>
        <Row className={styles.rowSpace}>
          <Col>
            <h3>Boost Your Earnings</h3>
            <p>
              Monetize your content like never before with our innovative page
              traffic solutions powered by the Lukso blockchain.
            </p>
          </Col>
          <Col>
            <h3>Understand Your Audience</h3>
            <p>
              Gain insights into your content consumers. Tailor your creations
              to meet the preferences of your target audience.
            </p>
          </Col>
          <Col>
            <h3>Flexible and Cost-Effective Payments</h3>
            <p>
              Say goodbye to high transaction fees. With Lukso blockchain
              integration, enjoy a pay-what-you-read model and maximize your
              profits.
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <div className={styles.centeredTextUPCreationBox}>
              <p className={styles.centeredTextUPCreationTitle}>
                Ready to Join Us? Create Your Universal Profile (Digital
                Identity) Today!
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
        <div className={styles.overlay}>
          <p className={styles.backgroundText}>
            &quot;Artists should own their own work for so many reasons, but the
            most screamingly obvious one is that if you own what you create, you
            have control over what happens to it.&quot;
            <br />
            <br />
            Taylor Swift, World Renowned Performing Artist
          </p>
        </div>
      </div>
      <RootLayout>
        <Row>
          <h3 className={styles.centeredText}>
            Meet the Top 3 Content Supporters on Quill
          </h3>
          <CardsTop3Supporters />
        </Row>
        <Row>
          <h3 className={styles.centeredTextFeed}>
            Explore the Latest Interactions with Content on Quill
          </h3>
          <SocialFeed />
        </Row>
        <Row>
          <h3 className={styles.centeredText}>
            The Lukso Blockchain offers jobs via the Agency for the Future GmbH
          </h3>
          <JobBoard />
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
