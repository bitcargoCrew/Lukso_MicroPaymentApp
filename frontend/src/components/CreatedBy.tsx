import React, { useState } from "react";
import { Image } from "react-bootstrap";
import { PersonBoundingBox } from "react-bootstrap-icons";

const CreatedBy: React.FC = () => {
  const [imageError, setImageError] = useState(false);
  const contentCreatorPicture = `https://api.universalprofile.cloud/ipfs/bafkreifzajflcehakjdl3rjupdkstc57nx7hvhbwucjqlhylpzhusa2dji`;
  return (
    <div>
      Created by:
      <span style={{ paddingLeft: "1%" }}>
        {imageError ? (
          <PersonBoundingBox size={30} />
        ) : (
          <Image
            src={contentCreatorPicture}
            style={{ width: "30px", height: "30px" }} // Set width and height
            fluid
            rounded
            alt="contentCreatorPicture"
            onError={() => setImageError(true)}
          />
        )}
      </span>
      <span style={{ paddingLeft: "1%" }}>sandro</span>
    </div>
  );
};

export default CreatedBy;
