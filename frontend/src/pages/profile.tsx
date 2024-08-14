import styles from "./profile.module.css";
import { Button, Col, Row, Spinner, Image, Modal } from "react-bootstrap";
import React, { useEffect, useState, useCallback } from "react";
import { PersonBoundingBox } from "react-bootstrap-icons";
import { useRouter } from "next/router";
import FetchProfileData from "../components/FetchProfileData";
import RootLayout from "../app/layout";
import NavBar from "../components/NavBar";
import ContentList from "@/components/ContentList";
import PurchasedContent from "@/components/PurchasedContent";

interface ProfileViewProps {}

const Profile: React.FC<ProfileViewProps> = ({}) => {
  const [imageError, setImageError] = useState(false);
  const [account, setAccount] = useState("");
  const [profileMetaData, setProfileMetaData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const router = useRouter();

  // Callback function to handle fetched data
  const handleProfileData = useCallback((data: any) => {
    setProfileMetaData(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setShowModal(true);
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      const accountValue = accountQuery as string;
      setAccount(accountValue);
      setIsLoading(true); // Reset loading state when account changes
      FetchProfileData({ account: accountValue, onDataFetched: handleProfileData });
    }
  }, [router.query, account, handleProfileData]);

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
      <div className={styles.backgroundContainer}>
        <Image
          src="/profile_background.jpeg"
          alt="Profile Background Image"
          className={styles.backgroundImage}
        />
      </div>
      <RootLayout>
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <Spinner animation="border" role="status" />
          </div>
        ) : (
          <div>
            <Row className={styles.rowSpace}>
              <h1>Your purchased content</h1>
            </Row>
            <Row className={styles.rowSpace}>
              <PurchasedContent />
            </Row>
            <Row className={styles.rowSpace}>
              <h1>Explore the content of Quill</h1>
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