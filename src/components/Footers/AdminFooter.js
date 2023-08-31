/*eslint-disable*/
import React from 'react';
import moment from 'moment';
// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from 'reactstrap';

class Calendar extends React.Component {
  render() {
    return (
      <>
        <Container fluid>
          <footer className='footer pt-4'>
            <Row className='align-items-center justify-content-lg-between'>
              <Col lg='6'>
                <div className='copyright text-center text-lg-left text-muted'>
                  © {moment().format('DD-MM-YYYY')}{' '}
                  <a className='font-weight-bold ml-1 text-default' href='https://ames.edu.vn/' target='_blank'>
                    MY AMES
                  </a>
                </div>
              </Col>
              <Col lg='6'>
                {/* <Nav className='nav-footer justify-content-center justify-content-lg-end'>
                  <NavItem>
                    <NavLink href='https://www.tony-woo.com?ref=adpr-admin-footer' target='_blank'>
                      Tony Woo
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href='https://www.tony-woo.com/presentation?ref=adpr-admin-footer' target='_blank'>
                      About Us
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href='http://blog.tony-woo.com?ref=adpr-admin-footer' target='_blank'>
                      Blog
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href='https://www.tony-woo.com/license?ref=adpr-admin-footer' target='_blank'>
                      License
                    </NavLink>
                  </NavItem>
                </Nav> */}
              </Col>
            </Row>
          </footer>
        </Container>
      </>
    );
  }
}

export default Calendar;
