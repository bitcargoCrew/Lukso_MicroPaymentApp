export interface ContentDataInterface {
  contentId: string;
  contentTitle: string;
  contentMedia: string;
  contentCreator: string;
  contentCosts: number;
  creatorMessage: string;
  contentShortDescription: string;
  contentLongDescription: string;
  contentTags: string[];
  numberOfRead: number;
  numberOfLikes: number;
  numberOfComments: number;
  contentComments: string[];
}

export interface ImageDataInterface {
  ipfsImage: File | string | null;
}
