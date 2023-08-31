import React from 'react';
import { useDrag } from 'react-dnd';
import { dragItemTypes } from '../../../../constants';
import PropTypes from 'prop-types'

const DragItem = ({ style, payload, disable, ...props }) => {
  const [{ isDragging }, drag] = useDrag({
    canDrag: () => !disable,
    item: { type: dragItemTypes.CARD, payload },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      {...props}
    />
  );
}

DragItem.propTypes = {
  disable: PropTypes.bool,
  payload: PropTypes.object,
  style: PropTypes.object,
}

export default DragItem;
