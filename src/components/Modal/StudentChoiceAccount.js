import React from 'react';
import {
  Modal,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  Row, Col
} from 'reactstrap';
import PropTypes from 'prop-types';

const StudentChoiceAccountModal = ({
  isVisibled,
  toggleModal,
  users,
  saveAccount,
}) => {

  const renderCard = React.useCallback(() => {

    return users.map((item, index) => {
     
      return (
        <Col key={index}>
          <div className="card-deck">
            <Card onClick={() => saveAccount(index)}>
              <CardImg
                alt="..."
                src={require('assets/img/maleAccount.gif')}
                top
              />
              <CardBody>
                <CardTitle>
                  <small className="text-muted">{item?.StudentName}</small>
                </CardTitle>
              </CardBody>
            </Card>
          </div>
        </Col>
      )
    })
  }, [saveAccount, users])

  return (
    <>
      <Modal
        className="modal-dialog-centered modal-danger modal-lg"
        isOpen={isVisibled}
        toggle={toggleModal}
        backdrop= 'static'
        keyboard= {false}
      >
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Thông báo
          </h5>
        </div>
        <div className="modal-body text-center">
          <div className="py-3 text-center">
            <i className="fas fa-user-circle ni-4x" />
            <h4 className="heading mt-4" style={{ fontSize: 18 }}>Vui lòng chọn tài khoản bạn muốn sử dụng</h4>
          </div>
          <Row>
            {renderCard()}
          </Row>
        </div>
        {/* <div className="modal-footer">
          <Button
            color="secondary"
            data-dismiss="modal"
            type="button"
            onClick={() => toggleModal()}
          >
            OK
          </Button>
        </div> */}
      </Modal>
    </>
  );
};

StudentChoiceAccountModal.propTypes = {
  groupPart: PropTypes.instanceOf(Array),
  users: PropTypes.instanceOf(Array),
  sessionItem: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  classId: PropTypes.string,
  isVisibled: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  saveAccount: PropTypes.func.isRequired,
}

export default StudentChoiceAccountModal;
