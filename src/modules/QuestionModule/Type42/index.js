/* eslint-disable no-unused-expressions */
import React from 'react';
import { Row, Col, Card, CardBody, CardHeader, CardFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import TitleQuestion from 'components/TitleQuestion'
import styles from './styles.module.css';


const UnderLine = ({ question, classId, sessionId, history }) => {


  const inputTag = '#';

  const inputCount = React.useRef(0);

  const [state, setState] = React.useState({
    sentences: JSON.parse(question.questionJson),
    isDisabledSubmit: true,
    // isDisabledSubmit:false,
    isDisabledRetry: true,
    isPointed: false,
    selectedArray: []
  });


  React.useEffect(() => {
    let answerString = [];
    state.sentences[0].answersInPairs.forEach((item, index) => {
      answerString.push(item.first, item.second)
    })
    state.sentences[0].answerString = answerString;

    setState((prevState) => ({
      ...prevState, sentences: state.sentences
    }))
  }, [state.sentences])

  const onSubmit = React.useCallback(() => {

    const answerString = state.sentences[0].answerString;
    const correctAnswers = state.sentences[0].correctAnswers;
    let answerArray = []
    let results = []

    state.selectedArray.forEach((item, index) => {
      let isCorrect = false;
      if (answerString[item] === correctAnswers[index]) {
        isCorrect = true;
      }
      answerArray.push({ isCorrect, selectedText: answerString[item] });
    })

    answerString.forEach((item, index) => {
      const indexAnswer = answerArray.findIndex((x) => x.selectedText === item);

      let checkAnswer = false;
      if (indexAnswer > -1) {

        checkAnswer = answerArray[indexAnswer].isCorrect
      }
      results.push(checkAnswer)
    });

    state.sentences[0].results = results
    setState((prevState) => ({
      ...prevState, sentences: state.sentences, isDisabledSubmit: true, isPointed: true, isDisabledRetry: false
    }))

  }, [state.sentences, state.selectedArray])


  const onRetry = React.useCallback(() => {
    setState((prevState) => ({
      ...prevState, selectedArray: [], isDisabledRetry: true, isPointed: false
    }))
  }, [])

  const choiceAnwsers = React.useCallback((value) => () => {

    const isPushToArray = state.selectedArray.findIndex((x) => x === value) > -1;
    if (isPushToArray) return null;
    if (value % 2 !== 0) {

      //Kiểm tra số đứng trước co nằm trong mảng hay không. Nếu có thì replace ko thì push
      const checkPreviousIndex = state.selectedArray.findIndex((x) => x === value - 1);
      checkPreviousIndex > -1 ? state.selectedArray.splice(checkPreviousIndex, 1, value) : state.selectedArray.push(value);
    } else {
      //Kiểm tra số đứng sau co nằm trong mảng hay không. Nếu có thì replace ko thì push
      const checkNextIndex = state.selectedArray.findIndex((x) => x === value + 1);
      checkNextIndex > -1 ? state.selectedArray.splice(checkNextIndex, 1, value) : state.selectedArray.push(value);
    }
    const isDone = state.selectedArray.length === state.sentences[0].correctAnswers.length;
    setState((prevState) => ({
      ...prevState, selectedArray: state.selectedArray, isDisabledSubmit: !isDone
    }))
  }, [state.selectedArray, state.sentences])



  const transform = React.useCallback((node, index) => {
    if (!state.sentences[0].answerString) return null;
    if (node.type === 'text') {
      if (!node.data.includes(inputTag)) return;
      const elementArray = node.data.split(inputTag)
      let currentInputNo = 0;
      return (
        <span key={index}>
          {elementArray.map((item, index) => {
            if (index > 0) {
              currentInputNo = inputCount.current;
              const maxInput = state.sentences[0].answerString.length
              inputCount.current++;
              if (inputCount.current >= maxInput) {
                inputCount.current = 0;
              }
            }
            const isSelected = state.selectedArray.findIndex((x) => x === currentInputNo) > -1;

            let borderColor = '#022F63';
            if (state.isPointed) {
              const isCorrect = state.sentences[0].results[currentInputNo]
              borderColor = isSelected ? isCorrect ? '#2dce89' : '#f5365c' : '';
            }

            return (
              <React.Fragment key={index}>
                {index !== 0 && (
                  <span
                    className={isSelected ? styles.selectedSpan : ''}
                    style={{ fontSize: 18, fontWeight: '700', cursor: 'pointer', borderColor }}
                    onClick={choiceAnwsers(currentInputNo)} >
                    {state.sentences[0].answerString[currentInputNo]}
                  </span>
                )}
                {item}
              </React.Fragment>
            )
          })}
        </span>
      )
    }
  }, [state.sentences, state.selectedArray, choiceAnwsers, state.isPointed])

  return (
    <Row className='d-flex justify-content-center'>
      <Col className='d-initial justify-content-center'>
        <Card>
          <CardHeader>
            <TitleQuestion
              no={question.exercise}
              type={question.lesson}
              title={question.exerciseName}
            />
          </CardHeader>
          <CardBody style={{ overflowY: 'auto', maxHeight: '50vh' }}>
            <span style={{ fontSize: 18 }}>
              {ReactHtmlParser(state.sentences[0].title, { transform })}
            </span>
          </CardBody>
          <CardFooter>
            <FooterIeltsMindset isDisabledSubmit={state.isDisabledSubmit} isDisabledRetry={state.isDisabledRetry} onSubmit={onSubmit} onRetry={onRetry} />
          </CardFooter>
        </Card>
      </Col>
    </Row>
  );
};
UnderLine.propTypes = {
  // allowPress: PropTypes.func.isRequired,
  question: PropTypes.instanceOf(Object),
}
export default UnderLine;
