import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';

import FooterModal from '../../../FooterModal'

import styles from './styles.module.css';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const Multiple1 = ({ question }) => {

  const [state, setState] = React.useState({
    questions: [],
    isPointed: false,
    isDisabledSubmit: true,
    isDisabledRetry: true,
    videoVisible: false,
  });

  React.useEffect(() => {
    setState((prevState) => ({ ...prevState, questions: JSON.parse(JSON.stringify(question)) }))
  }, [question]);

  const onSubmit = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, isPointed: true, isDisabledSubmit: true, isDisabledRetry: false }))
  }, []);

  const onRetry = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, isPointed: false, isDisabledRetry: true }))
  }, []);

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

  const renderTitle = React.useCallback((item) => {

    const titleSplit = item.question?.split(' ');
    if (!titleSplit) return null
    return titleSplit.map((itemTitle, index) => {
      return itemTitle === '#' ? (
        <span key={index}><strong>{item.boldText}</strong></span>
      ) : (
          <span key={index}>{' '}{itemTitle}{' '}</span>
        )
    })
  }, []);

  const renderAnswerItem = React.useCallback((qItem) => (answer, answerIndex) => {
    const isSelected = qItem.selectedItem === answerIndex;
    // Check answers
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
        <b>{index + 1}</b>{'.'} {renderTitle(item)}
        <Row style={{ fontSize: 20 }}>
          {item.answers.map(renderAnswerItem(item, index))}
        </Row>
      </div>
    );
  }, [renderTitle, renderAnswerItem]);


  if (!state.questions) return null;

  return (
    <>
      <Row className='d-flex justify-content-center'>
        <Col className='d-initial justify-content-center'>

          <span style={{ fontSize: 18 }}>
            {state.questions.map(renderQuestion)}
          </span>
        </Col>
      </Row>
      <Row >
        <FooterModal isDisabledSubmit={state.isDisabledSubmit} isDisabledRetry={state.isDisabledRetry} onSubmit={onSubmit} onRetry={onRetry} />
      </Row>
    </>
  );
};

Multiple1.propTypes = {
  question: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  sessionId: PropTypes.string,
  classId: PropTypes.string,
};

export default Multiple1;
