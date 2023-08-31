/* eslint-disable react/prop-types */

import React from 'react';
import { useDrag } from 'react-dnd'
import * as specifications from '../../../../constants/AdjustSpecifications';

const Box = ({
    id,
    color,
    index,
    answer,
    canDrag,
    isDropped,
    questionIndex,
    backgroundColor,
    padding,
    margin
}) => {

    const [{ isDragging },
        drag] = useDrag({
            item: {
                id,
                index,
                answer,
                isDropped,
                type: 'BOX',
                questionIndex,
            },
            canDrag: () => canDrag,
            collect: (monitor) => ({
                isDragging: monitor.isDragging()
            })
        })
    // if (isDragging) {
    //     return <span ref={drag} />;
    // }
    return (
        answer &&
        <span key={index}
            // eslint-disable-next-line jsx-a11y/aria-role
            role="Handle"
            ref={drag}
            style={{
                color,
                margin,
                padding,
                backgroundColor,
                borderRadius: '5px',
                display: 'inline-block',
                cursor: canDrag && 'pointer',
                opacity: isDragging ? 0.5 : 1,
                border: specifications.DOTTED_Black
            }}>
            {answer}
        </span>
    )
}
export default Box;