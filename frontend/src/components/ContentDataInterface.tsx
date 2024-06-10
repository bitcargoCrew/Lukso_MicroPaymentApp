interface ContentDataInterface {
  contentId: string;
  contentTitle: string;
  contentMedia: File | null;
  contentCreator: string;
  contentCosts: number;
  creatorMessage: string;
  contentShortDescription: string;
  contentLongDescription: string;
  contentTags: string;
  numberOfRead: number;
  numberofLikes: number;
  numberOfComments: number;
  contentComments: string;
}

export default ContentDataInterface;