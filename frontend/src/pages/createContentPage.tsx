import styles from "./createContentPage.module.css";
import { Button, Form, InputGroup } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import RootLayout from "../app/layout";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import ContentDataInterface from "@/components/ContentDataInterface";
import config from "../../config";

const CreateContentPage: React.FC = () => {
  const router = useRouter();
  const [account, setAccount] = useState<string>("");

  useEffect(() => {
    const accountQuery = router.query.account as string;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery);
    }
  }, [router.query.account, account]);

  const [formData, setFormData] = useState<ContentDataInterface>({
    contentId: "",
    contentTitle: "",
    contentMedia: null,
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
      setFormData((prevState) => ({
        ...prevState,
        contentMedia: files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSend = new FormData();
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

    if (formData.contentMedia) {
      formDataToSend.append("contentMedia", formData.contentMedia);
    }

    try {
      const response = await fetch(`${config.apiUrl}/postContent`, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Form submitted successfully!", result);
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
      <NavBar account={account} />
      <RootLayout>
        <div>
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
              <InputGroup.Text id="basic-addon1">Post Picture</InputGroup.Text>
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
                value={formData.contentTags.join(",")}
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
