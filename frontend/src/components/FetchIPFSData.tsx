// fetchContentUtils.ts
import { config, pinata } from "../../config";
import { ContentDataInterface, IPFSCidInterface } from "../components/ContentDataInterface";

export const fetchAllContentCID = async (): Promise<IPFSCidInterface[]> => {
  try {
    const cidResponse = await fetch(`${config.apiUrl}/allContentCID`);
    if (cidResponse.ok) {
      const cidData: IPFSCidInterface[] = await cidResponse.json();
      return cidData;
    } else {
      throw new Error(`Failed to fetch content data: ${cidResponse.statusText}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`An error occurred: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};

export const fetchAllContentFromIPFS = async (
  cidList: IPFSCidInterface[]
): Promise<(ContentDataInterface | null)[]> => {
  try {
    if (!Array.isArray(cidList) || cidList.length === 0) {
      console.warn("No CID list provided or CID list is empty.");
      return [];
    }

    const contentDataIPFS: (ContentDataInterface | null)[] = await Promise.all(
      cidList.map(async (item: IPFSCidInterface): Promise<ContentDataInterface | null> => {
        try {
          const response = await pinata.gateways.get(item.postCID);
          let ipfsData: any = response?.data;

          if (ipfsData instanceof Blob) {
            ipfsData = await ipfsData.text();
          }

          if (typeof ipfsData === "string") {
            ipfsData = JSON.parse(ipfsData);
          }

          if (typeof ipfsData !== "object" || ipfsData === null) {
            console.error(`Invalid data format for CID ${item.postCID}`);
            return null;
          }

          const contentData: ContentDataInterface = {
            contentId: ipfsData.contentId || "",
            contentTitle: ipfsData.contentTitle || "",
            contentMedia: ipfsData.contentMedia || "",
            contentCreator: ipfsData.contentCreator || "",
            contentCosts: ipfsData.contentCosts || 0,
            creatorMessage: ipfsData.creatorMessage || "",
            contentShortDescription: ipfsData.contentShortDescription || "",
            contentLongDescription: ipfsData.contentLongDescription || "",
            contentTags: ipfsData.contentTags || [],
            numberOfRead: ipfsData.numberOfRead || 0,
            numberOfLikes: ipfsData.numberOfLikes || 0,
            numberOfComments: ipfsData.numberOfComments || 0,
            contentComments: ipfsData.contentComments || [],
            contentSupporters: ipfsData.contentSupporters || [],
          };

          return contentData;
        } catch (error) {
          console.error(`Error fetching content for CID ${item.postCID}:`, error);
          return null;
        }
      })
    );

    return contentDataIPFS;
  } catch (error) {
    console.error("Error fetching content from IPFS:", error);
    return [];
  }
};