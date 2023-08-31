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
import React from 'react';
// nodejs library to set properties for components
import PropTypes from 'prop-types';
import './auth-header.css'
// reactstrap components
import { Container, Row, Col } from 'reactstrap';
import NotificationAlert from 'react-notification-alert';
import { notificationAlert } from 'variables/common';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

const AuthHeader = (props) => {

  const history = useHistory()

  const loggedInUser = useSelector((rootState) => rootState.loginReducer.loggedInUser)
  const local = localStorage.getItem('loggedInUser');
  React.useEffect(() => {
    if (loggedInUser || local) {
      history.push('/ames/')
    }
  }, [loggedInUser, history, local])

  return (
    <>
      <div className="rna-wrapper">
        <NotificationAlert ref={notificationAlert} />
      </div>
      <div className="header bg-gradient-info header_container">
        <Container>
          <div className="header-body text-center mb-7">
            <Row className="justify-content-center">
              <Col className="px-5" lg="6" md="8" xl="5">
                {props.title ? (
                  <span style={{ fontSize: 50, fontWeight: '500' }} className="text-white">{props.title}</span>
                ) : null}
                {props.lead ? (
                  <p className="text-lead text-white">{props.lead}</p>
                ) : null}
              </Col>
            </Row>
          </div>
        </Container>
        <div className="separator separator-bottom separator-skew zindex-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="fill-default"
              points="2560 0 2560 100 0 100"
            />
          </svg>
        </div>
      </div>
    </>
  );

}

AuthHeader.propTypes = {
  title: PropTypes.string,
  lead: PropTypes.string
};

export default AuthHeader;
