import styles from "./CreatedBy.module.css";
import React, { useEffect, useState, useCallback } from "react";
import { Image, Spinner, Card } from "react-bootstrap";
import { PersonBoundingBox } from "react-bootstrap-icons";
import FetchProfileData from "./FetchProfileData";
import { useRouter } from "next/router";

const CreatedBy: React.FC = () => {
  const [imageError, setImageError] = useState(false);
  const [profileMetaData, setProfileMetaData] = useState<any>(null);
  const [account, setAccount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery as string);
      setIsLoading(true); // Reset loading state when account changes
    }
  }, [router.query, account]);

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
      return "";
    }
    return `https://api.universalprofile.cloud/ipfs/${ipfsHash}`;
  }, []);

  return (
    <div>
      <FetchProfileData account={account} onDataFetched={handleProfileData} />
      {isLoading ? (
        <div className={styles.spinnerContainer}>
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <Card.Text className={styles.rowSpace}>
          <span><strong>Created by:</strong></span>
          <span style={{ paddingLeft: "1%" }}>
            {imageError || !profileMetaData ? (
              <PersonBoundingBox size={20} />
            ) : (
              <Image
                src={getProfileImageUrl(profileMetaData)}
                fluid
                rounded
                alt="Profile"
                onError={() => setImageError(true)}
                className={styles.creatorImage}
              />
            )}
          </span>
          <span style={{ paddingLeft: "1%" }}>
            {profileMetaData?.value?.LSP3Profile?.name}
          </span>
        </Card.Text>
      )}
    </div>
  );
};

export default CreatedBy;
