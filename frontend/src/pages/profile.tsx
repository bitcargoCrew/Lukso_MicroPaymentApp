import styles from "./profile.module.css";
import { Button, Col, Row, Spinner, Image, Modal } from "react-bootstrap";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import FetchProfileData from "../components/FetchProfileData";
import RootLayout from "../app/layout";
import NavBar from "../components/NavBar";
import ContentList from "@/components/ContentList";
import PurchasedContent from "@/components/PurchasedContent";

interface ProfileViewProps {}

const Profile: React.FC<ProfileViewProps> = ({}) => {
  const [account, setAccount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const router = useRouter();

  useEffect(() => {
    setShowModal(true);
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      const accountValue = accountQuery as string;
      setAccount(accountValue);
      setIsLoading(true); // Reset loading state when account changes
    }
  }, [router.query, account]);

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
      </RootLayout>
    </div>
  );
};

export default Profile;
