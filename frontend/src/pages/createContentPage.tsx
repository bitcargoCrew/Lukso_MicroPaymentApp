import styles from "./createContentPage.module.css";
import { Button, Form, InputGroup, Tab, Tabs, Spinner } from "react-bootstrap";
import React, { useEffect, useState, useRef } from "react";
import RootLayout from "../app/layout";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import {
  ContentDataInterface,
  ImageDataInterface,
} from "../components/ContentDataInterface";
import { Editor, EditorState, convertToRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import { pinata } from "../../config";
import { v4 as uuidv4 } from "uuid";
import { config } from "../../config";
// import { deployAndSetCollectionMetadata } from "../components/DeployContentPost";

const CreateContentPage: React.FC = () => {
  const router = useRouter();
  const [account, setAccount] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("creator"); // Track active tab
  const [formData, setFormData] = useState<ContentDataInterface>({
    contentId: uuidv4(),
    contentTitle: "",
    contentMedia: "",
    contentCreator: account,
    contentCosts: 0,
    creatorMessage: "",
    contentShortDescription: "",
    contentLongDescription: "",
    contentTags: [""],
    numberOfRead: 0,
    numberOfLikes: 0,
    numberOfComments: 0,
    contentComments: [""],
    contentSupporters: [""],
  });
  const [imageData, setImageData] = useState<ImageDataInterface>({
    ipfsImage: null,
  });

  const [editorState, setEditorState] = useState(EditorState.createEmpty()); // Draft.js editor state
  const imageCIDRef = useRef<string>(""); // Initialize a ref for imageCID
  const [imageCID, setImageCID] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsClient(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    const accountQuery = router.query.account as string;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery);
    }
  }, [router.query.account, account]);

  // Convert content state to raw JSON format
  const handleEditorChange = (state: any) => {
    setEditorState(state);
    const contentState = state.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    setFormData((prevState) => ({
      ...prevState,
      contentLongDescription: JSON.stringify(rawContent),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "contentTags") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value.split(","),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        contentCreator: account,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImageData((prevState) => ({
        ...prevState,
        ipfsImage: files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (imageData.ipfsImage instanceof File && !imageCID) {
      try {
        const imageFile = new File(
          [imageData.ipfsImage],
          imageData.ipfsImage.name,
          {
            type: "text/plain",
          }
        );
        const imageupload = await pinata.upload.file(imageFile);
        console.log(imageupload)

        const imageCid = `https://gateway.pinata.cloud/ipfs/${imageupload.IpfsHash}`;
        imageCIDRef.current = imageCid;
        console.log("test2:", imageCid)

      } catch (error) {
        console.error("An error occurred during image upload:", error);
        setLoading(false);
        return; // Exit if image upload fails
      }
    }

    if (!imageCIDRef.current) {
      console.error("Image CID not set, upload might have failed");
      setLoading(false);
      return;
    }

    try {
      console.log("test upload");
      const responseIPFS = await pinata.upload
        .json({
          contentId: formData.contentId,
          contentTitle: formData.contentTitle,
          contentCreator: formData.contentCreator,
          contentCosts: formData.contentCosts,
          creatorMessage: formData.creatorMessage,
          contentShortDescription: formData.contentShortDescription,
          contentLongDescription: formData.contentLongDescription,
          contentTags: formData.contentTags.join(","),
          numberOfRead: formData.numberOfRead,
          numberOfLikes: formData.numberOfLikes,
          numberOfComments: formData.numberOfComments,
          contentComments: formData.contentComments.join(","),
          contentMedia: imageCIDRef.current,
          contentSupporters: formData.contentSupporters,
        })
        .addMetadata({
          name: formData.contentId,
          keyValues: {
            whimsey: 100,
            description: formData.contentShortDescription,
            author: formData.contentCreator,
          },
        });

      if (responseIPFS) {
        const postCIDValue = responseIPFS.IpfsHash;
        console.log("Post submitted successfully!", responseIPFS);
        const response = await fetch(`${config.apiUrl}/postContentDatabase`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postCID: postCIDValue,
            contentId: formData.contentId,
            contentCreator: formData.contentCreator,
            contentCosts: formData.contentCosts,
            numberOfRead: formData.numberOfRead,
            numberOfLikes: formData.numberOfLikes,
            numberOfComments: formData.numberOfComments,
            contentComments: formData.contentComments.join(","),
            contentSupporters: formData.contentSupporters,
          }),
        });
        if (response.ok) {
          const result = await response.json();
          console.log("POST CID submitted successfully!", result);

          // const contentCreator = formData.contentCreator;
          // const postCID = postCIDValue;
          // deployAndSetCollectionMetadata(postCID, contentCreator);

          setLoading(false);

          router.push({
            pathname: "/profile",
            query: { account: account },
          });
        } else {
          console.error("POST CID submission failed:", response.statusText);
          setLoading(false);
        }
      } else {
        console.error("Form submission failed:", responseIPFS);
        setLoading(false);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <NavBar account={account} />
      <RootLayout>
        <div>
          <h1 className={styles.rowSpace}>Create your post</h1>
          {loading && (
            <div className={styles.spinnerOverlay}>
              <div className={styles.spinnerOverlayContent}>
                <Spinner animation="border" role="status" />
                <div>Processing... Waiting for confirmation</div>
              </div>
            </div>
          )}
          <Form onSubmit={handleSubmit}>
            {isClient && (
              <Tabs
                transition={false}
                id="create-content-tabs"
                className="mb-3"
                activeKey={activeTab}
                onSelect={(k) => handleTabChange(k as string)}
              >
                <Tab
                  eventKey="creator"
                  title={
                    <span style={{ color: "black" }}>Creator Information</span>
                  }
                >
                  <InputGroup className="mb-3">
                    <InputGroup.Text
                      id="basic-addon1"
                      className={styles.inputGroupText}
                    >
                      Content Creator Public Key
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="contentCreator"
                      value={account}
                      onChange={handleChange}
                      placeholder="Your Universal Profile Public Key e.g. 0xfAdAE19e2ed0EA36D2c2B482E0882d2bFC8Be532"
                      aria-label="contentCreator"
                      aria-describedby="basic-addon1"
                      required
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text
                      id="basic-addon1"
                      className={styles.inputGroupText}
                    >
                      Content Price in LYX
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="contentCosts"
                      value={formData.contentCosts}
                      onChange={handleChange}
                      placeholder="Enter the amount of LYX costs for the content"
                      aria-label="contentCosts"
                      aria-describedby="basic-addon1"
                      required
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text
                      id="basic-addon1"
                      className={styles.inputGroupText}
                    >
                      Personalized Message
                    </InputGroup.Text>
                    <Form.Control
                      as="textarea"
                      type="text"
                      name="creatorMessage"
                      value={formData.creatorMessage}
                      onChange={handleChange}
                      placeholder="Enter a personalized message for your readers"
                      aria-label="creatorMessage"
                      aria-describedby="basic-addon1"
                      required
                    />
                  </InputGroup>
                  <div className="d-flex justify-content-end mb-3">
                    <Button
                      variant="dark"
                      onClick={() => handleTabChange("overview")}
                    >
                      Next
                    </Button>
                  </div>
                </Tab>
                <Tab
                  eventKey="overview"
                  title={<span style={{ color: "black" }}>Post Overview</span>}
                >
                  <InputGroup className="mb-3">
                    <InputGroup.Text
                      id="basic-addon1"
                      className={styles.inputGroupText}
                    >
                      Post Picture
                    </InputGroup.Text>
                    <Form.Control
                      type="file"
                      name="contentMedia"
                      onChange={handleFileChange}
                      placeholder="Add an image"
                      aria-label="contentMedia"
                      aria-describedby="basic-addon1"
                      required
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text
                      id="basic-addon1"
                      className={styles.inputGroupText}
                    >
                      Post Title
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="contentTitle"
                      value={formData.contentTitle}
                      onChange={handleChange}
                      placeholder="Enter a post title"
                      aria-label="contentTitle"
                      aria-describedby="basic-addon1"
                      required
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text
                      id="basic-addon1"
                      className={styles.inputGroupTextShort}
                    >
                      Post Description
                    </InputGroup.Text>
                    <Form.Control
                      as="textarea"
                      type="text"
                      name="contentShortDescription"
                      value={formData.contentShortDescription}
                      onChange={handleChange}
                      placeholder="Enter a short description for your post"
                      aria-label="contentShortDescription"
                      aria-describedby="basic-addon1"
                      required
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text
                      id="basic-addon1"
                      className={styles.inputGroupText}
                    >
                      Post Tags
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="contentTags"
                      value={formData.contentTags.join(",")}
                      onChange={handleChange}
                      placeholder="Enter tags for your content"
                      aria-label="contentTags"
                      aria-describedby="basic-addon1"
                      required
                    />
                  </InputGroup>
                  <div className="d-flex justify-content-between mb-3">
                    <Button
                      variant="dark"
                      onClick={() => handleTabChange("creator")}
                    >
                      Back
                    </Button>
                    <Button
                      variant="dark"
                      onClick={() => handleTabChange("post")}
                    >
                      Next
                    </Button>
                  </div>
                </Tab>
                <Tab
                  eventKey="post"
                  title={<span style={{ color: "black" }}>Post Content</span>}
                >
                  <InputGroup className="mb-3">
                    <div className={styles.draftEditorWrapper}>
                      <Editor
                        editorState={editorState}
                        onChange={handleEditorChange}
                        placeholder="Enter the post content"
                      />
                    </div>
                  </InputGroup>
                  <div className="d-flex justify-content-between mb-3">
                    <Button
                      variant="dark"
                      onClick={() => handleTabChange("overview")}
                    >
                      Back
                    </Button>
                    <Button variant="dark" type="submit">
                      Submit
                    </Button>
                  </div>
                </Tab>
              </Tabs>
            )}
          </Form>
        </div>
      </RootLayout>
    </div>
  );
};

export default CreateContentPage;
