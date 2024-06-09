import styles from "./profile.module.css";
import { Button, Col, Row, Spinner, Card, Image } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { PersonBoundingBox } from "react-bootstrap-icons";
import Balance from "../components/Balance";
import { useRouter } from "next/router";
import FetchProfileData from "../components/FetchProfileData";
import ChangePagePayment from "../components/ChangePagePayment";
import RootLayout from "../app/layout";
import NavBar from "../components/NavBar";
import CreatedBy from "@/components/CreatedBy";
import Link from "next/link";

interface ProfileViewProps {}

const Profile: React.FC<ProfileViewProps> = ({}) => {
  const [imageError, setImageError] = useState(false);
  const [account, setAccount] = useState("");
  const [profileMetaData, setProfileMetaData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [paid, setPaid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { account } = router.query;
    if (account) {
      setAccount(account as string);
    }
  }, [router.query]);

  // Callback function to handle fetched data
  const handleProfileData = (data: any) => {
    setProfileMetaData(data);
    setIsLoading(false);
  };

  const getProfileImageUrl = (profileMetaData: any) => {
    const ipfsHash =
      profileMetaData?.value?.LSP3Profile?.profileImage?.[0]?.url.split(
        "://"
      )[1];
    if (!ipfsHash) {
      setImageError(true);
    }
    const profilePicture = `https://api.universalprofile.cloud/ipfs/${ipfsHash}`;
    console.log(profilePicture);
    return profilePicture;
  };

  const handlePayment = async () => {
    try {
      setTransactionInProgress(true);
      await ChangePagePayment.transactionModule();
      setPaid(true);
      router.push(`/contentPage?account=${account}&paid=true`);
    } catch (error) {
      console.error("Payment failed:", error);
      setTransactionInProgress(false);
    }
  };

  return (
    <div>
      <NavBar account={account}></NavBar>
      <div className={styles.backgroundContainer}>
        <Image
          src="/profile_background.jpeg"
          alt="Profile Background Image"
          className={styles.backgroundImage}
        />
      </div>
      <RootLayout>
        <FetchProfileData account={account} onDataFetched={handleProfileData} />
        {isLoading ? ( // Show spinner if loading
          <div className={styles.spinnerContainer}>
            <Spinner animation="border" role="status" />
          </div>
        ) : (
          <div>
            <Row className={styles.rowSpace}>
              <h1 className={styles.rowSpace}>User Profile</h1>
              <Col xs={4}>
                {imageError || !profileMetaData ? (
                  <PersonBoundingBox
                    size={200}
                    className={styles.profileIcon}
                  />
                ) : (
                  <Image
                    src={getProfileImageUrl(profileMetaData)}
                    fluid
                    rounded
                    alt="Profile"
                    onError={() => setImageError(true)}
                  />
                )}
              </Col>
              <Col xs={8}>
                {profileMetaData && (
                  <div>
                    <div>Name: {profileMetaData?.value?.LSP3Profile?.name}</div>
                    <div>
                      Description:{" "}
                      {profileMetaData?.value?.LSP3Profile?.description}
                    </div>
                  </div>
                )}
                <div>Account: {account}</div>
                <Balance account={account} />
              </Col>
            </Row>
            {}
            <Row className={styles.rowSpace}>
              <h1>Create content</h1>
              <div>You can create a new post here
              <span style={{ paddingLeft: "1%" }}>
              <Link
                href={{
                  pathname: "/createContentPage",
                  query: { account: account },
                }}
              >
                <Button variant="dark">Create a post</Button>
              </Link>
              </span>
              </div>
            </Row>
            <Row className={styles.rowSpace}>
              <h1>Your purchased content</h1>
              <div>We will add this section soon</div>
            </Row>
            <Row className={styles.rowSpace}>
              <h1>Explore more content</h1>
            </Row>
            <Row className={styles.rowSpace}>
              <Card className={styles.customCard}>
                <Card.Body>
                  <Row>
                    <Col xs={4}>
                      <Image
                        src="/quote_image.jpg"
                        alt="Creator Quote Image"
                        fluid
                        className={styles.contentImage}
                      />
                    </Col>
                    <Col xs={8}>
                      <Card.Title className={styles.cardTitleSpace}>
                        Why I support Lukso
                      </Card.Title>
                      <Card.Text>
                        <CreatedBy />
                      </Card.Text>
                      <Card.Text>
                        Preview of my story. I you want to read the full story
                        it costs 0.01 LYX to read it on the next page.
                      </Card.Text>
                      {transactionInProgress ? ( // Display spinner if transaction is in progress
                        <div className={styles.spinnerContainer}>
                          <Spinner animation="border" role="status" />
                        </div>
                      ) : (
                        <Button
                          variant="dark"
                          onClick={handlePayment}
                          disabled={transactionInProgress}
                        >
                          Read more
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Row>
            <Row className={styles.rowSpace}>
              <Card className={styles.customCard}>
                <Card.Body>
                  <Row>
                    <Col xs={4}>
                      <Image
                        src="/quote_image.jpg"
                        alt="Creator Quote Image"
                        fluid
                        className={styles.contentImage}
                      />
                    </Col>
                    <Col xs={8}>
                      <Card.Title className={styles.cardTitleSpace}>
                        Why I support Lukso
                      </Card.Title>
                      <Card.Text>
                        <CreatedBy />
                      </Card.Text>
                      <Card.Text>
                        Preview of my story. I you want to read the full story
                        it costs 0.01 LYX to read it on the next page.
                      </Card.Text>
                      {transactionInProgress ? ( // Display spinner if transaction is in progress
                        <div className={styles.spinnerContainer}>
                          <Spinner animation="border" role="status" />
                        </div>
                      ) : (
                        <Button
                          variant="dark"
                          onClick={handlePayment}
                          disabled={transactionInProgress}
                        >
                          Read more
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Row>
          </div>
        )}
      </RootLayout>
    </div>
  );
};

export default Profile;