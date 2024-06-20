import styles from "./profile.module.css";
import { Button, Col, Row, Spinner, Image, Modal } from "react-bootstrap";
import React, { useEffect, useState, useCallback } from "react";
import { PersonBoundingBox } from "react-bootstrap-icons";
import Balance from "../components/Balance";
import { useRouter } from "next/router";
import FetchProfileData from "../components/FetchProfileData";
import RootLayout from "../app/layout";
import NavBar from "../components/NavBar";
import ContentList from "@/components/ContentList";

interface ProfileViewProps {}

const Profile: React.FC<ProfileViewProps> = ({}) => {
  const [imageError, setImageError] = useState(false);
  const [account, setAccount] = useState("");
  const [profileMetaData, setProfileMetaData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(true); // State to control the modal visibility
  const router = useRouter();

  useEffect(() => {
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery as string);
      setIsLoading(true); // Reset loading state when account changes
    }
  }, [router.query, account]);

  // Callback function to handle fetched data
  const handleProfileData = useCallback((data: any) => {
    setProfileMetaData(data);
    setIsLoading(false);
  }, []);

  const getProfileImageUrl = useCallback((profileMetaData: any) => {
    const ipfsHash =
      profileMetaData?.value?.LSP3Profile?.profileImage?.[0]?.url.split(
        "://"
      )[1];
    if (!ipfsHash) {
      setImageError(true);
      return ""; // Return empty string if no valid IPFS hash
    }
    return `https://api.universalprofile.cloud/ipfs/${ipfsHash}`;
  }, []);

  return (
    <div>
      <NavBar account={account} />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Important</Modal.Title>
        </Modal.Header>
        <Modal.Body>We are currently in development. Please use the application with your Lukso testnet UP</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className={styles.backgroundContainer}>
        <Image
          src="/profile_background.jpeg"
          alt="Profile Background Image"
          className={styles.backgroundImage}
        />
      </div>
      <RootLayout>
        <FetchProfileData account={account} onDataFetched={handleProfileData} />
        {isLoading ? (
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
            <Row className={styles.rowSpace}>
              <h1>Your purchased content</h1>
              <div>We will add this section soon</div>
            </Row>
            <Row className={styles.rowSpace}>
              <h1>Explore more content</h1>
            </Row>
            <Row className={styles.rowSpace}>
              <ContentList />
            </Row>
          </div>
        )}
      </RootLayout>
    </div>
  );
};

export default Profile;
