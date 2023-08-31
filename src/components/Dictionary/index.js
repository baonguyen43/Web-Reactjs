import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Popover } from 'antd';
import { ListGroupItem, ListGroup } from 'reactstrap';

const propTypes = {
  text: PropTypes.string.isRequired,
};
const defaultProps = {};

class DictionaryText extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      words: [],
      wordDictionary: undefined,

      isModalVisible: false,
    };
  }

  showModal = (word) => {
    this.setState(() => {
      this.getVocabulary(_.startCase(word));

      return { isModalVisible: true };
    });
  };

  hideModal = () => {
    this.setState({ isModalVisible: false });
  };

  getWords = () => {
    let text = this.props.text;
    let words = _.split(text, ' ');
    return words;
  };

  getVocabulary = (vocabulary) => {
    fetch(
      `https://cloud.softech.cloud/mobile/ames/api/dictionary/${vocabulary}`
    )
      .then((res) => res.json())
      .then((data) => {
        const { ok, result } = data;

        if (ok) {
          this.setState({ wordDictionary: result });
        } else {
          this.setState({ wordDictionary: undefined });
        }
      })
      .catch(() => {

      });
  };

  render = () => {
    const words = this.getWords();

    return (
      <>
        {words.map((word, index) => {
          return (

            <Popover
              key={index}
              placement="bottom"
              content={this._renderContentDictionary()}
              title="Từ điển"
              trigger="click"
            >
              <span
                key={index}
                style={{ marginRight: 5,cursor: 'pointer'  }}
                onClick={() => this.showModal(word)}
              >
                {`${word}`}
              </span>
            </Popover>

          );
        })}
      </>
    );
  };

  _renderContentDictionary = () => {
    const { wordDictionary } = this.state;

    return (
      <>
        {wordDictionary && (
          <ListGroup style={{ flexWrap: 'wrap', maxWidth: 250 }}>
            <ListGroupItem className="active">
              Vocabulary: {wordDictionary.text}
            </ListGroupItem>
            <ListGroupItem>Phonetic: {wordDictionary.phonetic} </ListGroupItem>
            <ListGroupItem>
              Means:{' '}
              {wordDictionary.types.map(({ wordType, means }, index) => (
                <div key={index}>
                  <span>{wordType}</span>
                  {means.map((mean) => (
                    <div key={mean} >
                      <i className="fas fa-hand-point-right"></i>
                      <span> {mean}</span>
                    </div>
                  ))}
                </div>
              ))}{' '}
            </ListGroupItem>
          </ListGroup>
        )}
      </>
    );
  };
}

DictionaryText.propTypes = propTypes;
DictionaryText.defaultProps = defaultProps;

export { DictionaryText };
