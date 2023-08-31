/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import { ListGroupItem, ListGroup, Modal, Button } from 'reactstrap';
import { Row, Col, Avatar, Rate } from 'antd';
import * as functions from 'components/functions';
import Type02Log_Mix from './Log_Mix/Type02_Mix';
import Type03Log_Mix from './Log_Mix/Type03_Mix';
import Type04Log_Mix from './Log_Mix/Type04_Mix';
import Type05Log_Mix from './Log_Mix/Type05_Mix';
import Type06Log_Mix from './Log_Mix/Type06_Mix';
import Type07Log_Mix from './Log_Mix/Type07_Mix';
import Type09Log_Mix from './Log_Mix/Type09_Mix';
import Type10Log_Mix from './Log_Mix/Type10_Mix';
import Type12Log_Mix from './Log_Mix/Type12_Mix';
import Type13Log_Mix from './Log_Mix/Type13_Mix';
import Type14Log_Mix from './Log_Mix/Type14_Mix';
import Type15Log_Mix from './Log_Mix/Type15_Mix';
import Type16Log_Mix from './Log_Mix/Type16_Mix';
import Type17Log_Mix from './Log_Mix/Type17_Mix';
import Type18Log_Mix from './Log_Mix/Type18_Mix';
import Type20Log_Mix from './Log_Mix/Type20_Mix';
class LogAssi_Mix extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: [],
    };
  }

  renderItem = (resultsList) => {
    return resultsList.map((item, index) => {
      const no = index + 1;
      return (
        <ListGroupItem key={index} tag="a" onClick={() => this.toggleModal(item)}>
          <Row gutter={24} style={{ width: '100%' }}>
            <Col span={4}>
              <Avatar style={{ backgroundColor: '#5E76E5' }}>{no < 10 ? `0${no}` : no}</Avatar>
            </Col>
            <Col span={18}>
              {/* {this.renderTitle(item, item.answerType)} */}
              <h5>{item.assignmentTitle}</h5>
              <Rate disabled value={functions.getStarRecord(item.score)} allowHalf />
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
    const { isVisibled } = this.state;
    if (!item) {
      this.setState({ isVisibled: !isVisibled });
    } else {
      const { questionType } = item;
      if (questionType === 'Listening') return null;
      this.setState({ isVisibled: !isVisibled, detail: item });
    }
  };

  bodyModal = (detail) => {
    const { questionType } = detail;
    switch (questionType) {
      case 'ListenAndRepeat': {
        return <Type02Log_Mix detail={detail} type={questionType} />;
      }
      case 'OneCorrectQuestionText': {
        return <Type03Log_Mix detail={detail} type={questionType} />;
      }
      case 'OneCorrectQuestionImage': {
        return <Type04Log_Mix detail={detail} type={questionType} />;
      }
      case 'OneTextMultiOptionOneCorrect': {
        return <Type05Log_Mix detail={detail} type={questionType} />;
      }
      case 'SpeakCorrectEnglishFromVietnamese': {
        return <Type06Log_Mix detail={detail} type={questionType} />;
      }
      case 'RepeatTheWords': {
        return <Type07Log_Mix detail={detail} type={questionType} />;
      }
      case 'SayTheWordsText': {
        return <Type09Log_Mix detail={detail} type={questionType} />;
      }
      case 'SayTheWordsImage': {
        return <Type10Log_Mix detail={detail} type={questionType} />;
      }
      case 'RepeatTheSentence': {
        return <Type12Log_Mix detail={detail} type={questionType} />;
      }
      case 'ScrambleWord': {
        return <Type13Log_Mix detail={detail} type={questionType} />;
      }
      case 'MakeASentence': {
        return <Type14Log_Mix detail={detail} type={questionType} />;
      }
      case 'MatchingWordWithPicture': {
        return <Type15Log_Mix detail={detail} type={questionType} />;
      }
      case 'MatchingWordWithSound': {
        return <Type16Log_Mix detail={detail} type={questionType} />;
      }
      case 'MatchingSoundWithPicture': {
        return <Type17Log_Mix detail={detail} type={questionType} />;
      }
      case 'CompleteWord': {
        return <Type18Log_Mix detail={detail} type={questionType} />;
      }
      case 'Grammar': {
        return <Type20Log_Mix detail={detail} type={questionType} />;
      }
      default:
        return null;
    }
  };

  render = () => {
    const { results } = this.props;
    const { isVisibled, detail } = this.state;
    return (
      <React.Fragment>
        <ListGroup>
          <ListGroupItem
            style={{ backgroundColor: '#5E76E5', borderWidth: 0, fontSize: 20, fontWeight: '500' }}
            className="active text-center"
          >
            ĐÁNH GIÁ CHI TIẾT
          </ListGroupItem>
          {this.renderItem(results)}
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
      </React.Fragment>
    );
  };
}
export default LogAssi_Mix;
