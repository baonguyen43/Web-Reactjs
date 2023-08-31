import React from 'react';
import {
  Button,
  Modal,
  Card,
  CardImg,
  CardBody,
  CardText,
  Progress,
  Col
} from 'reactstrap';
import { Rate } from 'antd';
import { useDispatch } from 'react-redux';
import * as ActionTypes from 'modules/SessionModule/actions/types';
import PropTypes from 'prop-types';

const PartsModal = ({
  isVisibled,
  toggleModal,
  groupPart,
  sessionItem,
  history,
  classId,
}) => {
  const dispatch = useDispatch();
  // Chuyển đến QuestionModule - PartQuestions
  const moveToNextPage = React.useCallback(
    (item, index) => {
      const sessionId = sessionItem.id || sessionItem.sessionId;

      dispatch({
        type: ActionTypes.SAVE_SELECTED_PART,
        selectedPart: { ...item, index },
        groupPart,
        partQuestion: true,
      });

      const to = `/ames/class/${classId}/session/${sessionId}/questionsMix`;

      history.push(to);
    },
    [classId, dispatch, groupPart, history, sessionItem]
  );

  const Content = React.useCallback(() => {
    return groupPart.map((item, index) => {
      return (
        //  className="card-lift--hover"
        <Col key={index} xs={12} sm={6} md={6} lg={4} xl={4} xxl={2} >
          <Card key={index}>
            <CardImg
              alt="..."
              src="https://image.freepik.com/free-photo/learn-english-sticky-notes-pink-background_23-2148293417.jpg"
              top
            />
            <CardBody>
              <CardText>
                <span
                  className="text-warning"
                  style={{ fontSize: 18, fontWeight: '500' }}
                >
                  {item.Title}
                </span>
              </CardText>

              <span>
                <small className="text-muted">Đánh giá </small>
                <Rate
                  style={{ marginLeft: 15 }}
                  disabled
                  allowHalf
                  value={item.Star / 20}
                />
              </span>
              <span>
                <div className="progress-wrapper">
                  <div className="progress-warning">
                    <div className="progress-label">
                      <span style={{ color: '#fb6340' }}>Hoàn thành</span>
                    </div>
                    <div className="progress-percentage">
                      <span>{item.CompletedPercent}%</span>
                    </div>
                  </div>
                  <Progress
                    max="100"
                    value={item.CompletedPercent}
                    color="warning"
                  />
                </div>
              </span>
              <div className="text-right">
                <Button
                  outline
                  color="warning"
                  // href="#pablo"
                  onClick={() => moveToNextPage(item, index)}
                >
                  Làm bài
              </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      );
    });
  }, [groupPart, moveToNextPage]);
  return (
    <>
      <Modal
        className="modal-dialog-centered modal-danger modal-xl"
        isOpen={isVisibled}
        toggle={() => toggleModal(groupPart)}
      >
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Chọn phần học khóa {sessionItem?.title || sessionItem?.sessionName}
          </h5>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => toggleModal(groupPart)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="card-deck ">{Content()}</div>
        </div>
        <div className="modal-footer">
          <Button
            color="secondary"
            data-dismiss="modal"
            type="button"
            onClick={() => toggleModal(groupPart)}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
};

PartsModal.propTypes = {
  groupPart: PropTypes.instanceOf(Array),
  sessionItem: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  classId: PropTypes.string,
  isVisibled: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
}

export default PartsModal;
