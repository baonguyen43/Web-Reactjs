import React from 'react';
import {
  Button,
  Modal,
} from 'reactstrap';
import moment from 'moment';
import PropTypes from 'prop-types';
import { dynamicApiAxios } from 'configs/api';

const ModalResultType32 = ({  isVisibled, toggleModal ,studentId, sessionId}) => {

  const [state, setState] = React.useState({
    question: [],
    questionList: [],
  })
  React.useEffect(() => {
    const getResult = async () => {

      const parameters = {
        studentID: studentId,
        sessionId,
      };

      const body = {
        sqlCommand: 'p_AMES247_Speaking_Practice_Log',
        parameters,
      };

      try {
        const response = await dynamicApiAxios.query.post('', body);
        if (response.data.ok) {
          // .questionList = response.data.items;
          // stateModel.question = response.data.items[this.questionIndex];
          setState((previousState) => ({ ...previousState, question: response.data.items[0], questionList: response.data.items}))
          // stateModel.audioUrl = stateModel.question.recordUrl;
        }
      } catch (error) {
       console.log(error);
      }
    }
    getResult();
  }, [sessionId, studentId])
  if(!state.question) return null;
  return (
    <>
      <Modal
        className="modal-dialog-centered modal-danger"
        contentClassName="bg-gradient-danger"
        isOpen={isVisibled}
        toggle={toggleModal}
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
            onClick={toggleModal}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body text-left">
          <p style={{fontSize: 18, fontWeight: '500' }}>SPEAKING TOPIC:</p>
          <div >
            <p dangerouslySetInnerHTML={{ __html: state.question.text }} />
          </div>
          <p style={{fontSize: 18, fontWeight: '500' }}>BÀI GHI ÂM CỦA BẠN:</p>
          <div className='text-center'>
            <audio controls="controls" src={state.question.recordUrl} />
          </div>
          <React.Fragment>
            {state.question.isMarked && (
              <div>
                <p style={{fontSize: 18, fontWeight: '500' }}>ĐÁNH GIÁ:</p>
                <p>Ngày chấm điểm: <span>{moment(state.question.markedDate).format('DD-MM-YYYY')}</span></p>
                <p>Giáo viên: <span>{state.question.teacherName}</span></p>
                {/* <p>Kết quả: <Rate disabled allowHalf value={question.mark / 2} /></p> */}
                <p>Kết quả: <span>{state.question.mark}</span></p>
                <p>Nhận xét:</p>
                <div className='text-center'>
                  <audio controls="controls" src={state.question.recordUrlComment}></audio>
                </div>
                <div >
                  <p dangerouslySetInnerHTML={{ __html: state.question.comment }} />
                </div>
              </div>
            )}
            {/* {state.questionList.length > 1 && (
              <div className='Result-T35-container-footer'>
                <Button
                  style={{
                    marginRight: 10,
                    borderRadius: 25,
                    color: "#ffffff",
                    marginBottom: 10,
                  }}
                  type='primary'
                  disabled={this.questionIndex === 0}
                  onClick={this.goBack}
                >
                  <Icon icon="chevron-left" /> &nbsp; Quay lại
                  </Button>
                <Button
                  style={{
                    borderRadius: 25,
                    color: "#ffffff",
                    marginBottom: 10,
                  }}
                  type='primary'
                  disabled={this.questionIndex === (state.questionList.length - 1)}
                  onClick={this.nextQuestion}
                >
                  Tiếp tục &nbsp; <Icon icon="chevron-right" />
                </Button>
              </div>
            )} */}
          </React.Fragment>
        </div>
        <div className="modal-footer">
          {/* <Button className="btn-white" color="default" type="button">
            Về trang chủ
          </Button> */}
          <Button
            className="text-warning ml-auto"
            color="secondary"
            data-dismiss="modal"
            type="button"
            onClick={toggleModal}
          >
            Đóng
       </Button>
        </div>
      </Modal>
    </>
  )
}

ModalResultType32.propTypes = {
  body: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  studentId:PropTypes.number, 
  sessionId:PropTypes.string,
  toggleModal: PropTypes.func.isRequired,
  isVisibled: PropTypes.bool.isRequired,
}

export default ModalResultType32;