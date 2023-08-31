import React from 'react';

import { UncontrolledDropdown, DropdownToggle, UncontrolledTooltip } from 'reactstrap';
import * as ActionTypes from 'components/Sidebar/actions/types'
import '../Notifications/style.css';
import { useDispatch } from 'react-redux';
function SiderRightBar(props) {

  const dispatch = useDispatch();

  const toggleMenuBar = () => {
    dispatch({type: ActionTypes.TOGGLE_MENU_BAR})
  }
  return (
    <UncontrolledDropdown nav>
      <DropdownToggle onClick={toggleMenuBar} className='nav-link' color='' tag='a' style={{ cursor: 'pointer' }}>
      <i id='tooltipSider' className="fas fa-layer-group"></i>
        <UncontrolledTooltip
          delay={0}
          placement="top"
          target="tooltipSider"
        >
          Danh sách khóa học
        </UncontrolledTooltip>
      </DropdownToggle>
    </UncontrolledDropdown>
  );
}

export default SiderRightBar;
