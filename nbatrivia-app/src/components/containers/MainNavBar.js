import React, { useContext } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import "./Navbar.css";
import { UserContext } from "../context/UserContext";

function MainNavBar() {
  const history = useHistory();
  const { user, setUser } = useContext(UserContext);
  return (
    <Navbar variant="dark" className="color-nav" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand>Basketball Stats Master</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink
              to="/authenticate"
              className="navLinkInactive"
              activeClassName="navLinkActive"
            >
              Sign In
            </NavLink>
            <NavLink
              to="/game"
              className="navLinkInactive"
              activeClassName="navLinkActive"
            >
              Game
            </NavLink>
            <NavLink
              to="/aboutMe"
              className="navLinkInactive"
              activeClassName="navLinkActive"
            >
              About Me
            </NavLink>
            {user && (
              <Navbar.Text className="user">{`Signed in as: ${user.username}`}</Navbar.Text>
            )}
            {user && (
              <Navbar.Text className="logout">
                <Button
                  variant="outline-danger"
                  onClick={() => {
                    setUser(null);
                    localStorage.removeItem("userData");
                    history.push("/authenticate");
                  }}
                >
                  Log Out
                </Button>
              </Navbar.Text>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
// simple react-bootstrap navbar pretty much right out of the box. Used react-router NavLinks inside it because they make it easy to add active/inactive styling

export default MainNavBar;
