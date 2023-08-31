/* eslint-disable react/prop-types */
/* eslint-disable quotes */
import React, { useCallback, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { CardFooter } from 'reactstrap';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import CardBody from 'reactstrap/lib/CardBody';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import * as functions from '../../../../../components/functions';
import { useDispatch } from 'react-redux';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types'

const DD4 = ({ question, audio }) => {

    const [state, setState] = useState({
        items: [],
        answers: [],
        submitted: false,
        timestamp: Date.now()
    })

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const grid = 8;

    const getItemStyle = (isDragging, draggableStyle, submitted, isCorrect) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        padding: grid * 2,
        margin: `3px 0 3px 0`,

        // change background colour if dragging
        background: submitted ? (isCorrect ? 'lightgreen' : 'red') : (isDragging ? "lightgreen" : "white"),

        // styles we need to apply on draggables
        ...draggableStyle
    });

    const getListStyle = isDraggingOver => ({
        // background: isDraggingOver ? "lightblue" : "lightgrey",
        background: "lightblue",
        padding: grid,
        display: 'inline-block'
        // width: 250
    });

    const onRetry = React.useCallback(() => {
        setState({ submitted: false, items: [], answers: [], timestamp: Date.now() });
    }, [])


    const onDragEnd = React.useCallback((result) => {
        if (!result.destination) {
            return;
        }

        const items = reorder(
            state.items,
            result.source.index,
            result.destination.index
        );

        setState(pre => ({ ...pre, items }));
    }, [state.items])

    // Cập nhật điểm cho session.
    const dispatch = useDispatch();
    const fetchIeltsMindsetScore = useCallback((studentId, sessionId, assignmentId, takeExamTime) => {
        const payload = { studentId, sessionId, assignmentId, takeExamTime }
        dispatch({ type: FETCH_SCORE, payload })
    }, [dispatch])
    // #region Gởi dữ liệu tới máy chủ.
    const params = useParams()
    const location = useLocation()
    const { takeExamTime } = queryString.parse(location.search)
    const StudentId = useSelector(state => state.loginReducer.loggedInUser.userMyames.StudentId)
    const postAnswer = useCallback((answers, sentences, state) => {
        // Tính điểm.
        const correctAnswers = answers.filter(item => item.isCorrect).length
        const score = (correctAnswers / sentences.length) * 100
        // Thuộc tính.
        let result = {
        answerType: 'IELTS', // Đổi từ NEWWORD sang IELTS
        assignmentId: params.assignmentId,
        notes: '',
        questionEntityName: question.questionEntityName,
        groupName: '',
        questionGuid: '',
        questionId: question.id,
        score: score,
        sessionId: params.sessionId,
        studentChoice: JSON.stringify({
            book: question.book,
            unit: question.unit,
            lesson: question.lesson,
            exercise: question.exercise,
            subexercise: question.subExercise ?? '',
            answers: answers,
            score: score,
            question: state,
        }),
        studentId: StudentId,
        takeExamTime: takeExamTime,
        duration: 0,
        }
        // Gởi
        functions.postAnswerToAPI(result).then(response => console.log('Send DD4 answers: success')).catch(error => console.log('Send DD4 answers', error))
        // Cập nhật điểm.
        fetchIeltsMindsetScore(StudentId, params.sessionId, params.assignmentId, takeExamTime)
    }, [StudentId, fetchIeltsMindsetScore, params.assignmentId, params.sessionId, question.book, question.exercise, question.id, question.lesson, question.questionEntityName, question.subExercise, question.unit, takeExamTime])
    // #endregion

    const onResult = React.useCallback(() => {
        state.items.forEach((e, i) => {
            if (e.content === state.answers[i].answer) {
                e.isCorrect = true;
            }
        });
        setState(pre => ({ ...pre, submitted: true, ...state.items }))
        postAnswer(state.items, state.answers, state)
    }, [postAnswer, state])

    React.useEffect(() => {
        let items = [];
        let answers = [];
        JSON.parse(question.questionJson).forEach(q => {
            items.push({ id: q.no, content: q.question, isCorrect: false });
            answers.push({ id: q.no, answer: q.answers[0].answer })
        });

        setState(pre => ({
            ...pre,
            items,
            answers,
        }))
    }, [question, state.timestamp])

    // const editorConfiguration = {
    //   toolbar: ['bold', 'italic', 'Alignment', 'underline']
    // };

    return (
        <React.Fragment>
            <CardBody style={{ overflowY: 'auto', overflowX: 'hidden', padding: 0 }}>
                <div className="App" style={{ display: 'flex', justifyContent: 'center', paddingBottom: 15 }}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable" >
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                >
                                    {state.items.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={state.submitted}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style,
                                                        state.submitted,
                                                        item.isCorrect
                                                    )}
                                                >
                                                    {item.content}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                </div>
            </CardBody>
            <CardFooter style={{ padding: 0 }}>
                <FooterIeltsMindset
                    isDisabledSubmit={state.submitted}
                    isDisabledRetry={!state.submitted}
                    onSubmit={onResult}
                    onRetry={onRetry}
                    // onPlayVideo={onPlayVideo}
                    audioUrl={audio}
                />
            </CardFooter>
        </React.Fragment>
    );
}

export default DD4;
