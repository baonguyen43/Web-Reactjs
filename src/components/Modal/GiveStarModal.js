import React from 'react';
import {
  Button,
  Modal,
} from 'reactstrap';
import PropTypes from 'prop-types';

const GiveStarModal = ({
  isVisibled,
  toggleModal,
  receiveStarNumber
}) => {

  return (
    <>
      <Modal
        className="modal-dialog-centered modal-danger"
        isOpen={isVisibled}
        toggle={() => toggleModal()}
      >
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Thông báo
          </h5>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => toggleModal()}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body text-center">
          <div className="py-3 text-center">
            <i className="ni ni-satisfied ni-4x" />
            <h4 className="heading mt-4" style={{fontSize:18}}>Chúc mừng bạn đã được tặng thêm {receiveStarNumber} sao!</h4>
          </div>
          <img alt='giveStar' src={require('assets/img/giveStar.gif')} />
        </div>
        <div className="modal-footer">
          <Button
            color="secondary"
            data-dismiss="modal"
            type="button"
            onClick={() => toggleModal()}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
};

GiveStarModal.propTypes = {
  groupPart: PropTypes.instanceOf(Array),
  sessionItem: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  classId: PropTypes.string,
  receiveStarNumber: PropTypes.number,
  isVisibled: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
}

export default GiveStarModal;
