import styles from "./createContentPage.module.css";
import { Button, Form, InputGroup} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import RootLayout from "../app/layout";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import ContentDataInterface from "@/components/ContentDataInterface";
import config from "../../config";

const CreateContentPage: React.FC = () => {
  const router = useRouter();
  const [account, setAccount] = useState("");

  useEffect(() => {
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery as string);
    }
  }, [router.query, account]);

  const [formData, setFormData] = useState<ContentDataInterface>({
    contentId: "",
    contentDetails: {
      contentTitle: "",
      contentMedia: null,
      contentCreator: "",
      contentCosts: 0,
      creatorMessage: "",
      contentShortDescription: "",
      contentLongDescription: "",
      contentTags: [""],
      numberOfRead: 0,
      numberOfLikes: 0,
      numberOfComments: 0,
      contentComments: [""],
    }
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      contentDetails: {
        ...prevState.contentDetails,
        contentCreator: account,
        [name]: value,
      },
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData((prevState: ContentDataInterface) => ({
        ...prevState,
        contentDetails: {
          ...prevState.contentDetails,
          contentMedia: files[0],
        }
      }));
    }
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${config.apiUrl}/postContent`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await response.json();
        console.log("Form submitted successfully!");
        // Redirect to profile page after successful form submission
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

  return (
    <div>
      <NavBar account={account}></NavBar>
      <RootLayout>
        <div className={styles.containerHeight}>
          <h1 className={styles.rowSpace}>Create your post</h1>
          <Form onSubmit={handleSubmit}>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                Content Creator
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
              <InputGroup.Text id="basic-addon1">Content Price</InputGroup.Text>
              <Form.Control
                type="number"
                name="contentCosts"
                value={formData.contentDetails.contentCosts}
                onChange={handleChange}
                placeholder="Enter the amount of LYX costs for the content"
                aria-label="contentCosts"
                aria-describedby="basic-addon1"
                required
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                Creator Message
              </InputGroup.Text>
              <Form.Control
                as="textarea"
                type="text"
                name="creatorMessage"
                value={formData.contentDetails.creatorMessage}
                onChange={handleChange}
                placeholder="Enter a personalized message for your readers"
                aria-label="creatorMessage"
                aria-describedby="basic-addon1"
                required
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">Post Title</InputGroup.Text>
              <Form.Control
                type="text"
                name="contentTitle"
                value={formData.contentDetails.contentTitle}
                onChange={handleChange}
                placeholder="Enter a post title"
                aria-label="contentTitle"
                aria-describedby="basic-addon1"
                required
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <Form.Control
                type="file"
                name="contentMedia"
                onChange={handleFileChange}
                placeholder="Add an image"
                aria-label="contentMedia"
                aria-describedby="basic-addon1"
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                Short Description Content
              </InputGroup.Text>
              <Form.Control
                as="textarea"
                type="text"
                name="contentShortDescription"
                value={formData.contentDetails.contentShortDescription}
                onChange={handleChange}
                placeholder="Enter a short description for your post"
                aria-label="contentShortDescription"
                aria-describedby="basic-addon1"
                required
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">Post Content</InputGroup.Text>
              <Form.Control
                as="textarea"
                type="text"
                name="contentLongDescription"
                value={formData.contentDetails.contentLongDescription}
                onChange={handleChange}
                placeholder="Enter the post content"
                aria-label="contentLongDescription"
                aria-describedby="basic-addon1"
                required
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">Post Tags</InputGroup.Text>
              <Form.Control
                type="text"
                name="contentTags"
                value={formData.contentDetails.contentTags}
                onChange={handleChange}
                placeholder="Enter tags for your content"
                aria-label="contentTags"
                aria-describedby="basic-addon1"
                required
              />
            </InputGroup>
            <Button variant="dark" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </RootLayout>
    </div>
  );
};

export default CreateContentPage;