import styles from "./contentPage.module.css";
import { Button, Col, Container, Row, Image, Spinner } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import RootLayout from "../app/layout";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import CreatedBy from "@/components/CreatedBy";
import ContentDataInterface from "@/components/ContentDataInterface";
import config from "../../config";

const ContentPage: React.FC = () => {
  const [account, setAccount] = useState("");
  const [contentData, setContentData] = useState<ContentDataInterface | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { query } = router;
  const { paid, contentId } = query;

  useEffect(() => {
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery as string);
    }

    const fetchContentData = async () => {
      if (contentId) {
        try {
          const response = await fetch(
            `${config.apiUrl}/content/${contentId}`
          );
          if (response.ok) {
            const data = await response.json();
            setContentData(data);
          } else {
            setError(`Failed to fetch content data: ${response.statusText}`);
          }
        } catch (error) {
          if (error instanceof Error) {
            setError(`An error occurred: ${error.message}`);
          } else {
            setError("An unknown error occurred.");
          }
        }
      }
    };

    fetchContentData();
  }, [router.query, account, contentId]);

  if (!paid || paid !== "true") {
    return (
      <RootLayout>
        <div className={styles.containerErrorPage}>
          <h1>You are not authorized to view this page.</h1>
          <h1>Please make a payment to access this page.</h1>
        </div>
      </RootLayout>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!contentData) {
    return <Spinner animation="border" role="status" />;
  }

  return (
    <div>
      <NavBar account={account}></NavBar>
      <RootLayout>
        <div>
          <Row className={styles.rowSpace}>
            <h1>{contentData.contentDetails.creatorMessage}</h1>
          </Row>
          <Row className={styles.rowSpace}>
            <div className={styles.imageContainer}>
              <Image
                src={"/quote_image.jpg"}
                alt="Content Image"
                className={styles.contentImage}
              />
            </div>
          </Row>
          <Row className={styles.rowSpace}>
            <h1>{contentData.contentDetails.contentTitle}</h1>
          </Row>
          <Row className={styles.rowSpace}>
            <CreatedBy />
          </Row>
          <Row className={styles.rowSpace}>
            <div>{contentData.contentDetails.contentLongDescription}</div>
          </Row>
        </div>
      </RootLayout>
    </div>
  );
};

export default ContentPage;
