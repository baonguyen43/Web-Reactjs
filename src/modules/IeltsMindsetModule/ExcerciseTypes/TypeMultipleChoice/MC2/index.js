/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

import styles from './styles.module.css';
import ReactHtmlParser from 'react-html-parser';
import { Col, Row } from 'reactstrap';
import CardFooter from 'reactstrap/lib/CardFooter';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const Multiple2 = ({ question, audio }) => {
  const inputTag = '#';

  const [state, setState] = React.useState({
    questions: null,
    isPointed: false,
    isDisabledSubmit: true,
    isDisabledRetry: true,
    videoVisible: false,
  });

  React.useEffect(() => {
    setState((prevState) => ({ ...prevState, questions: JSON.parse(JSON.stringify(question)) }))
  }, [question])

  const onSubmit = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, isPointed: true, isDisabledSubmit: true, isDisabledRetry: false }))
  }, [])

  const onRetry = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, isPointed: false, isDisabledRetry: true }))
  }, [])

  const onClickAnswer = React.useCallback((item, index) => {
    item.selectedItem = index;

    setState((prevState) => {
      const count = prevState.questions.reduce((total, countItem) => {
        if (countItem.selectedItem >= 0) {
          return total + 1;
        }
        return total;
      }, 0);

      const isDone = count === prevState.questions.length;

      if (isDone && state.isDisabledSubmit) {
        setState((prevState) => ({ ...prevState, isDisabledSubmit: false }))
      }

      return { ...prevState, questions: prevState.questions };
    })
  }, [state.isDisabledSubmit]);

  const renderAnswerItem = React.useCallback((qItem) => (answer, answerIndex) => {
    const isSelected = qItem.selectedItem === answerIndex;
    //Check answers
    let isCorrect = false;

    if (state.isPointed) {
      isCorrect = answer.isCorrect;
    }

    const customStyles = {
      alphabet: {
        marginRight: 8,
        color: isSelected ? 'white' : 'black',
        background: isSelected ? isCorrect ? '#2ecc71' : '#E74C3C' : 'white',
      },
    }

    return state.isPointed ? (
      <Button key={answerIndex} type='text' className={`${styles.answerButton} flex flex-1 ml-4`}>
        <Row style={{ marginLeft: 4, fontSize: 16 }}>
          <strong className={styles.mutilpleKey} style={customStyles.alphabet}>{alphabet[answerIndex]}</strong>
          <span style={{ display: 'block', justifyContent: 'center', alignItems: 'center' }}>{answer.text}</span>
        </Row>
      </Button>
    ) : (
      <Button
        type='text'
        key={answerIndex}
        className={`${styles.answerButton} flex flex-1 ml-4`}
        onClick={() => onClickAnswer(qItem, answerIndex)}
      >
        <Row style={{ marginLeft: 4, fontSize: 16 }}>
          <span className={isSelected ? styles.mutilpleKeySelected : styles.mutilpleKey}>
            <strong>{alphabet[answerIndex]}</strong>
          </span>
          <span style={{ display: 'block', justifyContent: 'center', alignItems: 'center' }}>{answer.text}</span>
        </Row>
      </Button>
    );
  }, [state.isPointed, onClickAnswer])

  const renderQuestion = React.useCallback((item, index) => {
    return (
      <div key={index} style={{ marginRight: 8, fontSize: 16 }} className='mb-3'>
        <Row style={{ fontSize: 20 }}>
          <span className='ml-3 mt-1' style={{ fontWeight: '600' }}>{index + 1}</span>
          {item.answers.map(renderAnswerItem(item, index))}
        </Row>
      </div>
    );
  }, [renderAnswerItem]);

  const transform = React.useCallback((node, index) => {
    if (node.type === 'text') {
      if (!node.data.includes(inputTag)) return;
      const elementArray = node.data.split(inputTag)
      return (
        <span key={index}>
          {elementArray.map((item, index) => {
            return (
              <React.Fragment key={index}>
                {index !== 0 && (
                  <span>_______</span>
                )}
                {item}
              </React.Fragment>
            )
          })}
        </span>
      )
    }
  }, [])


  if (!state.questions) return null;
  return (
    <>
      <Row className='d-flex justify-content-center'>
        <Col className='d-initial justify-content-center'>
          <span style={{ fontSize: 18 }}>
            {state.questions[0].question && ReactHtmlParser(state.questions[0].question, { transform })}
            {state.questions.map(renderQuestion)}
          </span>
        </Col>
      </Row>
      <Row >
        <CardFooter>
          <FooterIeltsMindset
            isDisabledSubmit={state.isDisabledInput}
            isDisabledRetry={state.isDisabledRetry}
            onSubmit={onSubmit}
            onRetry={onRetry}
            audioUrl={audio}
          />
        </CardFooter>
      </Row>
    </>
  )
};

Multiple2.propTypes = {
  question: PropTypes.instanceOf(Object),
};

export default Multiple2;
