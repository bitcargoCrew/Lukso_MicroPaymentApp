import styles from "./contentPage.module.css";
import { Button, Col, Container, Row, Image, Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import RootLayout from "../app/layout";
import Link from "next/link";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";

const ContentPage: React.FC = () => {
  const [account, setAccount] = useState("");
  const router = useRouter();
  const { query } = router;
  const { paid } = query;

  useEffect(() => {
    const { account } = router.query;
    if (account) {
      setAccount(account as string);
      console.log(account);
    }
  }, [router.query]);

  return (
    <div>
      <NavBar></NavBar>
      <RootLayout>
        {paid === "true" ? (
          <div>
            <Row className={styles.rowSpace}>
              <h1 className={styles.rowSpace}>
                Thank you for supporting my content! Your contribution helps me
                to realize my dream of independence.
              </h1>
            </Row>
            <Row className={styles.rowSpace}>
              <div className={styles.imageContainer}>
                <Image
                  src="/quote_image.jpg"
                  alt="Profile Background Image"
                  className={styles.contentImage}
                />
              </div>
            </Row>
            <Row className={styles.rowSpace}>
              <h1>This is my story</h1>
            </Row>
            <Row className={styles.rowSpace}>
              <div>This story is created by: Userprofile</div>
            </Row>
            <Row className={styles.rowSpace}>
              <div>
                What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
                printing and typesetting industry. Lorem Ipsum has been the
                industry&apos;s standard dummy text ever since the 1500s, when
                an unknown printer took a galley of type and scrambled it to
                make a type specimen book. It has survived not only five
                centuries, but also the leap into electronic typesetting,
                remaining essentially unchanged. It was popularised in the 1960s
                with the release of Letraset sheets containing Lorem Ipsum
                passages, and more recently with desktop publishing software
                like Aldus PageMaker including versions of Lorem Ipsum. Why do
                we use it? It is a long established fact that a reader will be
                distracted by the readable content of a page when looking at its
                layout. The point of using Lorem Ipsum is that it has a
                more-or-less normal distribution of letters, as opposed to using
                &apos;Content here, content here&apos;, making it look like
                readable English. Many desktop publishing packages and web page
                editors now use Lorem Ipsum as their default model text, and a
                search for &apos;lorem ipsum&apos; will uncover many web sites
                still in their infancy. Various versions have evolved over the
                years, sometimes by accident, sometimes on purpose (injected
                humour and the like). Where does it come from? Contrary to
                popular belief, Lorem Ipsum is not simply random text. It has
                roots in a piece of classical Latin literature from 45 BC,
                making it over 2000 years old. Richard McClintock, a Latin
                professor at Hampden-Sydney College in Virginia, looked up one
                of the more obscure Latin words, consectetur, from a Lorem Ipsum
                passage, and going through the cites of the word in classical
                literature, discovered the undoubtable source. Lorem Ipsum comes
                from sections 1.10.32 and 1.10.33 of &quotde Finibus Bonorum et
                Malorum&quot (The Extremes of Good and Evil) by Cicero, written
                in 45 BC. This book is a treatise on the theory of ethics, very
                popular during the Renaissance. The first line of Lorem Ipsum,
                &quotLorem ipsum dolor sit amet..&quot, comes from a line in
                section 1.10.32. The standard chunk of Lorem Ipsum used since
                the 1500s is reproduced below for those interested. Sections
                1.10.32 and 1.10.33 from &quotde Finibus Bonorum et Malorum&quot
                by Cicero are also reproduced in their exact original form,
                accompanied by English versions from the 1914 translation by H.
                Rackham. Where can I get some? There are many variations of
                passages of Lorem Ipsum available, but the majority have
                suffered alteration in some form, by injected humour, or
                randomised words which don&apos;t look even slightly believable.
                If you are going to use a passage of Lorem Ipsum, you need to be
                sure there isn&apos;t anything embarrassing hidden in the middle
                of text. All the Lorem Ipsum generators on the Internet tend to
                repeat predefined chunks as necessary, making this the first
                true generator on the Internet. It uses a dictionary of over 200
                Latin words, combined with a handful of model sentence
                structures, to generate Lorem Ipsum which looks reasonable. The
                generated Lorem Ipsum is therefore always free from repetition,
                injected humour, or non-characteristic words etc.
              </div>
            </Row>
          </div>
        ) : (
          <div className={styles.containerErrorPage}>
            <h1>You are not authorized to view this page.</h1>
            <h1>Please make a payment to access this page.</h1>
          </div>
        )}
      </RootLayout>
    </div>
  );
};

export default ContentPage;
