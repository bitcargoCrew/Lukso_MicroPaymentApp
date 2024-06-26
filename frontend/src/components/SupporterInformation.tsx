import styles from "./SupporterInformation.module.css";
import React, { useEffect, useState, useCallback } from "react";
import { Image, Spinner, Card, Row } from "react-bootstrap";
import { PersonBoundingBox } from "react-bootstrap-icons";
import FetchSupporterData from "./FetchSupporterData";

const SupporterInformation: React.FC<{ contentSupporter: string }> = ({
  contentSupporter,
}) => {
  const [imageError, setImageError] = useState(false);
  const [profileMetaData, setProfileMetaData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleCreatorData = useCallback((data: any) => {
    setProfileMetaData(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (contentSupporter) {
      setIsLoading(true);
      setImageError(false);
      FetchSupporterData({
        contentSupporter,
        onDataFetched: handleCreatorData,
      });
    }
  }, [contentSupporter, handleCreatorData]);

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
      {isLoading ? (
        <div className={styles.spinnerContainer}>
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <Row className="align-items-center">
          <Card.Text>
              {imageError || !profileMetaData ? (
                <PersonBoundingBox size={40} />
              ) : (
                <Image
                  src={getProfileImageUrl(profileMetaData)}
                  fluid
                  rounded
                  alt="Profile"
                  onError={() => setImageError(true)}
                  className={styles.supporterImage}
                />
              )}
            <span style={{ paddingLeft: "5%", paddingTop: "5%" }}>
              {profileMetaData?.value?.LSP3Profile?.name}
            </span>
          </Card.Text>
        </Row>
      )}
    </div>
  );
};

export default SupporterInformation;
