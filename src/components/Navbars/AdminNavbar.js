/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/*!

=========================================================
* WOO Dashboard PRO React - v1.0.0
=========================================================

* Product Page: https://www.tony-woo.com/product/woo-dashboard-pro-react
* Copyright 2020 Tony Woo (https://www.tony-woo.com)

* Coded by Tony Woo

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react';
// nodejs library that concatenates classes
import classnames from 'classnames';
// nodejs library to set properties for components
import PropTypes from 'prop-types';
// reactstrap components
import { Collapse, Navbar, NavItem, Nav, Container } from 'reactstrap';

import Notification from './Notifications';
// import QuickLinks from './QuickLinks';
import StarGift from './StarGifts';
import SiderRightBar from './SiderRightBar';
import Profile from './Profile';
// import { SearchForm } from './SearchForm';
import { notificationAlert } from 'variables/common';
import NotificationAlert from 'react-notification-alert';
import * as Color from 'configs/color';
import { connect } from 'react-redux';
import { dynamicApiAxios } from 'configs/api'

class AdminNavbar extends React.Component {

  componentDidMount = () => {
    // const { loggedInUser } = this.props;
    window.addEventListener('beforeunload', async () => {
      try {
        await dynamicApiAxios.query.post('', {
          sqlCommand: '[EBM.SOFTECH.EDU.VN].dbo.p_EBM_UserMyAmes_Update_Offline_Status ',
          parameters: {
            UserId: loggedInUser?.userMyames.UserId,
          },
        });
        // navigator.onLine

      } catch (error) {
        console.log(error);
      }
    })
    window.addEventListener('load', function (e) {
      if (navigator.onLine) {
        console.log('We\'re online!');
      } else {
        console.log('We\'re offline...');
      }
    }, false);

    window.addEventListener('online', function (e) {
      console.log('And we\'re back :).');
    }, false);

    window.addEventListener('offline', function (e) {
      console.log('Connection is down.');
    }, false);
  }

  render() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const defautColor = `navbar-dark bg-${Color.PRIMARY}`;
    return (
      <>
        <div className="rna-wrapper">
          <NotificationAlert ref={notificationAlert} />
        </div>
        <Navbar
          className={classnames(
            'navbar-top navbar-expand border-bottom',
            { [defautColor]: this.props.theme === 'dark' },
            { 'navbar-light bg-secondary': this.props.theme === 'light' }
          )}
        >
          <Container fluid>
            <Collapse navbar isOpen={true}>
              {/* SEARCh FORM */}
              {/* <SearchForm theme={this.props.theme} /> */}

              <Nav className="align-items-center ml-md-auto" navbar>
                <NavItem className="d-xl-none">
                  <div
                    className={classnames(
                      'pr-3 sidenav-toggler',
                      { active: this.props.sidenavOpen },
                      { 'sidenav-toggler-dark': this.props.theme === 'dark' }
                    )}
                    onClick={this.props.toggleSidenav}
                  >
                    <div className="sidenav-toggler-inner">
                      <i className="sidenav-toggler-line" />
                      <i className="sidenav-toggler-line" />
                      <i className="sidenav-toggler-line" />
                    </div>
                  </div>
                </NavItem>

                {/* <NavItem className="d-sm-none">
                  <NavLink
                    onClick={() => {
                      document.body.classList.add('g-navbar-search-showing');
                      setTimeout(function () {
                        document.body.classList.remove(
                          'g-navbar-search-showing'
                        );
                        document.body.classList.add('g-navbar-search-show');
                      }, 150);
                      setTimeout(function () {
                        document.body.classList.add('g-navbar-search-shown');
                      }, 300);
                    }}
                  >
                    <i className="ni ni-zoom-split-in" />
                  </NavLink>
                </NavItem> */}
                {this.props.location.pathname.includes('session') && (
                  <SiderRightBar {...this.props} />
                )}
                {/* NOTIFICATION */}
                {loggedInUser?.typeLogin !== 'teacher' && 
                  <>
                    <StarGift {...this.props} />
                    <Notification {...this.props} />
                  </>
                }
                {/* QUICK LINKS */}
                {/* <QuickLinks /> */}
              </Nav>
              <Nav className='align-items-center ml-auto ml-md-0' navbar>
                {/* PROFILE */}
                <Profile {...this.props} />
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}
AdminNavbar.defaultProps = {
  toggleSidenav: () => { },
  sidenavOpen: false,
  theme: 'dark',
};
AdminNavbar.propTypes = {
  toggleSidenav: PropTypes.func,
  sidenavOpen: PropTypes.bool,
  theme: PropTypes.oneOf(['dark', 'light']),
};

const mapStateToProps = (state) => ({
  loggedInUser: state.loginReducer.loggedInUser,
});

export default connect(mapStateToProps)(AdminNavbar);
