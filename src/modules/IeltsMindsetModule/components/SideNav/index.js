import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './styles.css';

const SideNav = (props) => {
  //#region Turn on or off the menu bar.

  const [isOpen, setIsOpen] = useState(props.opendDefault);

  const handleOpenNav = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  //#endregion

  //#region Click outside the opened menu.

  const toggleContainerRef = useRef();

  const onClickOutSideHandler = useCallback(
    (event) => {
      if (isOpen && !toggleContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    },
    [isOpen]
  );

  useEffect(() => {
    window.addEventListener('mousedown', onClickOutSideHandler);
    return () => {
      window.removeEventListener('mousedown', onClickOutSideHandler);
    };
  }, [onClickOutSideHandler]);

  //#endregion

  //#region Render.

  return (
    <div ref={toggleContainerRef}>
      <div className="mysidenav" style={{ width: isOpen ? props.width : 0, zIndex: 2 }}>
        <div className="closebtn" onClick={handleOpenNav}>
          &times;
        </div>
        <div className="title">{props.title}</div>
        <div className="content">{props.content}</div>
      </div>

      <div className="main">
        <span onClick={handleOpenNav}>
          <i className="fas fa-bars" />
        </span>
      </div>
    </div>
  );

  //#endregion
};

//#region Type Checking

SideNav.propTypes = {
  content: PropTypes.object,
  title: PropTypes.string,
  width: PropTypes.number,
  opendDefault: PropTypes.bool,
};

SideNav.defaultProps = {
  title: '',
  width: 250,
  opendDefault: false,
};

//#endregion

export default SideNav;
