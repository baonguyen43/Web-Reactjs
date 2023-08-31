/* eslint-disable react/prop-types */
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { dragItemTypes } from '../../../constants';

const style = {
    /* border: 1px dashed gray; */
    padding: '0.5rem 1rem',
    marginBottom: '0.5rem',
    /* background-color: white; */
    cursor: 'move',
    /* opacity: 1; */
    backgroundColor: '#022F63',
    color: 'white',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: '500',
    borderRadius: 5,
    minHeight: 60,
    display: 'flex',
    justifyContent: 'flex-start', alignItems: 'center'
};

export const Card = ({ id, text, moveCard, findCard, height }) => {
    const originalIndex = findCard(id).index;
    const [{ isDragging }, drag] = useDrag({
        item: { type: dragItemTypes.CARD, id, originalIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (dropResult, monitor) => {
            const { id: droppedId, originalIndex } = monitor.getItem();
            const didDrop = monitor.didDrop();
            if (!didDrop) {
                moveCard(droppedId, originalIndex);
            }
        },
    });
    const [, drop] = useDrop({
        accept: dragItemTypes.CARD,
        canDrop: () => false,
        hover({ id: draggedId }) {
            if (draggedId !== id) {
                const { index: overIndex } = findCard(id);
                moveCard(draggedId, overIndex);
            }
        },
    });
    const opacity = isDragging ? 0 : 1;
    return (<div ref={(node) => drag(drop(node))} style={{ ...style, opacity, height }}>
        {text}
    </div>);
};
