import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import Link from "next/link";

const NavBar: React.FC = () => {
  return (
    <div>
      <Navbar expand="lg" bg="dark" data-bs-theme="dark" sticky="top">
        <Container>
          <Navbar.Brand href="#home">Quill</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Profile</Nav.Link>
              <Nav.Link href="#solution">Purchased Content</Nav.Link>
              <Nav.Link href="#solution">Explore Content</Nav.Link>
              <Nav.Link href="#story">Content Editor</Nav.Link>
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
