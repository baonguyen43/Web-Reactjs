/* eslint-disable react/prop-types */
/* eslint-disable react/no-string-refs */
/* !

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
// react library for routing
import { Route, Switch, Redirect } from 'react-router-dom';
// core components
import AdminNavbar from 'components/Navbars/AdminNavbar.js';
// import AdminFooter from 'components/Footers/AdminFooter.js';
import Sidebar from 'components/Sidebar';
import SiderBarRight from 'components/Sidebar/components/SiderBarRight';
import { connect } from 'react-redux';
import routes from 'routes';

import styles from './Admin.module.css';
import PropTypes from 'prop-types';

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidenavOpen: true,
    };
    // this.toggleMenuFirstLoad()
  }

  componentDidMount() {
    if (this.state.sidenavOpen) {
      document.body.classList.add('g-sidenav-pinned');
      document.body.classList.remove('g-sidenav-hidden');
    } else {
      document.body.classList.remove('g-sidenav-pinned');
      document.body.classList.add('g-sidenav-hidden');
    }
  }

  componentDidUpdate(e) {
    if (e.history.pathname !== e.location.pathname) {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainContent.scrollTop = 0;
    }
  }
  getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === '/ames') {
        return <Route exact={prop.exact} path={prop.layout + prop.path} component={prop.component} key={key} />;
      } else {
        return null;
      }
    });
  };
  getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (this.props.location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return 'Brand';
  };
  // toggles collapse between mini sidenav and normal
  toggleSidenav = (e) => {
    if (document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-pinned');
      document.body.classList.add('g-sidenav-hidden');
    } else {
      document.body.classList.add('g-sidenav-pinned');
      document.body.classList.remove('g-sidenav-hidden');
    }
    this.setState({
      sidenavOpen: !this.state.sidenavOpen,
    });
    // localStorage.setItem('sidenavOpen', !this.state.sidenavOpen)
  };
  getNavbarTheme = () => {
    return this.props.location.pathname.indexOf('ames/alternative-dashboard') === -1 ? 'dark' : 'light';
  };

  render() {
    const { sidenavOpen } = this.state;
    const { loggedInUser, sidenavOpenRight } = this.props;
    // Id = 88933 là tài khoản koala house (tài khoản: koalademo, mật khẩu: koalahouse), chỉ riêng tài khoản đó là ẩn Sidebar
    const koalaHouseAccount = loggedInUser && loggedInUser.userMyai && loggedInUser.userMyai.Id === 88933;
    const filtedRoutes = loggedInUser.userTeacher
      ? routes.filter((x) => x.role === 'teacher')
      : routes.filter((x) => x.role === 'student');
    return (
      <>
        {!koalaHouseAccount && (
          <Sidebar {...this.props} routes={routes} toggleSidenav={this.toggleSidenav} sidenavOpen={sidenavOpen} />
        )}

        <div ref="mainContent" className={`main-content ${styles.container}`} onClick={this.closeSidenav}>
          {/* Header */}
          <AdminNavbar
            {...this.props}
            theme={this.getNavbarTheme()}
            toggleSidenav={this.toggleSidenav}
            sidenavOpen={sidenavOpen}
            brandText={this.getBrandText(this.props.location.pathname)}
          />

          {/* Content */}
          <div className={styles.container}>
            <Switch>
              {this.getRoutes(filtedRoutes)}
              {loggedInUser.userTeacher && <Redirect from="*" to="/ames/teacher/assigments-management" />}
              {koalaHouseAccount ? <Redirect from="*" to="/ames/classes" /> : <Redirect from="*" to="/ames/share" />}
            </Switch>
          </div>

          {!sidenavOpenRight && <SiderBarRight {...this.props} />}

          {/* Footer */}
          {/* <AdminFooter  {...this.props} /> */}
        </div>
        {sidenavOpen ? <div className="backdrop d-xl-none" onClick={this.toggleSidenav} /> : null}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedInUser: state.teacherReducer.loggedInUser ?? state.loginReducer.loggedInUser,
  sidenavOpenRight: state.toggleSidenavReducer.isVisibled,
});

Admin.propTypes = {
  loggedInUser: PropTypes.object,
};

export default connect(mapStateToProps)(Admin);
