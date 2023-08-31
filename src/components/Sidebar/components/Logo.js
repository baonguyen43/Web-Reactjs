import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { NavbarBrand } from 'reactstrap';

// const logoUrl = require('assets/img/LogoSlider.png');

export const Logo = () => {
  const pathname = useHistory().location.pathname;
  return (
    <div>
      <NavbarBrand
        tag={Link}
        to={`${pathname.includes('teacher') ? pathname : '/'}`}
      >
        {/* <img alt='Logo' className='navbar-brand-img' src={logoUrl} /> */}
        <h2 className="text-default mt-2" style={{ fontWeight: 'bold' }}>
          AMES ENGLISH
        </h2>
      </NavbarBrand>
    </div>
  );
};
