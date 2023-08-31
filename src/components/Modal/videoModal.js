
import React from "react";
// reactstrap components
import { Modal } from "reactstrap";
import 'video-react/dist/video-react.css';
import { Player } from 'video-react';

class VideoModal extends React.Component {
  state = {
    isVisibled: false
  };
  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state]
    });
  };
  render() {
    return (
      <>
        <Modal
          className="modal-dialog-centered modal-lg"
          isOpen={this.state.isVisibled}
          toggle={() => this.toggleModal("isVisibled")}
        >
          <div className="modal-header">
            <h5 className="modal-title" id="isVisibledLabel">
              Video
            </h5>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => this.toggleModal("isVisibled")}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <div className="modal-body">
            <Player
              playsInline
              poster="/assets/poster.png"
              src={this.props.videoUrl}
            />
          </div>
        </Modal>
      </>
    );
  }
}

export default VideoModal;