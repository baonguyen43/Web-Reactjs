import React from 'react';
import { Collapse, NavbarBrand, Navbar, NavItem, NavLink, Nav } from 'reactstrap';

export const DocumentLinks = () => {
  return (
    <React.Fragment>
      <h6 className='navbar-heading p-0 text-muted'>
        <span className='docs-normal'>Documentation</span>
        <span className='docs-mini'>D</span>
      </h6>
      <Nav className='mb-md-3' navbar>
        <NavItem>
          <NavLink href='https://demos.creative-tim.com/argon-dashboard-pro-react/#/documentation/overview?ref=adpr-sidebar' target='_blank'>
            <i className='ni ni-spaceship' />
            <span className='nav-link-text'>Getting started</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href='https://demos.creative-tim.com/argon-dashboard-pro-react/#/documentation/colors?ref=adpr-sidebar' target='_blank'>
            <i className='ni ni-palette' />
            <span className='nav-link-text'>Foundation</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href='https://demos.creative-tim.com/argon-dashboard-pro-react/#/documentation/alert?ref=adpr-sidebar' target='_blank'>
            <i className='ni ni-ui-04' />
            <span className='nav-link-text'>Components</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href='https://demos.creative-tim.com/argon-dashboard-pro-react/#/documentation/charts?ref=adpr-sidebar' target='_blank'>
            <i className='ni ni-chart-pie-35' />
            <span className='nav-link-text'>Plugins</span>
          </NavLink>
        </NavItem>
      </Nav>
    </React.Fragment>
  );
};
