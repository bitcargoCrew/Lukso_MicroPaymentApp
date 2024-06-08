import React, { useEffect, useState } from "react";

interface ContentData {
  contentTitle: string;
  contentMedia: string; // Assuming contentMedia is a URL to an image
  contentCreator: string;
  contentCosts: number;
  creatorMessage: string;
  contentShortDescription: string;
  contentLongDescription: string;
  contentTags: string;
  numberOfRead: number;
  numberofLikes: number;
  numberOfComments: number;
  contentComments: string; // Assuming contentComments is a string of comments
}

const ContentDetails: React.FC<{ contentId: string }> = ({ contentId }) => {
  const [contentData, setContentData] = useState<ContentData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/content/${contentId}`);
        if (response.ok) {
          const data = await response.json();
          setContentData(data);
        } else {
          console.error("Failed to fetch content data:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, [contentId]);

  return (
    <div>
      {contentData ? (
        <div>
        <h1>{contentData.contentTitle}</h1>
        <img src={contentData.contentMedia} alt="Content Media" />
        <p>Creator: {contentData.contentCreator}</p>
        <p>Costs: {contentData.contentCosts}</p>
        <p>Creator Message: {contentData.creatorMessage}</p>
        <p>Short Description: {contentData.contentShortDescription}</p>
        <p>Long Description: {contentData.contentLongDescription}</p>
        <p>Tags: {contentData.contentTags}</p>
        <p>Number of Reads: {contentData.numberOfRead}</p>
        <p>Number of Likes: {contentData.numberofLikes}</p>
        <p>Number of Comments: {contentData.numberOfComments}</p>
        <p>Comments: {contentData.contentComments}</p>
      </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ContentDetails;