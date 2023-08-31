/* eslint-disable quotes */
/* eslint-disable react/prop-types */
import React, { useCallback, useState } from 'react';
import { CardFooter } from 'reactstrap';
import { useDrop } from 'react-dnd';
import { message } from 'antd';
import Bucket from './Bucket';
import Box from './Box';
import CardBody from 'reactstrap/lib/CardBody';
import * as specifications from '../../../constants/AdjustSpecifications';
import * as helpers from '../../../constants/helpers'
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import CircleTheNumberInTheText from 'modules/IeltsMindsetModule/components/CircleTheNumberInTheText';

import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import * as functions from '../../../../../components/functions';
import { useDispatch } from 'react-redux';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types'

const DD2 = ({ question, audio }) => {

    // const questionsList = [
    //     { id: 1, question: 'what is # your name? # a #', droppedAnswer: [], answer: [], isDropped: false, color: null },
    //     { id: 2, question: 'How are # you? #', droppedAnswer: [], answer: [], isDropped: false, color: null },
    //     { id: 3, question: 'What is # going on here? #', droppedAnswer: [], answer: [], isDropped: false, color: null },
    // ];
    // const answersList = [
    //     { id: 1, answer: `1. I'm verry well.`, isDropped: false },
    //     { id: 2, answer: '2. Not at all.', isDropped: false },
    //     { id: 3, answer: '3. My name Thuan.', isDropped: false },
    //     { id: 4, answer: '4. Where are you from ?', isDropped: false },
    //     { id: 5, answer: '5. Wonderful', isDropped: false },
    // ];


    const [state, setState] = useState({
        questionsList: [],
        answersList: [],
        answers: [],
        submitted: false,
        isCheck: false,
    })

    const onRetry = React.useCallback(() => {
        setState((prevState) => ({ ...prevState, questionsList: [], answersList: [], submitted: false, isCheck: false }));
    }, [])

    const handleDrop = React.useCallback((item, toBox, toIndex) => {
        const { index } = item;
        const { droppedAnswer } = state.questionsList[toIndex];
        let isFound = droppedAnswer.some(el => el.id === toBox + 1)

        //Drag from root to destination if destination is defined or not null
        if (isFound) {
            if (item.isDropped === false) {
                droppedAnswer.forEach((e, i) => {
                    if (e.id === toBox + 1) {
                        let temp = droppedAnswer[i].answer;
                        droppedAnswer[i].answer = state.answersList[item.index].answer;
                        state.answersList[index].answer = temp;
                        setState(pre => ({ ...pre, questionsList: state.questionsList, answersList: state.answersList }));
                    }
                });
                return;
            }

            let fromDroppedBox = state.questionsList[item.index];
            let id = item.id + 1;
            fromDroppedBox.droppedAnswer.forEach((from, index) => {
                if (from.id === id) {
                    droppedAnswer.forEach((to, i) => {
                        if (to.answer === droppedAnswer[i].answer && to.id === toBox + 1) {
                            let temp = droppedAnswer[i].answer
                            droppedAnswer[i].answer = from.answer;
                            fromDroppedBox.droppedAnswer[index].answer = temp;
                            setState(pre => ({
                                ...pre,
                                questionsList: state.questionsList
                            }));
                        }
                    });
                }
            });
            return;
        }

        //Drag from answerList to destination if destination is undefined or null
        if (item.isDropped === false) {
            droppedAnswer.push({ id: toBox + 1, answer: state.answersList[item.index].answer, isDropped: true, isCorrect: false });
            state.answersList.splice(index, 1);
            setState(pre => ({ ...pre, questionsList: state.questionsList, answersList: state.answersList }));
            return;
        }

        //Drag from questionList to destination if destination is undefined or null
        let fromDroppedBox = state.questionsList[item.index];
        fromDroppedBox.droppedAnswer.forEach((e, i) => {
            if (e.id === item.id + 1) {
                let answer = e.answer;
                fromDroppedBox.droppedAnswer.splice(i, 1);
                droppedAnswer.push({ id: toBox + 1, answer, isDropped: true, isCorrect: false })
                setState(pre => ({ ...pre, questionsList: state.questionsList, answersList: state.answersList }));
            }
        });
        return;
    }, [state.answersList, state.questionsList]);

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
        functions.postAnswerToAPI(result).then(response => console.log('Send DD2 answers: success')).catch(error => console.log('Send DD2 answers', error))
        // Cập nhật điểm.
        fetchIeltsMindsetScore(StudentId, params.sessionId, params.assignmentId, takeExamTime)
    }, [StudentId, fetchIeltsMindsetScore, params.assignmentId, params.sessionId, question.book, question.exercise, question.id, question.lesson, question.questionEntityName, question.subExercise, question.unit, takeExamTime])
    // #endregion

    const onSubmit = React.useCallback(() => {
        let isNotEmpty = true;
        for (let index = 0; index < state.questionsList.length; index++) {
            let q = state.questionsList[index];
            if (q.droppedAnswer.length !== q.answers.length) {
                isNotEmpty = false;
                message.error('Fields must not be empty!');
                break;
            }
        }

        if (isNotEmpty) {
            for (let index = 0; index < state.questionsList.length; index++) {
                let q = state.questionsList[index];
                q.droppedAnswer.forEach((e, i) => {
                    q.answers.forEach(answer => {
                        if (e.id === answer.id && e.answer === answer.answer) {
                            q.droppedAnswer[i].isCorrect = true;
                        }
                    });
                });
            }
            setState((prevState) => ({ ...prevState, submitted: true, questionsList: state.questionsList }))
        }

        if (isNotEmpty) {
            let answers = [];
            state.questionsList.map((value, index) => {
                return value.droppedAnswer.map((x, i) => {
                    return answers.push({
                        answers: x.answer, isCorrect: x.isCorrect
                    })
                })
            })
            state.answers = answers
            postAnswer(state.answers, state.answers, state)
        }
    }, [postAnswer, state]);

    //Drag from questionList to answerList
    const handleBoxDrop = React.useCallback((item) => {
        if (item.isDropped === false) {
            return;
        }
        let id = item.id + 1;
        let { droppedAnswer } = state.questionsList[item.questionIndex];
        droppedAnswer.forEach((e, i) => {
            if (e.id === id) {
                droppedAnswer.splice(i, 1);
                state.answersList.push({ answer: e.answer, isDropped: false, color: 'green' });
                setState(pre => ({ ...pre, questionsList: state.questionsList, answersList: state.answersList }));
            }
        });
        return;
    }, [state.answersList, state.questionsList]);

    React.useEffect(() => {
        // onRetry();
        const questions = JSON.parse(question.questionJson);
        let dragItems = [];
        if (state.questionsList.length > 0) {
            onRetry()
            return;
        }
        for (let index = 1; index < questions.length; index++) {
            let q = questions[index];
            let answers = []
            q.answers.forEach((e, i) => {
                answers.push({ id: i + 1, answer: e.answer, isCorrect: false });
            });
            state.questionsList.push({ id: index, question: q.question, droppedAnswer: [], answers: answers, isDropped: false, image: q.image })
        }
        questions[0].answers.forEach(item => {
            dragItems.push(item.answer);
        })

        helpers.shuffle(dragItems);
        dragItems.forEach((item, i) => {
            state.answersList.push({ id: i + 1, answer: item, isDropped: false },)
        })
        setState((prevState) => ({ ...prevState, questionsList: state.questionsList, answersList: state.answersList }))
    }, [onRetry, question, state.answersList, state.questionsList])

    const [
        // { canDrop, isOver }
        , drop] = useDrop(() => ({
            accept: 'BOX',
            canDrop: () => !state.submitted,
            drop: handleBoxDrop,
            collect: (monitor) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
                isDropped: !state.submitted
            })
        }))

    const renderAnswerList = React.useCallback(() => {
        let backgroundColor = specifications.BACKGROUND_DROP
        let color = specifications.COLOR_Black;
        let DOTTED_Black = specifications.DOTTED_Black;
        return state.answersList.map((item, i) => <Box backgroundColor={backgroundColor} color={color}
            key={i} answer={item.answer} index={i} isDropped={false} canDrag={!state.submitted} border={DOTTED_Black} />)
    }, [state.answersList, state.submitted])

    const renderBucket = useCallback((arr, q, i, count) => {
        return arr.map((text, index) => {
            count += 1;
            return (
                <React.Fragment key={index}>
                    {count < arr.length ?
                        <span key={index}>
                            <CircleTheNumberInTheText text={text} />
                            <Bucket canDrag={!state.submitted} droppedAnswer={q.droppedAnswer} onDrop={(item) => handleDrop(item, index, i)} questionIndex={i} index={i} answerIndex={index} />
                        </span>
                        : <span key={index + 1}>{text}</span>}
                </React.Fragment>
            )
        })
    }, [handleDrop, state.submitted])

    const renderQuestionsList = React.useCallback(() => {
        return state.questionsList.map((q, i) => {
            var arr = q.question.split("#");
            let count = 0;
            return (
                <div key={i + 1} style={{ margin: 10 }}>
                    {renderBucket(arr, q, i, count)}
                    <div key={i + 1}>
                        {q.image && <img key={i + 1} src={q?.image} alt='...' style={{ height: 150, width: 300, marginTop: 10 }} />}
                    </div>
                </div>
            )
        })
    }, [renderBucket, state.questionsList])

    return (
        <React.Fragment>
            <CardBody >
                <div style={{ display: 'flex', justifyContent: 'start', height: '103.5%' }}>
                    <div style={{ fontSize: specifications.FONTSIZE, display: 'flex', flexDirection: 'column', flex: 1, fontWeight: specifications.FONTWEIGHT }}>
                        <div ref={drop} style={{ whiteSpace: 'initial', textAlign: 'center', minHeight: 50 }}>
                            {renderAnswerList()}
                        </div>
                        <hr />
                        <div style={{ overflowY: 'auto', overflowX: 'hidden', }} >
                            {renderQuestionsList()}
                        </div>
                    </div>
                </div>
            </CardBody>
            <CardFooter style={{ padding: 0 }}>
                <FooterIeltsMindset
                    isDisabledSubmit={state.submitted}
                    isDisabledRetry={!state.submitted}
                    onSubmit={onSubmit}
                    onRetry={onRetry}
                    // onPlayVideo={onPlayVideo}
                    audioUrl={audio}
                />
            </CardFooter>
        </React.Fragment>
    );
}

export default DD2;
