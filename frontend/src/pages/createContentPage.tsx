import styles from "./createContentPage.module.css";
import { Button, Form, InputGroup, Tab, Tabs } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import RootLayout from "../app/layout";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import { ContentDataInterface } from "/Users/sruettimann/lukso_up/frontend/src/components/ContentDataInterface";
import { ImageDataInterface } from "/Users/sruettimann/lukso_up/frontend/src/components/ContentDataInterface";
import { Editor, EditorState, convertToRaw } from "draft-js";
import "draft-js/dist/Draft.css";

const CreateContentPage: React.FC = () => {
  const router = useRouter();
  const [account, setAccount] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("creator"); // Track active tab
  const [formData, setFormData] = useState<ContentDataInterface>({
    contentId: "",
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
  });
  const [imageData, setImageData] = useState<ImageDataInterface>({
    ipfsImage: null,
  });

  const [editorState, setEditorState] = useState(EditorState.createEmpty()); // Draft.js editor state

  useEffect(() => {
    setIsClient(true);
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
    console.log(files);
    if (files && files.length > 0) {
      console.log("ok");
      setImageData((prevState) => ({
        ...prevState,
        ipfsImage: files[0],
      }));
      console.log(imageData);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    const imageFormDataToSend = new FormData();
    const urlPinata = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    // Check if there's an image to upload
    console.log(imageData.ipfsImage)
    if (imageData.ipfsImage) {
      try {
        console.log(imageFormDataToSend)
        console.log(imageData.ipfsImage)
        imageFormDataToSend.append("ipfsImage", imageData.ipfsImage);
        console.log(imageFormDataToSend)

        // Upload image
        const imageUploadResponse = await fetch(urlPinata, {
          method: "POST",
          headers: {
            pinata_api_key: process.env.NEXT_PUBLIC_API_KEY_PINATA as string,
            pinata_secret_api_key: process.env
              .NEXT_PUBLIC_API_SECRET_PINATA as string,
          },
          body: imageFormDataToSend,
        });

        if (!imageUploadResponse.ok) {
          throw new Error(
            `Image upload failed: ${imageUploadResponse.statusText}`
          );
        }

        const imageDataResponse = await imageUploadResponse.json();
        const imageCid = imageDataResponse.IpfsHash;

        // Update form data with image CID
        formDataToSend.append("contentMedia", imageCid);
      } catch (error) {
        console.error("An error occurred during image upload:", error);
        return; // Exit if image upload fails
      }
    }

    formDataToSend.append("contentId", formData.contentId);
    formDataToSend.append("contentTitle", formData.contentTitle);
    formDataToSend.append("contentCreator", formData.contentCreator);
    formDataToSend.append("contentCosts", String(formData.contentCosts));
    formDataToSend.append("creatorMessage", formData.creatorMessage);
    formDataToSend.append(
      "contentShortDescription",
      formData.contentShortDescription
    );
    formDataToSend.append(
      "contentLongDescription",
      formData.contentLongDescription
    );
    formDataToSend.append("contentTags", formData.contentTags.join(","));
    formDataToSend.append("numberOfRead", String(formData.numberOfRead));
    formDataToSend.append("numberOfLikes", String(formData.numberOfLikes));
    formDataToSend.append(
      "numberOfComments",
      String(formData.numberOfComments)
    );
    formDataToSend.append(
      "contentComments",
      formData.contentComments.join(",")
    );

    try {
      const response = await fetch(urlPinata, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: process.env.NEXT_PUBLIC_API_KEY_PINATA as string,
          pinata_secret_api_key: process.env
            .NEXT_PUBLIC_API_SECRET_PINATA as string,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Form submitted successfully!", result);
        router.push({
          pathname: "/profile",
          query: { account: account },
        });
      } else {
        console.error("Form submission failed:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
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
