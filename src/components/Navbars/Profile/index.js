import React from 'react';
import { useDispatch } from 'react-redux';
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
} from 'reactstrap';
import { persistStore } from 'redux-persist'
import './style.css';
import PropTypes from 'prop-types';

const ProFile = (props) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.clear();
    persistStore(props).purge();
    // props.history.push('/')
    dispatch({ type: 'POST_LOGOUT' });
  };

  return (
    <UncontrolledDropdown nav>
      <DropdownToggle
        className="nav-link pr-0"
        color=""
        tag="a"
        style={{ cursor: 'pointer' }}
      >
        <Media className="align-items-center">
          <span className="avatar avatar-sm rounded-circle">
            <img
              alt="Tony Woo"
              src={loggedInUser?.userTeacher?.imageUrl ?? require('assets/img/avatar.PNG')}
            />
          </span>
          <Media className="ml-2 d-none d-lg-block">
            <span className="mb-0 text-sm font-weight-bold"></span>
          </Media>
        </Media>
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem className="noti-title" header tag="div">
          <h6 className="text-overflow m-0">Welcome!</h6>
        </DropdownItem>
        <DropdownItem onClick={() => props.history.push('/ames/Profile')}>
          <i className="ni ni-single-02" />
          <span>My profile</span>
        </DropdownItem>
        
          {loggedInUser?.typeLogin !== 'teacher' && <DropdownItem onClick={() => props.history.push('/ames/calendar')}>
            <i className="ni ni-calendar-grid-58" />
            <span>Calendar</span>
          </DropdownItem>}
        <DropdownItem divider />
        <DropdownItem onClick={handleLogout}>
          <i className="ni ni-user-run" />
          <span>Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

ProFile.propTypes = {
  history: PropTypes.instanceOf(Object)
}

export default ProFile;
