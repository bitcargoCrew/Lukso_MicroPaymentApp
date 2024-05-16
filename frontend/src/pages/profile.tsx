import styles from "./profile.module.css";
import { Button, Col, Row, Spinner, Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Image from "react-bootstrap/Image";
import { PersonBoundingBox } from "react-bootstrap-icons";
import Balance from "../components/Balance";
import { useRouter } from "next/router";
import FetchProfileData from "../components/FetchProfileData";
import ChangePagePayment from "../components/ChangePagePayment";
import RootLayout from "../app/layout";

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
    return profilePicture;
  };

  const handlePayment = async () => {
    try {
      setTransactionInProgress(true);
      await ChangePagePayment.sendTransaction();
      setPaid(true);
      router.push(`/overview?account=${account}&paid=true`);
    } catch (error) {
      console.error("Payment failed:", error);
      setTransactionInProgress(false);
    }
  };

  return (
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
            <Col>
              {imageError || !profileMetaData ? (
                <PersonBoundingBox size={200} />
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
            <Col>
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
            <Col></Col>
          </Row>
          <Row className={styles.rowSpace}>
            <Col>
              <Card>
                <Card.Header>My Lukso story</Card.Header>
                <Card.Body>
                  <Card.Title>Why I support Lukso</Card.Title>
                  <Card.Text>
                    Preview of my story. I you want to read the full story it
                    costs 0.01 LYX to read it on the next page.
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
                      Go to Next Page
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </RootLayout>
  );
};

export default Profile;
