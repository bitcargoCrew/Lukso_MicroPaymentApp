// CreatedBy.tsx
import styles from "./CreatedBy.module.css";
import React, { useEffect, useState, useCallback } from "react";
import { Image, Spinner, Card } from "react-bootstrap";
import { PersonBoundingBox } from "react-bootstrap-icons";
import FetchCreatorData from "./FetchCreatorData";

const CreatedBy: React.FC<{ contentCreator: string }> = ({ contentCreator }) => {
  const [imageError, setImageError] = useState(false);
  const [profileMetaData, setProfileMetaData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleCreatorData = useCallback((data: any) => {
    setProfileMetaData(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (contentCreator) {
      setIsLoading(true);
      setImageError(false);
      FetchCreatorData({ contentCreator, onDataFetched: handleCreatorData });
    }
  }, [contentCreator, handleCreatorData]);

  const getProfileImageUrl = useCallback((profileMetaData: any) => {
    const ipfsHash =
      profileMetaData?.value?.LSP3Profile?.profileImage?.[0]?.url.split("://")[1];
    if (!ipfsHash) {
      setImageError(true);
      return "";
    }
    return `https://api.universalprofile.cloud/ipfs/${ipfsHash}`;
  }, []);

  return (
    <div>
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