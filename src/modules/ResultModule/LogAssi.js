import React from 'react';
import { Row, Col, Avatar, Rate } from 'antd';
// import { default as LogModitem } from "../LogModule/components/LogModitem";
import * as functions from 'components/functions';
import { ListGroup, ListGroupItem, Modal, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import Type02Log from './Log/Type02';
import Type03Log from './Log/Type03';
import Type04Log from './Log/Type04';
import Type05Log from './Log/Type05';
import Type06Log from './Log/Type06';
import Type07Log from './Log/Type07';
import Type09Log from './Log/Type09';
import Type10Log from './Log/Type10';
import Type12Log from './Log/Type12';
import Type12ALog from './Log/Type12A';
import Type13Log from './Log/Type13';
import Type14Log from './Log/Type14';
import Type15Log from './Log/Type15';
import Type16Log from './Log/Type16';
import Type17Log from './Log/Type17';
import Type18Log from './Log/Type18';
import Type20Log from './Log/Type20';
import Type31Log from './Log/Type31'
import queryString from 'query-string';

class LogAssi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: []
    };
    this.queryString = queryString.parse(props.location.search);
  }

  checkQuestionType = (item, type) => {
    switch (type) {
      case 'RepeatTheWords':
      case 'ListenAndRepeat':
      case 'SayTheWordsText':
      case 'SayTheWordsImage':
      case 'RepeatTheSentence':
      case 'RepeatTheSentence_A':
      case 'SpeakCorrectEnglishFromVietnamese':
        console.log(JSON.parse(item.studentChoices))
        return <Row gutter={[8, 8]}>{JSON.parse(item.studentChoices).wordShows.map((item, index) => {
          return <Col key={index} style={{ color: item.color }}><p>{item.word}</p></Col>
        })}</Row>

      default:
        return <p>{item.vocabularyQuestion?.[0].text}</p>
    }
  }

  renderTitle = (item, questionType) => {
    const { type } = this.queryString;
    switch (questionType) {
      case 'RECORD': {
        return this.checkQuestionType(item, type);
      }
      case 'GRAMMAR': {
        return <div>{item.grammarQuestion[0].correctAnswerText}</div>;
      }
      case 'ConversationOnePerson': {
        return <div></div>;
      }
      case 'MatchingWordWithPicture': {
        return <div></div>;
      }
      case 'OneTextMultiOptionOneCorrect': {
        return <div></div>;
      }
      case 'MatchingWordWithSound': {
        return <div></div>;
      }
      case 'MatchingSoundWithPicture': {
        return <div></div>;
      }
      case 'TOEIC_LISTENING_READING': {
        return <div className="text-primary" style={{ fontWeight: '500' }}>TOEIC LISTENING READING</div>;
      }


      default: {
        return <p>{item.vocabularyQuestion?.[0].text}</p>
      }
    }
  };

  renderItem = (resultsList) => {
    return resultsList.map((item, index) => {
      const no = index + 1;
      return (
        <ListGroupItem tag="a" key={index} onClick={() => this.toggleModal(item)}>
          <Row gutter={24} style={{ width: '100%' }}>
            <Col span={4}>
              <Avatar className='bg-default'>{no < 10 ? `0${no}` : no}</Avatar>
            </Col>
            <Col span={18}>
              {this.renderTitle(item, item.answerType)}
              <Rate
                disabled
                value={functions.getStarRecord(item.score)}
                allowHalf
              />
            </Col>
            <Col span={2} style={{ marginTop: 6 }}>
              <span>{parseInt(item.score)}%</span>
            </Col>
          </Row>
        </ListGroupItem>
      );
    });
  };

  toggleModal = (item) => {
    const { type } = this.queryString;
    if (type === 'Listening') return null;
    const { isVisibled } = this.state;
    this.setState({ isVisibled: !isVisibled, detail: item })
  }

  bodyModal = (detail) => {
    // if (detail) {
    //   detail.studentChoices && console.log(JSON.parse(detail.studentChoices))
    // }
    const { type } = this.queryString;
    switch (type) {
      case 'ListenAndRepeat': {
        return <Type02Log detail={detail} type={type} />
      }
      case 'OneCorrectQuestionText': {
        return <Type03Log detail={detail} type={type} />
      }
      case 'OneCorrectQuestionImage': {
        return <Type04Log detail={detail} type={type} />
      }
      case 'OneTextMultiOptionOneCorrect': {
        return <Type05Log detail={detail} type={type} />
      }
      case 'SpeakCorrectEnglishFromVietnamese': {
        return <Type06Log detail={detail} type={type} />
      }
      case 'RepeatTheWords': {
        return <Type07Log detail={detail} type={type} />
      }
      case 'SayTheWordsText': {
        return <Type09Log detail={detail} type={type} />
      }
      case 'SayTheWordsImage': {
        return <Type10Log detail={detail} type={type} />
      }
      case 'RepeatTheSentence': {
        return <Type12Log detail={detail} type={type} />
      }
      case 'RepeatTheSentence_A': {
        return <Type12ALog detail={detail} type={type} />
      }
      case 'ScrambleWord': {
        return <Type13Log detail={detail} type={type} />
      }
      case 'ScrambleWordForSS_A': {
        return <Type13Log detail={detail} type={type} />
      }
      case 'MakeASentence': {
        return <Type14Log detail={detail} type={type} />
      }
      case 'MatchingWordWithPicture': {
        return <Type15Log detail={detail} type={type} />
      }

      case 'MatchingWordWithSound': {
        return <Type16Log detail={detail} type={type} />
      }
      case 'MatchingSoundWithPicture': {
        return <Type17Log detail={detail} type={type} />
      }
      case 'MatchingSoundWithPicture_A': {
        return <Type17Log detail={detail} type={type} />
      }
      case 'CompleteWord': {
        return <Type18Log detail={detail} type={type} />
      }
      case 'CompleteWordForSS_A': {
        return <Type18Log detail={detail} type={type} />
      }
      case 'Grammar': {
        return <Type20Log detail={detail} type={type} />
      }
      case 'TOEIC_LISTENING_READING': {
        return <Type31Log detail={detail} type={type} />
      }
      default: return null
    }
  }

  render = () => {
    const { results } = this.props;
    const { isVisibled, detail } = this.state;
    const resultsList = (results && JSON.parse(results[0].resultLogs)) || [];
    const { type } = this.queryString;
    return (
      <>
        <ListGroup>
          {type !== 'IELTS_DICTATION' && (
            <ListGroupItem key='text' style={{ borderWidth: 0, fontSize: 20, fontWeight: '500' }} className="active text-center bg-default">ĐÁNH GIÁ CHI TIẾT</ListGroupItem>
          )}
          {this.renderItem(resultsList)}
        </ListGroup>
        <Modal
          className="modal-dialog-centered modal-lg"
          contentClassName="bg-secondary"
          isOpen={isVisibled}
          toggle={() => this.toggleModal()}

        >
          <div className="modal-header">
            <h6 className="modal-title" id="modal-title-notification">
              Kết quả làm bài
            </h6>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => this.toggleModal()}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          {this.bodyModal(detail)}
          <div className="modal-footer">
            <Button
              className="ml-auto"
              color="primary"
              data-dismiss="modal"
              type="button"
              onClick={() => this.toggleModal()}
            >
              Đóng
            </Button>
          </div>
        </Modal>
      </>
    );
  };
}
LogAssi.propTypes = {
  results: PropTypes.instanceOf(Object),
  location: PropTypes.instanceOf(Object),
}

export default LogAssi;
