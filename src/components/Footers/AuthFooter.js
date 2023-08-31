/*eslint-disable*/
import React from 'react';

// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from 'reactstrap';
import "./AuthFooter.css"

class Login extends React.Component {
  render() {
    return (
      <>
        <footer className='footer_container' id='footer-main'>
          <Container>
            <Row className='align-items-center justify-content-xl-between'>
              <Col xl='6'>
                <div className='copyright text-center text-xl-left text-muted'>
                  © {new Date().getFullYear()}{' '}
                  <a className='font-weight-bold ml-1' href='https://ames.edu.vn/' target='_blank' style={{ color: '#1890F5' }}>
                    MY AMES
                  </a>
                </div>
              </Col>
              <Col xl='6'>
                <Nav className='nav-footer justify-content-center justify-content-xl-end'>
                  <NavItem>
                    <NavLink className="footer-item" href='https://www.tony-woo.com?ref=adpr-auth-footer' target='_blank'>
                      My Ames
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="footer-item" href='https://ames.edu.vn/gioi-thieu-ve-ames' target='_blank'>
                      About Us
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="footer-item" href='https://ames.edu.vn/' target='_blank'>
                      Blog
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="footer-item" href='#'>
                      License
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
          </Container>
        </footer>
      </>
    );
  }
}

export default Login;
