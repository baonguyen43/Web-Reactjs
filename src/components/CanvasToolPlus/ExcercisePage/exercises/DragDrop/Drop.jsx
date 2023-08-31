import { useDrag, useDrop } from 'react-dnd';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';

function Drop({ value, onDrop, draggedIndex, boxStyle }) {
  const { angle, groupName, height, image, left, mode, text, top, width } = value;
  const ref = useRef();

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: `${mode}-${groupName}`,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const [, drag] = useDrag({
    // CHÚ Ý: Nếu nâng cấp thư viện react dnd từ 13 => 14, tham khảo: https://github.com/react-dnd/react-dnd/releases/tag/v14.0.0
    // item defined here to get a type
    item: { type: `${mode}-${groupName}` },
    // ...but the actual item is created here
    begin: () => {
      return { value, draggedIndex };
    },
    canDrag: !!image,
  });

  const isActive = canDrop && isOver;
  const backgroundColor = changeBackgroundColor(isActive, canDrop);

  drop(drag(ref)); // Node này có thể kéo, cũng có thể thả.

  return (
    <div
      ref={ref}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        fontSize: (height * 2) / 3,
        // padding: 2,
        // border: '2px dotted gray',
        backgroundColor,
        backgroundImage: `url(${image})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        ...boxStyle,
      }}
    >
      {/* <img src={image} alt="" width={width} height={height} /> */}
    </div>
  );
}

export default Drop;

Drop.propTypes = {
  value: PropTypes.object.isRequired,
  onDrop: PropTypes.func,
  draggedIndex: PropTypes.number,
  boxStyle:PropTypes.object,
};

const changeBackgroundColor = (isActive, canDrop) => {
  if (isActive) {
    return 'green';
  } if (canDrop) {
    return 'yellow';
  }
  return 'white';
};
