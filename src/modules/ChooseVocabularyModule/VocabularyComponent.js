import React from 'react';
import { Modal, Tabs, Result } from 'antd';
import {
  Card,
  Row,
  Col,
  Button,
  CardBody,
  CardTitle,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import _get from 'lodash/get';
import Loading from 'components/Loading';
import * as Color from 'configs/color';
import NotData from 'components/Error/NotData';
import { dynamicApiAxios } from '../../configs/api';
import openNotificationWithIcon from 'components/Notification';

import { getUser } from 'components/functions';
import PropTypes from 'prop-types';
// import * as Colors from 'configs/color'

// const color = ['warning', 'danger', 'info'];
// const randomIndex = Math.floor(Math.random(color) * 3);
// const name = `active bg-${Colors.PRIMARY} text-center`;

class VocabularyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LogId: 1,
      GameLevel: 1,
      countKnown: 0,
      countNew: 0,
      question: [],
      answers: [],
      visibleDetail: false,
      visibleModelReset: false,
      listNew: [],
      listKnown: [],
      loading: true,
      isCompleted: false,
      message: '',
    };

    this.student = getUser();
  }

  componentDidMount = async () => {
    if(!this.student) return this.props.history.push('/ames/homepage')
    await this.getUserLog();
    await this.getVocabulary();
  };

  getUserLog = async () => {
    const body = {
      sqlCommand: '[dbo].[p_AMES247_GAME_Get_UserLog]',
      parameters: {
        StudentId: this.student.StudentId,
        Game: 'VOCABULARY',
      },
    };
    try {
      const response = await dynamicApiAxios.query.post('', body);
      const countKnown = response.data.items[0].totalCorrect;
      const countNew =
        response.data.items[0].totalWords - response.data.items[0].totalCorrect;
      this.setState({
        LogId: response.data.items[0].logId,
        GameLevel: response.data.items[0].gameLevel,
        countKnown,
        countNew,
      });
    } catch (error) {
      openNotificationWithIcon(
        'danger',
        'Thông báo',
        'Lỗi dữ liệu, vui lòng thử lại sau.'
      );
    }
  };

  getVocabulary = async () => {
    const { LogId, GameLevel } = this.state;
    const body = {
      sqlCommand: '[dbo].[p_AMES247_Practice_Vocabulary_GetQuestions_V4]',
      parameters: {
        StudentId: this.student.StudentId,
        LogId,
        GameLevel,
      },
    };
    try {
      const response = await dynamicApiAxios.query.post('', body);
      if (response.data.items.length > 0) {
        const isCompleted =
          _get(response.data.items[0], 'isCompleted') || false;
        const message = _get(response.data.items[0], 'message') || '';
        if (isCompleted) {
          this.setState({ isCompleted, message, loading: false });
        } else {
          const answers = JSON.parse(response.data.items[0].answers) || '';
          this.setState({
            question: response.data.items[0],
            answers,
            loading: false,
          });
        }
      } else {
        this.setState({ loading: false });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  getListKnew = async () => {
    const body = {
      sqlCommand: '[dbo].[p_AMES247_Practice_Vocabulary_GetLogs_V2]',
      parameters: {
        StudentId: this.student.StudentId,
        Evaluation: 'NEW',
      },
    };
    try {
      const response = await dynamicApiAxios.query.post('', body);
      if (response.data.items.length > 0) {
        this.setState({ listNew: response.data.items });
      }
    } catch (error) {
      console.log(error);
      openNotificationWithIcon(
        'danger',
        'Thông báo',
        'Lỗi dữ liệu, vui lòng thử lại sau.'
      );
    }
  };

  getListNew = async () => {
    const body = {
      sqlCommand: '[dbo].[p_AMES247_Practice_Vocabulary_GetLogs_V2]',
      parameters: {
        StudentId: this.student.StudentId,
        Evaluation: 'KNOWN',
      },
    };
    try {
      const response = await dynamicApiAxios.query.post('', body);
      if (response.data.items.length > 0) {
        this.setState({ listKnown: response.data.items });
      }
    } catch (error) {
      console.log(error);
      openNotificationWithIcon(
        'danger',
        'Thông báo',
        'Lỗi dữ liệu, vui lòng thử lại sau.'
      );
    }
  };

  chooseAnswer = async (answer) => {
    const { question, LogId } = this.state;
    const isCorrect = answer.IsTrue;
    if (isCorrect === true) {
      openNotificationWithIcon('success', 'Thông báo', 'Đáp án chính xác');
    } else {
      openNotificationWithIcon('danger', 'Thông báo', 'Đáp án chưa chính xác');
    }
    this.setState({ loading: true });
    const body = {
      sqlCommand: '[dbo].[p_AMES247_PracticeVocabulary_SaveLogs_V2]',
      parameters: {
        StudentId: this.student.StudentId,
        VocabularyId: question.id,
        IsTrue: isCorrect,
        LogId,
      },
    };
    try {
      const response = await dynamicApiAxios.query.post('', body);
      if (response.data.items[0].gameStatus === 'LEVEL-UP') {
        openNotificationWithIcon(
          'success',
          'Thông báo',
          `Chúc mừng bạn đã đạt được cấp độ ${response.data.items[0].gameLevel}`
        );
      }
      const GameLevel = response.data.items[0].gameLevel;
      const countKnown = response.data.items[0].totalCorrect;
      const countNew =
        response.data.items[0].totalWords - response.data.items[0].totalCorrect;
      this.setState({ countKnown, countNew, GameLevel });
    } catch (error) {
      console.log(error);
      openNotificationWithIcon(
        'danger',
        'Thông báo',
        'Lỗi dữ liệu, vui lòng thử lại sau.'
      );
    }
    this.nextQuestion();
  };

  nextQuestion = async () => {
    await this.getUserLog();
    await this.getVocabulary();
    this.setState({ loading: false });
  };

  goToDetail = () => {
    this.setState({ visibleDetail: true });
    this.getListNew();
    this.getListKnew();
  };

  callBack = (key) => {
    // console.log('TCL: VocabularyComponent -> callBack -> key', key);
  };

  hiddeModal = () => {
    this.setState({ visibleDetail: false });
  };

  loadingComponent = () => {

  };

  resetVocabulary = async () => {
    this.setState({ visibleModelReset: !this.state.visibleModelReset });
  };

  handleOk = async () => {
    this.setState({
      visibleModelReset: !this.state.visibleModelReset,
    });
    const body = {
      sqlCommand: '[dbo].[p_Ames247_GamePracticeVocabulary_ResetLog]',
      parameters: {
        StudentId: this.student.StudentId,
      },
    };
    try {
      await dynamicApiAxios.query.post('', body);
      window.location.reload(false);
    } catch (error) {
      openNotificationWithIcon(
        'danger',
        'Thông báo',
        'Lỗi dữ liệu, vui lòng thử lại sau.'
      );
    }
  };

  handleCancel = () => {
    this.setState({
      visibleModelReset: false,
    });
  };

  renderComponent = () => {
    const {
      GameLevel,
      countKnown,
      countNew,
      question,
      answers,
      visibleDetail,
      listKnown,
      listNew,
      isCompleted,
    } = this.state;
    const { TabPane } = Tabs;
    const defautColor = `header bg-${Color.PRIMARY}`;
    const defautColorCard = `bg-${Color.PRIMARY}`;
    return (
      <>
        {/* //////////////////////////////////////////////////////////////////////////////////////// */}
        {/* //////////////////////////////////////////////////////////////////////////////////////// */}
        {/* /HEADER/ */}
        <div className={defautColor}>
          <Card className={defautColorCard} style={{ margin: 0 }}>
            <CardBody style={{ padding: 0 }}>
              <div>
                {/* <Button
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
                </Button> */}
              </div>
              <CardTitle
                className="text-white text-center"
              >
                <span style={{ fontSize: 30, fontWeight: '600' }}>Vocabulary Practice</span>

                <footer className="text-white">
                  <cite style={{ fontSize: 15, fontWeight: '400' }} title="Source Title">Luyện tập từ vựng</cite>
                </footer>
              </CardTitle>
              <blockquote className="blockquote text-white mb-0 text-center">
                <p style={{ fontSize: 15, fontWeight: '400' }}>
                  <i className="fas fa-check-square"></i> Known words:{' '}
                  <b>{countKnown}</b>{' '}
                  <i
                    style={{ marginLeft: 10 }}
                    className="fas fa-times-circle"
                  ></i>{' '}
                  Unknown words:{' '}
                  <b>{countNew}</b>{' '}
                  <i
                    style={{ marginLeft: 10 }}
                    className="fas fa-layer-group"
                  ></i>{' '}
                  Level: <b>{GameLevel}</b>
                  <Button
                    style={{ marginLeft: 15 }}
                    size="sm"
                    // color='danger'
                    type="primary"
                    onClick={this.goToDetail}
                  >
                    <span className="btn-inner--icon mr-2">
                      <i className="fas fa-info-circle"></i>
                    </span>
                    Detail
                  </Button>
                </p>
              </blockquote>
            </CardBody>
          </Card>
        </div>
        {/* //////////////////////////////////////////////////////////////////////////////////////// */}
        {/* //////////////////////////////////////////////////////////////////////////////////////// */}
        {/* NỘI DUNG PHẦN TRẮC NGHIỆM */}

        {!isCompleted ? (
          <Row className="justify-content-md-center mt-3" >
            <Col lg="8" className="justify-content-center" >
              <Card >
                <ListGroup>
                  <ListGroupItem
                    style={{
                      borderWidth: 0,
                      fontSize: 20,
                      padding: 0,
                    }}
                    className="active bg-default text-white text-center"
                  >
                    Choose the word that means
                  <footer className="text-white">
                      <cite title="Source Title" style={{ fontSize: 15 }}>Chọn nghĩa của từ sau</cite>
                    </footer>
                  </ListGroupItem>
                  <ListGroupItem className="text-center">
                    <div className='text-danger display-4' style={{ fontSize: 35 }}>
                      {question.text}
                    </div>

                    {answers.map((answer, index) => {
                      return (
                        <Button
                          className="mt-3 ml-0"
                          style={{ width: '60%', display: 'inline' }}
                          key={index}
                          color='info'
                          block
                          onClick={() => this.chooseAnswer(answer)}
                        >
                          {answer.Text}
                        </Button>
                      );
                    })}
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        ) : (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Result
                status="success"
                title="Bạn đã hoàn thành khóa luyện tập từ vựng!"
                subTitle="Bạn có thể bắt đầu lại từ đầu khóa học - Lưu ý dữ liệu từ vựng đã nắm không thể khôi phục lại."
                extra={[
                  <Button
                    color="primary"
                    onClick={this.resetVocabulary}
                    type="primary"
                    key="console"
                  >
                    Bắt đầu lại
                </Button>,
                ]}
              />
            </div>
          )}
        {/* Modal detail */}
        <Modal
          visible={visibleDetail}
          footer={null}
          bodyStyle={{ paddingRight: 10 }}
          onCancel={this.hiddeModal}
        >
          <Tabs defaultActiveKey="1" onChange={this.callBack}>
            <TabPane tab="TỪ CHƯA BIẾT" key="1">
              <div>
                <ListGroup>
                  <ListGroupItem
                    className="list-group-item-action active d-flex justify-content-between align-items-center"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    tag="a"
                  >
                    <span style={{ fontSize: 15, fontWeight: '500' }}>
                      Từ vựng
                    </span>
                    <span style={{ fontSize: 15, fontWeight: '500' }}>
                      Phiên âm
                    </span>
                  </ListGroupItem>
                  <div
                    style={{
                      overflowY: 'scroll',
                      height: '60vh',
                    }}
                  >
                    {listNew.map((item) => (
                      <>
                        <ListGroupItem
                          className="list-group-item-action d-flex justify-content-between align-items-center"
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                          tag="a"
                        >
                          <span style={{ fontSize: 15, fontWeight: '400' }}>
                            {item.text}
                          </span>
                          <span
                            style={{ fontSize: 15, fontWeight: '400' }}
                          >{`/ ${item.phonetics} /`}</span>
                        </ListGroupItem>
                      </>
                    ))}
                  </div>
                </ListGroup>
              </div>
            </TabPane>
            <TabPane tab="TỪ ĐÃ BIẾT" key="2">
              <div>
                <ListGroup>
                  <ListGroupItem
                    className="list-group-item-action active d-flex justify-content-between align-items-center"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    tag="a"
                  >
                    <span style={{ fontSize: 15, fontWeight: '500' }}>
                      Từ vựng
                    </span>
                    <span style={{ fontSize: 15, fontWeight: '500' }}>
                      Phiên âm
                    </span>
                  </ListGroupItem>
                  <div
                    style={{
                      overflowY: 'scroll',
                      height: '60vh',
                    }}
                  >
                    {listKnown.map((item) => (
                      <>
                        <ListGroupItem
                          className="list-group-item-action d-flex justify-content-between align-items-center"
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                          tag="a"
                        >
                          <span style={{ fontSize: 15, fontWeight: '400' }}>
                            {item.text}
                          </span>
                          <span
                            style={{ fontSize: 15, fontWeight: '400' }}
                          >{`/ ${item.phonetics} /`}</span>
                        </ListGroupItem>
                      </>
                    ))}
                  </div>
                </ListGroup>
              </div>
            </TabPane>
          </Tabs>
        </Modal>
        {/* Modal reset */}
        <Modal
          title="Thông báo"
          visible={this.state.visibleModelReset}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Result
            status="warning"
            title="Kết quả đã học không thể khôi phục  Bạn có chắc chắn muốn bắt đầu lại"
          />
        </Modal>
      </>
    );
  };

  render = () => {
    const { loading, question } = this.state;
    if (loading) return <Loading />;
    if (!question) {
      return <NotData />;
    }
    return this.renderComponent()
  };
}

VocabularyComponent.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired
}

export default VocabularyComponent;

