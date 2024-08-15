import React, { useEffect, useState, useCallback } from "react";
import { Image, Row, Col } from "react-bootstrap";
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
    <div className="d-flex align-items-center">
        {imageError || !profileMetaData ? (
          <PersonBoundingBox width="38px" height="38px" fill="white" />
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
      <span style={{ paddingLeft: "10%", color: "white" }}>
        {profileMetaData?.value?.LSP3Profile?.name}
      </span>
    </div>
  );
};

export default ProfileHeader;