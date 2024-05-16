import React, { ReactNode } from "react";
import styles from "./globals.module.css";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <div className={styles.background}>
      <Container className={styles.mainContainer}>{children}</Container>
    </div>
  );
};

export default RootLayout;