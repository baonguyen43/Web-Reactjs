import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
const style = {
        /* border: 1px dashed gray; */
        padding: '0.5rem 1rem',
        marginBottom: '0.5rem',
        /* background-color: white; */
         cursor: 'move',
        /* opacity: 1; */
        backgroundColor: '#022F63',
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '500',
        borderRadius: 5,
        minHeight:60, 
        display: 'flex',
        justifyContent: 'center', alignItems: 'center'
};
export const Card = ({ id, text, moveCard, findCard }) => {
    const originalIndex = findCard(id).index;
    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.CARD, id, originalIndex },
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
        accept: ItemTypes.CARD,
        canDrop: () => false,
        hover({ id: draggedId }) {
            if (draggedId !== id) {
                const { index: overIndex } = findCard(id);
                moveCard(draggedId, overIndex);
            }
        },
    });
    const opacity = isDragging ? 0 : 1;
    return (<div ref={(node) => drag(drop(node))} style={{ ...style, opacity }}>
			{text}
		</div>);
};
