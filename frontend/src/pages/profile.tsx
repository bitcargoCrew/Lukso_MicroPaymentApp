import styles from "./profile.module.css";
import { Button, Col, Row, Spinner, Image } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import RootLayout from "../app/layout";
import NavBar from "../components/NavBar";
import ContentList from "@/components/ContentList";
import PurchasedContent from "@/components/PurchasedContent";

interface ProfileViewProps {}

const Profile: React.FC<ProfileViewProps> = ({}) => {
  const [account, setAccount] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const router = useRouter();

  useEffect(() => {
    setShowModal(true);
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      const accountValue = accountQuery as string;
      setAccount(accountValue);
    }
  }, [router.query, account]);

  return (
    <div>
      <NavBar account={account} />
      <div className={styles.backgroundContainer}>
        <Image
          src="/profile_background.jpeg"
          alt="Profile Background Image"
          className={styles.backgroundImage}
        />
      </div>
      <RootLayout>
        <div>
        {/*<Row className={styles.rowSpace}>
            <h1>Your purchased content</h1>
          </Row>
          <Row className={styles.rowSpace}>
            <PurchasedContent />
          </Row>
          */}
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
