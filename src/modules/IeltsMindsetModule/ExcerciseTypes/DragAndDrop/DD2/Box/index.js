import React from 'react';
import { useDrag } from 'react-dnd'


const Box = ({
    id,
    color,
    index,
    answer,
    canDrag,
    isDropped,
    questionIndex,
    backgroundColor,
    border
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
                margin: 5,
                padding: '5px 10px',
                backgroundColor,
                borderRadius: '5px',
                display: 'inline-block',
                border,
                cursor: canDrag && 'pointer',
                opacity: isDragging ? 0.5 : 1
            }}>
            {answer}
        </span>
    )
}
export default Box;