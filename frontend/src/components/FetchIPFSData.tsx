// fetchContentUtils.ts
import { config } from "../../config";
import {
  ContentDataInterface,
} from "../components/ContentDataInterface";

export const fetchAllIpfsData = async (): Promise<ContentDataInterface[]> => {
  try {
    const ipfsResponse = await fetch(
      `${config.apiUrl}/getAllContentPostsFromIPFS`
    );
    if (ipfsResponse.ok) {
      const ipfsData: ContentDataInterface[] = await ipfsResponse.json();
      console.log(ipfsData)
      return ipfsData;
    } else {
      throw new Error(
        `Failed to fetch content data: ${ipfsResponse.statusText}`
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`An error occurred: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};