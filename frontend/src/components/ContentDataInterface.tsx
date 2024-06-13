interface ContentDataInterface {
  contentId: string;
  contentTitle: string;
  contentMedia: File | string | null;
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

export default ContentDataInterface;
