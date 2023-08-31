/* eslint-disable react/prop-types */
import React from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Row, Col, CardFooter, CardBody, Card as CardTrap } from 'reactstrap'

import { Card } from './Card.js';
import styles from './styles.module.css';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import { dragItemTypes } from '../../../constants/index.js';

const M1 = ({ question, audio }) => {
  console.log(question);
  const [, dropRight] = useDrop({ accept: dragItemTypes.CARD });
  const [, dropLeft] = useDrop({ accept: dragItemTypes.CARD });
  const [state, setState] = React.useState({
    arrayArrow: [],
    isPointed: false,
    videoVisible: false,
    questionParse: JSON.parse(question.questionJson),
  });

  const toggleState = React.useCallback((fieldName) => () => {
    setState((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  }, []);

  const onPlayVideo = React.useCallback(() => {
    toggleState('videoVisible')();
  }, [toggleState])

  const left = React.useCallback(() => {
    const leftItem = [];
    state.questionParse.forEach((item, index) => {
      const id = parseFloat(item.no);
      const text = item.question;
      leftItem.push({ id, text })
    })
    return leftItem
  }, [state.questionParse])

  const right = React.useCallback(() => {
    const rightItem = [];
    state.questionParse.forEach((item, index) => {
      const id = parseFloat(item.no);
      const text = item.answers[0].right;
      rightItem.push({ id, text })
    })
    return rightItem
  }, [state.questionParse])

  const results = React.useCallback(() => {
    let resultItem = [];
    state.questionParse.forEach((item, index) => {
      const left = item.question;
      const right = item.answers[0].right;
      const text = item.answers[0].text; // Correct answer
      resultItem.push({ left, right, text });
    })
    return resultItem
  }, [state.questionParse])

  React.useEffect(() => {
    const cardsLeft = left();
    let arrayArrow = [];
    cardsLeft.forEach(() => {
      const isCorrect = false;
      arrayArrow.push({ isCorrect });
    })
    setState((preState) => ({ ...preState, arrayArrow }))
  }, [left])

  const [cardsLeft, setCardsLeft] = React.useState(left);

  const [cardsRight, setCardsRight] = React.useState(right);

  // onSubmit
  const onSubmit = React.useCallback(() => {
    const resultsArray = results();

    cardsLeft.forEach((item, index) => {
      const leftInResult = resultsArray.find((x) => x.left === item.text);

      const isCorrect = leftInResult.text === cardsRight[index].text;

      state.arrayArrow[index].isCorrect = isCorrect;
    });

    setState((preState) => ({ ...preState, isPointed: true }))
  }, [cardsLeft, cardsRight, results, state.arrayArrow]);

  const onRetry = React.useCallback(() => {
    setState((preState) => ({ ...preState, isPointed: false }))
  }, [])

  const moveCardRight = (id, atIndex) => {

    const { card, index } = findCardRight(id);
    setCardsRight(update(cardsRight, {
      $splice: [
        [index, 1],
        [atIndex, 0, card],
      ],
    }));
  };
  const findCardRight = (id) => {
    const card = cardsRight.filter((c) => `${c.id}` === id)[0];
    return {
      card,
      index: cardsRight.indexOf(card),
    };
  };

  //Card Left
  const moveCardLeft = (id, atIndex) => {
    const { card, index } = findCardLeft(id);

    const newCardLeft = update(cardsLeft, {
      $splice: [
        [index, 1],
        [atIndex, 0, card],
      ],
    });

    setCardsLeft(newCardLeft);
  };
  const findCardLeft = (id) => {
    const card = cardsLeft.filter((c) => `${c.id}` === id)[0];
    return {
      card,
      index: cardsLeft.indexOf(card),
    };
  };

  return (
    <Row className='d-flex justify-content-center'>
      <Col className='d-initial justify-content-center'>
        <CardTrap>
          <CardBody>
            <Row>
              <Col >
                <Row className="container-fluid">
                  <Col span={8}>
                    <div ref={dropLeft}>
                      {cardsLeft.map((card) => (<Card key={card.id} id={`${card.id}`} text={card.text} moveCard={moveCardLeft} findCard={findCardLeft} />))}
                    </div>
                  </Col>
                  <Col span={8} >
                    {state.arrayArrow.map((item, index) => {
                      return (
                        <Row key={index} className='flex-1' style={{ minHeight: 60, justifyContent: 'center', fontSize: 28, marginTop: 6, color: state.isPointed ? item.isCorrect ? '#27ae60' : '#e74c3c' : 'black' }}>
                          <div>
                            <ArrowRightOutlined />
                          </div>
                        </Row>
                      )
                    })}
                  </Col>
                  <Col span={8}>
                    <div ref={dropRight}>
                      {cardsRight.map((card) => (<Card key={card.id} id={`${card.id}`} text={card.text} moveCard={moveCardRight} findCard={findCardRight} />))}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
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
              isDisabledSubmit={state.isPointed}
              isDisabledRetry={!state.isPointed}
              onSubmit={onSubmit}
              onRetry={onRetry}
              onPlayVideo={onPlayVideo}
              audioUrl={audio}
            />
          </CardFooter>
        </CardTrap>
      </Col>
    </Row>
  );
}

export default M1;
