import React from 'react';
import { useDrop } from 'react-dnd'
import Box from '../Box';
import * as specifications from '../../../../constants/AdjustSpecifications';

const Bucket = (item) => {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: 'BOX',
        drop: item.onDrop,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        })

    }))
    const isActive = isOver && canDrop;
    var isBox = false;
    let correct = false;
    var droppedText = '';
    if (item.droppedAnswer.length !== 0) {
        item.droppedAnswer.forEach((q) => {
            if (q.id === item.answerIndex + 1) {
                isBox = true;
                droppedText = q.answer;
                correct = q.isCorrect;
            }
        })
    }
    return (
        <span
            ref={drop}
            // eslint-disable-next-line jsx-a11y/aria-role
            role={'Dustbin'}
            style={{ backgroundColor: isActive && isBox === false ? 'gray' : 'white' }}
        >
            {
                isBox ?
                    <Box
                        id={item.answerIndex}
                        key={item.index}
                        isDropped={true}
                        index={item.index}
                        answer={droppedText}
                        canDrag={item.canDrag}
                        questionIndex={item.questionIndex}
                        backgroundColor={specifications.BACKGROUND_DROP} // 1: Thả xuống dính. 2:khi submit
                        margin={'-6px 0'} //Thảxuống dính.và khi submit
                        padding={'0px 10px'}//Thả xuống dính.và khi submit
                        color={!item.canDrag ? (correct ? specifications.SUCCESS_OR_CORRECT : specifications.FAILED_OR_WRONG) : specifications.COLOR_Black}
                    /> : '..................'
            }
        </span>
    )
}
export default Bucket;