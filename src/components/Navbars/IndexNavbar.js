/*!

=========================================================
* Argon Dashboard PRO React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// react library for routing
import { Link } from "react-router-dom";
// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
  Button,
} from "reactstrap";

class AdminNavbar extends React.Component {
  render() {
    return (
      <>
        <Navbar
          className="navbar-horizontal navbar-main navbar-dark bg-info"
          expand="lg"
          id="navbar-main"
        >
          <Container>
            <NavbarBrand to="/" tag={Link}>
              <h2 className="display-5 text-white mt-2">AMES ENGLISH</h2>
            </NavbarBrand>
            <button
              aria-controls="navbar-collapse"
              aria-expanded={false}
              aria-label="Toggle navigation"
              className="navbar-toggler"
              data-target="#navbar-collapse"
              data-toggle="collapse"
              id="navbar-collapse"
              type="button"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <UncontrolledCollapse
              className="navbar-custom-collapse"
              navbar
              toggler="#navbar-collapse"
            >
              <div className="navbar-collapse-header">
                <Row>
                  <Col className="collapse-brand" xs="6">
                    <Link to="/admin/">
                      <img
                        alt="..."
                        src={require('assets/img/LogoSlider.png')}
                      />
                    </Link>
                  </Col>
                  <Col className="collapse-close" xs="6">
                    <button
                      aria-controls="navbar-collapse"
                      aria-expanded={false}
                      aria-label="Toggle navigation"
                      className="navbar-toggler"
                      data-target="#navbar-collapse"
                      data-toggle="collapse"
                      id="navbar-collapse"
                      type="button"
                    >
                      <span />
                      <span />
                    </button>
                  </Col>
                </Row>
              </div>
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <NavLink href="https://ames.edu.vn/tin-tuc" target="_blank">
                    <span className="nav-link-inner--text">Tin tức</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/auth/login" tag={Link}>
                    <span className="nav-link-inner--text">Đăng nhập</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/auth/register" tag={Link}>
                    <span className="nav-link-inner--text">Đăng ký</span>
                  </NavLink>
                </NavItem>
              </Nav>
              <hr className="d-lg-none" />
              <Nav className="align-items-lg-center ml-lg-auto" navbar>
                <NavItem>
                  <NavLink
                    className="nav-link-icon"
                    href="https://www.facebook.com/AnhNguAMES/"
                    id="tooltip601201423"
                    target="_blank"
                  >
                    <i className="fab fa-facebook-square" />
                    <span className="nav-link-inner--text d-lg-none">
                      Facebook
                    </span>
                  </NavLink>
                  <UncontrolledTooltip delay={0} target="tooltip601201423">
                    Like us on Facebook
                  </UncontrolledTooltip>
                </NavItem>
                <NavItem>
                  <NavLink
                    className="nav-link-icon"
                    href="https://www.youtube.com/channel/UCWd4ZpokmP2oeL5hQ0ZDk0A"
                    id="tooltip871243015"
                    target="_blank"
                  >
                    <i className="fab fa-youtube" />
                    <span className="nav-link-inner--text d-lg-none">
                      Youtube
                    </span>
                  </NavLink>
                  <UncontrolledTooltip delay={0} target="tooltip871243015">
                    Follow us on Youtube
                  </UncontrolledTooltip>
                </NavItem>
                <NavItem>
                  <NavLink
                    className="nav-link-icon"
                    href="#"
                    id="tooltip366258619"
                  // target="_blank"
                  >
                    <i className="fab fa-twitter-square" />
                    <span className="nav-link-inner--text d-lg-none">
                      Twitter
                    </span>
                  </NavLink>
                  <UncontrolledTooltip delay={0} target="tooltip366258619">
                    Follow us on Twitter
                  </UncontrolledTooltip>
                </NavItem>
                <NavItem>
                  <NavLink
                    className="nav-link-icon"
                    href="#"
                    id="tooltip931502898"
                  // target="_blank"
                  >
                    <i className="fab fa-github" />
                    <span className="nav-link-inner--text d-lg-none">
                      Github
                    </span>
                  </NavLink>
                  <UncontrolledTooltip delay={0} target="tooltip931502898">
                    Star us on Github
                  </UncontrolledTooltip>
                </NavItem>
                <NavItem className="d-none d-lg-block ml-lg-4">
                  <Button
                    className="btn-neutral btn-icon"
                    color="default"
                    href="https://ames.edu.vn/lien-he"
                    target="_blank"
                  >
                    {/* <span className="btn-inner--icon">
                      <i className="fas fa-shopping-cart mr-2" />
                    </span> */}
                    <span className="nav-link-inner--text">Liên hệ ngay</span>
                  </Button>
                </NavItem>
              </Nav>
            </UncontrolledCollapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default AdminNavbar;
