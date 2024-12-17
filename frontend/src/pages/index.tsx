import styles from "./index.module.css";
import {
  Button,
  Col,
  Container,
  Row,
  Nav,
  Navbar,
  Image,
  Spinner,
  Alert,
} from "react-bootstrap";
import SignIn from "../components/SignIn";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import RootLayout from "../app/layout";
import ContentCarousel from "@/components/ContentCarousel";
import CardsTop3Supporters from "@/components/CardsTop3Supporters";
import SocialFeed from "@/components/SocialFeed";
import ProfileHeader from "@/components/ProfileHeader";
import Balance from "@/components/Balance";
import { useRouter } from "next/router";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [account, setAccount] = useState(""); // State to store account
  const [signInError, setSignInError] = useState<string | null>(null); // State to store sign-in errors
  const router = useRouter();

  useEffect(() => {
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery as string);
    }
  }, [router.query, account]);

  const handleButtonClick = () => {
    setButtonClicked(true);
    setSignInError(null); // Clear any previous error when attempting a new sign-in
  };

  const handleSignInSuccess = (account: string) => {
    setAccount(account); // Update account state
  };

  const handleSignInError = (error: string) => {
    setSignInError(error); // Set error message
    setButtonClicked(false); // Reset button state to allow retry
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
          <Navbar.Brand href="#home">
            <Image
              src="/Quill_logo_white.png"
              alt="UP Logo"
              className={styles.logoHeader}
            />
          </Navbar.Brand>
          <Navbar.Brand href="#home">Quill</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#solution">Solution</Nav.Link>
              <Nav.Link href="#topSupporters">Top Supporters</Nav.Link>
            </Nav>

            {!buttonClicked && !account && (
              <Nav className="d-flex align-items-center">
                <Nav.Item>
                  <Button variant="success" onClick={handleButtonClick}>
                    Connect UP
                  </Button>
                </Nav.Item>
              </Nav>
            )}

            {buttonClicked && !account && (
              <Nav className="d-flex align-items-center ms-auto">
                <Nav.Item>
                  <SignIn
                    onSignInSuccess={handleSignInSuccess}
                    onSignInError={handleSignInError}
                  />
                  <Button variant="success" disabled>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="align-items-center"
                    />
                    Connecting...
                  </Button>
                </Nav.Item>
              </Nav>
            )}

            {account && (
              <Nav className="d-flex align-items-center ms-auto">
                <Nav.Item>
                  <ProfileHeader account={account} />
                </Nav.Item>
                <Nav.Item>
                  <div className={styles.navBalance}>
                    <Balance account={account} />
                  </div>
                </Nav.Item>
                <Nav.Item>
                  <Link
                    href={{
                      pathname: "/profile",
                      query: { account: account },
                    }}
                  >
                    <Button variant="success">Go to your profile</Button>
                  </Link>
                </Nav.Item>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {signInError && ( // Display error message if sign-in error occurs
        <div className={styles.errorOverlay}>
          <Alert
            variant="danger"
            onClose={() => setSignInError(null)}
            dismissible
          >
            <Alert.Heading>Sign-In Error</Alert.Heading>
            <p>{signInError}</p>
          </Alert>
        </div>
      )}

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

      <div id="solution">
        <RootLayout>
          <Row className={styles.centeredText}>
            <h1>
              Welcome to Quill - The Ultimate Content Platform Integrating
              Micropayments (SocialFi).
            </h1>
          </Row>
          <ContentCarousel />
          <Row className={styles.centeredText}>
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
                <Button
                  variant="dark"
                  onClick={() =>
                    window.open("https://universalprofile.cloud/", "_blank")
                  }
                >
                  Create your profile
                </Button>
              </div>
            </Col>
          </Row>
        </RootLayout>
      </div>
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
      <div id="topSupporters">
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
        </RootLayout>
      </div>
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
