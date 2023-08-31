import React from 'react';
import moment from 'moment';
import { DropdownMenu, DropdownItem, UncontrolledDropdown, DropdownToggle, ListGroupItem, ListGroup, Row, Col } from 'reactstrap';

export default () => {
  return (
    <UncontrolledDropdown nav>
      <DropdownToggle className='nav-link' color='' tag='a' style={{ cursor: 'pointer' }}>
        <i className='ni ni-ungroup' />
      </DropdownToggle>
      <DropdownMenu className='dropdown-menu-lg dropdown-menu-dark bg-default' right>
        <Row className='shortcuts px-4'>
          <Col className='shortcut-item' href='#pablo' onClick={(e) => e.preventDefault()} xs='4' tag='a'>
            <span className='shortcut-media avatar rounded-circle bg-gradient-red'>
              <i className='ni ni-calendar-grid-58' />
            </span>
            <small>Calendar</small>
          </Col>
          <Col className='shortcut-item' href='#pablo' onClick={(e) => e.preventDefault()} xs='4' tag='a'>
            <span className='shortcut-media avatar rounded-circle bg-gradient-orange'>
              <i className='ni ni-email-83' />
            </span>
            <small>Email</small>
          </Col>
          <Col className='shortcut-item' href='#pablo' onClick={(e) => e.preventDefault()} xs='4' tag='a'>
            <span className='shortcut-media avatar rounded-circle bg-gradient-info'>
              <i className='ni ni-credit-card' />
            </span>
            <small>Payments</small>
          </Col>
          <Col className='shortcut-item' href='#pablo' onClick={(e) => e.preventDefault()} xs='4' tag='a'>
            <span className='shortcut-media avatar rounded-circle bg-gradient-green'>
              <i className='ni ni-books' />
            </span>
            <small>Reports</small>
          </Col>
          <Col className='shortcut-item' href='#pablo' onClick={(e) => e.preventDefault()} xs='4' tag='a'>
            <span className='shortcut-media avatar rounded-circle bg-gradient-purple'>
              <i className='ni ni-pin-3' />
            </span>
            <small>Maps</small>
          </Col>
          <Col className='shortcut-item' href='#pablo' onClick={(e) => e.preventDefault()} xs='4' tag='a'>
            <span className='shortcut-media avatar rounded-circle bg-gradient-yellow'>
              <i className='ni ni-basket' />
            </span>
            <small>Shop</small>
          </Col>
        </Row>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};
