import React from 'react';
import classNames from 'classnames';
import { Button } from 'antd';
import PropTypes from 'prop-types';

const ButtonCustom = (props) => {
  const btnClass = ['ames__btn'];

  return (
    <Button
      // iconLeft={props.iconLeft}
      // iconRight={props.iconRight}
      size="large"
      className={classNames(...btnClass)}
      style={props.style ? props.style : { margin: 8 }}
      onClick={props.onClick}
      disabled={props.disabled ? props.disabled : false}
    >
      {props.iconLeft && <span style={{ marginRight: 8 }}>{props.iconLeft}</span>}
      {props.value}
      {props.iconRight && <span style={{ marginLeft: 8 }}>{props.iconRight}</span>}
    </Button>
  );
}

ButtonCustom.propTypes = {
  style:PropTypes.instanceOf(Object),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  iconLeft: PropTypes.string,
  iconRight: PropTypes.string,
  value: PropTypes.string,
}
export default ButtonCustom;
