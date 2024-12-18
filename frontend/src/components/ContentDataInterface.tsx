import { RawDraftContentState } from "draft-js";

export interface ContentDataInterface {
  contentId: string;
  contentTitle: string;
  contentMedia: string;
  contentCreator: string;
  contentCosts: number;
  creatorMessage: string;
  contentShortDescription: string;
  contentLongDescription: RawDraftContentState;
  contentTags: string[];
  numberOfRead: number;
  numberOfLikes: number;
  numberOfComments: number;
  contentComments: string[];
  contentSupporters: string[];
  postCID: string;
}

export interface ImageDataInterface {
  ipfsImage: File | string | null;
}

