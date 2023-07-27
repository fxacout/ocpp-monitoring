import Container from "react-bootstrap/Container";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

export function NavBar({isAdmin, userName, image}: {isAdmin?: boolean, userName?: string, image?: string}) {
  console.log('isAdmin', isAdmin)
  const authorizedHtml = userName ? (
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ml-auto">
        <Nav.Link href="/">Home</Nav.Link>
      </Nav>

      <Nav className="mx-auto">
        <Nav.Link href="/dashboard">Dashboard</Nav.Link>
        <Nav.Link href="/chargepoints">Map</Nav.Link>
      </Nav>
      {isAdmin && <Nav className="mx-auto">
        <Nav.Link href="/user/all">Users</Nav.Link>
        <Nav.Link href="/audit">Audit</Nav.Link>
      </Nav>}
      <Nav className="ms-auto">
        <NavDropdown
          title={`Hi ${userName}`}
          id="basic-nav-dropdown"
        >
          <NavDropdown.Item href="/me">Profile</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={() => signOut()}>
            Sign Out
          </NavDropdown.Item>
        </NavDropdown>
        <Image src={image ||'/user.png'} width={64} height={64} alt={'user image'}/>

        </Nav>
    </Navbar.Collapse>
  ) : (
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ml-auto">
        <Nav.Link href="/">Home</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  );

  return (
    <Navbar
      bg="dark"
      data-bs-theme="dark"
      expand="lg"
      className="bg-body-tertiary"
    >
      <Container fluid>
        <Navbar.Brand href="/">OCPP Monitoring</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {authorizedHtml}
      </Container>
    </Navbar>
  );
}
