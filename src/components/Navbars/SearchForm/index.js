import React from 'react';
import classnames from 'classnames';
import {  FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup} from 'reactstrap';

export const SearchForm = ({ theme }) => {
  // function that on mobile devices makes the search open
  // const openSearch = () => {};

  // function that on mobile devices makes the search close
  const closeSearch = () => {
    document.body.classList.remove('g-navbar-search-shown');
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-show');
      document.body.classList.add('g-navbar-search-hiding');
    }, 150);
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-hiding');
      document.body.classList.add('g-navbar-search-hidden');
    }, 300);
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-hidden');
    }, 500);
  };

  return (
    <Form className={classnames('navbar-search form-inline mr-sm-3', { 'navbar-search-light': theme === 'dark' }, { 'navbar-search-dark': theme === 'light' })}>
      <FormGroup className='mb-0'>
        <InputGroup className='input-group-alternative input-group-merge'>
          <InputGroupAddon addonType='prepend'>
            <InputGroupText>
              <i className='fas fa-search' />
            </InputGroupText>
          </InputGroupAddon>
          <Input placeholder='Search' type='text' />
        </InputGroup>
      </FormGroup>
      <button aria-label='Close' className='close' type='button' onClick={closeSearch}>
        <span aria-hidden={true}>×</span>
      </button>
    </Form>
  );
};
