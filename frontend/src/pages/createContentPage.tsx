import styles from "./createContentPage.module.css";
import {
  Button,
  Col,
  Container,
  Row,
  Image,
  Card,
  Form,
  InputGroup,
} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import RootLayout from "../app/layout";
import Link from "next/link";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";

const CreateContentPage: React.FC = () => {
  const router = useRouter();
  const [account, setAccount] = useState("");

  useEffect(() => {
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery as string);
    }
  }, [router.query, account]);

  interface FormData {
    contentCreator: string;
    contentCosts: string;
    creatorMessage: string;
    contentTitle: string;
    contentMedia: File | null; // Adjusted type to allow File or null
    contentShortDescription: string;
    contentLongDescription: string;
    contentTags: string;
  }

  const [formData, setFormData] = useState<FormData>({
    contentCreator: "",
    contentCosts: "",
    creatorMessage: "",
    contentTitle: "",
    contentMedia: null,
    contentShortDescription: "",
    contentLongDescription: "",
    contentTags: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLInputElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      contentCreator: account,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData((prevState: FormData) => ({
        ...prevState,
        contentMedia: files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/postContent", {
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
                value={formData.contentCosts}
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
                value={formData.creatorMessage}
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
                value={formData.contentTitle}
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
                value={formData.contentShortDescription}
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
                value={formData.contentLongDescription}
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
                value={formData.contentTags}
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