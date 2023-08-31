import React from 'react';

import { UncontrolledDropdown, DropdownToggle, UncontrolledTooltip } from 'reactstrap';

import '../Notifications/style.css';

function StarGifts(props) {
  return (
    <UncontrolledDropdown nav>
      <DropdownToggle onClick={()=>props.history.push('/ames/gifts')} className='nav-link' color='' tag='a' style={{ cursor: 'pointer' }}>
        <i id='tooltipStar' className="fas fa-star"></i>
        <UncontrolledTooltip
          delay={0}
          placement="top"
          target="tooltipStar"
        >
          Sao và quà tặng
        </UncontrolledTooltip>
      </DropdownToggle>
    </UncontrolledDropdown>
  );
}

export default StarGifts;
