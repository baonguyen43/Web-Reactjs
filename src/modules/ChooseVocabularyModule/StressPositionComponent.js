import React from 'react';
import {
  Row,
  Col,
  Card,
  Modal,
  Alert,
  Button,
  CardBody,
  Collapse,
  ListGroup,
  CardTitle,
  CardHeader,
  ListGroupItem,
} from 'reactstrap';
import { Markup } from 'interweave';
import PropTypes from 'prop-types';
import * as Color from 'configs/color';
import Loading from 'components/Loading';
import Listen from 'components/Listening';
import NotData from 'components/Error/NotData';
import { getUser } from 'components/functions';
import { dynamicApiAxios } from '../../configs/api';
import openNotificationWithIcon from 'components/Notification';

const defautColor = `header bg-${Color.PRIMARY} mt--1`;
const defautColorCard = `bg-${Color.PRIMARY}`

class StressPositionComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      question: [],
      answers: [],
      answer: null,
      LogId: 1,
      totalWords: [],
      totalCorrect: [],
      isCorrect: false,
      isShowModal: false,
      openedCollapses: false

    };
    this.student = getUser();
  }
  
  componentDidMount = async () => {
    if(!this.student) return this.props.history.push('/ames/homepage')
    await this.getUserLog();
    await this.getStressPosition();
  };

  collapsesToggle = () => {
    this.setState({
      openedCollapses: !this.state.openedCollapses,
    });
  }
  getUserLog = async () => {
  
    const body = {
      sqlCommand: '[dbo].[p_AMES247_GAME_Get_UserLog]',
      parameters: {
        StudentId: this.student?.StudentId,
        Game: 'STREES-POSITION',
      },
    };
    try {
      const response = await dynamicApiAxios.query.post('', body);
      const totalWords = response.data.items[0].totalWords;
      const totalCorrect = response.data.items[0].totalCorrect;
      // const countKnown = response.data.items[0].totalCorrect;
      // const countNew = response.data.items[0].totalWords - response.data.items[0].totalCorrect;
      this.setState({
        LogId: response.data.items[0].logId,
        GameLevel: response.data.items[0].gameLevel,
        totalWords,
        totalCorrect,
      });
    } catch (error) {
      openNotificationWithIcon(
        'danger',
        'Thông báo',
        'Lỗi dữ liệu, vui lòng thử lại sau.'
      );
    }
  };

  getStressPosition = async () => {
    const body = {
      sqlCommand: '[dbo].[p_AMES247_GAME_Get_Question_StressPosition_V3]',
      parameters: {
        StudentId: this.student.StudentId,
      },
    };
    try {
      const response = await dynamicApiAxios.query.post('', body);
      if (response.data.items.length > 0) {
        const answers = JSON.parse(response.data.items[0].answers);
        this.setState({
          question: response.data.items[0],
          loading: false,
          answers,
          isShowModal: false,
        });
      }
    } catch (error) {
      this.setState({ loading: false });
      openNotificationWithIcon(
        'danger',
        'Thông báo',
        'Lỗi dữ liệu, vui lòng thử lại sau.'
      );
    }
  };

  chooseAnswer = async (answer) => {
    this.toggleModal();
    const { LogId, question } = this.state;
    this.setState({ answer })
    const isCorrect = answer.IsTrue === 1;
    // if (isCorrect) {
    //   openNotificationWithIcon(
    //     'success',
    //     'Thông báo',
    //     'Đáp án chính xác.',
    //     'tr'
    //   );
    // } else {
    //   openNotificationWithIcon(
    //     'danger',
    //     'Thông báo',
    //     'Chưa chính xác, vui lòng kiểm tra lại đáp án',
    //     'tr'
    //   );
    // }

    const body = {
      sqlCommand: '[dbo].[p_AMES247_GAME_Set_Question_StressPosition_Log_V2]',
      parameters: {
        LogId,
        StudentId: this.student.StudentId,
        DifficultyScore: question.difficultyScore,
        QuestionId: question.id,
        IsCorrect: isCorrect,
      },
    };
    try {
      await dynamicApiAxios.query.post('', body);
    } catch (error) {
      console.log(error);
      openNotificationWithIcon(
        'danger',
        'Thông báo',
        'Lỗi dữ liệu, vui lòng thử lại sau.'
      );
    }
  };

  toggleModal = () => {
    this.setState({ isShowModal: !this.state.isShowModal });
  };

  nextQuestion = async () => {
    this.setState({ loading: true, openedCollapses: false, });
    await this.getUserLog();
    await this.getStressPosition();
    this.setState({ loading: false });
  };

  renderComponent = () => {
    const {
      question,
      answers,
      answer,
      isShowModal,
      totalWords,
      totalCorrect,
    } = this.state;
    return (
      <>
        {/* //////////////////////////////////////////////////////////////////////////////////////// */}
        {/* //////////////////////////////////////////////////////////////////////////////////////// */}
        {/* HEADER*/}
        <div className={defautColor} >
          <Card className={defautColorCard} style={{ margin: 0 }}>
            <CardBody style={{ padding: 0 }}>
              {/* <div>
                <Button
                  className="text-right"
                  type="primary"
                  size="sm"
                  onClick={() => this.props.history.push('/ames/choose')}
                  style={{ marginLeft: 10 }}
                >
                  <span className="btn-inner--icon mr-2">
                    <i className="fas fa-arrow-left"></i>
                  </span>
                Back
              </Button>
              </div> */}
              <CardTitle
                className="text-white text-center"
              >
                <span style={{ fontSize: 30, fontWeight: '500' }}>WORD STRESS</span>
                <footer className="text-white" style={{marginTop: 0}}>
                  <cite style={{ fontSize: 15, fontWeight: '400' }} title="Source Title">Xác định trọng âm</cite>
                </footer>
              </CardTitle>

              <blockquote className="blockquote text-white mb-0 text-center">
                <p style={{ fontSize: 15, fontWeight: '400' }}>
                  <i className="fas fa-check-square"></i> Total number of words answered:{' '}
                  <b>{totalWords}</b>
                  <i style={{ marginLeft: 15 }} className="fas fa-times-circle"></i>   Number of correct answers: <b>{totalCorrect}</b>
                  <i style={{ marginLeft: 15 }} className="fas fa-layer-group"></i>   Correct ratio:<b> {totalWords === 0 ? 0 : ((totalCorrect * 100) / totalWords).toFixed(1)}%  </b>
                </p>
              </blockquote>
            </CardBody>
          </Card>
        </div>

        <Row className="justify-content-md-center mt-3">
          <Col lg="8">
            <Card>
              <ListGroup>
                <ListGroupItem
                  style={{
                    borderWidth: 0,
                    fontSize: 20,
                    padding: 0,
                  }}
                  className="active bg-default text-white text-center"
                >
                  Choose the main stressed syllable
                  <footer className="text-white">
                    <cite title="Source Title" style={{ fontSize: 15 }}>Xác định trọng âm từ sau</cite>
                  </footer>
                  {/* <p>{question.wordType}</p>
                <p>Meaning</p> */}
                </ListGroupItem>
                <ListGroupItem>
                  <div className="accordion">
                    <Card className="card-plain" style={{ boxShadow: 'none' }}>
                      <CardHeader
                        role="tab"
                        onClick={() => this.collapsesToggle()}
                        aria-expanded={this.state.openedCollapses}
                        className="text-center"
                      >
                        <div className='text-danger display-4' style={{ fontSize: 35 }}>
                          {question.text}
                        </div>
                        {/* <div className='text display-4' style={{ fontSize: 20 }}>
                          {question.phonetics}
                        </div> */}
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: '300',
                            fontStyle: 'italic',
                          }}
                        >
                          {question.wordType}
                        </div>
                        <div
                          style={{ fontSize: 18, fontWeight: '500', color: '#0993EA' }}
                        >
                          Meaning
                    </div>
                      </CardHeader>
                      <Collapse
                        role="tabpanel"
                        isOpen={this.state.openedCollapses}
                      >
                        <CardBody>
                          <Markup content={question.definition} />
                        </CardBody>
                      </Collapse>
                    </Card>
                  </div>
                </ListGroupItem>

                <ListGroupItem className="text-center">
                  {answers.map((answer, index) => (
                    <Button
                      key={index}
                      type="button"
                      color='danger'
                      onClick={() => this.chooseAnswer(answer)}
                      style={{ fontSize: 20 }}
                    >
                      {answer.Text}
                    </Button>
                  ))}
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>

        {/* /////////////////////////////////////////////////////////////////////////////////////// */}
        <Modal
          className="modal-dialog-centered"
          isOpen={isShowModal}
          toggle={() => this.toggleModal}
        >
          <div className="modal-header">
            <h6 className="modal-title" id="modal-title-default">
              Result
                </h6>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={this.toggleModal}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <div className="modal-body text-center">
            {answer?.IsTrue === 1 ? (
              <Alert color="success">
                <strong>Correct answer</strong>
              </Alert>
            ) : (
                <Alert color="danger">
                  <strong>Incorrect answer</strong>
                </Alert>
              )}

            <p style={{ fontSize: 25, fontWeight: '500', color: '#f5365c' }}>{question.text}</p>
            <p style={{ fontSize: 15, fontStyle: 'italic' }}>{`/${question.phonetics}/`}</p>

            <p style={{ fontSize: 15, fontWeight: '500' }} className='text-default'>{`Nhấn ở âm thứ ${question.stressPosition}`}</p>
            <Listen onAuto audioURL={question.soundUK} />
          </div>
          <div className="modal-footer">

            <Button
              className="ml-auto"
              color="primary"
              data-dismiss="modal"
              type="button"
              onClick={this.nextQuestion}
            >
              Tiếp tục
                </Button>
          </div>
        </Modal>
      </>
    );
  };

  render = () => {
    const { loading, question } = this.state;
    if (loading) return <Loading />;
    if (!question) return <NotData />;
    return this.renderComponent()
  };
}
StressPositionComponent.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired
}


export default StressPositionComponent;
