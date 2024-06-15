import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import Link from "next/link";
import styles from "./NavBar.module.css";

interface NavBarProps {
  account: string;
}

const NavBar: React.FC<NavBarProps> = ({ account }) => {
  return (
    <div>
      <Navbar expand="lg" bg="dark" data-bs-theme="dark" sticky="top">
        <Container>
          <Navbar.Brand>Quill</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link
                href={{
                  pathname: "/profile",
                  query: { account: account },
                }}
                style={{ textDecoration: 'none' }}
              >
                <div className={styles.navLink}>Content Overview</div>
              </Link>
              <Link
                href={{
                  pathname: "/socialLeaderboard",
                  query: { account: account },
                }}
                style={{ textDecoration: 'none' }}
              >
                <div className={styles.navLinkSocial}>Social Leaderboard</div>
              </Link>
              <div className={styles.centeredButton}>
                <Link
                  href={{
                    pathname: "/createContentPage",
                    query: { account: account },
                  }}
                >
                  <Button variant="light">Create Post</Button>
                </Link>
              </div>
            </Nav>
            <div className="justify-content-end">
              <Link
                href={{
                  pathname: "/",
                }}
              >
                <Button variant="success">Logout</Button>
              </Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
