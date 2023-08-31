/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import _ from 'lodash';
import React from 'react';
import { CirclePicker } from 'react-color';

const colors = ['#32325d', '#000000', '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b'];

function ColorPicker({ value, onChange, moreColors = [] }) {
  return (
    <React.Fragment>
      <CirclePicker
        colors={_.concat(colors, moreColors)}
        width='100%'
        circleSize={24}
        color={value}
        onChange={(color) => {
          onChange(color.hex);
        }}
      />
    </React.Fragment>
  );
}

ColorPicker.defaultProps = {
  value: '#32325d',
  onChange: null,
  moreColors: [],
};

export default ColorPicker;
