import React from 'react';
// react library for routing
import { NavLink as NavLinkRRD } from 'react-router-dom';
// nodejs library that concatenates classes
import classnames from 'classnames';
// nodejs library to set properties for components
import { PropTypes } from 'prop-types';
// react library that creates nice scrollbar on windows devices
import PerfectScrollbar from 'react-perfect-scrollbar';
// reactstrap components
import { Collapse, Navbar, NavItem, NavLink, Nav } from 'reactstrap';
import { Logo } from './components/Logo';
// import { connect } from 'react-redux';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseOpen: false,
      ...this.getCollapseStates(props.routes),
    };
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute = (routeName) => {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'active' : '';
  };
  // makes the sidenav normal on hover (actually when mouse enters on it)
  onMouseEnterSidenav = () => {
    if (!document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.add('g-sidenav-show');
    }
  };
  // makes the sidenav mini on hover (actually when mouse leaves from it)
  onMouseLeaveSidenav = () => {
    if (!document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-show');
    }
  };
  // toggles collapse between opened and closed (true/false)
  toggleCollapse = () => {
    this.setState({
      collapseOpen: !this.state.collapseOpen,
    });
  };
  // closes the collapse
  closeCollapse = () => {
    this.setState({
      collapseOpen: false,
    });
  };
  // this creates the intial state of this component based on the collapse routes
  // that it gets through this.props.routes
  getCollapseStates = (routes) => {
    let initialState = {};
    routes.map((prop) => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: this.getCollapseInitialState(prop.views),
          ...this.getCollapseStates(prop.views),
          ...initialState,
        };
      }
      return null;
    });
    return initialState;
  };
  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  // while on the src/views/forms/RegularForms.js - route /admin/regular-forms
  getCollapseInitialState(routes) {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && this.getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (window.location.href.indexOf(routes[i].path) !== -1) {
        return true;
      }
    }
    return false;
  }
  // this is used on mobile devices, when a user navigates
  // the sidebar will autoclose
  closeSidenav = () => {
    if (window.innerWidth < 1200) {
      this.props.toggleSidenav();
    }
  };
  // this function creates the links and collapses that appear in the sidebar (left menu)
  createLinks = (routes) => {
    const isTeacher = this.props.loggedInUser?.typeLogin === 'teacher';
    let cloneRoutes = routes;
    if (isTeacher) {
      cloneRoutes = routes.filter((x) => x.role === 'teacher');
    } else {
      cloneRoutes = routes.filter((x) => x.role !== 'teacher');
    }
    const arrayDisibled =
      'Dashboard-Login-IELTSMindSet-Register-Choose-List-Sessions-Assignments-MixQuestions-Questions-Results-Profile-Notifications-Calendar-Star & Gifts';
    return cloneRoutes.map((prop, key) => {
      if (prop.showInSidebar === false) {
        return null;
      }

      if (prop.redirect) {
        return null;
      }

      if (arrayDisibled.includes(prop.name)) return null;

      // if(prop.name === 'Quản lý lịch' && this.props.loggedInUser?.typeLogin !== 'ames') return null;
      if (prop.collapse) {
        var st = {};
        st[prop['state']] = !this.state[prop.state];
        return (
          <NavItem key={key}>
            <NavLink
              href="#pablo"
              data-toggle="collapse"
              aria-expanded={this.state[prop.state]}
              className={classnames({
                active: this.getCollapseInitialState(prop.views),
              })}
              onClick={(e) => {
                e.preventDefault();
                this.setState(st);
              }}
            >
              {prop.icon ? (
                <>
                  <i className={prop.icon} />
                  <span className="nav-link-text" style={{ fontSize: 15 }}>
                    {prop.name}
                  </span>
                </>
              ) : prop.miniName ? (
                <>
                  <span className="sidenav-mini-icon"> {prop.miniName} </span>
                  <span className="sidenav-normal"> {prop.name} </span>
                </>
              ) : null}
            </NavLink>
            <Collapse isOpen={this.state[prop.state]}>
              <Nav className="nav-sm flex-column">
                {this.createLinks(prop.views)}
              </Nav>
            </Collapse>
          </NavItem>
        );
      }
      return (
        <NavItem
          className={this.activeRoute(prop.layout + prop.path)}
          key={key}
        >
          <NavLink
            to={prop.layout + prop.path}
            activeClassName=""
            onClick={this.closeSidenav}
            tag={NavLinkRRD}
          >
            {prop.icon !== undefined ? (
              <>
                <i className={prop.icon} />
                <span className="nav-link-text" style={{ fontSize: 15 }}>
                  {prop.name}
                </span>
              </>
            ) : prop.miniName !== undefined ? (
              <>
                <span className="sidenav-mini-icon" style={{ fontSize: 15 }}>
                  {' '}
                  {prop.miniName}{' '}
                </span>
                <span className="sidenav-normal" style={{ fontSize: 15 }}>
                  {' '}
                  {prop.name}{' '}
                </span>
              </>
            ) : (
              prop.name
            )}
          </NavLink>
        </NavItem>
      );
    });
  };

  render() {
    const { routes } = this.props;

    const scrollBarInner = (
      <div className="scrollbar-inner">
        <div className="sidenav-header d-flex align-items-center">
          {/* LOGO */}
          <Logo />
          <div className="ml-auto">
            <div
              className={classnames(
                'sidenav-toggler d-sm-block d-md-none d-xl-block pr-3',
                {
                  active: this.props.sidenavOpen,
                }
              )}
              onClick={this.props.toggleSidenav}
            >
              <div className="sidenav-toggler-inner">
                <i className="sidenav-toggler-line" />
                <i className="sidenav-toggler-line" />
                <i className="sidenav-toggler-line" />
              </div>
            </div>
          </div>
        </div>
        <div className="navbar-inner">
          <Collapse navbar isOpen={true}>
            {/* MENU ITEMS */}
            <Nav navbar>{this.createLinks(routes)}</Nav>

            <hr className="my-3" />
            {/* DOCUMENT LINKS */}
          </Collapse>
        </div>
      </div>
    );
    return (
      <Navbar
        onMouseEnter={this.onMouseEnterSidenav}
        onMouseLeave={this.onMouseLeaveSidenav}
        className={
          'sidenav navbar-vertical navbar-expand-xs navbar-light bg-white ' +
          (this.props.rtlActive ? 'fixed-right' : 'fixed-left')
        }
      >
        {navigator.platform.indexOf('Win') > -1 ? (
          <PerfectScrollbar>{scrollBarInner}</PerfectScrollbar>
        ) : (
          scrollBarInner
        )}
      </Navbar>
    );
  }
}

Sidebar.defaultProps = {
  routes: [{}],
  toggleSidenav: () => {},
  sidenavOpen: false,
  rtlActive: false,
};

Sidebar.propTypes = {
  // function used to make sidenav mini or normal
  toggleSidenav: PropTypes.func,
  // prop to know if the sidenav is mini or normal
  sidenavOpen: PropTypes.bool,
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  // rtl active, this will make the sidebar to stay on the right side
  rtlActive: PropTypes.bool,
  loggedInUser: PropTypes.object,
  location: PropTypes.object,
};
// const mapStateToProps = (state) => {
// console.log('🚀 ~ file: index.js ~ line 219 ~ mapStateToProps ~ state', state)

//   return {
//   loggedInUser:state.loginReducer.loggedInUser
//   }
// };

export default Sidebar;
