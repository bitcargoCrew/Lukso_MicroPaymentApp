interface ContentDataInterface {
  contentId: string;
  contentDetails: {
    contentTitle: string;
    contentMedia: File | null;
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
  };
}

export default ContentDataInterface;
