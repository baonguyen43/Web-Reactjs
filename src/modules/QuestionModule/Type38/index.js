import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

import styles from './styles.module.css';

import TitleQuestion from 'components/TitleQuestion'
import FooterIeltsMindset from 'components/FooterIeltsMindset'
import { CardBody, Card, CardFooter, CardHeader, Col, Row } from 'reactstrap';
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const Type38 = ({ question, classId, sessionId, history }) => {

  const [state, setState] = React.useState({
    questions: [],
    isPointed: false,
    isDisabledSubmit: true,
    isDisabledRetry: true,
    videoVisible: false,
  });

  const createQuestion = React.useCallback(() => {
    if (!question) return null;
    const questionParse = JSON.parse(JSON.stringify(question))
    if (!questionParse.questionJson) return null;
    const questionJson = JSON.parse(questionParse?.questionJson)
    setState((prevState) => ({
      ...prevState,
      questions: questionJson
    }))
  }, [question])

  const toggleState = React.useCallback((fieldName) => () => {
    setState((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  }, []);

  const onSubmit = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, isPointed: true }))
    toggleState('isDisabledSubmit')();
    toggleState('isDisabledRetry')();
  }, [toggleState])

  const onRetry = React.useCallback(() => {
    createQuestion();
    toggleState('isDisabledRetry')();
    toggleState('isPointed')();
  }, [toggleState, createQuestion])

  const onPlayVideo = React.useCallback(() => {
    toggleState('videoVisible')();
  }, [toggleState])

  React.useEffect(() => {
    createQuestion()
  }, [question, createQuestion])




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
        toggleState('isDisabledSubmit')();
      }

      return { ...prevState, questions: prevState.questions };
    })
  }, [state.isDisabledSubmit, toggleState]);

  const renderTitle = React.useCallback((item) => {
    const titleSplit = item.title.split(' ');
    return titleSplit.map((itemTitle, index) => {
      return itemTitle === '#' ? (
        <span key={index}>__________</span>
      ) : (
          <span key={index}>{' '}{itemTitle}{' '}</span>
        )
    })
  }, []);

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
        <b>{index + 1}</b>{'.'} {renderTitle(item)}
        <Row style={{ fontSize: 20 }}>
          {item.answers.map(renderAnswerItem(item, index))}
        </Row>
      </div>
    );
  }, [renderTitle, renderAnswerItem]);

  const linkGoBackAssignment = React.useCallback(() => {
    const link = `/ames/class/${classId}/session/${sessionId}/assignments/`;
    history.push(link)
  }, [classId, history, sessionId])

  return (
    <Row className='flex flex-1 justify-content-center'>
      <Col >
        <Card >
          <CardHeader>
            <div className="modal-header" style={{ padding: 0 }}>
              <TitleQuestion
                no={question?.exercise}
                type={question?.lesson}
                title={question?.exerciseName}
              />
              <button
                type="button"
                className="close"
                aria-label="Close"
                data-dismiss="modal"
                onClick={linkGoBackAssignment}
              >
                <span aria-hidden={true}>×</span>
              </button>
            </div>
          </CardHeader>
          <CardBody>
            {state.questions.map(renderQuestion)}
            {state.videoVisible && (
              <Row className={styles.centeredRow}>
                <div className={styles['video-container']}>
                  <iframe title='video'
                    src="https://www.youtube.com/embed/tgbNymZ7vqY">
                  </iframe>
                </div>
              </Row>
            )}
          </CardBody>
          <CardFooter>
            <FooterIeltsMindset
              isDisabledRetry={state.isDisabledRetry}
              isDisabledSubmit={state.isDisabledSubmit}
              onSubmit={onSubmit}
              onRetry={onRetry}
              onPlayVideo={onPlayVideo}
            />
          </CardFooter>
        </Card>
      </Col>
    </Row>
  )
};

Type38.propTypes = {
  question: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  sessionId: PropTypes.string,
  classId: PropTypes.string,
};

export default Type38;
