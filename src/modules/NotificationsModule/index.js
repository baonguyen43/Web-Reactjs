import React from 'react';
import { dynamicApiAxios } from 'configs/api';
import { useSelector } from 'react-redux';
import moment from 'moment';
import {
  ListGroupItem,
  ListGroup,
  Row,
  Col,
  Card
} from 'reactstrap';
import ModalNotificationsModule from 'components/Modal/ModalNotificationsModule';
import * as Colors from 'configs/color'

const colorClassName = `active bg-${Colors.PRIMARY} text-left`

const NotificationsModule = () => {
  const loggedInUser = useSelector((rootState) => rootState.loginReducer.loggedInUser)
  const [state, setState] = React.useState({
    loading: true,
    notifiList: [],
    jsonData: [],
    isVisibled: false,
    question: []
  })

  React.useEffect(() => {
    const getNotification = async () => {
      let UserId = '';
      if (loggedInUser?.typeLogin.includes('ames')) {
        UserId = loggedInUser.userMyames.UserId;
      } else {
        UserId = loggedInUser.userMyai.UserId
      }
      const listResponse = await dynamicApiAxios.query.post('', {
        sqlCommand: 'dbo.p_AMES247_GET_Notification_History',
        parameters: {
          UserId,
          Page: 0,
        },
      });

      setState((prevState) => ({ ...prevState, notifiList: listResponse.data.items, loading: false }))
    }
    getNotification();
  }, [loggedInUser])

  const toggleModal = React.useCallback((jsonData) => {
    setState((prevState) => ({
      ...prevState, isVisibled: !state.isVisibled, jsonData
    }))
  },[state.isVisibled])

  const renderItem = React.useCallback(() => {

    return state.notifiList.map((item, index) => {
      const jsonData = JSON.parse(item.jsonData)
      return (
        <ListGroupItem
          key={index}
          className="list-group-item-action"
          onClick={() => toggleModal(jsonData)}
          tag="a"
        >
          <Row className="align-items-center">
            <Col className="col-auto">
              <img
                alt="..."
                className="avatar rounded-circle"
                src='https://176g4u2eqkgm30b0371yje33-wpengine.netdna-ssl.com/wp-content/uploads/2018/04/image-11.png'
              />
            </Col>
            <div className="col ml--2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0 text-sm">{item.title}</h4>
                </div>
                <div className="text-right text-muted">
                  <small>{moment(item.createdDate).format('DD/MM/YYYY')}</small>
                </div>
              </div>
            </div>
          </Row>
        </ListGroupItem>
      )
    })
  }, [state.notifiList, toggleModal])

  

  React.useEffect(() => {
    const getResult = async () => {
      if (!state.jsonData) return null;
      const parameters = {
        studentID: state.jsonData.studentId,
        sessionId: state.jsonData.sessionId,
      };

      const body = {
        sqlCommand: 'p_AMES247_Speaking_Practice_Log',
        parameters,
      };

      try {
        const response = await dynamicApiAxios.query.post('', body);
        if (response.data.ok) {
          setState((previousState) => ({ ...previousState, question: response.data.items[0] }))
        }
      } catch (error) {
        console.log(error)
      }
    }
    getResult();
  }, [state.jsonData])

  return (
    <>
      <Row className="justify-content-md-center text-center mt-3">
        <Col lg="9">
          <Card>
            <ListGroup>
              <ListGroupItem
                style={{
                  // backgroundColor: "#F5365C",
                  borderWidth: 0,
                  fontSize: 20,
                  fontWeight: '500',
                }}
                className={colorClassName}
              >
                Danh sách thông báo
                {/* <p>{question.wordType}</p>
                <p>Meaning</p> */}
              </ListGroupItem>
              {renderItem()}
            </ListGroup>
          </Card>
        </Col>
        <ModalNotificationsModule question={state.question} isVisibled={state.isVisibled} toggleModal={toggleModal} />
      </Row>
    </>
  )
}
export default NotificationsModule