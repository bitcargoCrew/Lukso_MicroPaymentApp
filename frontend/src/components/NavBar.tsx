import React from "react";
import { Button, Container, Nav, Navbar, Col } from "react-bootstrap";
import Link from "next/link";
import styles from "./NavBar.module.css";
import ProfileHeader from "./ProfileHeader";
import Balance from "../components/Balance";

interface NavBarProps {
  account: string;
}

const NavBar: React.FC<NavBarProps> = ({ account }) => {
  return (
    <div>
      <Navbar expand="lg" bg="dark" data-bs-theme="dark" sticky="top">
        <Container>
          <Navbar.Brand>
            <Link
              href={{
                pathname: "/",
              }}
              style={{ textDecoration: "none" }}
            >
              <div className={styles.navLink}>Quill</div>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="d-flex align-items-center me-auto">
              <Nav.Item>
                <Link
                  href={{
                    pathname: "/profile",
                    query: { account: account },
                  }}
                  style={{ textDecoration: "none" }}
                >
                  <div className={styles.navLink}>Content Overview</div>
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link
                  href={{
                    pathname: "/socialLeaderboard",
                    query: { account: account },
                  }}
                  style={{ textDecoration: "none" }}
                >
                  <div className={styles.navLinkSocial}>Social Leaderboard</div>
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link
                  href={{
                    pathname: "/createContentPage",
                    query: { account: account },
                  }}
                >
                  <Button variant="light">Create Post</Button>
                </Link>
              </Nav.Item>
            </Nav>
            <Nav className="d-flex align-items-center ms-auto">
              <Nav.Item>
                <ProfileHeader account={account} />
              </Nav.Item>
              <Nav.Item>
                <div className={styles.navBalance}>
                  <Balance account={account} />
                </div>
              </Nav.Item>
              <Nav.Item>
                <Link
                  href={{
                    pathname: "/",
                  }}
                >
                  <Button variant="success">Logout</Button>
                </Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
