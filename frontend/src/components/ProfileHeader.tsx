import React, { useEffect, useState, useCallback } from "react";
import { Image, Spinner, Row, Col } from "react-bootstrap";
import { PersonBoundingBox } from "react-bootstrap-icons";
import fetchProfileData from "./FetchProfileData";

const ProfileHeader: React.FC<{ account: string }> = ({ account }) => {
  const [imageError, setImageError] = useState(false);
  const [profileMetaData, setProfileMetaData] = useState<any>(null);

  const handleProfileData = useCallback((data: any) => {
    setProfileMetaData(data);
  }, []);

  useEffect(() => {
    if (account) {
      setImageError(false);
      fetchProfileData({ account, onDataFetched: handleProfileData });
    }
  }, [account, handleProfileData]);

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
      <Row>
        <Col>
          {imageError || !profileMetaData ? (
            <PersonBoundingBox size={38} />
          ) : (
            <Image
              src={getProfileImageUrl(profileMetaData)}
              fluid
              rounded
              alt="Profile"
              onError={() => setImageError(true)}
              style={{ height: "38px", width: "38px" }}
            />
          )}
        </Col>
        <Col style={{ paddingLeft: "1%", paddingTop: "4.5%", color: "white" }}>
          {profileMetaData?.value?.LSP3Profile?.name}
        </Col>
      </Row>
    </div>
  );
};

export default ProfileHeader;