/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/aria-role */
import React, { useCallback, useRef, useState } from 'react';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import { CardBody, CardFooter } from 'reactstrap';
import * as specifications from '../../../constants/AdjustSpecifications'
import CircleTheNumberInTheText from 'modules/IeltsMindsetModule/components/CircleTheNumberInTheText';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import * as functions from '../../../../../components/functions';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types'

const Underline4 = ({ question, audio }) => {

    const [state, setState] = useState({
        questions: [],
        answers: [],
        submitted: false,
        isCheckClick: false,
        timestamp: Date.now(),
    })
    // Tạo biến đếm đối với đoạn văn.
    const countClickref = useRef(0)
    const onHandleClick = useCallback((item, index, i) => {
        let textChoose = state.questions[i][index].text.toLowerCase().trim();
        const question = state.questions[i];

        for (let arrayIndex = 0; arrayIndex < state.questions.length; arrayIndex++) {
            question[arrayIndex]?.answers?.forEach((answerItem, j) => {
                let correctAnswer = answerItem?.answer.toLowerCase().trim();
                if (index === parseInt(answerItem.index) && textChoose.includes(correctAnswer)) {
                    question[index].isCorrect = true;
                    arrayIndex = state.questions.length - 1;
                    return;
                }
            })
        }

        state.isCheckClick = true;
        state.questions[i][index].isClick = !item.isClick;
        // Đối với đoạn văn, đếm số lần chọn.
        item.isClick ? countClickref.current++ : countClickref.current--
        setState((prevState) => ({ ...prevState, questions: state.questions }))
    }, [state]);

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
        functions.postAnswerToAPI(result).then(response => console.log('Send U4 answers: success')).catch(error => console.log('Send U4 answers', error))
        // Cập nhật điểm.
        fetchIeltsMindsetScore(StudentId, params.sessionId, params.assignmentId, takeExamTime)
    }, [StudentId, fetchIeltsMindsetScore, params.assignmentId, params.sessionId, question.book, question.exercise, question.id, question.lesson, question.questionEntityName, question.subExercise, question.unit, takeExamTime])
    // #endregion

    const onResult = React.useCallback(() => {
        console.log(state);
        if (state.questions.length === 1) {
            // Kiểm tra làm đủ số lựa chọn trong bài chưa?
            for (let index = 0; index < state.questions[0].length; index++) {
                if (!state.questions[0].some(x => x.isClick)) {
                    message.error(specifications.NOTIFICATION_INCOMPLETED_EXERCISE)
                    return
                }
            }
            if (countClickref.current < state.questions[0][0].answers.length) {
                message.error(`you have not chosen enough ${state.questions[0][0].answers.length} answers`)
                return
            }
        } else {
            // Kiểm tra làm đủ số câu chưa?
            for (let index = 0; index < state.questions.length; index++) {
                if (!state.questions[index].some(x => x.isClick) && state.questions[index][0].answers?.length) {
                    message.error(specifications.NOTIFICATION_INCOMPLETED_EXERCISE)
                    return
                }
            }
        }
        // ---------------------------------------------------------------------------------
        if (!state.isCheckClick) {
            return setState((prevState) => ({ ...prevState, submitted: true }))
        }
        setState((prevState) => ({ ...prevState, submitted: true }))
        // ---------------------------------------------------------------------------------
        const checkAnswers = []
        state.questions.length === 1
            // 1 bài.
            ? state.questions[0].forEach((item, index) => item.isClick === true && checkAnswers.push({
                answers: item.text,
                isCorrect: item.answers.find(x => parseInt(x.index) === index) ? true : false
            }))
            // Nhiều câu.
            : state.questions.map((item) => {
                // Lưu giá trị người dùng chọn.
                const userAnswers = item.map((v) => v.isClick === true ? v.text : '')

                // Kiểm tra số từ được chọn trong 1 câu, nếu chọn đúng thì ++, chọn sai thì --.
                let countTrueClick = item.reduce((total, current) => {
                    return current.isClick
                        ? current.isCorrect ? ++total : --total
                        : total
                }, 0)
                // Đếm số đáp án đúng.
                const countIsCorrect = item.filter(x => x.isCorrect).length
                let isCorrect = countTrueClick !== 0 ? countTrueClick === countIsCorrect : false

                return checkAnswers.push({ answers: userAnswers, isCorrect })
            })
        postAnswer(checkAnswers, state.questions.length === 1 ? state.questions[0][0].answers : state.questions, state)
    }, [postAnswer, state]);

    const onReTry = React.useCallback(() => {
        countClickref.current = 0
        setState((prevState) => ({ ...prevState, submitted: false, isCheckClick: false, timestamp: Date.now() }))
    }, []);

    React.useEffect(() => {
        let questions = [];
        JSON.parse(question.questionJson).forEach((e) => {
            let array = e.question.trim().split(' ');
            let questionsArray = [];
            array.forEach(element => {
                questionsArray.push({ text: element, answers: e.answers, isClick: false, isCorrect: false })
            });
            questions.push(questionsArray);
        });
        setState((prevState) => ({ ...prevState, questions, submitted: false, isCheckClick: false }))
        countClickref.current = 0 // Reset lại biến đếm nếu 2 bài cùng type, kiểu đoạn văn, được lựa chọn liên tiếp.
    }, [question, state.timestamp])

    const renderItem = React.useCallback((item, index, i) => {
        return (
            <React.Fragment key={index}>
                <span
                    key={index}
                    onClick={state.submitted ? () => '' : () => onHandleClick(item, index, i)}
                    style={{
                        color: state.submitted ?
                            (item.isClick ? (item.isCorrect ? 'green' : '#F91851') : specifications.QUESTION_COLOR)
                            : (item.isClick ? specifications.ANSWER_COLOR : specifications.QUESTION_COLOR),
                        cursor: state.submitted ? 'no-drop' : 'pointer',
                        display: 'inline-block',
                        margin: specifications.QUESTION_SPACE_BETWEEN_WORDS,
                        borderBottom: item.isClick ? '1px solid black' : '',
                    }}
                >
                    <CircleTheNumberInTheText text={item.text} />
                </span>
                &nbsp;
            </React.Fragment>
        )
    }, [onHandleClick, state.submitted])

    const renderItemsArray = useCallback((q, i) => {
        return <div key={i} style={{
            fontSize: specifications.QUESTION_FONT_SIZE,
            fontWeight: specifications.QUESTION_FONT_WEIGHT,
            margin: specifications.QUESTION_SPACE_BETWEEN_SENTENCES,
            textAlign: 'justify',
        }}>{q.map((item, index) => renderItem(item, index, i))}</div >
    }, [renderItem])

    return (
        <React.Fragment>
            <CardBody style={{ overflowY: 'auto', overflowX: 'hidden', padding: 0 }}>
                {state.questions.map(renderItemsArray)}
            </CardBody>
            <CardFooter style={{ padding: 0 }}>
                <FooterIeltsMindset
                    isDisabledSubmit={state.submitted}
                    isDisabledRetry={!state.submitted}
                    onSubmit={onResult}
                    onRetry={onReTry}
                    // onPlayVideo={onPlayVideo}
                    audioUrl={audio}
                />
            </CardFooter>
        </React.Fragment>
    );
}

export default Underline4;