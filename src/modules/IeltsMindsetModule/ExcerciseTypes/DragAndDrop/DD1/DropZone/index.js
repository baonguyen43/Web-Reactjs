import React from 'react';
import { useDrop } from 'react-dnd';

import { dragItemTypes } from '../../../../constants';
import PropTypes from 'prop-types'

const DropZone = ({ onDrop, ...props }) => {
  const [, drop] = useDrop({
    accept: dragItemTypes.CARD,
    drop: onDrop,
  });

  return <div {...props} ref={drop} />;
}

DropZone.propTypes = {
  onDrop: PropTypes.func,
}

export default DropZone;
